//TODO: Implement UpdateFeatureNameCommand

using ProjectName.Domain.Abstractions;
using ProjectName.Domain.Entities;
using ProjectName.Domain.Shared;
using MediatR;

namespace ProjectName.Application.FeatureNames;

public record UpdateFeatureNameCommand(long Id, long UserId) : IRequest<Result<FeatureName>>;

internal class UpdateFeatureNameCommandHandler : IRequestHandler<UpdateFeatureNameCommand, Result<FeatureName>>
{
    private readonly IUnitOfWork _unitOfWork;

    public UpdateFeatureNameCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<FeatureName>> Handle(UpdateFeatureNameCommand request, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}