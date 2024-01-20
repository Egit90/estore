using API.Entity;

namespace API.Extensions;
public static class ProductExtension
{
    public static IQueryable<Product> Sort(this IQueryable<Product> query, string? orderBy)
    {
        if (string.IsNullOrEmpty(orderBy)) return query;
        query = orderBy switch
        {
            "Price" => query.OrderBy(b => b.Price),
            "PriceDec" => query.OrderByDescending(b => b.Price),
            _ => query.OrderBy(p => p.Name)
        };
        return query;
    }

    public static IQueryable<Product> Search(this IQueryable<Product> query, string searchTerm)
    {
        if (string.IsNullOrEmpty(searchTerm)) return query;

        var lowerCAse = searchTerm.Trim().ToLower();

        return query.Where(p => p.Name.ToLower().Contains(searchTerm));
    }


    public static IQueryable<Product> Filter(this IQueryable<Product> query, string brands, string types)
    {
        var brandList = new List<string>();
        var typeList = new List<string>();

        if (!string.IsNullOrEmpty(brands))
        {
            brandList.AddRange([.. brands.ToLower().Split(',')]);
        }

        if (!string.IsNullOrEmpty(types))
        {
            typeList.AddRange([.. types.ToLower().Split(",")]);
        }

        query = query.Where(p => brandList.Count == 0 || brandList.Contains(p.Brand.ToLower()));
        query = query.Where(p => typeList.Count == 0 || typeList.Contains(p.Type.ToLower()));

        return query;
    }
}