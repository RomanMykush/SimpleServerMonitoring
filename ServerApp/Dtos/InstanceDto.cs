namespace SimpleServerMonitoring.Dtos;

public class InstanceDto
{
    public long Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public string OS { get; set; } = null!;
}