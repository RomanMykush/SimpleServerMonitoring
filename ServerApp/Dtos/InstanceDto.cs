namespace SimpleServerMonitoring.Dtos;

public class InstanceDto
{
    public long Id { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public required string OS { get; set; }
}