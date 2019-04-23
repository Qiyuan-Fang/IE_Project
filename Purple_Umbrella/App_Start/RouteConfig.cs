using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace Purple_Umbrella
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "Iteration1",
                url: "Iteration1/{action}",
                defaults: new { controller = "Iteration1", action = "Index" }
            );

            routes.MapRoute(
                name: "Iteration2",
                url: "Iteration2/{action}",
                defaults: new { controller = "Iteration2", action = "Index" }
            );

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Account", action = "Login", id = UrlParameter.Optional }
            );

        }
    }
}
