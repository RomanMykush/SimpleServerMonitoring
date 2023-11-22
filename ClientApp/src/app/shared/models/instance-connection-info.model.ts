export class InstanceConnectionInfo {
  constructor(
    public id: number,
    public ip: string,
    public sshUsername: string,
    public sshPassword: string,
    public sshPrivateKey: string,
    public sshKeyPassphrase: string
  ) { }
}
