using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]

public class ThemeController : BaseController
{
    private readonly SqlServerDBContext _context;
    public ThemeController(SqlServerDBContext context)
    {
        _context = context;
    }

    // GET: api/Theme
    [HttpGet]
    public ActionResult<IEnumerable<Theme>> GetTheme()
    {
        return _context.Theme
            .OrderBy(theme => theme.Label)
            .ToList();
    }



    // POST: api/AddTheme
    [HttpPost("AddTheme")]
    public ActionResult<Theme> CreateTheme(string themeLabel)
    {
        if (string.IsNullOrEmpty(themeLabel))
        {
            return BadRequest();
        }

        // Vérifiez et créez le Theme si nécessaire
        var existingTheme = _context.Theme.FirstOrDefault(g => g.Label == themeLabel);
        if (existingTheme == null)
        {
            existingTheme = new Theme { Label = themeLabel };
            _context.Theme.Add(existingTheme);
            _context.SaveChanges();
        }

        return existingTheme;
    }
}