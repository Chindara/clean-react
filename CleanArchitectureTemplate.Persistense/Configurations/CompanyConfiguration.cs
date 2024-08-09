using CleanArchitectureTemplate.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CleanArchitectureTemplate.Persistence.Configurations;
internal class CompanyConfiguration : IEntityTypeConfiguration<Company>
{
    public void Configure(EntityTypeBuilder<Company> builder)
    {
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Name).IsRequired().HasMaxLength(100);
        builder.Property(x => x.Address1).IsRequired().HasMaxLength(200);
        builder.Property(x => x.Address2).HasMaxLength(200);
        builder.Property(x => x.Address3).HasMaxLength(200);
        builder.Property(x => x.PostalCode).HasMaxLength(10);
        builder.Property(x => x.Country).HasMaxLength(200);
        builder.Property(x => x.Telephone).HasMaxLength(20);
        builder.Property(x => x.Email).HasMaxLength(100);
        builder.Property(x => x.Website).HasMaxLength(100);
        builder.Property(x => x.Status).IsRequired();
    }
}
