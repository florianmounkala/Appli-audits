using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;
using System.Linq;

[Route("api/[controller]")]
[ApiController]

public class AttachmentController : BaseController
{
    private readonly SqlServerDBContext _context;
    public AttachmentController(SqlServerDBContext context)
    {
        _context = context;
    }

    // GET: api/Customer
    [HttpGet]
    public ActionResult<IEnumerable<Attachment>> GetAttachments()
    {
        return _context.Attachment.ToList();
    }

    // GET: api/Customer/1
    [HttpGet("{id}")]
    public ActionResult<Attachment> GetAttachments(int id)
    {
        var customer = _context.Attachment.Find(id);
        if (customer == null)
        {
            return NotFound();
        }
        return customer;
    }

    // POST: api/Customer
    [HttpPost]
    public ActionResult<Attachment> CreateAttachments(Attachment Attachments)
    {
        //Arborescence
        //\Attachments\Clients\{id}\Audits\{id}\{file}

        if (Attachments == null)
        {
            return BadRequest();
        }
        _context.Attachment.Add(Attachments);
        _context.SaveChanges();
        return CreatedAtAction(nameof(GetAttachments), new { id = Attachments.Id }, Attachments);
    }
}
