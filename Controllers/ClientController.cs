using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;
using System.Linq;

[Route("api/[controller]")]
[ApiController]

public class ClientController : BaseController
{
    private readonly SqlServerDBContext _context;
    public ClientController(SqlServerDBContext context)
    {
        _context = context;
    }

    // GET: api/Customer
    [HttpGet]
    public ActionResult<IEnumerable<Client>> GetClient()
    {
        return _context.Client.ToList();
    }

    // GET: api/Customer/1
    [HttpGet("{id}")]
    public ActionResult<Client> GetClient(int id)
    {
        var customer = _context.Client.Find(id);
        if (customer == null)
        {
            return NotFound();
        }
        return customer;
    }

    // GET: api/Customer/1
    [HttpGet("GetClientName/{id}")]
    public ActionResult<string> GetClientName(int id)
    {
        var customer = _context.Client.Find(id);
        if (customer == null)
        {
            return NotFound();
        }
        return customer.Name;
    }


    // POST: api/Customer
    [HttpPost("AddClient")]
    public ActionResult<Client> CreateClient(Client Client)
    {
        if (Client == null)
        {
            return BadRequest();
        }
        _context.Client.Add(Client);
        _context.SaveChanges();
        return CreatedAtAction(nameof(GetClient), new { id = Client.Id }, Client);
    }

    // PUT: api/Customer/1
    [HttpPut("ModifierClient/{id}")]
    public IActionResult UpdateClient(int id, Client Client)
    {
        if (id != Client.Id)
        {
            return BadRequest();
        }
        var existingClient = _context.Client.Find(id);
        if (existingClient == null)
        {
            return NotFound();
        }
        existingClient.Name = Client.Name;
        existingClient.Phone = Client.Phone;
        existingClient.Email = Client.Email;
        existingClient.Adress = Client.Adress;
        existingClient.City = Client.City;
        existingClient.Country = Client.Country;
        existingClient.ContactName = Client.ContactName;
        existingClient.Branch = Client.Branch;
        _context.Client.Update(existingClient);
        _context.SaveChanges();
        return Ok();
    }
}
