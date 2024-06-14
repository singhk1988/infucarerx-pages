const requiredControls = {
    'fname': 'Please enter first name.',
    'lname': 'Please enter last name.',
    'patient_Dob': 'Please enter date of birth.',
    'mrn': 'Please enter patient MRN.',
    'LegalGName': 'Please enter the name of patient or legal guardian.',
    'date_sign': 'Please enter signature date.',
};

let ValidationErrorStatus = { patient_sign: false };

document.addEventListener("DOMContentLoaded", async function () {
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

    commonFormOpeation.showSpinner('overlay-spinner', false);
    commonFormOpeation.populatePatientData({
        //step 3
        fname: formData.happ_PatientList.happ_patientfirstname,
        lname: formData.happ_PatientList.happ_patientlastname,
        mrn: formData.happ_PatientList.happ_mrn,
    })
});

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
            document.getElementById('patient_sign_validations').style.display = 'block';
        }
    });
}

function validateFormData() {
    ValidationErrorStatus = { patient_sign: false };
    let hasError = false;

    for (const [id, errorMsg] of Object.entries(requiredControls)) {
        const el = document.getElementById(id);
        if (!el.value.trim()) {
            hasError = true;
            el.setAttribute('error', errorMsg);
            el.classList.add('is-invalid');
        } else {
            el.removeAttribute('error');
            el.classList.remove('is-invalid');
        }

        el.addEventListener('input', () => {
            if (el.value.trim()) {
                el.removeAttribute('error');
                el.classList.remove('is-invalid');
            }
        });
    }

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

const getQuestionToIdMap = () => {
    const idToQueMap = {
        "fname": "328e7d00-af28-ef11-840a-000d3a5d2bf5",
        "lname": "02688025-b028-ef11-840a-000d3a5d2bf5",
        "patient_Dob": "64f0177a-b028-ef11-840a-000d3a3b9a57",
        "mrn": "e756f041-b028-ef11-840a-000d3a5c4f78",
        "LegalGname": "cf7b4190-b028-ef11-840a-000d3a5c4f78",
        "patient_sign": "2587d99d-b028-ef11-840a-000d3a3b9a57",
        "date_sign": "ce2fc6be-b028-ef11-840a-000d3a3b9a57"
    }
    return idToQueMap;
}

const getAnswerToIdMap = () => {
    const idToAnsMap = {

    }
    return idToAnsMap;
}