using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Audit
{
    [Key]
    public int Id { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime? SubmittedDate { get; set; }
    public int ClientId { get; set; }
    public virtual Client Client { get; set; } = null!;
    public virtual ICollection<UserAudit> UserAudits { get; set; } = new List<UserAudit>();
    public virtual ICollection<Answer> Answers { get; set; } = new List<Answer>();
    public virtual ICollection<Attachment> Attachments { get; set; } = new List<Attachment>();
}