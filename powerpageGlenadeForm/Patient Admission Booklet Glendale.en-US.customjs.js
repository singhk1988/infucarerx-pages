const requiredControlsStep3 = {
    'lname': 'Please enter last name.',
    'fname': 'Please enter first name.',
    'mrn': 'Please select mrn.',
    'date_sign': 'Please select signature date.',
    //'date': 'Please select witness date.',

};

const requiredControlsStep4 = {
    'view_Privacy_Notice': 'Please check.',
    //'legal_represenative': 'Please check.',
    'sign_date': 'Please select signature date.',
    'NPPlname': 'Please enter last name.',
    'NPPfname': 'Please enter first name.',
    //'LRfname': 'Please enter first name.',
    //'LRlname':'Please enter last name.',
    //'LRsign_date': 'Please select signature date.',
};
const requiredControlsStep5 = {
    'ConcernGrievance_date': 'Please select signature date.',
    'patient_fname': 'Please enter first name.',
    'patient_lname': 'Please enter last name.',
    'do_date': 'Please Date of Birth.',
    'patient_cell_phone': 'Please enter your phone.',
    'PA_DOB_date': 'Please select signature date.',
};
const requiredControlsStep6 = {
    'patient_fname': 'Please enter last name.',
    'patient_lname': 'Please enter first name.',
    'PA_DOB_date': 'Please enter date of birth.',
    'do_date': 'Please select signature date.',
    'patient_cell_phone': 'Please enter cell phone. ',
};

const handleSaveAsDraft = () => {
    const formDataMap = commonFormOpeation.getFormDataToSave(getQuestionToIdMap(), getAnswerToIdMap(), 'False', fromResponses ? JSON.parse(fromResponses) : undefined);
    console.log('formDataMap', formDataMap);
    window.localStorage.setItem(formResponseId, JSON.stringify(formDataMap));
    /// save all signature
    saveSignatureDatas('patient_sign');
    saveSignatureDatas('patient_rp_sign');
    saveSignatureDatas('CGPatSignCanvas');
    saveSignatureDatas('legalRepresentative');
    saveSignatureDatas('PAuthorization');

};


const saveSignatureDatas = (elementId) => {
    const signatureURLData = commonFormOpeation.getSignatureDataToSave(elementId);
    window.localStorage.setItem(`${formResponseId}-${elementId}-sig`, signatureURLData);
}

const setSignatureDatas = (elementId) => {
    commonFormOpeation.setSignatureFromSave(elementId, window.localStorage.getItem(`${formResponseId}-${elementId}-sig`));
}


let formResponseId, signatureData, fromResponses;
document.addEventListener("DOMContentLoaded", async function () {
    const searchParams = new URLSearchParams(window.location.search);
    formResponseId = searchParams.get('id');
    fromResponses = window.localStorage.getItem(formResponseId);
    commonFormOpeation.setFormDataFromSave(getQuestionToIdMap(), getAnswerToIdMap(), fromResponses ? JSON.parse(fromResponses) : undefined, 'False');

    setSignatureDatas('patient_sign');
    setSignatureDatas('patient_rp_sign');
    setSignatureDatas('CGPatSignCanvas');
    setSignatureDatas('legalRepresentative');
    setSignatureDatas('PAuthorization');

    nextAndprevbtnwithsavedraft();
    checkboxHideandShow();
    showOtherInputOnchecked();

    setupSignatureCanvas('patient_sign', 'clearButton', 'patient_sign_validation');
    setupSignatureCanvas('patient_rp_sign', 'RPClearButton', 'patient_rp_sign_validation');
    setupSignatureCanvas('CGPatSignCanvas', 'CGPatSignClearButton', 'CGPatSignCanvas_validation');
    setupSignatureCanvas('legalRepresentative', 'LRClearButton', 'legalRepresentative_validation');
    setupSignatureCanvas('PAuthorization', 'PAClearButton', 'PAuthorization_validation');


    showOtherSelectedRadioButtons();
    
    commonFormOpeation.showSpinner('overlay-spinner', true);

    {
        const headerForm = document.getElementById('header_form');
        const headerFormText = document.getElementById('header_form_text');

        headerForm.style.display = 'block';
        headerFormText.innerText = 'Patient Admission Booklet - Glenade';
    }

    //  showPatientSignature();
    // hideAndShowLogic();

    //get all form Data
    let formData, signatureData;
    let signatureTask = getSignatureData(formResponseId);
    try {
        // let signatureTask = GetSignatrureByForResponseId(formResponseId);
        formData = await GetFormResponseById(formResponseId);
        // [formData, signatureData] = await Promise.all([GetFormResponseById(formResponseId), GetSignatrureByForResponseId(formResponseId)])
    } // error checking code
    catch (error) {
        formData = null;

        // let element = document.getElementById('form_hide');
        // if (element !== null) {
        //     // Access the style property
        //     var style = element.style;
        //     console.log(style);
        // } else {
        //     // Handle the case where the element does not exist
        // }

        document.getElementById('form_hide').style.display = 'none';
        commonFormOpeation.showSpinner('overlay-spinner', false);
        // showToast('failed', 'Not valid url.');
        document.getElementById('formInvalidCondition').innerText = 'Not valid url.';
        document.getElementById('formInvalidCondition').style.display = '';
        // document.getElementById('errorStyle').style.display = 'block';
        return;
    }



    // try {
    //     signatureData = await signatureTask;
    // } catch (error) {

    // }
    //
    if (formData) {

        if (formData.statecode === 1) {
            document.getElementById('form_hide').style.display = 'none';
            commonFormOpeation.showSpinner('overlay-spinner', false);
            // showToast('failed', 'Link is already expired.');

            document.getElementById('formInvalidCondition').innerText = 'Link is already expired.';
            document.getElementById('formInvalidCondition').style.display = 'block';
            document.getElementById('errorStyle').style.display = 'block';
            return;
        } else if (formData.happ_formstatus === statusMap.Expired) {
            document.getElementById('form_hide').style.display = 'none';
            commonFormOpeation.showSpinner('overlay-spinner', false);
            // showToast('success', 'Form is Submitted and it is under review by nurse.');
            document.getElementById('formInvalidCondition').innerText = 'Link is already expired.';
            document.getElementById('formInvalidCondition').style.display = 'block';
            document.getElementById('errorStyle').style.display = 'block';
            return;
        } else if (formData.happ_formstatus === statusMap.InReview && isPortalUserLoggedIn === 'False') {

            document.getElementById('form_hide').style.display = 'none';
            commonFormOpeation.showSpinner('overlay-spinner', false);
            // showToast('success', 'Form is Submitted and it is under review by nurse.');
            const alertElement = document.getElementById('formInvalidCondition')
            alertElement.innerText = 'Form is Submitted and it is under review by nurse.';
            alertElement.classList.remove('alert-danger');
            alertElement.classList.add('alert-primary');
            alertElement.style.display = 'block';
            document.getElementById('errorStyle').style.display = 'block';
            return;
        } else if (formData.happ_formstatus === statusMap.Completed) {
            document.getElementById('form_hide').style.display = 'block';
            // commonFormOpeation.showSpinner('overlay-spinner', false);
            // showToast('success', 'Form is Submitted.');
            // return;
        } else {
            document.getElementById('form_hide').style.display = 'block';
        }

        CreateHistoryByFormResponseId(formResponseId, 'AccessLink', `Patient has access the link.`);
        const fromResponses = formData?.happ_formresponse;
        commonFormOpeation.populatePatientData({
            //step 3
            fname: formData.happ_PatientList.happ_patientfirstname,
            lname: formData.happ_PatientList.happ_patientlastname,
            mrn: formData.happ_PatientList.happ_mrn,
            //step 5
            PCGfname: formData.happ_PatientList.happ_patientfirstname,
            PCGlname: formData.happ_PatientList.happ_patientlastname,
            //step 6
            patient_fname: formData.happ_PatientList.happ_patientfirstname,
            patient_lname: formData.happ_PatientList.happ_patientlastname,
            patient_cell_phone: formData.happ_PatientList.happ_phonenumber,
            do_date: formData.happ_PatientList.happ_dateofbirth

        });


        // signatureData = signatureData?.value;
        //
        console.log('formData', formData, fromResponses);

        commonFormOpeation.setFormDataFromSave(getQuestionToIdMap(), getAnswerToIdMap(), JSON.parse(fromResponses));
        
    }

  
    signatureData = await signatureTask;
    if (signatureData) {
        commonFormOpeation.setSignatureFromSave('patient_sign', signatureData[0]?.happ_signature /*window.localStorage.getItem(`${formResponseId}-sig`)*/);
    }
    // hideAndShowLogic();
    if (formData) formViewOrEdit(formData.happ_formstatus);

    // document.getElementById("save-draft").addEventListener('click', async () => {
    //     commonFormOpeation.showSpinner('overlay-spinner', true);
    //     const formDataMap = commonFormOpeation.getFormDataToSave(getQuestionToIdMap(), getAnswerToIdMap());
    //     console.log('formValues', formDataMap);
    //     await SaveFormResponse(formResponseId, statusMap.Pending, JSON.stringify(formDataMap));
    //     const signatureURLData = commonFormOpeation.getSignatureDataToSave('patient_sign');
    //     CreateHistoryByFormResponseId(formResponseId, 'SaveAsDraft', `Patient saved the form as a draft.`);
    //     if (signatureData) await SaveSignature(signatureData[0].happ_esignatureid, signatureURLData);
    //     commonFormOpeation.showSpinner('overlay-spinner', false);
    //     notify('Your form has been successfully saved as a draft!.', 'success');
    // });

    document.getElementById("saveBtn").addEventListener('click', async () => {

        commonFormOpeation.showSpinner('overlay-spinner', true);
        let hasError = validateFormData();
        if (hasError) {
            showToast('failed', 'Please Fill the Required Fields.');
        } else {

            let confirm_button = document.getElementById('confirmbtn');
            // let myInput = document.getElementById('myInput')
            confirm_button.click();

            // myModal.addEventListener('shown.bs.modal', function () {
            // myInput.focus()
            // })


        }
        commonFormOpeation.showSpinner('overlay-spinner', false);
    });

    commonFormOpeation.showSpinner('overlay-spinner', false);


    const saveFormData = () => {
        const formDataMap = commonFormOpeation.getFormDataToSave(getQuestionToIdMap(), getAnswerToIdMap());
        const fromResponses = window.localStorage.getItem(formResponseId);
        if (JSON.stringify(formDataMap) !== fromResponses) {
            console.log('Periodic save');
            window.localStorage.setItem(formResponseId, JSON.stringify(formDataMap));
            SaveFormResponse(formResponseId, statusMap.Pending, JSON.stringify(formDataMap));
        }
    };

    // setInterval(() => {
    saveFormData();
    // }, 1000); // 30 seconds

});


function checkboxHideandShow() {
    const checkboxes = [
        { checkbox: "#view_welcome_packet input", div: "#customer_policy" },
        { checkbox: "#view_Privacy_Notice input", div: "#notice_of_privacy_practices" },
        { checkbox: "#legal_represenative input", div: "#show_legal_represenative" },
        { checkbox: "#support_organizations input", div: "#Support_Organizations_area" },
        { checkbox: "#view_medicare_DMEPOS input", div: "#medicare_DMEPOS_english" },
        { checkbox: "#view_medicare_DMEPOS_spanish input", div: "#see_medicare_DMEPOS_sp_area" },
        { checkbox: "#click_pat_survey input", div: "#pat_satistaction_survey" }
    ];

    checkboxes.forEach(item => {
        const checkboxElement = document.querySelector(item.checkbox);
        const divElement = document.querySelector(item.div);

        divElement.style.display = checkboxElement.checked ? 'block' : 'none';

        checkboxElement.addEventListener('change', () => {
            if (checkboxElement.checked) {
                divElement.style.display = 'block';
            } else {
                divElement.style.display = 'none';
            }
        });
    });
}


function showOtherInputOnchecked() {
    const otherRadioButton = document.getElementById('respodent_type_Other');
    const customInput = document.getElementById('respodent_type_Other-text');
    const radioButtons = document.querySelectorAll('input[name="resp_type"]');


    radioButtons.forEach(radio => {
        radio.addEventListener('change', function () {
            if (otherRadioButton.checked) {
                customInput.style.display = 'block';
            } else {
                customInput.style.display = 'none';
            }
        });
    });

    const otherRadioButton1 = document.getElementById('insurance_type_Other');
    const customInput1 = document.getElementById('insurance_type_Other-text');
    const radioButtons1 = document.querySelectorAll('input[name="insurance_type"]');

    radioButtons1.forEach(radio => {
        radio.addEventListener('change', function () {
            if (otherRadioButton1.checked) {
                customInput1.style.display = 'inline-block';
            } else {
                customInput1.style.display = 'none';
            }
        });
    });

}
const setupSignatureCanvas = (canvasId, clearButtonId, validationId) => {
    const canvas = document.getElementById(canvasId);
    const context = canvas.getContext('2d');
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    const getCoordinates = (e) => {
        let clientX, clientY;
        if (e.type.startsWith('touch')) {
            const touch = e.touches[0];
            clientX = touch.clientX;
            clientY = touch.clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        const rect = canvas.getBoundingClientRect();
        return [clientX - rect.left, clientY - rect.top];
    };

    const startDrawing = (e) => {
        isDrawing = true;
        [lastX, lastY] = getCoordinates(e);
    };

    const stopDrawing = () => {
        isDrawing = false;
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const [x, y] = getCoordinates(e);
        context.beginPath();
        context.moveTo(lastX, lastY);
        context.lineTo(x, y);
        context.strokeStyle = '#000';
        context.lineWidth = 2;
        context.stroke();
        [lastX, lastY] = [x, y];
    };

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchend', stopDrawing);

    canvas.addEventListener('mouseup', () => {
        isDrawing = false;
        if (ValidationErrorStatus[canvasId]) {
            canvas.style.borderColor = '#ccdae4';
            document.getElementById(validationId).style.display = 'none';
        }
    });

    document.getElementById(clearButtonId).addEventListener('click', () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        if (ValidationErrorStatus[canvasId]) {
            canvas.style.borderColor = 'red';
            document.getElementById(validationId).style.display = 'block';
        }
    });
};




function validateFormData(requiredControls, currentIndex) {
    // reset validation status.
    ValidationErrorStatus = {
        view_Privacy_Notice: false,
        patient_sign: false,
        patient_rp_sign: false,
        CGPatSignCanvas: false,
        legalRepresentative: false,
        PAuthorization: false
    };
    let hasError = false;
    let selectors = Object.keys(requiredControls).map(id => `#${id}`).join(', ');
    let elements = document.querySelectorAll(selectors);
    elements.forEach(el => {
        const elementType = el.getAttribute('type') ?? el.type;
        if (elementType === 'checkbox') {
            let checkBoxElements = el.querySelectorAll('.form-check-input');
            let isAnyCheckBoxSelected = false;
            checkBoxElements.forEach(checkBoxEl => {
                if (checkBoxEl.checked) {
                    isAnyCheckBoxSelected = true;
                }
            });
            if (!isAnyCheckBoxSelected) {
                hasError = true;
                ValidationErrorStatus.viewPrivacyNotice = true;
                el.setAttribute('error', requiredControls[el.id]);
            } else {

            }
        } else {
            let value = el.getAttribute('value') ?? el.value;
            if (!value || !value.trim()) {
                hasError = true;
                el.setAttribute('error', requiredControls[el.id]);
            }

            el.addEventListener('change', () => {
                if ((el.getAttribute('value') ?? el.value).trim()) {
                    el.setAttribute('error', '');
                } else {
                    el.setAttribute('error', requiredControls[el.id]);
                }
            });
        }
    });


    if (currentIndex === 2) {
        const canvas_patient_sign = document.getElementById('patient_sign');
        if (isCanvasBlank(canvas_patient_sign)) {
            hasError = true;
            ValidationErrorStatus.patient_sign = true;
            canvas_patient_sign.style.borderColor = 'red';
            document.getElementById('patient_sign_validation').style.display = 'block';
        }
    } else if (currentIndex === 3) {
        const canvas_patient_rp_sign = document.getElementById('patient_rp_sign');
        //const canvas_legalRepresentative = document.getElementById('legalRepresentative');

        if (isCanvasBlank(canvas_patient_rp_sign)) {
            hasError = true;
            ValidationErrorStatus.patient_rp_sign = true;
            canvas_patient_rp_sign.style.borderColor = 'red';
            document.getElementById('patient_rp_sign_validation').style.display = 'block';
        }
    } else if (currentIndex === 4) {
        const canvas_CGPatSignCanvas = document.getElementById('CGPatSignCanvas');
        if (isCanvasBlank(canvas_CGPatSignCanvas)) {
            hasError = true;
            ValidationErrorStatus.CGPatSignCanvas = true;
            canvas_CGPatSignCanvas.style.borderColor = 'red';
            document.getElementById('CGPatSignCanvas_validation').style.display = 'block';
        }
    } else if (currentIndex === 5) {
        const canvas_PAuthorization = document.getElementById('PAuthorization');
        if (isCanvasBlank(canvas_PAuthorization)) {
            hasError = true;
            ValidationErrorStatus.PAuthorization = true;
            canvas_PAuthorization.style.borderColor = 'red';
            document.getElementById('PAuthorization_validation').style.display = 'block';
        }
    }

    return hasError;
}

function validateForm(currentIndex) {
    let hasError = false;
    // Perform validation specific to the current index
    if (currentIndex === 2) {
        hasError = validateFormData(requiredControlsStep3, currentIndex);
    } else if (currentIndex === 3) {
        hasError = validateFormData(requiredControlsStep4, currentIndex);
    } else if (currentIndex === 5) {
        hasError = validateFormData(requiredControlsStep5, currentIndex);
    } else if (currentIndex === 6) {
        hasError = validateFormData(requiredControlsStep6, currentIndex);
    }
    // Return true if no errors found
    return !hasError;
}

const isCanvasBlank = (canvas) => {
    return !canvas.getContext('2d')
        .getImageData(0, 0, canvas.width, canvas.height).data
        .some(channel => channel !== 0);
};



const statusMap = {
    Completed: 0,
    Pending: 1,
    InReview: 2,
    Expired: 3
};


const getSignatureData = async (formResponseId) => {
    try {
        const signatures = await GetSignatureByFormResponseId(formResponseId);
        return signatures.value;
    } catch (error) {
        console.error('Error in fetching signature', error);
    }

    return null;
}



async function finalSave() {
    commonFormOpeation.showSpinner('overlay-spinner', true);
    const formDataMap = commonFormOpeation.getFormDataToSave(getQuestionToIdMap(), getAnswerToIdMap());
    const signatureURLData = commonFormOpeation.getSignatureDataToSave('patient_sign');
    CreateHistoryByFormResponseId(formResponseId, 'Submitted', `Patient submitted the form.`);
    await SaveFormResponse(formResponseId, statusMap.InReview, JSON.stringify(formDataMap));
    if (signatureData) await SaveSignature(signatureData[0].happ_esignatureid, signatureURLData);

    commonFormOpeation.showSpinner('overlay-spinner', false);


    showToast('success', 'Form is Saved Successfully.');
    document.getElementById('form_hide').style.display = 'none';

    const alertElement = document.getElementById('formInvalidCondition')
    alertElement.innerText = `Thank you! 
  Your form as successfully been submitted. We are reviewing.`;
    alertElement.classList.remove('alert-danger');
    alertElement.classList.add('alert-primary');
    alertElement.style.display = 'block';
    document.getElementById('errorStyle').style.display = 'block';

}

const formViewOrEdit = (formStatus = null) => {
    if (formStatus !== null) {
        let imgobj = document.querySelector('img[id="patient_sign"]');
        let canvasobj = document.querySelector('canvas[id="patient_sign"]');
        if (formStatus === statusMap.Pending) {
            [...document.querySelectorAll('input'), ...document.querySelectorAll('textarea'), ...document.querySelectorAll('[class="form-check-input"]'), ...document.querySelectorAll('select'), ...document.querySelectorAll('[id="save-draft"],[id="clearButton"],[id="saveBtn"]')].forEach((e) => {
                e.removeAttribute('readonly');
                // e.removeAttribute('disabled');

            })
            if (imgobj) imgobj.style.display = 'none';
            if (canvasobj) canvasobj.style.display = 'block';
        }
        if (formStatus === statusMap.InReview) {
            [...document.querySelectorAll('input'), ...document.querySelectorAll('textarea'), ...document.querySelectorAll('[class="form-check-input"]'), ...document.querySelectorAll('select'), ...document.querySelectorAll('[id="save-draft"],[id="clearButton"],[id="saveBtn"]')].forEach((e) => {
                e.setAttribute('disabled', true);
            })
            if (imgobj) imgobj.style.display = 'block';
            if (canvasobj) canvasobj.style.display = 'none';
        }
        if (formStatus == 0) {
            [...document.querySelectorAll('input'), ...document.querySelectorAll('textarea'), ...document.querySelectorAll('[class="form-check-input"]'), ...document.querySelectorAll('select'), ...document.querySelectorAll('[id="save-draft"],[id="clearButton"],[id="saveBtn"]')].forEach((e) => {
                e.setAttribute('disabled', true);
            })
            if (imgobj) imgobj.style.display = 'block';
            if (canvasobj) canvasobj.style.display = 'none';
        }
    }

    [...document.querySelectorAll('input[name="fname"],input[name="lname"],input[name="mrn"]')].forEach((e) => {
        e.setAttribute('readonly', true);
    });
}


const prepareDataForPdf = (formResponses) => {
    const formResponseMap = {};
    Object.keys(formResponses).forEach(questionId => {
        const {
            value,
            type,
            answerId
        } = formResponses[questionId];
        if (Array.isArray(value)) {

            formResponseMap[questionId] = value.map(x => x.value).join(',');
        } else if (type === "radio") {
            formResponseMap[questionId] = value;
        } else {
            formResponseMap[questionId] = value;
        }
    });

    return formResponseMap;
}


// Function to handle next step
function handleNext() {
    const stepper = document.querySelector('common-stepper');
    const currentStep = parseInt(stepper.getAttribute('current-step'));
    const totalSteps = stepper.getAttribute('steps').split(',').length;

    if (!validateForm(currentStep - 1)) {
        return;
    }

    if (currentStep < totalSteps) {
        stepper.setAttribute('current-step', currentStep + 1);
        updateButtonVisibility(currentStep + 1, totalSteps);
    }
}

// Function to handle previous step
function handlePrevious(totalSteps) {
    const stepper = document.querySelector('common-stepper');
    const currentStep = parseInt(stepper.getAttribute('current-step'));

    if (currentStep > 1) {
        stepper.setAttribute('current-step', currentStep - 1);
        updateButtonVisibility(currentStep - 1, totalSteps);
    }
}

function updateButtonVisibility(currentStep, totalSteps) {
    const prevButton = document.getElementById('prevButton');

    if (currentStep === 1) {
        if (prevButton) prevButton.style.display = 'none';
    } else {
        if (prevButton) prevButton.style.display = 'inline-block';
    }
    const saveBtnStep = document.getElementById('saveBtn');
    const nextButton = document.getElementById('nextButton');
    if (currentStep === totalSteps) {
        if (nextButton) nextButton.style.display = 'none';
        if (saveBtnStep) saveBtnStep.style.display = 'inline-block';

    } else {
        if (nextButton) nextButton.style.display = 'inline-block';
        if (saveBtnStep) saveBtnStep.style.display = 'none';
    }
}

function nextAndprevbtnwithsavedraft() {
    const stepper = document.querySelector('common-stepper');
    const currentStep = parseInt(stepper.getAttribute('current-step'));
    const totalSteps = stepper.getAttribute('steps').split(',').length;
    updateButtonVisibility(currentStep, totalSteps);
}


const getQuestionToIdMap = () => {
    const idToQueMap = {
  
        // step 2
        "view_welcome_packet": "5afd9607-a621-ef11-840a-000d3a371898",
  
        // step 4
  
        "legal_represenative": "23614729-a621-ef11-840a-002248095c06",
        "view_Privacy_Notice": "290f081d-a621-ef11-840a-002248095c06",
  
        // step 5
  
        "click_pat_survey": "4fd79439-a621-ef11-840a-000d3a5c0fc6",
        // step 6
  
        "support_organizations": "568a5045-a621-ef11-840a-000d3a371898",
        "view_medicare_DMEPOS": "a2353778-a621-ef11-840a-000d3a5c0fc6",
        "view_medicare_DMEPOS_spanish": "696697a4-a521-ef11-840a-000d3a371898",
  
  
        // step 3
        "fname": "84d51284-a621-ef11-840a-000d3a371898",
        "lname": "dcfb7ed8-a521-ef11-840a-000d3a5c0fc6",
        "mrn": "d823b18f-a621-ef11-840a-002248095c06",
        "date_sign": "5d62dd9b-a621-ef11-840a-002248095c06",
        "LegalGName": "bacf5ab4-a221-ef11-840a-000d3a5c0fc6",
        "patient_sign": "e699b1b4-a621-ef11-840a-000d3a371898",
        "ProWitName": "1726c4df-a221-ef11-840a-000d3a371898",
        "date": "1efaa9ba-a621-ef11-840a-000d3a371898",
        // step 4
        "NPPfname": "153266c7-a621-ef11-840a-000d3a5c0fc6",
        "NPPlname": "d88fa7d0-a621-ef11-840a-000d3a371898",
        "sign_date": "6af298de-a621-ef11-840a-000d3a371898",
        "patient_rp_sign": "1250cfe4-a621-ef11-840a-000d3a371898",
        // step 4.1
        "LRfname": "f66555f2-a621-ef11-840a-000d3a371898",
        "LRlname": "7b47e10f-a321-ef11-840a-000d3a371898",
        "LRsign_date": "4e5f83a8-a321-ef11-840a-002248095c06",
        "legalRepresentative": "2e58c2d3-a321-ef11-840a-000d3a5c0fc6",
        // step 5
        "PCGfname": "a0cd27f6-a621-ef11-840a-002248095c06",
        "PCGlname": "30f446e5-a321-ef11-840a-002248095c06",
        "RelationshipToPatient": "4c817c04-a721-ef11-840a-000d3a371898",
        "description_of_concern": "2f6910f8-a321-ef11-840a-000d3a5c0fc6",
        "formCompletedBy": "1faa9432-a721-ef11-840a-000d3a371898",
        "ConcernGrievance_date": "454f5d46-a721-ef11-840a-000d3a371898",
        "CGPatSignCanvas": "407bc24d-a721-ef11-840a-000d3a371898",
        "resp_type": "a3d07d83-a421-ef11-840a-002248095c06",
        "insurance_type": "075aaa4e-a821-ef11-840a-000d3a371898",
        "PharmacySerLoc": "facf297a-a521-ef11-840a-000d3a371898",
        "whenYou_started": "2a6f545c-a721-ef11-840a-002248095c06",
        "How_satisfied_are_1": "07ed4e5f-a421-ef11-840a-002248095c06",
        "How_satisfied_are_2": "85d966ef-a521-ef11-840a-000d3a371898",
        "How_satisfied_are_3": "4106e1c5-a421-ef11-840a-002248095c06",
        "How_satisfied_are_4": "e1e0f48f-a721-ef11-840a-000d3a5c0fc6",
        "How_would_you_rate_1": "3bea5c68-a721-ef11-840a-002248095c06",
        "How_would_you_rate_2": "2670867d-a721-ef11-840a-000d3a5c0fc6",
        "How_would_you_rate_3": "638636e6-a421-ef11-840a-000d3a5c0fc6",
        "How_would_you_feel": "8dc8d3b5-a721-ef11-840a-000d3a371898",
        // step 6
        "patient_fname": "4565dcf2-a421-ef11-840a-000d3a5c0fc6",
        "patient_lname": "9bd74dce-a721-ef11-840a-000d3a371898",
        "do_date": "bc8451d5-a721-ef11-840a-000d3a371898",
        "patient_address": "79bf5eff-a421-ef11-840a-000d3a5c0fc6",
        "patient_cell_phone": "d8db2de7-a721-ef11-840a-000d3a5c0fc6",
        "PA_DOB_date": "dd1d1fef-a721-ef11-840a-002248095c06",
        "PAuthorization": "cfeb9301-a821-ef11-840a-000d3a371898",
    };
  
  
    // const queToIdMap = Object.fromEntries(new Map(Object.keys(idToQueMap).map((k) => [idToQueMap[k], k])));
    return idToQueMap;
  }
  const getAnswerToIdMap = () => {
    const idToAnsMap = {
        // step 2
        "chkWelcomePacket": "5ffd9607-a621-ef11-840a-000d3a371898",
        // step 4
        "chkPrivacyNotice": "310f081d-a621-ef11-840a-002248095c06",
        "see_legal_represenative": "4c0e072c-a621-ef11-840a-000d3a371898",
        // step 5 
        "chkCGClickPatSurvey": "7a6e5d39-a621-ef11-840a-000d3a371898",
        // step 6 
  
        "see_medicare_DMEPOS_span": "8fd425a8-a521-ef11-840a-000d3a5c0fc6",
        "see_medicare_DMEPOS": "a1e10f77-a621-ef11-840a-000d3a371898",
        "see_SupportOrganizations": "431f4747-a621-ef11-840a-002248095c06",
  
        // step 5
        "resp_type_Patient": "add07d83-a421-ef11-840a-002248095c06",
        "resp_type_Caregiver": "7da2ce7e-a421-ef11-840a-000d3a5c0fc6",
        "respodent_type_Other": "3615f084-a421-ef11-840a-000d3a371898",
        "insurance_type_Medicare": "115aaa4e-a821-ef11-840a-000d3a371898",
        "insurance_type_Medicaid": "245aaa4e-a821-ef11-840a-000d3a371898",
        "insurance_type_Prime_Therapeutics": "355aaa4e-a821-ef11-840a-000d3a371898",
        "insurance_type_CIGNA": "455aaa4e-a821-ef11-840a-000d3a371898",
        "insurance_type_United_Healthcare": "7bf0fd4d-a821-ef11-840a-000d3a5c0fc6",
        "insurance_type_Anthem": "5b5aaa4e-a821-ef11-840a-000d3a371898",
        "insurance_type_Humana": "655aaa4e-a821-ef11-840a-000d3a371898",
        "insurance_type_BCBS": "51e24f4f-a821-ef11-840a-002248095c06",
        "insurance_type_Other": "56e24f4f-a821-ef11-840a-002248095c06",
        // location
        "PharmacySerLoc_CA": "6dca7374-a521-ef11-840a-002248095c06",
        "PharmacySerLoc_LA": "e97c6e7a-a521-ef11-840a-002248095c06",
        "PharmacySerLoc_MD": "0ed0297a-a521-ef11-840a-000d3a371898",
        "PharmacySerLoc_NJ": "ced4f275-a521-ef11-840a-000d3a5c0fc6",
        "PharmacySerLoc_PA": "14d0297a-a521-ef11-840a-000d3a371898",
        "PharmacySerLoc_TX": "5e7d6e7a-a521-ef11-840a-002248095c06",
        "PharmacySerLoc_FL": "74de057c-a521-ef11-840a-000d3a5c0fc6",
        "PharmacySerLoc_Unknown": "7bde057c-a521-ef11-840a-000d3a5c0fc6",
  
        // table answerId
        "when_you_started_service5": "436f545c-a721-ef11-840a-002248095c06",
        "when_you_started_service4": "656f545c-a721-ef11-840a-002248095c06",
        "when_you_started_service3": "ae1f5559-a721-ef11-840a-000d3a5c0fc6",
        "when_you_started_service2": "af1f5559-a721-ef11-840a-000d3a5c0fc6",
        "when_you_started_service1": "e624ed5b-a721-ef11-840a-000d3a371898",
  
        "how_satisfied_are_you1_5": "1bed4e5f-a421-ef11-840a-002248095c06",
        "how_satisfied_are_you1_4": "00442360-a421-ef11-840a-000d3a5c0fc6",
        "how_satisfied_are_you1_3": "6fed4e5f-a421-ef11-840a-002248095c06",
        "how_satisfied_are_you1_2": "06442360-a421-ef11-840a-000d3a5c0fc6",
        "how_satisfied_are_you1_1": "f1016064-a421-ef11-840a-000d3a371898",
  
        "how_satisfied_are_you2_5": "86d966ef-a521-ef11-840a-000d3a371898",
        "how_satisfied_are_you2_4": "47ddf0f2-a521-ef11-840a-002248095c06",
        "how_satisfied_are_you2_3": "4fddf0f2-a521-ef11-840a-002248095c06",
        "how_satisfied_are_you2_2": "0308a3f0-a521-ef11-840a-000d3a5c0fc6",
        "how_satisfied_are_you2_1": "61ddf0f2-a521-ef11-840a-002248095c06",
  
        "how_would_you_rate1_5": "130c706e-a721-ef11-840a-002248095c06",
        "how_would_you_rate1_4": "f19b3769-a721-ef11-840a-000d3a371898",
        "how_would_you_rate1_3": "2f344a6f-a721-ef11-840a-000d3a371898",
        "how_would_you_rate1_2": "2c0c706e-a721-ef11-840a-002248095c06",
        "how_would_you_rate1_1": "38344a6f-a721-ef11-840a-000d3a371898",
  
        "how_would_you_rate2_5": "275c757d-a721-ef11-840a-000d3a371898",
        "how_would_you_rate2_4": "476ccd83-a721-ef11-840a-000d3a5c0fc6",
        "how_would_you_rate2_3": "313b8880-a721-ef11-840a-002248095c06",
        "how_would_you_rate2_2": "4f6ccd83-a721-ef11-840a-000d3a5c0fc6",
        "how_would_you_rate2_1": "b0d8ab83-a721-ef11-840a-000d3a371898",
  
        "how_satisfied_are_you3_5": "4a06e1c5-a421-ef11-840a-002248095c06",
        "how_satisfied_are_you3_4": "5d206cc9-a421-ef11-840a-000d3a371898",
        "how_satisfied_are_you3_3": "5e206cc9-a421-ef11-840a-000d3a371898",
        "how_satisfied_are_you3_2": "5f206cc9-a421-ef11-840a-000d3a371898",
        "how_satisfied_are_you3_1": "60206cc9-a421-ef11-840a-000d3a371898",
  
        "how_would_you_rate3_5": "648636e6-a421-ef11-840a-000d3a5c0fc6",
        "how_would_you_rate3_4": "6b691be2-a421-ef11-840a-000d3a371898",
        "how_would_you_rate3_3": "a54847e4-a421-ef11-840a-002248095c06",
        "how_would_you_rate3_2": "aa4847e4-a421-ef11-840a-002248095c06",
        "how_would_you_rate3_1": "6f691be2-a421-ef11-840a-000d3a371898",
  
        "how_satisfied_are_you4_5": "f51aa88a-a721-ef11-840a-000d3a371898",
        "how_satisfied_are_you4_4": "fde0f48f-a721-ef11-840a-000d3a5c0fc6",
        "how_satisfied_are_you4_3": "04e1f48f-a721-ef11-840a-000d3a5c0fc6",
        "how_satisfied_are_you4_2": "14e1f48f-a721-ef11-840a-000d3a5c0fc6",
        "how_satisfied_are_you4_1": "fc4aa590-a721-ef11-840a-000d3a371898",
  
        "how_would_you_feel_5": "8fc8d3b5-a721-ef11-840a-000d3a371898",
        "how_would_you_feel_4": "37ac89b5-a721-ef11-840a-000d3a5c0fc6",
        "how_would_you_feel_3": "93c8d3b5-a721-ef11-840a-000d3a371898",
        "how_would_you_feel_2": "4dac89b5-a721-ef11-840a-000d3a5c0fc6",
        "how_would_you_feel_1": "5aac89b5-a721-ef11-840a-000d3a5c0fc6",
  
    };
    return idToAnsMap;
  }
  


const showOtherSelectedRadioButtons = () => {
    const otherRadioButtons = ['respodent_type_Other', 'insurance_type_Other'];
    otherRadioButtons.forEach(otherRadioButton => {
        const el = document.getElementById(otherRadioButton);
        if (el.checked) {
            document.getElementById(`${otherRadioButton}-text`).style.display = 'block';;
        }
    });
}

