namespace SimpleServerMonitoring.Dtos;

public class InstanceConnectionDto
{
    public long Id { get; set; }
    public string IP { get; set; } = null!;
    public string SshUsername { get; set; } = null!;
}