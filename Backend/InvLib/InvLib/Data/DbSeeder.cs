using Bogus;
using InvLib.Models;
using static System.Net.WebRequestMethods;

namespace InvLib.Data
{
    public static class DbSeeder
    {
        public static async Task SeedBooks(ApplicationDbContext context)
        {
            if (!context.Books.Any())
            {
                var bookFaker = new Faker<Book>()
                    .RuleFor(b => b.Title, f => f.Lorem.Sentence(3))
                    .RuleFor(b => b.Author, f => f.Name.FullName())
                    .RuleFor(b => b.Description, f => f.Lorem.Paragraph())
                    .RuleFor(b => b.Publisher, f => f.Company.CompanyName())
                    .RuleFor(b => b.ISBN, f => f.Commerce.Ean13())
                    .RuleFor(b => b.Category, f => f.Commerce.Categories(1)[0])
                    .RuleFor(b => b.PublicationDate, f => f.Date.Past(10))
                    .RuleFor(b => b.PageCount, f => f.Random.Int(100, 500))
                    .RuleFor(b => b.CoverImage, f => $"https://picsum.photos/seed/{f.Random.Int(1,100)}/200/300");

                var books = bookFaker.Generate(50);
                await context.Books.AddRangeAsync(books);
                await context.SaveChangesAsync();
            }
        }
    }
}
