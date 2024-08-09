using CleanArchitectureTemplate.Domain.Primitives;
using CleanArchitectureTemplate.Domain.Shared;
using System.Text.RegularExpressions;

namespace CleanArchitectureTemplate.Domain.Entities;

public sealed class Company : IAuditableEntity
{
    public Company()
    {
    }

    public long Id { get; private set; }
    public string Name { get; private set; }
    public string Address1 { get; private set; }
    public string? Address2 { get; private set; }
    public string? Address3 { get; private set; }
    public string? PostalCode { get; private set; }
    public string? Country { get; private set; }
    public string? Telephone { get; private set; }
    public string? Email { get; private set; }
    public string? Website { get; private set; }
    public int Status { get; private set; }
    public DateTime Created { get; set; }
    public long CreatedBy { get; set; }
    public DateTime Modified { get; set; }
    public long ModifiedBy { get; set; }

    public string FullAddress => (Address1 + ", " + Address2 + ", " + Address3 + ", " + Country + ", " + PostalCode).TrimEnd().TrimEnd(',').TrimEnd().TrimEnd(',').TrimEnd().TrimEnd(',').TrimEnd().TrimEnd(',');


    public Result<Company> CreateCompany(string name, string address1, string address2, string address3, string postalCode, string country, string telephone, string email, string website)
    {
        if (String.IsNullOrEmpty(name))
            return Result.Failure<Company>(new Error("Company.Create", "Name is required"));

        if (String.IsNullOrEmpty(address1))
            return Result.Failure<Company>(new Error("Company.Create", "Address 1 is required"));

        if (String.IsNullOrEmpty(email))
            return Result.Failure<Company>(new Error("Company.Create", "Email is required"));

        Name = name;
        Address1 = address1;
        Address2 = address2;
        Address3 = address3;
        PostalCode = postalCode;
        Country = country;
        Telephone = telephone;
        Email = email;
        Website = website;
        Status = (int)RecordStatus.Active;

        return Result.Success<Company>(this);
    }

    public Result<Company> UpdateCompany(string name, string address1, string address2, string address3, string postalCode, string country, string telephone, string email, string website, int status)
    {
        if (String.IsNullOrEmpty(name))
            return Result.Failure<Company>(new Error("Company.Update", "Name is required"));

        if (String.IsNullOrEmpty(address1))
            return Result.Failure<Company>(new Error("Company.Update", "Address 1 is required"));

        if (String.IsNullOrEmpty(email))
            return Result.Failure<Company>(new Error("Company.Update", "Email is required"));

        Name = name;
        Address1 = address1;
        Address2 = address2;
        Address3 = address3;
        PostalCode = postalCode;
        Country = country;
        Telephone = telephone;
        Email = email;
        Website = website;
        Status = status;

        return Result.Success<Company>(this);
    }

    public Result<Company> DeleteCompany()
    {
        if (Status == (int)RecordStatus.Deleted)
        {
            return Result.Failure<Company>(new Error("Company.Remove", "Company has already been removed"));
        }
        Status = (int)RecordStatus.Deleted;
        return Result.Success<Company>(this);
    }
}