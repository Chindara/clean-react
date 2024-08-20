//TODO: Implement FeatureName

using ProjectName.Domain.Primitives;
using ProjectName.Domain.Shared;

namespace ProjectName.Domain.Entities;

public sealed class FeatureName : BaseEntity, IAuditableEntity
{
    private FeatureName() : base(default)
    {
        // Parameterless constructor for EF Core
    }

    public FeatureName(long companyId) : base(companyId)
    {
    }
    public DateTime Created { get; set; }
    public long CreatedBy { get; set; }
    public DateTime Modified { get; set; }
    public long ModifiedBy { get; set; }

    public Result<FeatureName> Update()
    {
        throw NotImplementedException();
    }

    public Result<FeatureName> Delete()
    {
        throw NotImplementedException();
    }
}