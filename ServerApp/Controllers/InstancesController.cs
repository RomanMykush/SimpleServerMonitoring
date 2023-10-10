using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SimpleResourceMonitor.Dtos;
using SimpleResourceMonitor.Interfaces;
using SimpleResourceMonitor.Models;

namespace SimpleResourceMonitor.Controllers;

[Route("api/[controller]")]
[ApiController]
public class InstancesController : ControllerBase
{
    private readonly IInstanceService _service;
    private readonly IMapper _mapper;

    public InstancesController(IInstanceService service, IMapper mapper)
    {
        _service = service;
        _mapper = mapper;
    }

    // GET: api/Instances
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<ICollection<InstanceDto>>> GetInstances() => Ok(_mapper.Map<List<InstanceDto>>(await _service.GetInstancesAsync()));

    // GET: api/Instances/5
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(Error), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<InstanceDto>> GetInstance(long id)
    {
        var instance = await _service.GetInstanceAsync(id);

        if (instance == null)
            return NotFound(new Error() { Message = "Instance wasn't found" });

        return Ok(_mapper.Map<InstanceDto>(instance));
    }

    // PUT: api/Instances/5
    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(Error), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(Error), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> PutInstance(long id, InstanceDto dto)
    {
        var instance = _mapper.Map<Instance>(dto);
        instance.Id = id;

        if (!await _service.PutInstanceAsync(instance))
            return NotFound(new Error() { Message = "Instance wasn't found" });

        return NoContent();
    }

    // POST: api/Instances
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(Error), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<InstanceDto>> PostInstance(NewInstanceDto dto)
    {
        if (dto.Name == null)
            return BadRequest(new Error() { Message = "Instance.Name cannot be null" });

        var instance = _mapper.Map<Instance>(dto);
        await _service.PostInstanceAsync(instance);

        return CreatedAtAction(nameof(GetInstance), _mapper.Map<InstanceDto>(instance));
    }

    // DELETE: api/Instances/5
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(Error), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteInstance(long id)
    {
        if (!await _service.DeleteInstanceAsync(id))
            return NotFound(new Error() { Message = "Instance wasn't found" });

        return NoContent();
    }
}
