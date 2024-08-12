//TODO: Implement GetFeatureNamesQuery

using ProjectName.Application.DTO;
using ProjectName.Domain.Entities;
using ProjectName.Domain.Primitives;
using ProjectName.Persistence;
using MediatR;

namespace ProjectName.Application.FeatureNames;

public record GetFeatureNamesQuery(long CompanyId, int Page, int Size) : IRequest<PagedResult<FeatureNameResponses>>;

internal class GetFeatureNamesQueryHandler : IRequestHandler<GetFeatureNamesQuery, PagedResult<FeatureNameResponses>>
{
    private readonly IApplicationDbContext _context;

    public GetFeatureNamesQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PagedResult<FeatureNameResponses>> Handle(GetFeatureNamesQuery request, CancellationToken cancellationToken)
    {
        //var results = await PagedResult<FeatureNameResponses>.CreateAsync(query, request.Page, request.Size);
        //return results;

        throw new NotImplementedException();
    }
}