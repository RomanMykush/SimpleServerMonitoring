using System.ComponentModel.DataAnnotations;

namespace SimpleServerMonitoring.Dtos;

public class NewInstanceConnectionDto
{
    [Required]
    public required string IP { get; set; }
    [Required]
    public required string SshUsername { get; set; }
    public string? SshPassword { get; set; }
    public string? SshPrivateKey { get; set; }
    public string? SshKeyPassphrase { get; set; }
}