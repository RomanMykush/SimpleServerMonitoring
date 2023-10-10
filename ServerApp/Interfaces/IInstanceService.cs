using SimpleResourceMonitor.Models;

namespace SimpleResourceMonitor.Interfaces;

public interface IInstanceService
{
    Task<ICollection<Instance>?> GetInstancesAsync();
    Task<Instance?> GetInstanceAsync(long id);
    Task<bool> PutInstanceAsync(Instance instance);
    Task PostInstanceAsync(Instance instance);
    Task<bool> DeleteInstanceAsync(long id);
    bool InstanceExists(long id);
}