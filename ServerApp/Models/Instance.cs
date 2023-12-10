namespace SimpleServerMonitoring.Models;

public class Instance
{
    public long Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public string OS { get; set; } = null!;
    public ICollection<InstanceConnection>? InstanceConnections { get; set; }
}