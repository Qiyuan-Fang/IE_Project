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
    public class JsonsController : Controller
    {
        private DataModel db = new DataModel();

        // GET: Jsons
        public ActionResult Index()
        {
            return View(db.Jsons.ToList());
        }

        // GET: Jsons/Details/5
        public ActionResult Details(string id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Json json = db.Jsons.Find(id);
            if (json == null)
            {
                return HttpNotFound();
            }
            return View(json);
        }

        // GET: Jsons/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: Jsons/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "JsonName,JsonData")] Json json)
        {
            if (ModelState.IsValid)
            {
                db.Jsons.Add(json);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            return View(json);
        }

        // GET: Jsons/Edit/5
        public ActionResult Edit(string id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Json json = db.Jsons.Find(id);
            if (json == null)
            {
                return HttpNotFound();
            }
            return View(json);
        }

        // POST: Jsons/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "JsonName,JsonData")] Json json)
        {
            if (ModelState.IsValid)
            {
                db.Entry(json).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(json);
        }

        // GET: Jsons/Delete/5
        public ActionResult Delete(string id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Json json = db.Jsons.Find(id);
            if (json == null)
            {
                return HttpNotFound();
            }
            return View(json);
        }

        // POST: Jsons/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(string id)
        {
            Json json = db.Jsons.Find(id);
            db.Jsons.Remove(json);
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

        public JsonResult ReturnJson(string name)
        {
            db.Configuration.ProxyCreationEnabled = false;
            Json json = db.Jsons.Find(name);
            return Json(json.JsonData, JsonRequestBehavior.AllowGet);
        }
    }
}
