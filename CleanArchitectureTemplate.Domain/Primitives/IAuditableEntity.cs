// Ignore Spelling: Auditable

namespace CleanArchitectureTemplate.Domain.Primitives;

public interface IAuditableEntity
{
    DateTime Created { get; set; }
    long CreatedBy { get; set; }
    DateTime Modified { get; set; }
    long ModifiedBy { get; set; }
}