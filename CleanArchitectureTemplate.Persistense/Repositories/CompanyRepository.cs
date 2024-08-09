using CleanArchitectureTemplate.Domain.Abstractions;
using CleanArchitectureTemplate.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CleanArchitectureTemplate.Persistence.Repositories;

internal sealed class CompanyRepository : ICompanyRepository
{
    private readonly ApplicationDbContext _context;

    public CompanyRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public void Add(Company company)
    {
        _context.Companies.Add(company);
    }

    public void Remove(Company company)
    {
        _context.Companies.Remove(company);
    }

    public async Task<Company?> GetById(long id)
    {
        var reocrd = await _context.Companies.Where(c => c.Id == id).FirstOrDefaultAsync();
        if (reocrd is not null)
        {
            return reocrd;
        }
        return null;
    }

    public void Update(Company company)
    {
        _context.Companies.Update(company);
    }
}