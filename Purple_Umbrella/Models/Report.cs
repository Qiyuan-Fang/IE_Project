namespace Purple_Umbrella.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Report
    {
        public int Id { get; set; }

        public double Longitude { get; set; }

        public double Latitude { get; set; }

        [Required]
        public string IncidentType { get; set; }

        public DateTime IncidentTime { get; set; }

        public DateTime ReportedTime { get; set; }

        [Required]
        public string UserCookie { get; set; }

        public int ConfirmationNum { get; set; }
    }
}
