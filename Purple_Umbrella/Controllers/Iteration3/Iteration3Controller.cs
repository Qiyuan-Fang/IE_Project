using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Purple_Umbrella.Controllers.Iteration3
{
    public class Iteration3Controller : Controller
    {
        // GET: Iteration3
        public ActionResult Index()
        {
            if (User.Identity.IsAuthenticated)
            {
                return View();
            }
            return RedirectToAction("../Account/Login");
        }

        // GET: Map
        public ActionResult Map()
        {
            return View();
        }

        // GET: NavigationMap
        public ActionResult NavigationMap()
        {
            List<string> IncidentTypes = new List<string>() { "There's a suspicious person.", "Someone harassed me." };
            ViewBag.IncidentTypes = new SelectList(IncidentTypes);
            return View();
        }

        // GET: Support
        public ActionResult Support()
        {
            List<string> IncidentTypes = new List<string>() { "There's a suspicious person.", "Someone harassed me." };
            ViewBag.IncidentTypes = new SelectList(IncidentTypes);
            return View();
        }

    }
}