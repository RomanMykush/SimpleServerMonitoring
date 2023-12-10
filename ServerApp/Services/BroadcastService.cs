using System.Collections.Concurrent;
using Microsoft.AspNetCore.SignalR;
using Renci.SshNet;
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

            // Create Task of data transfer
            var task = Task.Run(async () =>
            {
                try
                {
                    // Fetch data from instance
                    var data = FetchData(instanceConnections);
                    // Set instance id
                    data.InstanceId = currentId;
                    // Broadcast data to clients
                    await _instanceDataHub.Clients.All.ReceiveData(data);
                }
                catch (ArgumentException)
                {
                    _logger.LogWarning($"Invalid {typeof(InstanceConnection).Name} entities detected for Instance #{currentId}");
                    return;
                }
            });

            DataFetchTasks[currentId] = task;
        }
    }

    public InstanceDataDto FetchData(ICollection<InstanceConnection> instanceConnections)
    {
        if (instanceConnections.FirstOrDefault() is not InstanceConnection connection)
            throw new ArgumentException($"Empty collection of {typeof(InstanceConnection).Name} was passed");

        // Fetching data
        InstanceDataDto? data;
        switch (_connectionMethodService)
        {
            case SshConnectionMethodService:
                var details = new SshConnectionMethodDetails(connection.SshUsername)
                {
                    Password = connection.SshPassword,
                    PrivateKey = connection.SshPrivateKey,
                    KeyPassphrase = connection.SshKeyPassphrase
                };

                data = _connectionMethodService.FetchData(connection.IP, details);
                break;
            default:
                throw new NotImplementedException($"New class of {typeof(IConnectionMethodService).Name} interfact was created but no handling logic was implemented");
        }

        // If no connection info was found
        if (data == null)
            throw new ArgumentException($"No connection info was found in {typeof(InstanceConnection).Name}");

        return data;
    }
}