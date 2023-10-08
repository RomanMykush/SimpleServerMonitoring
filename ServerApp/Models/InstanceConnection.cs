namespace SimpleResourceMonitor.Models;

public class InstanceConnection
{
    public long Id { get; set; }
    public string? IP { get; set; }
    public string? SshUsername { get; set; }
    public string? SshPassword { get; set; }
    public string? SshPrivateKey { get; set; }
    public string? SshKeyPassphrase { get; set; }
    public Instance Instance { get; set; } = null!;
}