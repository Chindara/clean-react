//TODO: Implement FeatureNameRepository

using ProjectName.Domain.Abstractions;
using ProjectName.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ProjectName.Persistence.Repositories;

internal sealed class FeatureNameRepository : IFeatureNameRepository
{
    private readonly ApplicationDbContext _context;

    public FeatureNameRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public void Add(FeatureName FeatureNameLower)
    {
        _context.FeatureNames.Add(FeatureNameLower);
    }

    public void Remove(FeatureName FeatureNameLower)
    {
        _context.FeatureNames.Remove(FeatureNameLower);
    }

    public async Task<FeatureName?> GetById(long id)
    {
        var reocrd = await _context.FeatureNames.Where(c => c.Id == id).FirstOrDefaultAsync();
        if (reocrd is not null)
        {
            return reocrd;
        }
        return null;
    }

    public void Update(FeatureName FeatureNameLower)
    {
        _context.FeatureNames.Update(FeatureNameLower);
    }
}