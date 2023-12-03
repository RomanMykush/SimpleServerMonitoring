export class InstanceConnectionInfo {
  constructor(
    public id: number,
    public ip: string,
    public sshUsername: string,
    public sshPassword: string | null,
    public sshPrivateKey: string | null,
    public sshKeyPassphrase: string | null
  ) { }
}
