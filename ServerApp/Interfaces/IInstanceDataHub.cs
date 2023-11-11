using SimpleServerMonitoring.Dtos;

namespace SimpleServerMonitoring.Interfaces;

public interface IInstanceDataClient
{
    Task ReceiveData(InstanceDataDto data);
}