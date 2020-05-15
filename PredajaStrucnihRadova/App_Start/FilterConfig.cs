using AutomatskiPDFMVC.Filters;
using System.Web;
using System.Web.Mvc;

namespace PredajaStrucnihRadova
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
            filters.Add(new HandleExceptionsAttribute());
        }
    }
}
