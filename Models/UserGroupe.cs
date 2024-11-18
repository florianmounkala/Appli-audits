using System.ComponentModel.DataAnnotations;
public class UserGroupe
{
    [Key]
    public int Id { get; set; }
    public string? Name { get; set; }
}