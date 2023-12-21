using System.ComponentModel.DataAnnotations;

namespace SimpleServerMonitoring.Dtos;

public class NewInstanceDto
{
    [Required]
    public required string Name { get; set; }
    public string? Description { get; set; }
    [Required]
    public required string OS { get; set; }
}