﻿using System;
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
            return View();
            //if (User.Identity.IsAuthenticated)
            //{
                
            //}
            //return RedirectToAction("../Account/Login");
        }
    }
}