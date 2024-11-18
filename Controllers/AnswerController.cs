using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

[Route("api/[controller]")]
[ApiController]
public class AnswerController : BaseController
{
    private readonly SqlServerDBContext _context;
    public AnswerController(SqlServerDBContext context)
    {
        _context = context;
    }

    // GET: api/Customer
    [HttpGet]
    public ActionResult<IEnumerable<Answer>> GetAnswer()
    {
        return _context.Answer.ToList();
    }

    //GET: api/Answer/1
    [HttpGet("{idQuestion}/{idAudit}")]
    public ActionResult<string> GetAnswerText(int idQuestion , int idAudit)
    {
        var answer = _context.Answer.FirstOrDefault(a => a.AuditId == idAudit && a.QuestionId == idQuestion);

        if (answer == null || answer.AnswerText == null)
        {
            return "";
        }

        return answer.AnswerText;
    }


    // GET: api/Customer/1
    [HttpGet("{id}")]
    public ActionResult<IEnumerable<Answer>> GetAnswersByAuditId(int id)
    {
        var answers = _context.Answer // Include Question related to the Answer
            .Where(a => a.AuditId == id)
            .ToList();

        if (answers == null)
        {
            return NotFound();
        }

        return answers;
    }

    //Get : api/Answer/GetAnswersByAuditId
    [HttpGet("GetAnswersAndQuestionByAuditId")]
    public ActionResult<IEnumerable<vwQuestionAnswer>> GetAnswersAndQuestionByAuditId(int idAudit)
    {
        return _context.vwQuestionAnswer.Where(a => a.AuditId == idAudit).ToList();
    }
    
    // POST : api/Answer/Update
    [HttpPost("Update")]
    public ActionResult<Answer> UpdateAnswer(int idAudit, int idQuestion, string label , int rating , DateTime date_audition , int valid_Date)
    {
        if (label == null )
        {
            label = "";
        }
        var audit = _context.Audit.FirstOrDefault(a => a.Id == idAudit);
        if (audit == null)
        {
            return NotFound();
        }
        if (valid_Date == 1)
        {
            audit.SubmittedDate = date_audition;
            _context.SaveChanges();
        }
        var answer = _context.Answer.FirstOrDefault(a => a.AuditId == idAudit && a.QuestionId == idQuestion);
        if (answer != null)
        {
            answer.AnswerText = label;
            answer.Rating = rating;
            _context.SaveChanges();
            return Ok("Answer updated successfully");
        }
        else
        {
            var newAnswer = new Answer
            {
                AuditId = idAudit,
                QuestionId = idQuestion,
                AnswerText = label,
                Rating = rating
            };
            _context.Answer.Add(newAnswer);
            _context.SaveChanges();
            return Ok("Answer created successfully");
        }
    }

}

