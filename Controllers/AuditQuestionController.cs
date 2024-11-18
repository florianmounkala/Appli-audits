using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]

public class AuditQuestionController : ControllerBase
{
    private readonly SqlServerDBContext _context;

    public AuditQuestionController(SqlServerDBContext context)
    {
        _context = context;
    }

    // GET: api/AuditQuestion
    [HttpGet]
    public ActionResult<IEnumerable<AuditQuestion>> GetAuditQuestion()
    {
        return _context.AuditQuestion.ToList();
    }


    // GET: api/AuditQuestion/1
    [HttpGet("{id}")]
    public ActionResult<IEnumerable<Question>> GetAuditQuestionByAuditId(int id , string cible)
    {
        List<AuditQuestion> listeQuestionid = new List<AuditQuestion>();
        if(cible == "Toutes les questions"){
            listeQuestionid = _context.AuditQuestion.Where(a => a.AuditId == id).ToList();
            if (listeQuestionid == null)
            {
                return NotFound();
            }
        }else{
            listeQuestionid = _context.AuditQuestion.Where(a => a.AuditId == id && a.Question != null && a.Question.Target.Label == cible).ToList();
            if (listeQuestionid == null)
            {
                return NotFound();
            }
        }
        var listeQuestion = new List<Question>();

        foreach (var item in listeQuestionid)
        {
        var question = _context.Question.Include(q => q.Theme)
                                        .Include(q => q.Target)
                                        .Include(q => q.RequiredLevel)
                                        .Where(q => q.Id == item.QuestionId)
                                        .FirstOrDefault();
            if (question != null)
            {
                listeQuestion.Add(question);
            }
        }
        listeQuestion = listeQuestion.OrderBy(q => q.ThemeId).ToList();
        return Ok(listeQuestion);
    }

}