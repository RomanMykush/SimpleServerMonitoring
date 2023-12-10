using System.ComponentModel.DataAnnotations;

namespace SimpleServerMonitoring.Dtos;

public class NewInstanceDto
{
    [Required]
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    [Required]
    public string OS { get; set; } = null!;
}