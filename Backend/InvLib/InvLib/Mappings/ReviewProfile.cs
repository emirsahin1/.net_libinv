using AutoMapper;
using InvLib.Dtos.Book;
using InvLib.Dtos.Review;
using InvLib.Models;


namespace InvLib.Mappings
{
    public class ReviewProfile : Profile
    {
        public ReviewProfile() { 
            CreateMap<Review, ReviewDto>().ReverseMap();
            CreateMap<Review, ReviewCreationDto>().ReverseMap();
        }
    }
}
