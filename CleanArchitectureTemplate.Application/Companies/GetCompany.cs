using MediatR;
using Microsoft.EntityFrameworkCore;
using CleanArchitectureTemplate.Persistence;

namespace CleanArchitectureTemplate.Application.Companies;

public record GetCompanyQuery(long Id) : IRequest<CompanyResponse>;

internal class GetCompanyQueryHandler : IRequestHandler<GetCompanyQuery, CompanyResponse>
{
    private readonly IApplicationDbContext _context;

    public GetCompanyQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<CompanyResponse> Handle(GetCompanyQuery request, CancellationToken cancellationToken)
    {
        var companyResponse = await _context.Companies.Where(c => c.Id == request.Id)
                     .Select(c => new CompanyResponse(
                         c.Id,
                         c.Name,
                         c.Address1,
                         c.Address2,
                         c.Address3,
                         c.PostalCode,
                         c.Country,
                         c.Telephone,
                         c.Email,
                         c.Website,
                         c.Status,
                         c.Created,
                         c.Modified
                     )).FirstAsync();

        return companyResponse;
    }
}