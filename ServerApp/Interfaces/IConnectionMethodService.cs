using Renci.SshNet;
using SimpleServerMonitoring.Dtos;

namespace SimpleServerMonitoring.Interfaces;

public interface IConnectionMethodService
{
    InstanceDataDto FetchData(string host, string username, string password);
    InstanceDataDto FetchData(string host, string username, PrivateKeyFile privateKey);
}