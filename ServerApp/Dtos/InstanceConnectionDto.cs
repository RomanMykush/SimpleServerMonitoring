namespace SimpleServerMonitoring.Dtos;

public class InstanceConnectionDto
{
    public long Id { get; set; }
    public required string IP { get; set; }
    public required string SshUsername { get; set; }
}