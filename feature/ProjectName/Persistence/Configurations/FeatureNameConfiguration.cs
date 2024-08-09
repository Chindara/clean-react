//TODO: Implement FeatureNameConfiguration

using ProjectName.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ProjectName.Persistence.Configurations;
internal class FeatureNameConfiguration : IEntityTypeConfiguration<object>
{
    public void Configure(EntityTypeBuilder<object> builder)
    {
        builder.HasKey(x => x.Id);
    }
}