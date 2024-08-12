//TODO: Implement FeatureNamesController.cs

using ProjectName.Application.FeatureNames;
using ProjectName.Domain.Entities;
using ProjectName.Domain.Shared;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace ProjectName.Api.Controllers;

[ApiController]
public class FeatureNamesController : ControllerBase
{
    private IMediator _mediator;

    public FeatureNamesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [Route("api/FeatureNames")]
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int limit = 5)
    {
        try
        {
            var records = await _mediator.Send(new GetFeatureNamesQuery(page, limit));
            return Ok(records);
        }
        catch (Exception e)
        {
            return StatusCode(500, new { ErrorMessage = e.Message });
        }
    }

    [Route("api/FeatureNames/{id:long}")]
    [HttpGet]
    public async Task<IActionResult> GetById(long id)
    {
        try
        {
            var record = await _mediator.Send(new GetFeatureNameQuery(id));
            return Ok(new { record });
        }
        catch (Exception e)
        {
            return StatusCode(500, new { ErrorMessage = e.Message });
        }
    }

    [Route("api/FeatureNames")]
    [HttpPost]
    public async Task<IActionResult> Create(CreateFeatureNameCommand command)
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

    [Route("api/FeatureNames")]
    [HttpPut]
    public async Task<IActionResult> Update(UpdateFeatureNameCommand command)
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
}