export class InstanceData {
  constructor(
    public isOnline: boolean,
    public maxRam: number,
    public ramLoad: number,
    public cpuLoad: number,
    public cpuTemp: number,
    public instanceId: number
  ) { }
}
