using CleanArchitectureTemplate.Domain.Abstractions;
using CleanArchitectureTemplate.Domain.Primitives;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace CleanArchitectureTemplate.Persistence;
internal sealed class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _dbContext;

    public UnitOfWork(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return _dbContext.SaveChangesAsync(cancellationToken);
    }

    public Task SaveChangesAsync(long userId, CancellationToken cancellationToken = default)
    {
        UpdateAuditableEntities(userId);
        return _dbContext.SaveChangesAsync(cancellationToken);
    }

    private void UpdateAuditableEntities(long userId)
    {
        IEnumerable<EntityEntry<IAuditableEntity>> entities = _dbContext.ChangeTracker.Entries<IAuditableEntity>();

        foreach (EntityEntry<IAuditableEntity> entityEntry in entities)
        {
            if (entityEntry.State == EntityState.Added)
            {
                entityEntry.Property(a => a.Created).CurrentValue = DateTime.UtcNow;
                entityEntry.Property(a => a.CreatedBy).CurrentValue = userId;
                entityEntry.Property(a => a.Modified).CurrentValue = DateTime.UtcNow;
                entityEntry.Property(a => a.ModifiedBy).CurrentValue = userId;
            }

            if (entityEntry.State == EntityState.Modified)
            {
                entityEntry.Property(a => a.Modified).CurrentValue = DateTime.UtcNow;
                entityEntry.Property(a => a.ModifiedBy).CurrentValue = userId;
            }
        }
    }
}
