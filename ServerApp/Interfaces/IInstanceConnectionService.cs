using SimpleServerMonitoring.Models;

namespace SimpleServerMonitoring.Interfaces;

public interface IInstanceConnectionService
{
    Task<ICollection<InstanceConnection>?> GetInstanceConnectionsAsync(long instanceId);
    Task<InstanceConnection?> GetInstanceConnectionAsync(long id);
    Task<bool> PutInstanceConnectionAsync(InstanceConnection instanceConnection);
    Task<bool> PostInstanceConnectionAsync(long instanceId, InstanceConnection instanceConnection);
    Task<bool> DeleteInstanceConnectionAsync(long id);
    bool InstanceConnectionExists(long id);
}