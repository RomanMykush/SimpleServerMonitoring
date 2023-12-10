using System.Text.RegularExpressions;
using Renci.SshNet;
using SimpleServerMonitoring.Dtos;
using SimpleServerMonitoring.Helper;
using SimpleServerMonitoring.Interfaces;

namespace SimpleServerMonitoring.Services;

public class SshConnectionMethodService : IConnectionMethodService
{
    private const int Timeout = 5;

    public InstanceDataDto FetchData(string host, IConnectionMethodDetails details)
    {
        if (details is not SshConnectionMethodDetails sshDetails)
            throw new ArgumentException("Invalid IConnectionMethodDetails object was passed as argument");

        if (sshDetails.Password != null)
        {
            var connectionInfo = new Renci.SshNet.ConnectionInfo(
                host,
                sshDetails.Username,
                new PasswordAuthenticationMethod(sshDetails.Username, sshDetails.Password))
            { Timeout = TimeSpan.FromSeconds(Timeout) };
            return Connect(connectionInfo);
        }

        if (sshDetails.PrivateKey != null)
        {
            PrivateKeyFile keyFile = GetPrivateKeyFile(sshDetails);

            var connectionInfo = new Renci.SshNet.ConnectionInfo(
                host,
                sshDetails.Username,
                new PrivateKeyAuthenticationMethod(sshDetails.Username, keyFile))
            { Timeout = TimeSpan.FromSeconds(Timeout) };
            return Connect(connectionInfo);
        }

        throw new ArgumentException("No secrets were found in IConnectionMethodDetails");
    }

    private PrivateKeyFile GetPrivateKeyFile(SshConnectionMethodDetails details)
    {
        if (details.KeyPassphrase != null)
            return new PrivateKeyFile(new MemoryStream(details.PrivateKey!), details.KeyPassphrase);
        return new PrivateKeyFile(new MemoryStream(details.PrivateKey!));
    }

    private InstanceDataDto Connect(Renci.SshNet.ConnectionInfo connectionInfo)
    {
        try
        {
            int maxRam;
            int ramLoad;
            float cpuLoad;
            float? cpuTemp = null;
            using (var client = new SshClient(connectionInfo))
            {
                client.Connect();

                // Get ram max and load
                var ramData = client.CreateCommand("free | grep 'Mem'").Execute();
                var ramMatches = Regex.Matches(ramData, "\\d+(\\.\\d+)?");

                maxRam = int.Parse(ramMatches[0].Groups[0].Value);
                ramLoad = int.Parse(ramMatches[1].Groups[0].Value);

                // Get cpu load
                var cpuData = client.CreateCommand("top -bn 2 -d 0.5 | grep 'Cpu' | tail -n 1").Execute();
                var cpuMatches = Regex.Matches(cpuData, "\\d+(\\.\\d+)?");

                cpuLoad = float.Parse(cpuMatches[0].Groups[0].Value) +
                    float.Parse(cpuMatches[1].Groups[0].Value) +
                    float.Parse(cpuMatches[2].Groups[0].Value);

                // Get cpu temp
                var tempData = client.CreateCommand("cat /sys/class/thermal/thermal_zone*/type").Execute();
                var tempArray = tempData.Split(new[] { '\r', '\n' });
                int tempIndex = Array.FindIndex(tempArray, w => w == "x86_pkg_temp");
                if (tempIndex < 0)
                    tempIndex = Array.FindIndex(tempArray, w => w == "acpitz");
                else
                {
                    tempData = client.CreateCommand("cat /sys/class/thermal/thermal_zone" + tempIndex + "/temp").Execute();
                    cpuTemp = float.Parse(tempData) / 1000;
                }

                client.Disconnect();
            }
            return new InstanceDataDto()
            {
                IsOnline = true,
                MaxRam = maxRam,
                RamLoad = ramLoad,
                CpuLoad = cpuLoad,
                CpuTemp = cpuTemp
            };
        }
        catch (Exception exc)
        {
            if (exc is Renci.SshNet.Common.SshOperationTimeoutException
                || exc is System.Net.Sockets.SocketException)
                return new InstanceDataDto() { IsOnline = false };

            throw;
        }
    }
}