using System.Text.RegularExpressions;
using Renci.SshNet;
using SimpleServerMonitoring.Dtos;
using SimpleServerMonitoring.Interfaces;

namespace SimpleServerMonitoring.Services;

public class SshConnectionMethodService : IConnectionMethodService
{
    const int Timeout = 5;
    public InstanceDataDto FetchData(string host, string username, string password)
    {
        var connectionInfo = new Renci.SshNet.ConnectionInfo(
                host,
                username,
                new PasswordAuthenticationMethod(username, password))
        {
            Timeout = TimeSpan.FromSeconds(Timeout)
        };
        return Connect(connectionInfo);
    }

    public InstanceDataDto FetchData(string host, string username, PrivateKeyFile privateKey)
    {
        var connectionInfo = new Renci.SshNet.ConnectionInfo(
                host,
                username,
                new PrivateKeyAuthenticationMethod(username, privateKey))
        {
            Timeout = TimeSpan.FromSeconds(Timeout)
        };
        return Connect(connectionInfo);
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

                if (tempIndex >= 0)
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
                return new InstanceDataDto()
                {
                    IsOnline = false
                };

            throw;
        }
    }
}