using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using Purple_Umbrella.Models;

namespace Purple_Umbrella.Controllers.Iteration2
{
    public class Road_SegmentsController : Controller
    {
        private DataModel db = new DataModel();

        // GET: Road_Segments
        public ActionResult Index()
        {
            return View(db.Road_Segments.ToList());
        }

        // GET: Road_Segments/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Road_Segments road_Segments = db.Road_Segments.Find(id);
            if (road_Segments == null)
            {
                return HttpNotFound();
            }
            return View(road_Segments);
        }

        // GET: Road_Segments/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: Road_Segments/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "Id,Name,Point1_X,Point1_Y,Point2_X,Point2_Y,Bar_Index,Cafe_Index,Light_Index,Camera_Index")] Road_Segments road_Segments)
        {
            if (ModelState.IsValid)
            {
                db.Road_Segments.Add(road_Segments);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            return View(road_Segments);
        }

        // GET: Road_Segments/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Road_Segments road_Segments = db.Road_Segments.Find(id);
            if (road_Segments == null)
            {
                return HttpNotFound();
            }
            return View(road_Segments);
        }

        // POST: Road_Segments/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "Id,Name,Point1_X,Point1_Y,Point2_X,Point2_Y,Bar_Index,Cafe_Index,Light_Index,Camera_Index")] Road_Segments road_Segments)
        {
            if (ModelState.IsValid)
            {
                db.Entry(road_Segments).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(road_Segments);
        }

        // GET: Road_Segments/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Road_Segments road_Segments = db.Road_Segments.Find(id);
            if (road_Segments == null)
            {
                return HttpNotFound();
            }
            return View(road_Segments);
        }

        // POST: Road_Segments/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            Road_Segments road_Segments = db.Road_Segments.Find(id);
            db.Road_Segments.Remove(road_Segments);
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
        public JsonResult ReturnAllRoadSegments()
        {
            var data = db.Road_Segments.ToList();
            Road_Segments road_Segments = new Road_Segments();
            List<Road_Segments> road_SegmentsList = data.Select(x => new Road_Segments
            {
                Id = x.Id,
                Name = x.Name,
                Point1_X = x.Point1_X,
                Point1_Y = x.Point1_Y,
                Point2_X = x.Point2_X,
                Point2_Y = x.Point2_Y,
                Bar_Index = x.Bar_Index,
                Cafe_Index = x.Cafe_Index,
                Camera_Index = x.Camera_Index,
                Light_Index = x.Light_Index
            }).ToList();
            return Json(road_SegmentsList, JsonRequestBehavior.AllowGet);
        }
    }
}
