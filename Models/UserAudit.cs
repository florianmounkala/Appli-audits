using System.ComponentModel.DataAnnotations;
public class UserAudit
{
    [Key]
    public int Id { get; set; }
    public int UserId { get; set; }
    public int AuditId { get; set; }
    public virtual Audit Audit { get; set; } = null!;
    public virtual User User { get; set; } = null!;
}