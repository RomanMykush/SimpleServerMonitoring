using Renci.SshNet;
using SimpleResourceMonitor.Dtos;

namespace SimpleResourceMonitor.Interfaces;

public interface IConnectionMethodService
{
    InstanceDataDto FetchData(string host, string username, string password);
    InstanceDataDto FetchData(string host, string username, PrivateKeyFile privateKey);
}