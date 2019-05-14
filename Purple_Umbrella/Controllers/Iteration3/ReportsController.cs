using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using Purple_Umbrella.Models;

namespace Purple_Umbrella.Controllers.Iteration3
{
    public class ReportsController : Controller
    {
        private DataModel db = new DataModel();

        // GET: Reports
        public ActionResult Index()
        {
            return View(db.Reports.ToList());
        }

        // GET: Reports/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Report report = db.Reports.Find(id);
            if (report == null)
            {
                return HttpNotFound();
            }
            return View(report);
        }

        // GET: Reports/Create
        public ActionResult Create()
        {
            List<string> IncidentTypes = new List<string>() { "There's a suspicious person.", "Someone harassed me." };
            ViewBag.IncidentTypes = new SelectList(IncidentTypes);
            return View();
        }

        // POST: Reports/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "Id,Longitude,Latitude,IncidentType,IncidentTime,UserCookie")] Report report)
        {
            DateTime current = DateTime.Now;
            report.ReportedTime = current;
            report.ConfirmationNum = 0;
            switch (report.IncidentType)
            {
                case "There's a suspicious person.":
                    report.IncidentType = "Risk";
                    break;
                case "Someone harassed me.":
                    report.IncidentType = "Incident";
                    break;
                default:
                    break;
            }

            ModelState.Clear();
            TryValidateModel(report);

            if (ModelState.IsValid)
            {
                db.Reports.Add(report);
                db.SaveChanges();
                return RedirectToAction("../Iteration3/NavigationMap");
            }

            return View(report);
        }

        // GET: Reports/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Report report = db.Reports.Find(id);
            if (report == null)
            {
                return HttpNotFound();
            }
            return View(report);
        }

        // POST: Reports/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "Id,Longitude,Latitude,IncidentType,IncidentTime,ReportedTime,UserCookie,ConfirmationNum")] Report report)
        {
            if (ModelState.IsValid)
            {
                db.Entry(report).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(report);
        }

        // GET: Reports/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Report report = db.Reports.Find(id);
            if (report == null)
            {
                return HttpNotFound();
            }
            return View(report);
        }

        // POST: Reports/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            Report report = db.Reports.Find(id);
            db.Reports.Remove(report);
            db.SaveChanges();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        //Create report and save to database
        public JsonResult CreateReport(float longitude, float latitude, string incidentType, DateTime incidentTime, string userCookie)
        {
            string result = "";
            try
            {
                Report report = new Report();
                DateTime current = DateTime.Now;
                report.ReportedTime = current;
                report.ConfirmationNum = 1;
                report.Longitude = longitude;
                report.Latitude = latitude;
                report.IncidentTime = incidentTime;
                report.UserCookie = userCookie;
                switch (incidentType)
                {
                    case "There's a suspicious person.":
                        report.IncidentType = "Risk";
                        break;
                    case "Someone harassed me.":
                        report.IncidentType = "Incident";
                        break;
                    default:
                        break;
                }

                ModelState.Clear();
                TryValidateModel(report);

                if (ModelState.IsValid)
                {
                    result = "Thank you for your report.";
                    db.Reports.Add(report);
                    db.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                result = ex.Message;
            }

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        //Return all reports to front end
        public JsonResult ReturnAllReports()
        {
            var data = db.Reports.ToList();
            Report report = new Report();
            List<Report> reportsList = data.Select(x => new Report
            {
                Id = x.Id,
                Longitude = x.Longitude,
                Latitude = x.Latitude,
                IncidentTime = x.IncidentTime,
                IncidentType = x.IncidentType,
                ReportedTime = x.ReportedTime,
                UserCookie = x.UserCookie,
                ConfirmationNum = x.ConfirmationNum
            }).ToList();
            return Json(reportsList, JsonRequestBehavior.AllowGet);
        }

        //Receive request from front-end then update the data in database
        public JsonResult ConfirmReport(int id)
        {
            string result = "";
            Report report = db.Reports.Find(id);
            db.Entry(report).State = EntityState.Detached;
            try
            {
                //Create a new Report object take the old one's value
                Report newReport = new Report();
                newReport.Id = report.Id;
                newReport.Longitude = report.Longitude;
                newReport.Latitude = report.Latitude;
                newReport.IncidentTime = report.IncidentTime;
                newReport.IncidentType = report.IncidentType;
                newReport.ReportedTime = report.ReportedTime;
                newReport.UserCookie = report.UserCookie;
                newReport.ConfirmationNum = report.ConfirmationNum;
                newReport.ConfirmationNum += 1;

                db.Entry(newReport).State = EntityState.Modified;
                db.SaveChanges();
                result = "Thank your for your confirmation.";
            }
            catch (Exception ex)
            {
                result = ex.Message;
            }
            return Json(result, JsonRequestBehavior.AllowGet);

        }

    }
}
