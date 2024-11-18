using System.ComponentModel.DataAnnotations;

public class Client
{
    public Client()
    {

    }
    public Client(string name)
    {
        this.Name = name;
    }
    [Key]
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string ContactName { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Adress { get; set; }
    public string? City { get; set; }
    public string? Country { get; set; }
    public string? Branch { get; set; }
    public virtual ICollection<Audit> Audits { get; set; } = new List<Audit>();
}