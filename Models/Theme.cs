using System.ComponentModel.DataAnnotations;

public class Theme
{
    [Key]
    public int Id { get; set; }

    public string Label { get; set; } = null!;
}
