using Microsoft.EntityFrameworkCore;
using SimpleServerMonitoring.Data;
using SimpleServerMonitoring.Interfaces;
using SimpleServerMonitoring.Models;

namespace SimpleServerMonitoring.Services;

public class InstanceConnectionService : IInstanceConnectionService
{
    private readonly DataContext _context;
    public InstanceConnectionService(DataContext context)
    {
        _context = context;
    }

    public async Task<ICollection<InstanceConnection>?> GetInstanceConnectionsAsync(long instanceId)
    {
        var instance = await _context.Instances.Where(p => p.Id == instanceId).Include(p => p.InstanceConnections).FirstOrDefaultAsync();
        if (instance == null)
            return null;
        return instance.InstanceConnections;
    }

    public async Task<InstanceConnection?> GetInstanceConnectionAsync(long id) => await _context.InstanceConnections.Where(p => p.Id == id).FirstOrDefaultAsync();

    public async Task<bool> PutInstanceConnectionAsync(InstanceConnection instanceConnection)
    {
        _context.Entry(instanceConnection).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!InstanceConnectionExists(instanceConnection.Id))
                return false;
            throw;
        }

        return true;
    }

    public async Task<bool> PostInstanceConnectionAsync(long instanceId, InstanceConnection instanceConnection)
    {
        var instance =  await _context.Instances.Where(p => p.Id == instanceId).FirstOrDefaultAsync();

        if (instance == null)
            return false;
        
        instanceConnection.Instance = instance;

        _context.InstanceConnections.Add(instanceConnection);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteInstanceConnectionAsync(long id)
    {
        var instanceConnection = await GetInstanceConnectionAsync(id);
        if (instanceConnection == null)
            return false;

        _context.InstanceConnections.Remove(instanceConnection);
        await _context.SaveChangesAsync();

        return true;
    }

    public bool InstanceConnectionExists(long id) => (_context.InstanceConnections?.Any(p => p.Id == id)).GetValueOrDefault();
}