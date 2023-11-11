using Microsoft.AspNetCore.SignalR;
using SimpleServerMonitoring.Interfaces;

namespace SimpleServerMonitoring.Hubs;

public sealed class InstanceDataHub : Hub<IInstanceDataClient> { }