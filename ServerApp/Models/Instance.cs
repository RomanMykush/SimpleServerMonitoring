namespace SimpleServerMonitoring.Models;

public class Instance
{
    public long Id { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public required string OS { get; set; }
    public ICollection<InstanceConnection> InstanceConnections { get; set; } = null!;
}