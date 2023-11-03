namespace SimpleServerMonitoring.Dtos;

public class InstanceDataDto
{
    public bool IsOnline { get; set; }
    public int MaxRam { get; set; }
    public int RamLoad { get; set; }
    public float CpuLoad { get; set; }
    public float? CpuTemp { get; set; }
    public long InstanceId { get; set; }
}