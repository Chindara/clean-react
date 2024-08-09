//TODO: Implement IFeatureNameRepository

using ProjectName.Domain.Entities;

namespace ProjectName.Domain.Abstractions;

public interface IFeatureNameRepository
{
    Task<FeatureName> GetById(long id);

    void Add(FeatureName FeatureNameLower);

    void Update(FeatureName FeatureNameLower);

    void Remove(FeatureName FeatureNameLower);
}
