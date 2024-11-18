using System.ComponentModel.DataAnnotations;
public class RequiredLevel
{
    [Key]
    public int Id { get; set; }
    public string Label { get; set; } = null!;
}