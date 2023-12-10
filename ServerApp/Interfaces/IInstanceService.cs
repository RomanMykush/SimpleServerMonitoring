using SimpleServerMonitoring.Models;

namespace SimpleServerMonitoring.Interfaces;

public interface IInstanceService
{
    Task<ICollection<Instance>?> GetInstances();
    Task<Instance?> GetInstance(long id);
    Task<bool> PutInstance(Instance instance);
    Task AddInstance(Instance instance);
    Task<bool> DeleteInstance(long id);
    bool InstanceExists(long id);
}