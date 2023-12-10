using SimpleServerMonitoring.Interfaces;

namespace SimpleServerMonitoring.Helper;

public class SshConnectionMethodDetails : IConnectionMethodDetails
{
    public string Username;
    public string? Password;
    public byte[]? PrivateKey;
    public string? KeyPassphrase;
    public SshConnectionMethodDetails(string username) =>
        Username = username;
}