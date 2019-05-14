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
    public class FeedbacksController : Controller
    {
        private DataModel db = new DataModel();

        // GET: Feedbacks
        public ActionResult Index()
        {
            var feedbacks = db.Feedbacks.Include(f => f.Road_Segments);
            return View(feedbacks.ToList());
        }

        // GET: Feedbacks/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Feedback feedback = db.Feedbacks.Find(id);
            if (feedback == null)
            {
                return HttpNotFound();
            }
            return View(feedback);
        }

        // GET: Feedbacks/Create
        public ActionResult Create()
        {
            ViewBag.Id = new SelectList(db.Road_Segments, "Id", "Name");
            return View();
        }

        // POST: Feedbacks/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "Id,Negative,Neutral,Positive")] Feedback feedback)
        {
            if (ModelState.IsValid)
            {
                db.Feedbacks.Add(feedback);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            ViewBag.Id = new SelectList(db.Road_Segments, "Id", "Name", feedback.Id);
            return View(feedback);
        }

        // GET: Feedbacks/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Feedback feedback = db.Feedbacks.Find(id);
            if (feedback == null)
            {
                return HttpNotFound();
            }
            ViewBag.Id = new SelectList(db.Road_Segments, "Id", "Name", feedback.Id);
            return View(feedback);
        }

        // POST: Feedbacks/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "Id,Negative,Neutral,Positive")] Feedback feedback)
        {
            if (ModelState.IsValid)
            {
                db.Entry(feedback).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.Id = new SelectList(db.Road_Segments, "Id", "Name", feedback.Id);
            return View(feedback);
        }

        // GET: Feedbacks/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Feedback feedback = db.Feedbacks.Find(id);
            if (feedback == null)
            {
                return HttpNotFound();
            }
            return View(feedback);
        }

        // POST: Feedbacks/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            Feedback feedback = db.Feedbacks.Find(id);
            db.Feedbacks.Remove(feedback);
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

        //Return the feedback of a specific road
        public JsonResult ReturnFeedback(int? id)
        {
            db.Configuration.ProxyCreationEnabled = false;
            Feedback feedback = db.Feedbacks.Find(id);
            return Json(feedback, JsonRequestBehavior.AllowGet);
        }

        //Receive request from front-end then update the data to database
        public JsonResult UpdateTable(int id, int choice)//int negative, int neutral, int positive)
        {
            string result = "";
            Feedback feedback = db.Feedbacks.Find(id);
            db.Entry(feedback).State = EntityState.Detached;
            try
            {
                //Create a new Feedback object take the old one's value
                Feedback newFeedback = new Feedback();
                newFeedback.Id = feedback.Id;
                newFeedback.Negative = feedback.Negative;
                newFeedback.Neutral = feedback.Neutral;
                newFeedback.Positive = feedback.Positive;
                //newFeedback.Id = id;
                //newFeedback.Negative = negative;
                //newFeedback.Neutral = neutral;
                //newFeedback.Positive = positive;
                switch (choice)
                {
                    case 1:
                        newFeedback.Negative += 1;
                        break;
                    case 2:
                        newFeedback.Neutral += 1;
                        break;
                    case 3:
                        newFeedback.Positive += 1;
                        break;
                    default:
                        break;
                }
                result = "Thank your for your feedback.";
                db.Entry(newFeedback).State = EntityState.Modified;
                db.SaveChanges();
            }
            catch (Exception ex)
            {
                result = ex.Message;
            }
            return Json(result, JsonRequestBehavior.AllowGet);

        }
    }
}
