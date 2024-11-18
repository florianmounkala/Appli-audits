using System.ComponentModel.DataAnnotations;
public class Target
{
    [Key]
    public int Id { get; set; }

    public string Label { get; set; } = null!;

}