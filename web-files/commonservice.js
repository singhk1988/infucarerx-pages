(function(webapi, $){
    function safeAjax(ajaxOptions) {
        var deferredAjax = $.Deferred();
        shell.getTokenDeferred().done(function (token) {
            // add headers for AJAX
            if (!ajaxOptions.headers) {
                $.extend(ajaxOptions, {
                    headers: {
                        "__RequestVerificationToken": token
                    }
                }); 
            } else {
                ajaxOptions.headers["__RequestVerificationToken"] = token;
            }
            $.ajax(ajaxOptions)
                .done(function(data, textStatus, jqXHR) {
                    validateLoginSession(data, textStatus, jqXHR, deferredAjax.resolve);
                }).fail(deferredAjax.reject); //AJAX
        }).fail(function () {
            deferredAjax.rejectWith(this, arguments); // on token failure pass the token AJAX and args
        });

        return deferredAjax.promise();	
    }
    webapi.safeAjax = safeAjax;
})(window.webapi = window.webapi || {}, jQuery)



let AssessmentRecord = async (assessmentGuid = null) => {
    let record;
    let date_1 = new Date(Date.now());

    if(assessmentGuid === null){
        record = await webapi.safeAjax({
            type: "GET",
            url: "/_api/happ_assessments?$select=happ_name,happ_description&$filter=createdon ne "+date_1.toISOString(),
            contentType: "application/json",
            success: function (res) {
                return res;
            }
        });
    }
    else{
        record = await webapi.safeAjax({
            type: "GET",
            url: "/_api/happ_assessments("+assessmentGuid+")"+"?$select=happ_name,happ_description&$filter=createdon ne "+date_1.toISOString(),
            contentType: "application/json",
            success: function (res) {
                return res;
            }
        });
    }
    
    return record;
}

let GetAllFormResponse = async () => {
    let record;
    let date_1 = new Date(Date.now());
    
    
        record = await webapi.safeAjax({
            type: "GET",
            url: "_api/happ_formresponseses?$select=createdon,_happ_assessmentreference_value,happ_formstatus&$expand=happ_PatientList($select=happ_patientfirstname,happ_patientlastname,happ_mrn)&$filter=statecode eq "+0+" and createdon ne "+date_1.toISOString(),
            contentType: "application/json",
            success: function (res) {
                return res;
            }
        });
   
    
    
    return record;
}

let PatientFormUrlRecord = async (UniqueUrlId = null) => {
    let record;
    let date_1 = new Date(Date.now());

    if(UniqueUrlId === null){
        record = await webapi.safeAjax({
            type: "GET",
            url: "/_api/happ_patientformurls?$filter=createdon ne "+date_1.toISOString(),
            contentType: "application/json",
            success: function (res) {
                // return res;
            }
        });
    }
    else{
        record = await webapi.safeAjax({
            type: "GET",
            url: "/_api/happ_patientformurls"+"?$filter=happ_uniqueurlid eq '"+UniqueUrlId+"' and createdon ne "+date_1.toISOString(),
            contentType: "application/json",
            success: function (res) {
                // return res;
            }
        });
        // // debugger
        // record = record.value.filter((q)=>q._happ_assessmentreference_value===assessmentGuid)
    }
    
    return record;
}

let GetAllPatients = async (filterText = null) => {
    let record;
    let date_1 = new Date(Date.now());

    if(filterText === null){
        record = await webapi.safeAjax({
            type: "GET",
            url: "/_api/happ_patientlists?$select=happ_phonenumber,happ_patientlastname,happ_patientfirstname,happ_mrn,happ_email&$filter=createdon ne "+date_1.toISOString(),
            contentType: "application/json",
            success: function (res) {
                return res;
            }
        });
    }
    else{
        record = await webapi.safeAjax({
            type: "GET",
            url: "/_api/happ_patientlists?$select=happ_email,happ_phonenumber,happ_patientlastname,happ_patientfirstname,happ_mrn&$filter=happ_patientlastname eq '"+filterText+"' or happ_patientfirstname eq '"+filterText+"' or happ_mrn eq '"+filterText+"' and createdon ne "+date_1.toISOString(),
            contentType: "application/json",
            success: function (res) {
                return res;
            }
        });
        // // debugger
        // record = record.value.filter((q)=>q._happ_assessmentreference_value===assessmentGuid)
    }
    
    return record;
}

let GetFormResponseById = async (formResponseRecordId) => {
    let record;
    let date_1 = new Date(Date.now());
    
    record = await webapi.safeAjax({
        type: "GET",
        url: "/_api/happ_formresponseses("+formResponseRecordId+")?$select=happ_formresponse,happ_formstatus&$expand=happ_PatientList($select=happ_patientfirstname,happ_patientlastname,happ_dateofbirth,happ_mrn)&$filter=createdon ne "+date_1.toISOString(),
        contentType: "application/json",
        success: function (res) {
            // return res;
        }
    });
        
    return record;
}

let GetSignatrureByForResponseId = async (formResponseRecordId = null) => {
    let record;
    let date_1 = new Date(Date.now());

    if(formResponseRecordId === null){
        record = await webapi.safeAjax({
            type: "GET",
            url: "/_api/happ_esignatures?$select=happ_signaturetype,happ_signature&$filter=createdon ne "+date_1.toISOString(),
            contentType: "application/json",
            success: function (res) {
                // return res;
            }
        });
    }
    else{
        record = await webapi.safeAjax({
            type: "GET",
            url: "/_api/happ_esignatures?$select=happ_signaturetype,happ_signature&$filter=_happ_formresponse_value eq '"+formResponseRecordId+"' and createdon ne "+date_1.toISOString(),
            contentType: "application/json",
            success: function (res) {
                // return res;
            }
        });
        // // debugger
        // record = record.value.filter((q)=>q._happ_assessmentreference_value===assessmentGuid)
    }
    
    return record;
}

let SubmitFormResponse = async (patientRecordId, assessmentGuid, dataObj, status, signImg = '') => {
    let record;

    if(signImg === ''){
        await webapi.safeAjax({
            type: "POST",
            url: "/_api/happ_formresponseses",
            contentType: "application/json",
            data: JSON.stringify({
                "happ_name": "Sample Record",
                "happ_responseby": "fname",
                "happ_formresponse": JSON.stringify(dataObj),
                "happ_formstatus": status,
                // "happ_signature": signImg,
                "happ_AssessmentReference@odata.bind": "/happ_assessments("+assessmentGuid+")",
                "happ_PatientFormUrl@odata.bind": "/happ_patientformurls("+patientRecordId+")"
    
                // "_happ_assessmentreference_value": "ba1ef98b-41cb-ee11-9078-6045bd09505e"
            }),
            success: function (res, status, xhr) {
          //print id of newly created table record
        //   // debugger
                console.log("entityID: "+ xhr.getResponseHeader("entityid"));
                // document.getElementById('guid').value = xhr.getResponseHeader("entityid");
            }
        });
    }
    else{
        await webapi.safeAjax({
            type: "POST",
            url: "/_api/happ_formresponseses",
            contentType: "application/json",
            data: JSON.stringify({
                "happ_name": "Sample Record",
                "happ_responseby": "fname",
                "happ_formresponse": JSON.stringify(dataObj),
                "happ_formstatus": status,
                "happ_signature": signImg,
                "happ_AssessmentReference@odata.bind": "/happ_assessments("+assessmentGuid+")",
                "happ_PatientFormUrl@odata.bind": "/happ_patientformurls("+patientRecordId+")"
    
                // "_happ_assessmentreference_value": "ba1ef98b-41cb-ee11-9078-6045bd09505e"
            }),
            success: function (res, status, xhr) {
          //print id of newly created table record
        //   // debugger
                console.log("entityID: "+ xhr.getResponseHeader("entityid"));
                // document.getElementById('guid').value = xhr.getResponseHeader("entityid");
            }
        });
    }
    
    
    return record;
}

let SaveFormResponse = async (formResponseId, status, formData) => {
    let record;
        await webapi.safeAjax({
            type: "PATCH",
            url: "/_api/happ_formresponseses("+formResponseId+")",
            contentType: "application/json",
            data: JSON.stringify({
                "happ_formresponse": formData,
                "happ_formstatus": status
            }),
            success: function (res) {
                console.log("updated", res);
            }
        });
    return record;
}
let SaveSignature = async (signatureResponseId, signatureData, signatureType = 1) => {
    let record;
        await webapi.safeAjax({
            type: "PATCH",
            url: "/_api/happ_esignatures("+signatureResponseId+")",
            contentType: "application/json",
            data: JSON.stringify({
                "happ_signature": signatureData,
                "happ_signaturetype": signatureType
            }),
            success: function (res) {
                console.log("updated", res);
            }
        });
    return record;
};

let SendFormLinToPatient = async (flowLink, data = {}) => {
    debugger;
    let payload = {};
    payload.eventData = JSON.stringify(data);
        shell
            .ajaxSafePost({
                type: "POST",
                contentType: "application/json",
                url: flowLink,
                data: JSON.stringify(payload),
                processData: false,
                global: false,
            })
            .done(function (response) {
                const result = JSON.parse(response);
                return result;
                
            })
            .fail(function () {
                alert("failed");
            });
    
};

let DeleteFormReponse = async (formResponseId) => {
    let record;
        await webapi.safeAjax({
            type: "PATCH",
            url: "/_api/happ_formresponseses("+formResponseId+")",
            contentType: "application/json",
            data: JSON.stringify({
                "statecode": 1
            }),
            success: function (res) {
                console.log("updated", res);
            }
        });
    return record;
};

let DonwnloadFormDataPdf = async (flowLink, body = {}) => {
    shell
            .ajaxSafePost({
                type: "POST",
                contentType: "application/json",
                url: flowLink,
                data: JSON.stringify(body),
                processData: false,
                global: false,
            })
            .done(function (response) {
                const result = JSON.parse(response);
                return result;
                
            })
            .fail(function () {
                alert("failed");
            });
};

let GetHistoryByFormResponseId = async (formResponseId) =>{
    
    let record;
    let date_1 = new Date(Date.now());

    record = await webapi.safeAjax({
        type: "GET",
        url: "/_api/happ_formsloghistories?$select=happ_name,happ_statustype,happ_status&$filter=_happ_formresponse_value eq "+formResponseId+" and createdon ne "+date_1.toISOString(),
        contentType: "application/json",
        success: function (res) {
            return res;
        }
    });

    return record;
};


