namespace SimpleServerMonitoring.Dtos;

public class NewInstanceConnectionDto
{
    public string? IP { get; set; }
    public string? SshUsername { get; set; }
    public string? SshPassword { get; set; }
    public string? SshPrivateKey { get; set; }
    public string? SshKeyPassphrase { get; set; }
}