
$().ready(function () {

    console.log("ef");

    var token = new Date().getTime(); //use the current timestamp as the token value
    $('#download_token_value').val(token);

    $('#btnUpload').click(function () {

        if ($('#form1').valid()) {
            $('#prijavaPredana').hide();
            $('#exampleModalCenter').modal();
        }
    }
    )

   jQuery.validator.addMethod("maxFilesLenValid", function (value, element) {
       var filesSize = 0;
       var maxFilesLen = 157286400;
        for (var i = 0; i < element.files.length; i++) {
            filesSize += element.files[i].size;  
        }
        return filesSize <= maxFilesLen;
   }, "Maximalna dozvoljena veličina datoteke za upload je 150 MB");

    jQuery.validator.addMethod("isExtensionValid", function (value, element) {
        var fileNameExt = value.split('.').pop();
        return fileNameExt === 'docx' || fileNameExt === 'doc';
    }, "Extenzija nije validna");

    jQuery.validator.addMethod("isPrijedlogStrucnogRadaFileNameValid", function (value, element) {
        var dateRegex = /\b(?=(?:\d*[a-zA-Z]){5}(?!\d*[a-zA-Z]))(?=(?:[a-zA-Z]*\d){3}(?![a-zA-Z]*\d))[a-zA-Z\d]+\b/;
        var fileNameWithoutExt = value.substring(0, value.lastIndexOf('.')) || value;
        var zadnjaDvaZnaka = fileNameWithoutExt.slice(-2);
        var fileNameWithoutExtAndLastTwoCharacters = fileNameWithoutExt.slice(0, fileNameWithoutExt.length - 2);
        return dateRegex.test(fileNameWithoutExtAndLastTwoCharacters) && zadnjaDvaZnaka === '_2';
    }, "Neispravan naziv datoteke");

    jQuery.validator.addMethod("isOstalaDokumentacijaFileNameValid", function (value, element) {
        var dateRegex = /\b(?=(?:\d*[a-zA-Z]){5}(?!\d*[a-zA-Z]))(?=(?:[a-zA-Z]*\d){3}(?![a-zA-Z]*\d))[a-zA-Z\d]+\b/;
        var fileNameWithoutExt = value.substring(0, value.lastIndexOf('.')) || value;
        var zadnjaDvaZnaka = fileNameWithoutExt.slice(-2);
        var fileNameWithoutExtAndLastTwoCharacters = fileNameWithoutExt.slice(0, fileNameWithoutExt.length - 2);
        return dateRegex.test(fileNameWithoutExtAndLastTwoCharacters) && zadnjaDvaZnaka === '_1';
    }, "Neispravan naziv datoteke");

    jQuery.validator.addMethod("isPasswordSame", function (value, element) {
        var prijedlogStrucnogRadaFileNameFullPath = $("#PrijedlogStrucnogRada").val();
        var prijedlogStrucnogRadaFileName = prijedlogStrucnogRadaFileNameFullPath.replace(/^.*[\\\/]/, '');
        var prijedlogStrucnogRadaFileNameWithoutExt = prijedlogStrucnogRadaFileName.substring(0, prijedlogStrucnogRadaFileName.lastIndexOf('.')) || value;
        var popratnaDokumentacijaFileNameWithoutExt = value.substring(0, value.lastIndexOf('.')) || value;

        prijedlogStrucnogRadaFileNameWithoutExtFirstEightLetters = prijedlogStrucnogRadaFileNameWithoutExt.slice(0, 8);
        popratnaDokumentacijaFileNameWithoutExtFirstEightLetters = popratnaDokumentacijaFileNameWithoutExt.slice(0, 8);

        return prijedlogStrucnogRadaFileNameWithoutExtFirstEightLetters === popratnaDokumentacijaFileNameWithoutExtFirstEightLetters;
    }, "Datoteke nisu istog naziva!");

    $('#form1').submit(function (evt) {
        if ($('#form1').valid()) {
            uploadFile();
            evt.preventDefault();
        }
        else {
            evt.preventDefault();
        }
    });

    $(function () {
        $("#form1").validate({
            rules: {
                "PrijedlogStrucnogRada": {
                    required: true,
                    maxFilesLenValid: true,
                    isPrijedlogStrucnogRadaFileNameValid: true,
                    isExtensionValid: true
                },
                "PopratnaDokumentacija": {
                    required: true,
                    maxFilesLenValid: true,
                    isOstalaDokumentacijaFileNameValid: true,
                    isPasswordSame: true
                },
            },
            messages: {
                "PrijedlogStrucnogRada": {
                    required: "Priložite prijedlog stručnog rada",
                    maxFilesLenValid: "Maximalna dozvoljena veličina datoteka za prijedlog stručnog rada je 150 MB",
                    isPrijedlogStrucnogRadaFileNameValid: "Neispravan naziv datoteke",
                    isExtensionValid: "Neispravan format dokumenta"
                },
                "PopratnaDokumentacija": {
                    required: "Priložite popratnu dokumentaciju",
                    maxFilesLenValid: "Maximalna dozvoljena veličina datoteka za popratnu dokumetaciju je 150 MB",
                    isOstalaDokumentacijaFileNameValid: "Neispravan naziv datoteke",
                    isPasswordSame: "Dokumenti moraju biti imenovani istom zaporkom"
                },
            }
        });
    });
});

function UploadFiles() {
    $('#exampleModalCenter').modal('hide');

    var filePrijedlogStrucnogRada = document.getElementById('PrijedlogStrucnogRada').files[0];
    var filePopratnaDokumentacija = document.getElementById('PopratnaDokumentacija').files[0];

    var filesToUpload = [filePrijedlogStrucnogRada, filePopratnaDokumentacija];

    var totalByteLength = 0;

    for (var i = 0; i < filesToUpload.length; i++) {
        totalByteLength += filesToUpload[i].size;
    }

    $('#total').val(totalByteLength / 1024 / (chunkSizeInMB * 1024));
    $('#counter').val(0);
    $('#filesUploaded').val(0);

    $('.progress-bar').css('width', '0%')
        .attr('aria-valuenow', 0);
    $("#percentageText").text("0%");

    myApp.showPleaseWait();

    for (var i = 0; i < filesToUpload.length; i++) {
        UploadFile(filesToUpload[i]);
    }
}

function UploadFileChunk(FileChunks, FileName, CurrentPart, TotalPart) {
    var formData = new FormData();
    formData.append('file', FileChunks[CurrentPart - 1], FileName);

    jQuery(function ($) {
        $.ajax({
            type: "POST",
            url: window.location.href + "/" + 'Podaci/UploadFiles/',
            contentType: false,
            processData: false,
            data: formData,
            xhr: function () {
                var xhr = new window.XMLHttpRequest();
                xhr.upload.addEventListener("progress", function (e, data) {
                    if (e.lengthComputable) {
                           
                    }
                    else $('#uploadFile').html('hmmm');
                }, false);
                return xhr;
            },
            success: function (data, textStatus, jqXHR) {
                if (data.status == true) {
                    if (TotalPart == CurrentPart) {
                        console.log("whole file uploaded successfully");

                        var filesUploaded = parseInt($('#filesUploaded').val()) + 1;
                        $('#filesUploaded').val(filesUploaded);

                        if ($('#filesUploaded').val() == 2) {
                            $('.progress-bar').css('width', '100%')
                                .attr('aria-valuenow', percentage);
                            $("#percentageText").text("100%");

                            myApp.hidePleaseWait();
                            myApp.hidePleaseWait();

                            // ovdje ide dowload pdf-a
                            DownloadPDF();

                            //$('#pozdravniDialog').modal();
                        }
                    }
                    else {
                        var count = parseInt($('#counter').val()) + 1;
                        $('#counter').val(count);

                        console.log("success:", $('#counter').val(), $('#total').val());

                        var percentage = Math.floor($('#counter').val() / $('#total').val() * 100);

                        $('.progress-bar').css('width', percentage + '%')
                            .attr('aria-valuenow', percentage);
                        $("#percentageText").text(Math.round(percentage) + "%");

                        UploadFileChunk(FileChunks, FileName, CurrentPart + 1, TotalPart);

                        console.log("success:", percentage);
                    }
                }
                else {
                    console.log("failed to upload file part no: " + CurrentPart);
                    alert("Predaja datoteke nije uspjela, molim pokušajte ponovo.");
                }
            },
            error: function (xhr, textStatus, thrownError) {

                console.log("error to upload file part no: " + CurrentPart);
                console.log("xhr.status: " + xhr.status);
                console.log("textStatus: " + textStatus);          
            }
        }).retry({ times: 10, timeout: 10000 }).then(function () {
            console.log("success from retry done");
        });
    });
}

function DownloadPDF() {

    var token = new Date().getTime(); //use the current timestamp as the token value
    $('#download_token_value').val(token);

    $('#generiranjePotvrde').modal();
    blockUIForDownload();

    window.location = window.location.href + "/" + 'Podaci/DownloadPDF?DownloadToken=' + token;
 }

function SaveFormData() {
    var formData = new FormData();

    formData.append('PrijedlogStrucnogRadaFileName', document.getElementById('PrijedlogStrucnogRada').files[0].name);
    formData.append('PopratnaDokumentacijaFileName', document.getElementById('PopratnaDokumentacija').files[0].name);
    formData.append('DownloadToken', $("#download_token_value").val());

    jQuery(function ($) {
        $.ajax({
            type: "POST",
            url: window.location.href + "/" + 'Podaci/SaveFormData/',
            contentType: false,
            processData: false,
            data: formData,
            success: function (data, textStatus, jqXHR) {
                if (data.status == true) {
                    UploadFiles();
                }
                else {
                    console.log("data: " + data);
                    console.log("textStatus: " + textStatus);
                    alert("Snimanje forme nije uspjelo, pokušajte ponovo.")
                }
            },
            error: function (xhr, textStatus, thrownError) {

                console.log("xhr.status: " + xhr.status);
                console.log("textStatus: " + textStatus); 
                alert("Snimanje forme nije uspjelo, pokušajte ponovo.")
            }
        }).retry({ times: 10, timeout: 10000 }).then(function () {
            console.log("success from retry done");
        });
    });
}

function UploadFile(TargetFile) {
    // create array to store the buffer chunks
    var FileChunks = [];
    // the file object itself that we will work with
    var file = TargetFile;
    // set up other initial vars
    var MaxFileSizeMB = chunkSizeInMB;
    var BufferChunkSize = MaxFileSizeMB * (1024 * 1024);
    var FileStreamPos = 0;
    // set the initial chunk length
    var EndPos = BufferChunkSize;
    var Size = file.size;

    // add to the FileChunk array until we get to the end of the file
    while (FileStreamPos < Size) {
        // "slice" the file from the starting position/offset, to  the required length
        FileChunks.push(file.slice(FileStreamPos, EndPos));
        FileStreamPos = EndPos; // jump by the amount read
        EndPos = FileStreamPos + BufferChunkSize; // set next chunk length
    }
    // get total number of "files" we will be sending
    var TotalParts = FileChunks.length;

    // ovdje ide format:
    // ABCDEF123_2_29042020050152.doc
    // originalni naziv: ABCDEF123_2.doc

    var fileDate = moment().format('DDMMYYYYHHmmss');
    var fileNameWithoutExt = file.name.split('.').slice(0, -1).join('.')
    var fileNameExt = file.name.split('.').pop();

    var fullFileName = fileNameWithoutExt + '_' + fileDate + '.' + fileNameExt;

    UploadFileChunk(FileChunks, fullFileName, 1, FileChunks.length);
}


var myApp;
myApp = myApp || (function () {
    var pleaseWaitDiv = $('#exampleModal');

    return {
        showPleaseWait: function () {
            pleaseWaitDiv.modal();
        },  
        hidePleaseWait: function () {
            pleaseWaitDiv.modal('hide');
        },

    };
})()

$(function () {
    $('#PopratnaDokumentacija').change(function () {
        var validator = $("#form1").validate();
        validator.element("#PopratnaDokumentacija");
    });
});

$(function () {
    $('#PrijedlogStrucnogRada').change(function () {
        var validator = $("#form1").validate();
        validator.element("#PrijedlogStrucnogRada");
    });
});

//function RedirectToHanfa() {
//    window.location.href= "http://www.hanfa.hr";
//}

var fileDownloadCheckTimer;
function blockUIForDownload() {
    var token = $('#download_token_value').val();

    fileDownloadCheckTimer = window.setInterval(function () {
        var cookieValue = $.cookie('fileDownloadToken');
        if (cookieValue == token)
            finishDownload();
    }, 1000);
}

function finishDownload() {
    window.clearInterval(fileDownloadCheckTimer);
    $.cookie('fileDownloadToken', null); //clears this cookie value

    $('#generiranjePotvrde').modal('hide');

    // clear input files
    $("#PrijedlogStrucnogRada").val(null);
    $("#PopratnaDokumentacija").val(null);

    $('#prijavaPredana').fadeIn();
}