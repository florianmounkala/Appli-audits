using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;
using System.Linq;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System;
using Microsoft.Extensions.Configuration;

[Route("api/[controller]")]
[ApiController]

public class UserController : BaseController
{
    private readonly SqlServerDBContext _context;
    private readonly IConfiguration _configuration;

    public UserController(SqlServerDBContext context, IConfiguration configuration) // Add IConfiguration parameter
    {
        _context = context;
        _configuration = configuration; // Initialize _configuration field
    }

    // GET: api/Connection/1
    [HttpGet("Connection/{email}/{password}")]
    public ActionResult<bool> Connection(string email, string password)
    {
        var user = _context.User.Where(u => u.Email == email && u.Password == password).FirstOrDefault();
        if (user == null)
        {
            return false;
        }
        else
        {
            return true;
        }
    }

    // Get : api/GetInfosUser/1
    [HttpGet("GetInfosUser/{mail}/{password}")]
    public ActionResult<User> GetInfosUser(string mail, string password)
    {
        var user = _context.User.Where(u => u.Email == mail && u.Password == password).FirstOrDefault();
        if (user == null)
        {
            return NotFound();
        }
        else
        {
            return user;
        }
    }

    // GET: api/UserExists/1
    [HttpGet("UserExists/{email}")]
    public ActionResult<bool> UserExists(string email)
    {
        var user = _context.User.Where(u => u.Email == email).FirstOrDefault();
        return user != null;
    }
    // POST: api/Register
    [HttpPost("Register")]
    public ActionResult<User> Register(User user)
    {
        _context.User.Add(user);
        _context.SaveChanges();

        return user;
    }
}
