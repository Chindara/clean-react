//TODO: Implement GetFeatureNamesQuery

using ProjectName.Application.DTO;
using ProjectName.Domain.Entities;
using ProjectName.Domain.Primitives;
using ProjectName.Persistence;
using MediatR;

namespace ProjectName.Application.FeatureNames;

public record GetFeatureNamesQuery(long CompanyId, int Page, int Size) : IRequest<PagedResult<FeatureNamesResponse>>;

internal class GetFeatureNamesQueryHandler : IRequestHandler<GetFeatureNamesQuery, PagedResult<FeatureNamesResponse>>
{
    private readonly IApplicationDbContext _context;

    public GetFeatureNamesQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PagedResult<FeatureNamesResponse>> Handle(GetFeatureNamesQuery request, CancellationToken cancellationToken)
    {
        //var results = await PagedResult<FeatureNameResponses>.CreateAsync(query, request.Page, request.Size);
        //return results;

        throw new NotImplementedException();
    }
}