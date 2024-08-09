using MediatR;
using CleanArchitectureTemplate.Application.DTO;
using CleanArchitectureTemplate.Domain.Entities;
using CleanArchitectureTemplate.Domain.Primitives;
using CleanArchitectureTemplate.Persistence;

namespace CleanArchitectureTemplate.Application.Companies;

public record GetCompaniesQuery(int Page, int Size) : IRequest<PagedResult<CompaniesResponse>>;

internal class GetCompaniesQueryHandler : IRequestHandler<GetCompaniesQuery, PagedResult<CompaniesResponse>>
{
    private readonly IApplicationDbContext _context;

    public GetCompaniesQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PagedResult<CompaniesResponse>> Handle(GetCompaniesQuery request, CancellationToken cancellationToken)
    {
        IQueryable<Company> companyQuery = _context.Companies;
        var companyResponseQuery = companyQuery.Where(c =>c.Status != (int)RecordStatus.Deleted)
        .Select(c =>
            new CompaniesResponse(
                c.Id,
                c.Name,
                c.FullAddress,
                c.Telephone,
                c.Email,
                c.Website,
                Enums.GetEnumValue<RecordStatus>(c.Status),
                c.Created,
                c.Modified));

        var companies = await PagedResult<CompaniesResponse>.CreateAsync(companyResponseQuery, request.Page, request.Size);
        return companies;
    }
}