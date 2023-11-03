using Microsoft.EntityFrameworkCore;
using SimpleServerMonitoring.Data;
using SimpleServerMonitoring.Interfaces;
using SimpleServerMonitoring.Models;

namespace SimpleServerMonitoring.Services;

public class InstanceService : IInstanceService
{
    private readonly DataContext _context;
    public InstanceService(DataContext context)
    {
        _context = context;
    }

    public async Task<ICollection<Instance>?> GetInstancesAsync() => await _context.Instances.ToListAsync();

    public async Task<Instance?> GetInstanceAsync(long id) => await _context.Instances.Where(p => p.Id == id).Include(p => p.InstanceConnections).FirstOrDefaultAsync();

    public async Task<bool> PutInstanceAsync(Instance instance)
    {
        _context.Entry(instance).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!InstanceExists(instance.Id))
                return false;
            throw;
        }

        return true;
    }

    public async Task PostInstanceAsync(Instance instance)
    {
        _context.Instances.Add(instance);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> DeleteInstanceAsync(long id)
    {
        var instance = await GetInstanceAsync(id);
        if (instance == null)
            return false;

        if (instance.InstanceConnections != null)
            _context.InstanceConnections.RemoveRange(instance.InstanceConnections);

        _context.Instances.Remove(instance);
        await _context.SaveChangesAsync();

        return true;
    }

    public bool InstanceExists(long id) => (_context.Instances?.Any(p => p.Id == id)).GetValueOrDefault();
}