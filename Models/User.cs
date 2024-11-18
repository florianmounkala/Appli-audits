
// Purpose: Model for Personnel table in database. Contains all the columns in the Personnel table.
using System.ComponentModel.DataAnnotations;
public class User
{
    public User(string email)
    {
        this.Email = email;
    }
    [Key]
    public int Id { get; set; }
    [Required]
    public string? FirstName { get; set; }
    [Required]
    public string? LastName { get; set; }
    [Required]
    public string? Phone { get; set; }
    [Required]
    [EmailAddress]
    public string Email { get; set; }
    public int? UserGroupId { get; set; }
    [Required]
    public string? Password { get; set; }
    public virtual ICollection<UserAudit> UserAudits { get; set; } = new List<UserAudit>();

    public virtual ICollection<UserGroupe> UserGroupe { get; set; } = new List<UserGroupe>();
}