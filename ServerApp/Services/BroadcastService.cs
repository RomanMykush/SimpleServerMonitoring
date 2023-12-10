using System.Collections.Concurrent;
using Microsoft.AspNetCore.SignalR;
using SimpleServerMonitoring.Dtos;
using SimpleServerMonitoring.Helper;
using SimpleServerMonitoring.Hubs;
using SimpleServerMonitoring.Interfaces;
using SimpleServerMonitoring.Models;

namespace SimpleServerMonitoring.Services;

public class BroadcastService : BackgroundService
{
    private const int TimerInterval = 2;
    private readonly ConcurrentDictionary<long, Task> DataFetchTasks = new();
    private readonly ConcurrentDictionary<long, long> PreferedConnection = new();
    private readonly PeriodicTimer _timer = new(TimeSpan.FromSeconds(TimerInterval));
    private readonly ILogger<BroadcastService> _logger;
    private readonly IServiceProvider _serviceProvider;

    // Services that are created from new scope every _timer tick
    private IInstanceService _instanceService = null!;
    private IInstanceConnectionService _instanceConnectionService = null!;
    private IConnectionMethodService _connectionMethodService = null!;
    private IHubContext<InstanceDataHub, IInstanceDataClient> _instanceDataHub = null!;

    public BroadcastService(IServiceProvider serviceProvider,
        ILogger<BroadcastService> logger)
    {
        _logger = logger;
        _serviceProvider = serviceProvider;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation($"Start of {typeof(BroadcastService).Name} execution");

        while (await _timer.WaitForNextTickAsync(stoppingToken)
            && !stoppingToken.IsCancellationRequested)
        {
            using IServiceScope scope = _serviceProvider.CreateScope();
            CreateNewServices(scope);
            await StartTransferingData();
        }
    }

    private void CreateNewServices(IServiceScope scope)
    {
        _instanceService = scope.ServiceProvider.GetRequiredService<IInstanceService>();
        _instanceConnectionService = scope.ServiceProvider.GetRequiredService<IInstanceConnectionService>();
        _connectionMethodService = scope.ServiceProvider.GetRequiredService<IConnectionMethodService>();
        _instanceDataHub = scope.ServiceProvider.GetRequiredService<IHubContext<InstanceDataHub, IInstanceDataClient>>();
    }

    public async Task StartTransferingData()
    {
        List<long> instanceIds = (await _instanceService.GetInstances())!.Select(i => i.Id).ToList();

        foreach (var currentId in instanceIds)
        {
            _logger.LogTrace($"Start trying to get data from {typeof(Instance).Name} #{currentId}");

            if (DataFetchTasks.ContainsKey(currentId) && !DataFetchTasks[currentId].IsCompleted)
            {
                _logger.LogTrace($"Data fetching process is still in progress from {typeof(Instance).Name} #{currentId}");
                continue;
            }

            var instanceConnections = await _instanceConnectionService.GetInstanceConnections(currentId);
            if (instanceConnections == null || !instanceConnections.Any())
            {
                _logger.LogTrace($"No connection info for {typeof(Instance).Name} #{currentId} was found");
                continue;
            }

            if (!PreferedConnection.ContainsKey(currentId))
                PreferedConnection[currentId] = instanceConnections.OrderBy(ic => ic.Id).First().Id;

            var connection = instanceConnections.FirstOrDefault(ic => ic.Id == PreferedConnection[currentId]);
            if (connection == null)
            {
                FindNextPreferedConnection(currentId, instanceConnections);
                continue;
            }
            // Create Task of data transfer
            var task = Task.Run(async () => await TransferDataTaskBody(currentId, instanceConnections));

            DataFetchTasks[currentId] = task;
        }
    }

    private void FindNextPreferedConnection(long instanceId, ICollection<InstanceConnection> instanceConnections)
    {
        if (instanceConnections == null || !instanceConnections.Any())
            return;

        var nextConnections = instanceConnections.Where(ic => ic.Id > PreferedConnection[instanceId]);
        if (!nextConnections.Any())
        {
            PreferedConnection[instanceId] = instanceConnections.OrderBy(ic => ic.Id).First().Id;
            return;
        }
        PreferedConnection[instanceId] = nextConnections.OrderBy(ic => ic.Id).First().Id;
    }

    private async Task TransferDataTaskBody(long instanceId, ICollection<InstanceConnection> instanceConnections)
    {
        try
        {
            var connection = instanceConnections.First(ic => ic.Id == PreferedConnection[instanceId]);
            // Fetch data from instance
            var data = FetchData(connection);
            // Set instance id
            data.InstanceId = instanceId;

            if (!data.IsOnline)
                FindNextPreferedConnection(instanceId, instanceConnections);
            // Broadcast data to clients
            await _instanceDataHub.Clients.All.ReceiveData(data);
        }
        catch (ArgumentException exc)
        {
            _logger.LogWarning(exc.Message);
            return;
        }
    }

    private InstanceDataDto FetchData(InstanceConnection connection)
    {
        IConnectionMethodDetails details = _connectionMethodService switch
        {
            SshConnectionMethodService => new SshConnectionMethodDetails(connection.SshUsername)
            {
                Password = connection.SshPassword,
                PrivateKey = connection.SshPrivateKey,
                KeyPassphrase = connection.SshKeyPassphrase
            },
            _ => throw new NotImplementedException($"New class of {typeof(IConnectionMethodService).Name} interfact was created but no handling logic was implemented"),
        };

        return _connectionMethodService.FetchData(connection.IP, details);
    }
}