using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class QuestionController : BaseController
{
    private readonly SqlServerDBContext _context;
    public QuestionController(SqlServerDBContext context)
    {
        _context = context;
    }

    // GET: api/GetQuestion
    [HttpGet]
    public ActionResult<IEnumerable<Question>> GetQuestion()
    {
        return _context.Question
            .OrderBy(question => question.TargetId)
            .ThenBy(question => question.ThemeId)
            .ThenBy(question => question.RequiredLevelId)
            .Include(question => question.Theme)
            .Include(question => question.Target)
            .Include(question => question.RequiredLevel)
            .ToList();
    }

    // GET: api/QuestionDansUnAudit/1
    [HttpGet("QuestionDansUnAudit/{id}")]
    public ActionResult<bool> QuestionInAudit(int id)
    {
        var questionInAudit = _context.AuditQuestion.Any(aq => aq.QuestionId == id);
        if (questionInAudit)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    // GET: api/CriterePresent/1
    [HttpGet("CriterePresent/{id}/{givenId}")]
    public bool DoesCriteriaExistInOtherQuestions(string id, int givenId)
    {
        var criteriaExistsInOtherQuestions = _context.Question.Any(q => q.Criteria == id && q.Id != givenId);
        return criteriaExistsInOtherQuestions;
    }
    // PUT: api/ModifierVisibilité/1
    [HttpPut("ModifierVisibilité/{id}")]
    public IActionResult UpdateQuestionVisibility(int id)
    {
        var question = _context.Question.Find(id);
        if (question == null)
        {
            return NotFound();
        }

        question.Visible = !question.Visible; // Assuming Visibility is a boolean property

        _context.Entry(question).State = EntityState.Modified;
        _context.SaveChanges();
        return NoContent();
    }

    // PUT: api/ModifierQuestion/1
    [HttpPut("ModifierQuestion/{id}")]
    public IActionResult UpdateQuestion(int id, string criteriaLabel, string questionLabel, string ThemeLabel, string cible, string requiredLevel)
    {
        var question = _context.Question.Find(id);
        if (question == null)
        {
            return NotFound();
        }

        // Vérifiez et créez le Theme si nécessaire
        var existingTheme = _context.Theme.FirstOrDefault(g => g.Label == ThemeLabel);
        if (existingTheme == null)
        {
            existingTheme = new Theme { Label = ThemeLabel };
            _context.Theme.Add(existingTheme);
            _context.SaveChanges();
        }

        // Vérifiez et créez la Target si nécessaire
        var existingTarget = _context.Target.FirstOrDefault(g => g.Label == cible);
        if (existingTarget == null)
        {
            existingTarget = new Target { Label = cible };
            _context.Target.Add(existingTarget);
            _context.SaveChanges();
        }

        // Vérifiez et créez le RequiredLevel si nécessaire
        var existingRequiredLevel = _context.RequiredLevel.FirstOrDefault(g => g.Label == requiredLevel);
        if (existingRequiredLevel == null)
        {
            existingRequiredLevel = new RequiredLevel { Label = requiredLevel };
            _context.RequiredLevel.Add(existingRequiredLevel);
            _context.SaveChanges();
        }

        question.Criteria = criteriaLabel;
        question.Label = questionLabel;
        question.ThemeId = existingTheme.Id;
        question.TargetId = existingTarget.Id;
        question.RequiredLevelId = existingRequiredLevel.Id;

        _context.Entry(question).State = EntityState.Modified;
        _context.SaveChanges();
        return NoContent();
    }
    // POST: api/AddQuestion
    [HttpPost("AddQuestion")]
    public ActionResult<Question> CreateQuestion(string criteriaLabel, string questionLabel, string ThemeLabel, string cible, string requiredLevel)
    {
        if (string.IsNullOrEmpty(questionLabel) || string.IsNullOrEmpty(ThemeLabel))
        {
            return BadRequest();
        }

        // Vérifiez et créez le Theme si nécessaire
        var existingTheme = _context.Theme.FirstOrDefault(g => g.Label == ThemeLabel);
        if (existingTheme == null)
        {
            existingTheme = new Theme { Label = ThemeLabel };
            _context.Theme.Add(existingTheme);
            _context.SaveChanges();
        }

        // Vérifiez et créez la Target si nécessaire
        var existingTarget = _context.Target.FirstOrDefault(g => g.Label == cible);
        if (existingTarget == null)
        {
            existingTarget = new Target { Label = cible };
            _context.Target.Add(existingTarget);
            _context.SaveChanges();
        }

        // Vérifiez et créez le RequiredLevel si nécessaire
        var existingRequiredLevel = _context.RequiredLevel.FirstOrDefault(g => g.Label == requiredLevel);
        if (existingRequiredLevel == null)
        {
            existingRequiredLevel = new RequiredLevel { Label = requiredLevel };
            _context.RequiredLevel.Add(existingRequiredLevel);
            _context.SaveChanges();
        }

        // Créez une nouvelle question associée au Theme, Target, et RequiredLevel
        var newQuestion = new Question
        {
            Criteria = criteriaLabel,
            Label = questionLabel,
            Visible = true,
            ThemeId = existingTheme.Id,
            TargetId = existingTarget.Id,
            RequiredLevelId = existingRequiredLevel.Id
        };
        _context.Question.Add(newQuestion);
        _context.SaveChanges();
        return Ok("Question ajoutée avec succès!");
    }

    [HttpGet("IsQuestionInUse/{id}")]
    public bool IsQuestionInUse(int id)
    {
        return _context.AuditQuestion.Any(aq => aq.QuestionId == id);
    }

    [HttpDelete("DeleteQuestion/{id}")]
    public IActionResult DeleteQuestion(int id)
    {
        var question = _context.Question.Find(id);
        if (question == null)
        {
            return NotFound();
        }

        _context.Question.Remove(question);
        _context.SaveChanges();
        return NoContent();
    }

}
