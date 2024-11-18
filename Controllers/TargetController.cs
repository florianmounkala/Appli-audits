using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]

public class TargetController : BaseController
{
    private readonly SqlServerDBContext _context;
    public TargetController(SqlServerDBContext context)
    {
        _context = context;
    }

    // GET: api/Target
    [HttpGet]
    public ActionResult<IEnumerable<Target>> GetTarget()
    {
        return _context.Target
            .OrderBy(target => target.Label)
            .ToList();
    }

}