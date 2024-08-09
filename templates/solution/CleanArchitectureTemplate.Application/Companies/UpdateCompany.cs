using CleanArchitectureTemplate.Domain.Abstractions;
using CleanArchitectureTemplate.Domain.Entities;
using CleanArchitectureTemplate.Domain.Shared;
using MediatR;

namespace CleanArchitectureTemplate.Application.Companies;

public record UpdateCompanyCommand(
    long Id,
    long UserId,
    string Name,
    string Address1,
    string Address2,
    string Address3,
    string PostalCode,
    string Country,
    string Telephone,
    string Email,
    string Website,
    int Status) : IRequest<Result<Company>>;

internal class UpdateCompanyCommandHandler : IRequestHandler<UpdateCompanyCommand, Result<Company>>
{
    private readonly ICompanyRepository _companyRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateCompanyCommandHandler(ICompanyRepository companyRepository, IUnitOfWork unitOfWork)
    {
        _companyRepository = companyRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<Company>> Handle(UpdateCompanyCommand request, CancellationToken cancellationToken)
    {
        Company company = await _companyRepository.GetById(request.Id);
        if (company is null)
        {
            return Result.Failure<Company>(new Error("", "Record not found"));
        }

        Result<Company> companyResult = company.UpdateCompany(request.Name, request.Address1, request.Address2, request.Address3, request.PostalCode, request.Country, request.Telephone, request.Email, request.Website, request.Status);

        _companyRepository.Update(companyResult.Value);
        await _unitOfWork.SaveChangesAsync(request.UserId, cancellationToken);

        return Result.Success<Company>(company);
    }
}