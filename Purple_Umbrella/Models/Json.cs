namespace Purple_Umbrella.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Json
    {
        [Key]
        [StringLength(50)]
        public string JsonName { get; set; }

        [Required]
        public string JsonData { get; set; }
    }
}
