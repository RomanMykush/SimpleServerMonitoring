export class InstanceData {
    constructor(
        public isntanceId: number,
        public isOnline: boolean,
        public cpuLoad: number,
        public cpuTemp: number,
        public ramMax: number,
        public ramLoad: number
    ) { }
}
