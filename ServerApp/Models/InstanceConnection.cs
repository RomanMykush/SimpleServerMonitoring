namespace SimpleServerMonitoring.Models;

public class InstanceConnection
{
    public long Id { get; set; }
    public required string IP { get; set; }
    public required string SshUsername { get; set; }
    public string? SshPassword { get; set; }
    public byte[]? SshPrivateKey { get; set; }
    public string? SshKeyPassphrase { get; set; }
    public Instance Instance { get; set; } = null!;
}