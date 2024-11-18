using System.ComponentModel.DataAnnotations;
public class Question
{
    [Key]
    public int Id { get; set; }

    public bool? Visible { get; set; }

    public string Criteria { get; set; } = null!;

    public string Label { get; set; } = null!;

    public int ThemeId { get; set; }

    public int TargetId { get; set; }

    public int RequiredLevelId { get; set; }

    public virtual Theme Theme { get; set; } = null!;

    public virtual Target Target { get; set; } = null!;

    public virtual RequiredLevel RequiredLevel { get; set; } = null!;


    public virtual ICollection<Answer> Answers { get; set; } = new List<Answer>();
}