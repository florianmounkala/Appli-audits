using System.ComponentModel.DataAnnotations;

public class Attachment
{
    public Attachment(string name, int auditId)
    {
        Name = name;
        AuditId = auditId;
    }

    [Key]
    public int Id { get; set; }
    public string Name { get; set; }
    public int AuditId { get; set; }
    public virtual Audit Audit { get; set; } = null!;
}