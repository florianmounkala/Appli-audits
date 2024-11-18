using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;
using System.Linq;

[Route("api/[controller]")]
[ApiController]

public class UserAuditController : BaseController
{
    private readonly SqlServerDBContext _context;
    public UserAuditController(SqlServerDBContext context)
    {
        _context = context;
    }

    // GET: api/Customer
    [HttpGet]
    public ActionResult<IEnumerable<UserAudit>> GetUserAudit()
    {
        return _context.UserAudit.ToList();
    }

    // GET: api/Customer/1
    [HttpGet("{id}")]
    public ActionResult<UserAudit> GetUserAudit(int id)
    {
        var customer = _context.UserAudit.Find(id);
        if (customer == null)
        {
            return NotFound();
        }
        return customer;
    }

}
