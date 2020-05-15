using log4net;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AutomatskiPDFMVC.Filters
{
    public class HandleExceptionsAttribute : HandleErrorAttribute
    {
        public override void OnException(ExceptionContext filterContext)
        {
            var exception = filterContext.Exception;

            ILog log = log4net.LogManager.GetLogger("UnhandledException");
            log.Error("Error", exception);
        }
    }
}