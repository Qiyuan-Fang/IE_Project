using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Purple_Umbrella.Controllers.Iteration2
{
    public class Iteration2Controller : Controller
    {
        // GET: Iteration2
        public ActionResult Index()
        {
            if (User.Identity.IsAuthenticated)
            {
                return View();
            }
            return RedirectToAction("../Account/Login");
        }
    }
}