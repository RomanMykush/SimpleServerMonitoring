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
        CreateMap<InstanceConnection, InstanceConnectionDto>().ReverseMap();
        CreateMap<InstanceConnection, NewInstanceConnectionDto>().ReverseMap();
    }
}