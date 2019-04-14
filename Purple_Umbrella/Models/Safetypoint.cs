namespace Purple_Umbrella.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Safetypoint
    {
        [Key]
        [Column(Order = 0)]
        public double X { get; set; }

        [Key]
        [Column(Order = 1)]
        public double Y { get; set; }

        public double Cam_score { get; set; }

        public double Bar_score { get; set; }

        public double Cafe_score { get; set; }

        public double Light_score { get; set; }

        public string Street_address { get; set; }

        public string Area { get; set; }
    }
}
