using CleanArchitectureTemplate.Domain.Entities;

namespace CleanArchitectureTemplate.Domain.Abstractions;

public interface ICompanyRepository
{
    Task<Company> GetById(long id);

    void Add(Company company);

    void Update(Company company);

    void Remove(Company company);
}
