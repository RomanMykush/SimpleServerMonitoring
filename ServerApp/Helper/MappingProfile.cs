using System.Text;
using AutoMapper;
using SimpleServerMonitoring.Dtos;
using SimpleServerMonitoring.Models;

namespace SimpleServerMonitoring.Helper;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Instance, InstanceDto>().ReverseMap();
        CreateMap<Instance, NewInstanceDto>().ReverseMap();
        CreateMap<InstanceConnection, InstanceConnectionDto>().ReverseMap();
        CreateMap<InstanceConnection, FullInstanceConnectionDto>()
            .ForMember(dest => dest.SshPrivateKey, opt => opt
                .MapFrom(src => src.SshPrivateKey != null && src.SshPrivateKey.Length > 0 ?
                    Encoding.UTF8.GetString(src.SshPrivateKey) : null));
        CreateMap<FullInstanceConnectionDto, InstanceConnection>()
            .ForMember(dest => dest.SshPrivateKey, opt => opt
                .MapFrom(src => !string.IsNullOrEmpty(src.SshPrivateKey) ?
                    Encoding.UTF8.GetBytes(src.SshPrivateKey) : null));
        CreateMap<InstanceConnection, NewInstanceConnectionDto>()
            .ForMember(dest => dest.SshPrivateKey, opt => opt
                .MapFrom(src => src.SshPrivateKey != null && src.SshPrivateKey.Length > 0 ?
                    Encoding.UTF8.GetString(src.SshPrivateKey) : null));
        CreateMap<NewInstanceConnectionDto, InstanceConnection>()
            .ForMember(dest => dest.SshPrivateKey, opt => opt
                .MapFrom(src => !string.IsNullOrEmpty(src.SshPrivateKey) ?
                    Encoding.UTF8.GetBytes(src.SshPrivateKey) : null));
    }
}