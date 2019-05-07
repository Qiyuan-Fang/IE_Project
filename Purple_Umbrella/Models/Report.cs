using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace assignment_6.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;

    public partial class Report
    {
        [Required]
        public int Id { get; set; }

        public double Longitude { get; set; }

        public double Latitude { get; set; }

        public string IncidentType { get; set; }

        public System.DateTime IncidentTime { get; set; }

        public System.DateTime ReportedTime { get; set; }

        public string UserCookie { get; set; }
    }
}