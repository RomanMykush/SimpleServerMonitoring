using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SimpleServerMonitoring.Dtos;
using SimpleServerMonitoring.Interfaces;
using SimpleServerMonitoring.Models;

namespace SimpleServerMonitoring.Controllers;

[Route("api/[controller]")]
[ApiController]
public class InstanceConnectionsController : ControllerBase
{
    private readonly IInstanceConnectionService _service;
    private readonly IMapper _mapper;

    public InstanceConnectionsController(IInstanceConnectionService service, IMapper mapper)
    {
        _service = service;
        _mapper = mapper;
    }

    // GET: api/InstanceConnections/Instance/5
    [HttpGet("Instance/{instanceId}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<ICollection<InstanceConnectionDto>>> GetInstanceConnectionsByInstance(long instanceId) =>
        Ok(_mapper.Map<List<InstanceConnectionDto>>(await _service.GetInstanceConnections(instanceId)));

    // GET: api/InstanceConnections/5
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorDto), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<FullInstanceConnectionDto>> GetInstanceConnection(long id)
    {
        var instanceConnection = await _service.GetInstanceConnection(id);

        if (instanceConnection == null)
            return NotFound(new ErrorDto() { Title = "InstanceConnection wasn't found" });

        return Ok(_mapper.Map<FullInstanceConnectionDto>(instanceConnection));
    }

    // PUT: api/InstanceConnections/5
    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorDto), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> PutInstanceConnection(long id, NewInstanceConnectionDto dto)
    {
        var instanceConnection = _mapper.Map<InstanceConnection>(dto);
        instanceConnection.Id = id;

        if (!await _service.PutInstanceConnection(instanceConnection))
            return NotFound(new ErrorDto() { Title = "InstanceConnection wasn't found" });

        return NoContent();
    }

    // POST: api/InstanceConnections/Instance/5
    [HttpPost("Instance/{instanceId}")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorDto), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<FullInstanceConnectionDto>> PostInstanceConnection(long instanceId, NewInstanceConnectionDto dto)
    {
        var instanceConnection = _mapper.Map<InstanceConnection>(dto);
        if (!await _service.AddInstanceConnection(instanceId, instanceConnection))
            return NotFound(new ErrorDto() { Title = "Instance wasn't found" });

        return CreatedAtAction(nameof(GetInstanceConnection), _mapper.Map<FullInstanceConnectionDto>(instanceConnection));
    }

    // DELETE: api/InstanceConnections/5
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ErrorDto), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteInstanceConnection(long id)
    {
        if (!await _service.DeleteInstanceConnection(id))
            return NotFound(new ErrorDto() { Title = "InstanceConnection wasn't found" });

        return NoContent();
    }
}
