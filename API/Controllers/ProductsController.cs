using API.Data;
using API.Entity;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController(StoreContext context)
{
    private readonly StoreContext _context = context;

    [HttpGet]
    public async Task<ActionResult<List<Product>>> GetProducts()
    {
        var Products = await _context.Products.ToListAsync();
        return Products;
    }


    [HttpGet("{id}")]
    public async Task<ActionResult<Product>> GetProducts(int id)
    {
        return await _context.Products.FindAsync(id);
    }

}
