namespace SimpleServerMonitoring.Dtos;

public class InstanceConnectionDto
{
    public long Id { get; set; }
    public string? IP { get; set; }
    public string? SshUsername { get; set; }
}