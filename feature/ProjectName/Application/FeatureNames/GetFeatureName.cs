//TODO: Implement GetFeatureNameQuery

using ProjectName.Persistence;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ProjectName.Application.FeatureNames;

public record GetFeatureNameQuery(long Id) : IRequest<FeatureNameResponse>;

internal class GetFeatureNameQueryHandler : IRequestHandler<GetFeatureNameQuery, FeatureNameResponse>
{
    private readonly IApplicationDbContext _context;

    public GetFeatureNameQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<FeatureNameResponse> Handle(GetFeatureNameQuery request, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}