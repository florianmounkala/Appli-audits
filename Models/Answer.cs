using System.ComponentModel.DataAnnotations;

public class Answer
{
    [Key]
    public int Id { get; set; }
    public string? AnswerText { get; set; }
    public int? Rating { get; set; }
    public int AuditId { get; set; }
    public int QuestionId { get; set; }
    public virtual Audit? Audit { get; set; }
    public virtual Question? Question { get; set; }
}