using Microsoft.EntityFrameworkCore;
public partial class SqlServerDBContext : DbContext
{
    public SqlServerDBContext(DbContextOptions<SqlServerDBContext> options)
        : base(options) { }

    //public virtual DbSet<Todo> Todo { get; set; }
    public virtual DbSet<User> User { get; set; }
    public virtual DbSet<AuditQuestion> AuditQuestion { get; set; }
    public virtual DbSet<Answer> Answer { get; set; }
    public virtual DbSet<Question> Question { get; set; }
    public virtual DbSet<Attachment> Attachment { get; set; }
    public virtual DbSet<Audit> Audit { get; set; }
    public virtual DbSet<Client> Client { get; set; }
    public virtual DbSet<UserAudit> UserAudit { get; set; }
    public virtual DbSet<Theme> Theme { get; set; }
    public virtual DbSet<Target> Target { get; set; }
    public virtual DbSet<RequiredLevel> RequiredLevel { get; set; }
    public virtual DbSet<vwQuestionAnswer> vwQuestionAnswer { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<vwQuestionAnswer>(entity =>
    {
        entity.HasNoKey();
    });
}

}