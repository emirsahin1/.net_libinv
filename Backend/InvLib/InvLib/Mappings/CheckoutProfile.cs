using AutoMapper;
using InvLib.Dtos.Checkout;
using InvLib.Models;

namespace InvLib.Mappings
{
    public class CheckoutProfile : Profile
    {
        public CheckoutProfile()
        {
            CreateMap<Checkout, CheckoutCreationDto>().ReverseMap();
            CreateMap<Checkout, CheckoutResponseDto>().ReverseMap();
        }
    }
}
