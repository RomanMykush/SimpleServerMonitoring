using SimpleServerMonitoring.Dtos;

namespace SimpleServerMonitoring.Interfaces;

public interface IConnectionMethodService
{
    InstanceDataDto FetchData(string host, IConnectionMethodDetails details);
}