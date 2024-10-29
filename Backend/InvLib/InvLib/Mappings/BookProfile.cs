using AutoMapper;
using InvLib.Dtos.Book;
using InvLib.Models;


namespace InvLib.Mappings
{
    public class BookProfile : Profile
    {
        public BookProfile() { 
            CreateMap<Book, BookDto>().ReverseMap();
        }
    }
}
