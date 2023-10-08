using Microsoft.EntityFrameworkCore;
using SimpleResourceMonitor.Models;

namespace SimpleResourceMonitor.Data;

public class DataContext : DbContext
{
    public DataContext(DbContextOptions<DataContext> options) : base(options) { }

    public DbSet<Instance> Instances { get; set; } = null!;
    public DbSet<InstanceConnection> InstanceConnections { get; set; } = null!;
}