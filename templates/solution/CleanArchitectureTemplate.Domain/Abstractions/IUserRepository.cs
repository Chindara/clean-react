using CleanArchitectureTemplate.Domain.Entities;

namespace CleanArchitectureTemplate.Domain.Abstractions;

public interface IUserRepository
{
    Task<User> GetById(long id);

    Task<User> GetByEmail(string email);

    void Add(User user);

    void Update(User user);
}