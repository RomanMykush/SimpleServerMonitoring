namespace SimpleResourceMonitor.Models;

public class Instance
{
    public long Id { get; set; }
    public string? Name { get; set; }
    public string? OS { get; set; }
    public ICollection<InstanceConnection>? InstanceConnections { get; set; }
}