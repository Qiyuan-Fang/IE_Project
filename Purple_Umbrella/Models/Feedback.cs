namespace Purple_Umbrella.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Feedback")]
    public partial class Feedback
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int Id { get; set; }

        public int Negative { get; set; }

        public int Neutral { get; set; }

        public int Positive { get; set; }

        public virtual Road_Segments Road_Segments { get; set; }
    }
}
