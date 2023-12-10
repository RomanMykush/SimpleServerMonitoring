using SimpleServerMonitoring.Models;

namespace SimpleServerMonitoring.Interfaces;

public interface IInstanceConnectionService
{
    Task<ICollection<InstanceConnection>?> GetInstanceConnections(long instanceId);
    Task<InstanceConnection?> GetInstanceConnection(long id);
    Task<bool> PutInstanceConnection(InstanceConnection instanceConnection);
    Task<bool> AddInstanceConnection(long instanceId, InstanceConnection instanceConnection);
    Task<bool> DeleteInstanceConnection(long id);
    bool InstanceConnectionExists(long id);
}