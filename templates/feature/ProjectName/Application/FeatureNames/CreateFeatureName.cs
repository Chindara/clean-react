//TODO: Implement CreateFeatureNameCommand

using ProjectName.Domain.Abstractions;
using ProjectName.Domain.Entities;
using ProjectName.Domain.Shared;
using MediatR;

namespace ProjectName.Application.FeatureNames;

public record CreateFeatureNameCommand(long UserId) : IRequest<Result<FeatureName>>;

internal class CreateFeatureNameCommandHandler : IRequestHandler<CreateFeatureNameCommand, Result<FeatureName>>
{
    private readonly IUnitOfWork _unitOfWork;

    public CreateFeatureNameCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<FeatureName>> Handle(CreateFeatureNameCommand request, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}