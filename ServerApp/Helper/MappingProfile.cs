using System.Text;
using AutoMapper;
using SimpleResourceMonitor.Dtos;
using SimpleResourceMonitor.Models;

namespace SimpleResourceMonitor.Helper;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Instance, InstanceDto>().ReverseMap();
        CreateMap<Instance, NewInstanceDto>().ReverseMap();
        CreateMap<InstanceConnection, InstanceConnectionDto>()
            .ForMember(dest => dest.SshPrivateKey, opt => opt.MapFrom(src => src.SshPrivateKey != null ? Encoding.UTF8.GetString(src.SshPrivateKey) : null));
        CreateMap<InstanceConnectionDto, InstanceConnection>()
            .ForMember(dest => dest.SshPrivateKey, opt => opt.MapFrom(src => src.SshPrivateKey != null ? Encoding.UTF8.GetBytes(src.SshPrivateKey) : null));
        CreateMap<InstanceConnection, NewInstanceConnectionDto>()
            .ForMember(dest => dest.SshPrivateKey, opt => opt.MapFrom(src => src.SshPrivateKey != null ? Encoding.UTF8.GetString(src.SshPrivateKey) : null));
        CreateMap<NewInstanceConnectionDto, InstanceConnection>()
            .ForMember(dest => dest.SshPrivateKey, opt => opt.MapFrom(src => src.SshPrivateKey != null ? Encoding.UTF8.GetBytes(src.SshPrivateKey) : null));
    }
}