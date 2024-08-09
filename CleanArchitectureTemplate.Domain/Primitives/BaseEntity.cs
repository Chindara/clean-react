namespace CleanArchitectureTemplate.Domain.Primitives;
public abstract class BaseEntity
{
    protected BaseEntity(long companyId)
    {
        CompanyId = companyId;
    }

    public long Id { get; private set; }
    public long CompanyId { get; private set; }
}
