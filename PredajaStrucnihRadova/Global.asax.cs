﻿using FluentValidation.Mvc;
using FluentValidationApplication.Validation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace PredajaStrucnihRadova
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            log4net.Config.XmlConfigurator.Configure();
            AreaRegistration.RegisterAllAreas();
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            ValidationConfiguration();

            Bootstrapper.Initialise();
        }
        private void ValidationConfiguration()
        {
            FluentValidationModelValidatorProvider.Configure(provider =>
            {
                provider.ValidatorFactory = new ValidatorFactory();
            });
        }

        //protected void Application_BeginRequest()
        //{
        //    log4net.GlobalContext.Properties["requestId"] =
        //        JSNLog.JavascriptLogging.RequestId();
        //    log4net.Config.XmlConfigurator.Configure();
        //}
    }
}
