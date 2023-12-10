using System.ComponentModel.DataAnnotations;

namespace SimpleServerMonitoring.Dtos;

public class NewInstanceConnectionDto
{
    [Required]
    public string IP { get; set; } = null!;
    [Required]
    public string SshUsername { get; set; } = null!;
    public string? SshPassword { get; set; }
    public string? SshPrivateKey { get; set; }
    public string? SshKeyPassphrase { get; set; }
}