using CleanArchitectureTemplate.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchitectureTemplate.Persistence;
public interface IApplicationDbContext
{
    DbSet<Company> Companies { get; set; }
    DbSet<User> Users { get; set; }
}
