﻿using System.Web;
using System.Web.Optimization;

namespace Purple_Umbrella
{
    public class BundleConfig
    {

        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js",
                        "~/Scripts/test.js"
                        ));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at https://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css"));

            bundles.Add(new StyleBundle("~/Content/Iteration1/css/style").Include(
                "~/Content/bootstrap.css",
                      "~/Content/Iteration1/css/Site.css", 
                      "~/Content/Iteration1/css/hero-slider.css",
                      "~/Content/Iteration1/css/tooplate-style.css",
                      "~/Content/Iteration1/css/fontAwesome.css"
                      ));

            bundles.Add(new ScriptBundle("~/bundles/Iteration1").Include(
                       "~/Scripts/jquery-{version}.js",
                       "~/Scripts/bootstrap.js",
                       "~/Scripts/modernizr-*",
                       "~/Scripts/Iteration1/main.js",
                       "~/Scripts/Iteration1/plugins.js"));

            bundles.Add(new ScriptBundle("~/bundles/Iteration1Defer").Include(
                      "~/Scripts/Iteration1/navbar.js",
                      "~/Scripts/Iteration1/safetymap.js",
                      "~/Scripts/Iteration1/dragbar.js"));

            bundles.Add(new ScriptBundle("~/bundles/Iteration2Defer").Include(
                      "~/Scripts/Iteration1/navbar.js",
                      //"~/Scripts/Iteration2/drawroutes.js",
                      "~/Scripts/Iteration2/map.js",
                      "~/Scripts/Iteration1/dragbar.js"));


        }
    }
}
