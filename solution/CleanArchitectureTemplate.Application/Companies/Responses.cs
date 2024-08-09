namespace CleanArchitectureTemplate.Application.Companies;

public record CompanyResponse(
    long Id,
    string Name,
    string Address1,
    string Address2,
    string Address3,
    string PostalCode,
    string Country,
    string Telephone,
    string Email,
    string Website,
    int Status,
    DateTime Created,
    DateTime Modified
);

public record CompaniesResponse(
    long Id,
    string Name,
    string Address,
    string Telephone,
    string Email,
    string Website,
    string Status,
    DateTime Created,
    DateTime Modified
);