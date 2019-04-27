namespace Purple_Umbrella.Models
{
    using System;
    using System.Data.Entity;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    public partial class DataModel : DbContext
    {
        public DataModel()
            : base("name=DataModel")
        {
        }

        public virtual DbSet<Feedback> Feedbacks { get; set; }
        public virtual DbSet<Road_Segments> Road_Segments { get; set; }
        public virtual DbSet<Safetypoint> Safetypoints { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Road_Segments>()
                .HasOptional(e => e.Feedback)
                .WithRequired(e => e.Road_Segments)
                .WillCascadeOnDelete();
        }
    }
}
