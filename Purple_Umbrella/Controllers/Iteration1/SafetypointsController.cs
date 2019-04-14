using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using Purple_Umbrella.Models;

namespace Purple_Umbrella.Controllers.Iteration1
{
    public class SafetypointsController : Controller
    {
        private DataModel db = new DataModel();

        // GET: Safetypoints
        public ActionResult Index()
        {
            return View(db.Safetypoints.ToList());
        }

        // GET: Safetypoints/Details/5
        public ActionResult Details(double? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Safetypoint safetypoint = db.Safetypoints.Find(id);
            if (safetypoint == null)
            {
                return HttpNotFound();
            }
            return View(safetypoint);
        }

        // GET: Safetypoints/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: Safetypoints/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "X,Y,Cam_score,Bar_score,Cafe_score,Light_score,Street_address,Area")] Safetypoint safetypoint)
        {
            if (ModelState.IsValid)
            {
                db.Safetypoints.Add(safetypoint);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            return View(safetypoint);
        }

        // GET: Safetypoints/Edit/5
        public ActionResult Edit(double? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Safetypoint safetypoint = db.Safetypoints.Find(id);
            if (safetypoint == null)
            {
                return HttpNotFound();
            }
            return View(safetypoint);
        }

        // POST: Safetypoints/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "X,Y,Cam_score,Bar_score,Cafe_score,Light_score,Street_address,Area")] Safetypoint safetypoint)
        {
            if (ModelState.IsValid)
            {
                db.Entry(safetypoint).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(safetypoint);
        }

        // GET: Safetypoints/Delete/5
        public ActionResult Delete(double? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Safetypoint safetypoint = db.Safetypoints.Find(id);
            if (safetypoint == null)
            {
                return HttpNotFound();
            }
            return View(safetypoint);
        }

        // POST: Safetypoints/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(double id)
        {
            Safetypoint safetypoint = db.Safetypoints.Find(id);
            db.Safetypoints.Remove(safetypoint);
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

        //Return All the safety points to the front end in JSON format
        public JsonResult ReturnAllSafetyPoints()
        {
            var data = db.Safetypoints.ToList();
            Safetypoint safetypoint = new Safetypoint();
            List<Safetypoint> safetypointList = data.Select(x => new Safetypoint
            {
                X = x.X,
                Y = x.Y,
                Bar_score = x.Bar_score,
                Cafe_score = x.Cafe_score,
                Cam_score = x.Cam_score,
                Light_score = x.Light_score,
                Street_address = x.Street_address,
                Area = x.Area
            }).ToList();
            return Json(safetypointList, JsonRequestBehavior.AllowGet);
        }
    }
}
