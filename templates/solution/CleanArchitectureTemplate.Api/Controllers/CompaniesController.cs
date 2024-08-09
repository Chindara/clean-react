using CleanArchitectureTemplate.Application.Companies;
using CleanArchitectureTemplate.Domain.Entities;
using CleanArchitectureTemplate.Domain.Shared;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CleanArchitectureTemplate.Api.Controllers;

[ApiController]
public class CompaniesController : ControllerBase
{
    private IMediator _mediator;

    public CompaniesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [Route("api/Companies")]
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int limit = 5)
    {
        try
        {
            var records = await _mediator.Send(new GetCompaniesQuery(page, limit));
            return Ok(records);
        }
        catch (Exception e)
        {
            return StatusCode(500, new { ErrorMessage = e.Message });
        }
    }

    [Route("api/Companies/{id:long}")]
    [HttpGet]
    public async Task<IActionResult> GetById(long id)
    {
        try
        {
            CompanyResponse record = await _mediator.Send(new GetCompanyQuery(id));
            return Ok(new { record });
        }
        catch (Exception e)
        {
            return StatusCode(500, new { ErrorMessage = e.Message });
        }
    }

    [Route("api/Companies")]
    [HttpPost]
    public async Task<IActionResult> Create(CreateCompanyCommand command)
    {
        try
        {
            var response = await _mediator.Send(command);
            if (response.IsFailure)
            {
                return BadRequest(response.Error);
            }

            return Ok(new { response.IsSuccess });
        }
        catch (Exception e)
        {
            return StatusCode(500, new { ErrorMessage = e.Message });
        }
    }

    [Route("api/Companies")]
    [HttpPut]
    public async Task<IActionResult> Update(UpdateCompanyCommand command)
    {
        try
        {
            Result<Company> response = await _mediator.Send(command);
            if (response.IsFailure)
            {
                return BadRequest(response.Error);
            }
            return Ok(new { response.IsSuccess });
        }
        catch (Exception e)
        {
            return StatusCode(500, new { ErrorMessage = e.Message });
        }
    }
}