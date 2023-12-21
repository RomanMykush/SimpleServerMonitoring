namespace SimpleServerMonitoring.Dtos;

public class FullInstanceConnectionDto
{
    public long Id { get; set; }
    public required string IP { get; set; }
    public required string SshUsername { get; set; }
    public string? SshPassword { get; set; }
    public string? SshPrivateKey { get; set; }
    public string? SshKeyPassphrase { get; set; }
}