using OnLinePrijaveMVC.Mvc.Attributes;
using PredajaStrucnihRadova.Attributes;
using PredajaStrucnihRadova.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Web;
using System.Web.Mvc;
using Spire.Doc;
using log4net;

namespace PredajaStrucnihRadova.Controllers
{
    public class PodaciController : Controller
    {
        private static log4net.ILog Log { get; set; }
        ILog log = log4net.LogManager.GetLogger(typeof(PodaciController));

        [HttpGet]
        [ImportModelState]
        public ActionResult Podaci()
        {
            log.Info($"Browser: {Request.Browser.Browser}, Version: {Request.Browser.Version}, UserAgent: {Request.UserAgent}");
            Podaci podaci = new Podaci();
            return View(podaci);
        }

        public JsonResult SaveFormData()
        {
            log.Info($"PrijedlogStrucnogRadaFileName: {Request["PrijedlogStrucnogRadaFileName"]}");
            log.Info($"PopratnaDokumentacijaFileName: {Request["PopratnaDokumentacijaFileName"]}");

            try
            {
                System.Web.HttpContext.Current.Session["PrijedlogStrucnogRadaFileName"] = Request["PrijedlogStrucnogRadaFileName"];
                System.Web.HttpContext.Current.Session["PopratnaDokumentacijaFileName"] = Request["PopratnaDokumentacijaFileName"];
                System.Web.HttpContext.Current.Session["VrijemePredaje"] = DateTime.Now;

                return Json(new { status = true });
            }
            catch (Exception ex)
            {
                log.Error("Error", ex);
                return Json(new { status = false, message = ex.Message });
            }
        }

        public JsonResult UploadFiles()
        {
            var files = Request.Files;

            if (files.Count > 0)
            {
                try
                {
                    string UploadPath = "";

                    if (files[0].FileName.Contains("_2_"))
                    {
                        UploadPath = Server.MapPath("~/App_Data/PrijedloziStrucnihRadova");
                    }

                    if (files[0].FileName.Contains("_1_"))
                    {
                        UploadPath = Server.MapPath("~/App_Data/PopratnaDokumentacija");
                    }

                    string path = Path.Combine(UploadPath, files[0].FileName); ;

                    using (FileStream fs = new FileStream(path, FileMode.Append))
                    {
                        var bytes = GetBytes(files[0].InputStream);
                        fs.Write(bytes, 0, bytes.Length);
                    }

                    return Json(new { status = true });
                }
                catch (Exception ex)
                {
                    log.Error("Error", ex);
                    return Json(new { status = false, message = ex.Message });
                }
            }

            return Json(new { status = false });        
        }

        private byte[] GetBytes(Stream input)
        {
            byte[] buffer = new byte[input.Length];
            using (MemoryStream ms = new MemoryStream())
            {
                int read;
                while ((read = input.Read(buffer, 0, buffer.Length)) > 0)
                {
                    ms.Write(buffer, 0, read);
                }

                return ms.ToArray();
            }
        }

        [HttpGet]
        public ActionResult DownloadPDF(string DownloadToken)
        {
            try
            {
                // otvori word document
                string filesFolder = System.Web.HttpContext.Current.Server.MapPath("~/App_Data/Potvrde/");
                string templateFolder = System.Web.HttpContext.Current.Server.MapPath("~/App_Data/Template/");

                Document document = new Document();

                var datumPredaje = String.Format("{0:dd.MM.yyyy.}", System.Web.HttpContext.Current.Session["VrijemePredaje"]);
                var vrijemePredaje = String.Format("{0:HH:mm:ss}", System.Web.HttpContext.Current.Session["VrijemePredaje"]);

                document.LoadFromFile(Path.Combine(templateFolder, "TemplatePotvrda.docx"));

                document.Replace("%DatumPredaje%", datumPredaje, false, true);
                document.Replace("%VrijemePredaje%", vrijemePredaje, false, true);
                document.Replace("%PrijedlogStrucnogRadaFileName%", System.Web.HttpContext.Current.Session["PrijedlogStrucnogRadaFileName"].ToString(), false, true);
                document.Replace("%PopratnaDokumentacijaFileName%", System.Web.HttpContext.Current.Session["PopratnaDokumentacijaFileName"].ToString(), false, true);

                var newFileNameWithoutExtension = String.Format($"PotvrdaPrimitka_{DateTime.Now.ToString("yyyy-MM-dd_HH_mm_ss")}_{Guid.NewGuid().ToString()}");
                var newPdfFileName = String.Format($"{newFileNameWithoutExtension}.pdf");

                document.SaveToFile(Path.Combine(filesFolder, newPdfFileName), FileFormat.PDF);

                using (MemoryStream stream = new MemoryStream())
                {
                    document.SaveToStream(stream, FileFormat.PDF);

                    var downloadCookie = new System.Web.HttpCookie("fileDownloadToken", DownloadToken)
                    {
                        Path = "/PredajaStrucnihRadova"
                    };

                    Response.AppendCookie(downloadCookie);

                    log.Info($"Download potvrde: {newPdfFileName}");

                    return File(stream.ToArray(), "application/pdf", newPdfFileName);
                }
            }
            catch (Exception ex)
            {
                log.Error("Error", ex);
                return Json(new { status = false, message = ex.Message });
            }
        }
    }
}