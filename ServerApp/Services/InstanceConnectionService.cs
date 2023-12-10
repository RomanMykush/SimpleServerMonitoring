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

    public async Task<ICollection<InstanceConnection>?> GetInstanceConnections(long instanceId)
    {
        var instance = await _context.Instances.Where(p => p.Id == instanceId).Include(p => p.InstanceConnections).FirstOrDefaultAsync();
        if (instance == null)
            return null;
        return instance.InstanceConnections;
    }

    public async Task<InstanceConnection?> GetInstanceConnection(long id) => await _context.InstanceConnections.Where(p => p.Id == id).FirstOrDefaultAsync();

    public async Task<bool> PutInstanceConnection(InstanceConnection instanceConnection)
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

    public async Task<bool> AddInstanceConnection(long instanceId, InstanceConnection instanceConnection)
    {
        var instance =  await _context.Instances.Where(p => p.Id == instanceId).FirstOrDefaultAsync();

        if (instance == null)
            return false;
        
        instanceConnection.Instance = instance;

        _context.InstanceConnections.Add(instanceConnection);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteInstanceConnection(long id)
    {
        var instanceConnection = await GetInstanceConnection(id);
        if (instanceConnection == null)
            return false;

        _context.InstanceConnections.Remove(instanceConnection);
        await _context.SaveChangesAsync();

        return true;
    }

    public bool InstanceConnectionExists(long id) => (_context.InstanceConnections?.Any(p => p.Id == id)).GetValueOrDefault();
}