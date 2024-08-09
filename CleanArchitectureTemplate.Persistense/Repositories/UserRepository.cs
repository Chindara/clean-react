using CleanArchitectureTemplate.Domain.Abstractions;
using CleanArchitectureTemplate.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CleanArchitectureTemplate.Persistence.Repositories;

internal sealed class UserRepository : IUserRepository
{
    private readonly ApplicationDbContext _applicationDbContext;

    public UserRepository(ApplicationDbContext applicationDbContext)
    {
        _applicationDbContext = applicationDbContext;
    }

    public void Add(User user)
    {
        _applicationDbContext.Users.Add(user);
    }

    public async Task<User?> GetById(long id)
    {
        var record = await _applicationDbContext.Users.Where(c => c.Id == id).FirstOrDefaultAsync();
        if (record is not null)
        {
            return record;
        }
        return null;
    }

    public async Task<User> GetByEmail(string email)
    {
        var record = await _applicationDbContext.Users.Where(c => c.Email == email).FirstOrDefaultAsync();
        if (record is not null)
        {
            return record;
        }
        return null;
    }

    public void Update(User user)
    {
        _applicationDbContext.Users.Update(user);
    }
}