using System.Collections.Concurrent;
using Renci.SshNet;
using SimpleServerMonitoring.Dtos;
using SimpleServerMonitoring.Interfaces;
using SimpleServerMonitoring.Models;

namespace SimpleServerMonitoring.Services;

public class BroadcastService : BackgroundService
{
    private readonly ConcurrentDictionary<long, Task> DataFetchTasks = new();
    private readonly PeriodicTimer _timer = new(TimeSpan.FromSeconds(2));
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<BroadcastService> _logger;
    public BroadcastService(IServiceProvider serviceProvider,
        ILogger<BroadcastService> logger)
    {
        _logger = logger;
        _serviceProvider = serviceProvider;
    }
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Start of BroadcastService execution");

        using IServiceScope scope = _serviceProvider.CreateScope();
        IInstanceService instanceService = scope.ServiceProvider.GetRequiredService<IInstanceService>();
        IInstanceConnectionService instanceConnectionService = scope.ServiceProvider.GetRequiredService<IInstanceConnectionService>();
        IConnectionMethodService connectionMethodService = scope.ServiceProvider.GetRequiredService<IConnectionMethodService>();

        while (await _timer.WaitForNextTickAsync(stoppingToken)
            && !stoppingToken.IsCancellationRequested)
        {
            await StartTransferingData(instanceService,
                instanceConnectionService,
                connectionMethodService);
        }
    }

    public async Task StartTransferingData(IInstanceService instanceService,
        IInstanceConnectionService instanceConnectionService,
        IConnectionMethodService connectionMethodService)
    {
        List<long> instanceIds = (await instanceService.GetInstancesAsync())!.Select(i => i.Id).ToList();

        foreach (var currentId in instanceIds)
        {
            _logger.LogTrace($"Start trying to get data from Instance #{currentId}");

            if (DataFetchTasks.ContainsKey(currentId) && !DataFetchTasks[currentId].IsCompleted)
            {
                _logger.LogTrace($"Data fetching process is still in progress from Instance #{currentId}");
                continue;
            }

            // Create Task of data transfer
            var task = Task.Run(async () =>
            {
                var instanceConnections = await instanceConnectionService.GetInstanceConnectionsAsync(currentId);
                if (instanceConnections == null)
                    return;

                try
                {
                    // Fetch data from instance
                    var data = FetchData(instanceConnections,
                        connectionMethodService);
                    // Broadcast data to clients

                    // TODO: Implement broadcast data to clients
                }
                catch (ArgumentException)
                {
                    _logger.LogWarning($"Invalid InstanceConnection entities detected for Instance #{currentId}");
                    return;
                }
            });

            DataFetchTasks[currentId] = task;
        }
    }

    public InstanceDataDto FetchData(ICollection<InstanceConnection> instanceConnections,
        IConnectionMethodService connectionMethodService)
    {

        if (instanceConnections.FirstOrDefault() is not InstanceConnection connection
            || connection.IP == null || connection.SshUsername == null)
            throw new ArgumentException("Invalid InstanceConnection was passed");

        // Fetching data
        InstanceDataDto? data = null;
        if (connectionMethodService is SshConnectionMethodService)
        {
            if (connection.SshPassword != null)
            {
                data = connectionMethodService.FetchData(connection.IP, connection.SshUsername, connection.SshPassword);
            }
            else if (connection.SshPrivateKey != null)
            {
                PrivateKeyFile keyFile;
                if (connection.SshKeyPassphrase != null)
                    keyFile = new PrivateKeyFile(new MemoryStream(connection.SshPrivateKey), connection.SshKeyPassphrase);
                else
                    keyFile = new PrivateKeyFile(new MemoryStream(connection.SshPrivateKey));
                data = connectionMethodService.FetchData(connection.IP, connection.SshUsername, keyFile);
            }
        }
        else
        {
            throw new NotImplementedException("New class of IConnectionMethodService interfact was created but no handling logic was implemented");
        }

        // If no connection info was found
        if (data == null)
            throw new ArgumentException("No connection info was found in InstanceConnection");

        return data;
    }
}