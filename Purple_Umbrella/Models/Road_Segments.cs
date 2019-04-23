namespace Purple_Umbrella.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Road_Segments
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        public double Point1_X { get; set; }

        public double Point1_Y { get; set; }

        public double Point2_X { get; set; }

        public double Point2_Y { get; set; }

        public double Bar_Index { get; set; }

        public double Cafe_Index { get; set; }

        public double Light_Index { get; set; }

        public double Camera_Index { get; set; }
    }
}
