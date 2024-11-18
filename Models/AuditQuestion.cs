using System.ComponentModel.DataAnnotations;

public class AuditQuestion
{
    [Key]
    public int Id { get; set; }
    public int QuestionId { get; set; }
    public int AuditId { get; set; }

    public virtual Question? Question { get; set; }

    public virtual Audit? Audit { get; set; }
}