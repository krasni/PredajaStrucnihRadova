using FluentValidation;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace PredajaStrucnihRadova.Models
{
    public class Podaci
    {
        [Display(Name = "Prijedlog stručnog rada")]
        [DataType(DataType.Upload)]
        public HttpPostedFileBase PrijedlogStrucnogRada { get; set; }

        [Display(Name = "Obavezna popratna dokumentacija")]
        [DataType(DataType.Upload)]
        public HttpPostedFileBase PopratnaDokumentacija { get; set; }

        public string DownloadToken { get; set; }
    }

    public class PodaciValidator : AbstractValidator<Podaci>
    {
        const int maxFilesLenPrijedlogStrucnogRada = 157286400;
        const int maxFilesLenPopratnaDokumentacija = 157286400;

        public PodaciValidator()
        {
            RuleFor(podaci => podaci.PrijedlogStrucnogRada).NotEmpty().WithMessage("Priložite prijedlog stručnog rada");
            RuleFor(podaci => podaci.PopratnaDokumentacija).NotEmpty().WithMessage("Priložite popratnu dokumentaciju");

            When(podaci => podaci.PrijedlogStrucnogRada != null, () =>
            {
                RuleFor(podaci => podaci.PrijedlogStrucnogRada).Custom((file, context) =>
                {
                    if (file.ContentLength > maxFilesLenPrijedlogStrucnogRada)
                    {
                        context.AddFailure($"Maximalna dozvoljena veličina datoteka za prijedlog stručnog rada je {maxFilesLenPrijedlogStrucnogRada / 1024 / 1024} MB");
                    }
                });
            });

            When(podaci => podaci.PopratnaDokumentacija != null , () =>
            {
                RuleFor(podaci => podaci.PopratnaDokumentacija).Custom((file, context) =>
                {
                    if (file.ContentLength > maxFilesLenPopratnaDokumentacija)
                    {
                        context.AddFailure($"Maximalna dozvoljena veličina datoteka za popratnu dokumetaciju je {maxFilesLenPrijedlogStrucnogRada / 1024 / 1024} MB");
                    }
                });
            });
        }
    }
}