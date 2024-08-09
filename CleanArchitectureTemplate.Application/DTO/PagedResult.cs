using Microsoft.EntityFrameworkCore;

namespace CleanArchitectureTemplate.Application.DTO;

public class PagedResult<T>
{
    public PagedResult(List<T> items, int page, int limit, int totalCount)
    {
        Items = items;
        Page = page;
        Limit = limit;
        TotalCount = totalCount;
    }

    public List<T> Items { get; }
    private int Page { get; }
    private int Limit { get; }
    public int TotalPages => Convert.ToInt32(Math.Ceiling(Convert.ToDecimal(TotalCount) / Convert.ToDecimal(Limit)));
    public int TotalCount { get; }
    public bool HasMore => Page < TotalPages;
    public int CurrentCount => Limit;
    public int CurrentPage => Page;

    public static async Task<PagedResult<T>> CreateAsync(IQueryable<T> query, int page, int limit)
    {
        var totalCount = await query.CountAsync();
        var items = await query.Skip((page - 1) * limit).Take(limit).ToListAsync();

        return new(items, page, limit, totalCount);
    }
}