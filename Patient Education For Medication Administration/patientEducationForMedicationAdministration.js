const requiredControls = {
    'fname': 'Please enter first name.',
    'lname': 'Please enter last name.',
    'dob_date': 'Please enter date of birth.',
    'visit_date': 'Please enter date of visit.',
    'proper_storage_medication_status': 'Please check.',
    'inspection_site_signs_status': 'Please check.',
    'inspection_status': 'Please check.',
    'supply_status': 'Please check.',
    'demonstrate_use_status': 'Please check.',
    'aseptic_technique_status': 'Please check.',
    'management_status': 'Please check.',
    'medication_preparation_status': 'Please check.',
    'infusion_site_preparation_status': 'Please check.',
    'therapy_initiation_status': 'Please check.',
    'therapy_completion_status': 'Please check.',
    'method_status': 'Please check.',
    'device_removal_status': 'Please check.',
    'disposal_status': 'Please check.',
    'adverse_effects_status': 'Please check.',
    'nurse_fname': 'Please Enter Nurse First name.',
    'nurse_lname': 'Please Enter Nancy Last name.',
    'credentials': 'Please enter credentials.',
    'nurse_sign_date': 'Please enter signature date.',
};

let ValidationErrorStatus = { patient_sign: false };
let formResponseId;
let formData, signatureData;
let fromResponses;

const allSignName = [
    'patient_sign'
];

const statusMap = {
    Completed: 0,
    Pending: 1,
    InReview: 2,
    Expired: 3,
    draft: 4
};

function validateFormData() {
    ValidationErrorStatus = { patient_sign: false };
    let hasError = false;
    const selectors = Object.keys(requiredControls)
        .filter(id => id.trim())  // Ensure there are no empty keys
        .map(id => `#${id}`)
        .join(', ');

    if (!selectors) {
        console.error("No valid selectors found for required controls.");
        return true;
    }

    const elements = document.querySelectorAll(selectors);

    elements.forEach(el => {
        const elementType = el.getAttribute('type') ?? el.type;
        if (elementType === 'checkbox' || elementType === 'radio') {
            validateInputGroup(el, elementType);
            el.addEventListener('change', () => validateInputGroup(el, elementType));
        } else {
            const value = el.getAttribute('value') ?? el.value;
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
    const canvas = document.getElementById('patient_sign');
    if (isCanvasBlank(canvas)) {
        hasError = true;
        ValidationErrorStatus.patient_sign = true;
        canvas.style.borderColor = 'red';
        document.getElementById('patient_sign_validation').style.display = 'block';
    }


    return hasError;
}
const isCanvasBlank = (canvas) => {
    return !canvas.getContext('2d')
        .getImageData(0, 0, canvas.width, canvas.height).data
        .some(channel => channel !== 0);
}

function validateInputGroup(el, elementType) {
    const inputElements = el.querySelectorAll('.form-check-input');
    let isAnyInputSelected = false;
    inputElements.forEach(inputEl => {
        if (inputEl.checked) {
            isAnyInputSelected = true;
        }
    });

    if (!isAnyInputSelected) {
        el.setAttribute('error', requiredControls[el.id]);
    } else {
        el.setAttribute('error', '');
    }
}

const showPatientSignature = () => {
    const canvas = document.getElementById('patient_sign');
    const context = canvas.getContext('2d');
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    function startDrawing(e) {
        isDrawing = true;
        if (e.type.startsWith('touch')) {
            disableScrolling();
        }
        const [x, y] = getCoordinates(e);
        [lastX, lastY] = [x, y];
    }

    function draw(e) {
        if (!isDrawing) return;
        const [x, y] = getCoordinates(e);
        context.beginPath();
        context.moveTo(lastX, lastY);
        context.lineTo(x, y);
        context.strokeStyle = '#000';
        context.lineWidth = 2;
        context.stroke();
        [lastX, lastY] = [x, y];
    }

    function stopDrawing() {
        isDrawing = false;
        enableScrolling();
    }

    function getCoordinates(e) {
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
    }

    function disableScrolling() {
        document.body.style.overflow = 'hidden';
    }

    function enableScrolling() {
        document.body.style.overflow = 'auto';
    }

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('touchstart', startDrawing);

    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('touchmove', draw);

    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('touchend', stopDrawing);

    canvas.addEventListener('mouseout', () => {
        isDrawing = false;
        enableScrolling();
        if (ValidationErrorStatus.patient_sign) {
            canvas.style.borderColor = '#ccdae4';
            document.getElementById('patient_sign_validation').style.display = 'none';
        }
    });

    // Clear canvas
    document.getElementById('clearButton').addEventListener('click', () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        if (ValidationErrorStatus.patient_sign) {
            canvas.style.borderColor = 'red';
            document.getElementById('patient_sign_validation').style.display = 'block';
        }
    });
}

document.addEventListener("DOMContentLoaded", async function () {
    // const headerForm = document.getElementById('header_form');
    // const headerFormText = document.getElementById('header_form_text');
    // headerForm.style.display = 'block';
    // headerFormText.innerText = 'Patient Education For Medication Administration';
    const searchParams = new URLSearchParams(window.location.search);
    const formResponseId = searchParams.get('id');
    const savedFormData = window.localStorage.getItem(formResponseId);
    const savedSignature = window.localStorage.getItem(`${formResponseId}-sig`);

    if (savedFormData) {
        commonFormOpeation.setFormDataFromSave(getQuestionToIdMap(), getAnswerToIdMap(), JSON.parse(savedFormData));
    }

    if (savedSignature) {
        commonFormOpeation.setSignatureFromSave('patient_sign', savedSignature);
    }

    showPatientSignature();

    document.getElementById("saveBtn").addEventListener('click', async () => {
        const hasError = validateFormData();
        if (!hasError) {
            const formDataMap = commonFormOpeation.getFormDataToSave(getQuestionToIdMap(), getAnswerToIdMap());
            window.localStorage.setItem(formResponseId, JSON.stringify(formDataMap));
            const signatureURLData = commonFormOpeation.getSignatureDataToSave('patient_sign');
            window.localStorage.setItem(`${formResponseId}-sig`, signatureURLData);
            commonFormOpeation.showModalPopup('exampleModal', true);
        }
    });

    // document.getElementById("cancelBtn").addEventListener('click', () => {
    //     clearForm();
    // });
});

// document.addEventListener("DOMContentLoaded", async function () {
//     const headerForm = document.getElementById('header_form');
//     const headerFormText = document.getElementById('header_form_text');
//     headerForm.style.display = 'block';
//     headerFormText.innerText = 'Patient Education For Medication Administration';
//     commonFormOpeation.showSpinner('overlay-spinner', true);
//     commonFormOpeation.userName = "{{user.fullname}}";
//     if (!envExpandAllVal) {
//         const envResponse = await GetEnvironmentVARByNameUsingExpand();
//         envExpandAllVal = envResponse?.value;
//     }

//     const searchParams = new URLSearchParams(window.location.search);
//     formResponseId = searchParams.get('id');

//     let signatureTask = getSignatureData(formResponseId);
//     try {
//         formData = await GetFormResponseById(formResponseId);
//     } // error checking code
//     catch (error) {
//         formData = null;
//         document.getElementById('form_hide').style.display = 'none';
//         commonFormOpeation.showSpinner('overlay-spinner', false);
//         // showToast('failed', 'Not valid url.');
//         document.getElementById('formInvalidCondition').innerText = 'Not valid url.';
//         document.getElementById('formInvalidCondition').style.display = 'block';
//         return;
//     }



//     const date = new Date();

//     let day = date.getDate().toString().padStart(2, '0');
//     let month = (date.getMonth() + 1).toString().padStart(2, '0');
//     let year = date.getFullYear();
    
//     let currentDate = `${day}-${month}-${year}`;
//     // console.log(currentDate);

//     console.log('isPortalUserLoggedIn', isPortalUserLoggedIn);
//     if (formData) {
//         document.getElementById('form_hide').style.display = 'block';

//         await CreateHistoryByFormResponseId(formResponseId, 'AccessLink', commonFormOpeation.gethistoryAccessText().replace('<userName>', "{{user.fullname}}"), commonFormOpeation.gethistoryActionType().replace('<userName>', "{{user.fullname}}"));
//         fromResponses = formData?.happ_formresponse;
//         commonFormOpeation.populatePatientData({ fname: (formData?.happ_PatientList?.happ_patientfirstname ?? ""), lname: (formData?.happ_PatientList?.happ_patientlastname ?? ""), mrn: (formData?.happ_PatientList?.happ_mrn ?? ""), dob_date: (formData?.happ_PatientList?.happ_dateofbirth.split('T')[0] ?? ""), visit_date: currentDate ?? "" });
//         commonFormOpeation.setFormDataFromSave(getQuestionToIdMap(), getAnswerToIdMap(), JSON.parse(fromResponses), isPortalUserLoggedIn);
//     }

//     if (formData) formViewOrEdit(formData.happ_formstatus);

//     signatureData = await signatureTask;
//     if (signatureData) {
//         commonFormOpeation.setSignatureFromSave('patient_sign', signatureData[0]?.happ_signature /*window.localStorage.getItem(`${formResponseId}-sig`)*/);
//     }
//     // hideAndShowLogic();
//     // if (formData) formViewOrEdit(formData.happ_formstatus);





//     commonFormOpeation.showSpinner('overlay-spinner', false);



//     showPatientSignature();

//     document.getElementById("saveBtn").addEventListener('click', async () => {
//         commonFormOpeation.showSpinner('overlay-spinner', true);
//         let hasError = validateFormData();
//         if (hasError) {

//             notify('Please Fill the Required Fields.', 'error');
//         }
//         else {

//             let confirm_button = document.getElementById('confirmbtn');

//             confirm_button.click();



//         }
//         commonFormOpeation.showSpinner('overlay-spinner', false);
//     });


// });

const getSignatureData = async (formResponseId) => {
    try {
        const signatures = await GetSignatureByFormResponseId(formResponseId);
        return signatures.value;
    } catch (error) {
        console.error('Error in fetching signature', error);
    }

    return null;
};

async function finalSave() {
    commonFormOpeation.showSpinner('overlay-spinner', true);

    const formDataMap = commonFormOpeation.getFormDataToSave(getQuestionToIdMap(), getAnswerToIdMap(), isPortalUserLoggedIn, JSON.parse(fromResponses));
    const signatureURLData = commonFormOpeation.getSignatureDataToSave('patient_sign');
    CreateHistoryByFormResponseId(formResponseId, 'Submitted', `Patient submitted the form.`, 'Patient');
    await SaveFormResponse(formResponseId, statusMap.InReview, JSON.stringify(formDataMap));
    if (signatureData) await SaveSignature(signatureData[0].happ_esignatureid, signatureURLData);

    commonFormOpeation.showSpinner('overlay-spinner', false);


    // showToast('success', 'Form is Saved Successfully.');
    notify('Form is Submitted Successfully.', 'success');
    document.getElementById('form_hide').style.display = 'none';

    const alertElement = document.getElementById('formInvalidCondition')
    alertElement.innerText = `Thank you! 
    Your form has successfully been submitted. We are reviewing.`;
    alertElement.classList.remove('alert-danger');
    alertElement.classList.add('alert-primary');
    alertElement.style.display = 'block';

    localStorage.setItem('selected-card-nurse', "InReview");
    redirectToWorkflow('n');

}

const formViewOrEdit = (formStatus = null) => {
    if (formStatus !== null) {
        let imgobj = [];
        allSignName.forEach((e) => {
            const temp = document.querySelector(`img[id="${e}"]`);
            imgobj.push(temp);
        })

        let canvasobj = [];
        allSignName.forEach((e) => {
            const temp = document.querySelector(`canvas[id="${e}"]`)
            canvasobj.push(temp);
        });


        if (formStatus === statusMap.draft) {
            [...document.querySelectorAll('input'), ...document.querySelectorAll('textarea'), ...document.querySelectorAll('[class="form-check-input"]'), ...document.querySelectorAll('select'), ...document.querySelectorAll('[id="clearButton_patient_sign"],[id="saveBtn"]')].forEach((e) => {
                e.removeAttribute('readonly');
                // e.removeAttribute('disabled');

            })
            imgobj.forEach((e) => { if (e) e.style.display = 'none'; });
            canvasobj.forEach((e) => { if (e) e.style.display = 'block'; });
        }


        if (formStatus === statusMap.InReview) {
            [...document.querySelectorAll('input'), ...document.querySelectorAll('textarea'), ...document.querySelectorAll('[class="form-check-input"]'), ...document.querySelectorAll('select'), ...document.querySelectorAll('[id="clearButton_patient_sign"]')].forEach((e) => {
                if (e.classList.contains('enable-for-nurse') === false) e.setAttribute('disabled', true);
            })

            document.querySelectorAll('button[id="saveBtn"]').forEach((e) => {
                e.style.display = 'none';
            })

            imgobj.forEach((e) => { if (e) e.style.display = 'block'; });
            canvasobj.forEach((e) => { if (e) e.style.display = 'none'; });
        }
        if (formStatus == 0) {
            [...document.querySelectorAll('input'), ...document.querySelectorAll('textarea'), ...document.querySelectorAll('[class="form-check-input"]'), ...document.querySelectorAll('select'), ...document.querySelectorAll('[id="save-draft"],[id="clearButton_patient_sign"],[id="saveBtn"]')].forEach((e) => {
                e.setAttribute('disabled', true);
            })

            imgobj.forEach((e) => { if (e) e.style.display = 'block'; });
            canvasobj.forEach((e) => { if (e) e.style.display = 'none'; });
        }
    }
}

const getQuestionToIdMap = () => {
    const idToQueMap = {
        "fname": "82a21fc4-062e-ef11-840a-000d3a5c4f78",
        "lname": "8e69dbca-062e-ef11-840a-000d3a5c4f78",
        "do_date": "fd687ed1-062e-ef11-840a-000d3a5d2bf5",
        "visit_date": "1b06d8de-062e-ef11-840a-000d3a5c4f78",
        "prescribed_therapy": "b06576fd-062e-ef11-840a-000d3a5d2bf5",
        "proper_storage_medication": "022cb90f-072e-ef11-840a-000d3a5c4f78",
        "proper_storage_medication_status": "09fbe827-072e-ef11-840a-000d3a5c4f78",
        "inspection_site_signs": "5d5486e6-142e-ef11-840a-000d3a5d2bf5",
        "inspection_site_signs_status": "ec64f655-072e-ef11-840a-000d3a5d2bf5",
        "inspection": "a1731672-072e-ef11-840a-000d3a5c4f78",
        "inspection_status": "edde3c8a-072e-ef11-840a-000d3a5c4f78",
        "supply_status": "ba9c6d9c-072e-ef11-840a-000d3a5d2bf5",
        "demonstrate_use": "f45e2eb0-072e-ef11-840a-000d3a5c4f78",
        "demonstrate_use_status": "9e66e4bd-072e-ef11-840a-000d3a5c4f78",
        "aseptic_technique_status": "d4e51bc9-072e-ef11-840a-000d3a5d2bf5",
        "management": "ac6b4de2-072e-ef11-840a-000d3a5d2bf5",
        "management_status": "2317e3ec-072e-ef11-840a-000d3a3b9a57",
        "medication_preparation": "d7dc9303-082e-ef11-840a-000d3a5c4f78",
        "medication_preparation_status": "5466f121-082e-ef11-840a-000d3a5d2bf5",
        "infusion_site_preparation_status": "41b9052e-082e-ef11-840a-000d3a5d2bf5",
        "therapy_initiation_status": "7a61f13d-082e-ef11-840a-000d3a5c4f78",
        "therapy_completion_status": "d9285d53-082e-ef11-840a-000d3a3b9a57",
        "method": "323afd5f-082e-ef11-840a-000d3a5d2bf5",
        "method_status": "6e18e06f-082e-ef11-840a-000d3a3b9a57",
        "device_removal_status": "48a19986-082e-ef11-840a-000d3a3b9a57",
        "disposal": "fcdbec94-082e-ef11-840a-000d3a5c4f78",
        "disposal_status": "dfc8ffa4-082e-ef11-840a-000d3a3b9a57",
        "adverse_effects_status": "8b4611b7-082e-ef11-840a-000d3a3b9a57",
        "nurse_fname": "0aa926bd-082e-ef11-840a-000d3a5d2bf5",
        "nurse_lname": "aea5b7c3-082e-ef11-840a-000d3a5d2bf5",
        "credentials": "9b8e4bcc-082e-ef11-840a-000d3a5c4f78",
        "patient_sign": "fa98efd2-082e-ef11-840a-000d3a5c4f78",
        "nurse_sign_date": "01a530d5-082e-ef11-840a-000d3a3b9a57"
    };
    return idToQueMap;
};

const getAnswerToIdMap = () => {
    const idToAnsMap = {
        "iv_push": "8c6a36f9-062e-ef11-840a-000d3a5c4f78",
        "subcutaneous_injection": "8d6a36f9-062e-ef11-840a-000d3a5c4f78",
        "iv_infusion": "8f6a36f9-062e-ef11-840a-000d3a5c4f78",
        "subcutaneous_infusion": "b76576fd-062e-ef11-840a-000d3a5d2bf5",
        "refrigerated": "0c9c5611-072e-ef11-840a-000d3a5d2bf5",
        "not_refrigerated": "0b2cb90f-072e-ef11-840a-000d3a5c4f78",
        "storage_medication_s": "0efbe827-072e-ef11-840a-000d3a5c4f78",
        "storage_medication_n": "a5782c24-072e-ef11-840a-000d3a5d2bf5",
        "storage_medication_na": "a7782c24-072e-ef11-840a-000d3a5d2bf5",
        "site_inspection": "a16f07e4-142e-ef11-840a-000d3a5c4f78",
        "signs_infection": "5e5486e6-142e-ef11-840a-000d3a5d2bf5",
        "site_s": "ed64f655-072e-ef11-840a-000d3a5d2bf5",
        "site_n": "196adf53-072e-ef11-840a-000d3a5c4f78",
        "dosage": "a2731672-072e-ef11-840a-000d3a5c4f78",
        "expiration_date": "a3731672-072e-ef11-840a-000d3a5c4f78",
        "solution_integrity": "a4731672-072e-ef11-840a-000d3a5c4f78",
        "correct_medication": "b22fcd6e-072e-ef11-840a-000d3a5d2bf5",
        "inspection_s": "eede3c8a-072e-ef11-840a-000d3a5c4f78",
        "inspection_n": "f0de3c8a-072e-ef11-840a-000d3a5c4f78",
        "inspection_na": "0272d088-072e-ef11-840a-000d3a5d2bf5",
        "supply_s": "94ef4d97-072e-ef11-840a-000d3a5c4f78",
        "supply_n": "3798489d-072e-ef11-840a-000d3a5c4f78",
        "supply_na": "3898489d-072e-ef11-840a-000d3a5c4f78",
        "infusion_pump": "4a1621b0-072e-ef11-840a-000d3a5d2bf5",
        "flow_control_device": "501621b0-072e-ef11-840a-000d3a5d2bf5",
        "demonstrate_use_s": "9f66e4bd-072e-ef11-840a-000d3a5c4f78",
        "demonstrate_use_n": "a066e4bd-072e-ef11-840a-000d3a5c4f78",
        "demonstrate_use_na": "170ca8bc-072e-ef11-840a-000d3a5d2bf5",
        "aseptic_technique_s": "d8e51bc9-072e-ef11-840a-000d3a5d2bf5",
        "aseptic_technique_n": "daaa3ecc-072e-ef11-840a-000d3a5c4f78",
        "aseptic_technique_na": "e2533acf-072e-ef11-840a-000d3a5d2bf5",
        "vascular_access_device": "126c4de2-072e-ef11-840a-000d3a5d2bf5",
        "subcutaneous_access_device": "206d4de2-072e-ef11-840a-000d3a5d2bf5",
        "management_s": "a80823ef-072e-ef11-840a-000d3a5d2bf5",
        "management_n": "b92ed5ef-072e-ef11-840a-000d3a5c4f78",
        "management_na": "ae0823ef-072e-ef11-840a-000d3a5d2bf5",
        "preparation_of_syringe": "ed999b05-082e-ef11-840a-000d3a3b9a57",
        "prime_tubing": "d8dc9303-082e-ef11-840a-000d3a5c4f78",
        "medication_preparation_s": "5265e81d-082e-ef11-840a-000d3a5c4f78",
        "medication_preparation_n": "5365e81d-082e-ef11-840a-000d3a5c4f78",
        "medication_preparation_na": "5a66f121-082e-ef11-840a-000d3a5d2bf5",
        "infusion_site_preparation_s": "90511730-082e-ef11-840a-000d3a3b9a57",
        "infusion_site_preparation_n": "91511730-082e-ef11-840a-000d3a3b9a57",
        "infusion_site_preparation_na": "92511730-082e-ef11-840a-000d3a3b9a57",
        "therapy_initiation_s": "3b604940-082e-ef11-840a-000d3a5d2bf5",
        "therapy_initiation_n": "3f604940-082e-ef11-840a-000d3a5d2bf5",
        "therapy_initiation_na": "40604940-082e-ef11-840a-000d3a5d2bf5",
        "therapy_completion_s": "6a84e350-082e-ef11-840a-000d3a5c4f78",
        "therapy_completion_n": "6b84e350-082e-ef11-840a-000d3a5c4f78",
        "therapy_completion_na": "da285d53-082e-ef11-840a-000d3a3b9a57",
        "sash": "feace362-082e-ef11-840a-000d3a3b9a57",
        "sas": "d245fa65-082e-ef11-840a-000d3a5d2bf5",
        "method_s": "6f18e06f-082e-ef11-840a-000d3a3b9a57",
        "method_n": "5bdb0b76-082e-ef11-840a-000d3a5c4f78",
        "method_na": "16967072-082e-ef11-840a-000d3a5d2bf5",
        "device_removal_s": "281f6987-082e-ef11-840a-000d3a5c4f78",
        "device_removal_n": "291f6987-082e-ef11-840a-000d3a5c4f78",
        "device_removal_na": "49a19986-082e-ef11-840a-000d3a3b9a57",
        "disposal_waste": "c3e30099-082e-ef11-840a-000d3a3b9a57",
        "disposal_sharps": "fddbec94-082e-ef11-840a-000d3a5c4f78",
        "disposal_s": "abd153a5-082e-ef11-840a-000d3a5c4f78",
        "disposal_n": "ffc8ffa4-082e-ef11-840a-000d3a3b9a57",
        "disposal_na": "add153a5-082e-ef11-840a-000d3a5c4f78",
        "adverse_effects_s": "c352beb6-082e-ef11-840a-000d3a5d2bf5",
        "adverse_effects_n": "969181b6-082e-ef11-840a-000d3a5c4f78",
        "adverse_effects_na": "c752beb6-082e-ef11-840a-000d3a5d2bf5"
    };
    return idToAnsMap;
};