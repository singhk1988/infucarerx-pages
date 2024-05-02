const localStorageKey = 'BenifitFormData';
const requiredControls = {
    'therapy': 'Please enter therapy.',
    'payment_method': 'Please select Payment method.',
    'benefits_date': 'Please select benifits date.',
    'signature_date': 'Please select signature date.',
    'contract': 'Please enter the contract between you and:',

};
let ValidationErrorStatus = { payment_method: false, patient_sign: false };
document.addEventListener("DOMContentLoaded", async function () {

    console.log('bootstrap', bootstrap);

    const searchParams = new URLSearchParams(window.location.search);
    const formResponseId = searchParams.get('id');
    showPatientSignature();
    const fromResponses = window.localStorage.getItem(formResponseId);
    commonFormOpeation.setFormDataFromSave(getQuestionToIdMap(), getAnswerToIdMap(), JSON.parse(fromResponses));
    commonFormOpeation.setSignatureFromSave('patient_sign', window.localStorage.getItem(`${formResponseId}-sig`));
    hideAndShowLogic();

    commonFormOpeation.populatePatientData({fname: 'kumod', lname: 'kumar', mrn: 3456345});

    document.getElementById("save-draft").addEventListener('click', async () => {
        const formDataMap = commonFormOpeation.getFormDataToSave(getQuestionToIdMap(), getAnswerToIdMap());
        // console.log('formValues', formDataMap);
        window.localStorage.setItem(formResponseId, JSON.stringify(formDataMap));
        const signatureURLData = commonFormOpeation.getSignatureDataToSave('patient_sign');
        window.localStorage.setItem(`${formResponseId}-sig`, signatureURLData);
        // commonFormOpeation.showSpinner('overlay-spinner', true);
        commonFormOpeation.showModalPopup('exampleModal', true);
        

    });
    document.getElementById("saveBtn").addEventListener('click', async () => {
        const hasError = validateFormData();
    });

    commonFormOpeation.showSpinner('overlay-spinner', false);
});

const hideAndShowLogic = () => {
    // checkbox hide and show
    const commercialControles = ['comm_insurance', 'comm_authorized', 'comm_forwarded', 'comm_billed', 'comm_deductible', 'comm_d_met', 'comm_d_coverage_met', 'comm_pocket', 'comm_p_met', 'comm_p_coverage_met'];
    const medicaidControles = ['commercialControls', 'medicaid_resp', 'medicaid_days', 'private_notes'];
    const medicareControles = ['medi_part', 'medi_authorized', 'medi_deductible', 'medi_met'];
    const privateNoPayControles = ['private_cost', 'private_per', 'private_notes', 'private_orders', 'private_initial'];
    const unVerifiedContorls = ['unverified_assigned'];

    let commercial = document.getElementById('commercial');
    let medicare = document.getElementById('medicare');
    let medicaid = document.getElementById('medicaid');
    let private_pay = document.getElementById('private_pay');
    let unverified = document.getElementById('unverified');
    const payment_method = document.getElementById('payment_method');

    if (commercial.checked) {
        document.getElementById('commercial-details-container').style.display = 'block';
    }
    if (medicare.checked) {
        document.getElementById('medicare-container').style.display = 'block';
    }
    if (medicaid.checked) {
        document.getElementById('medicaid-container').style.display = 'block';
    }
    if (private_pay.checked) {
        document.getElementById('private-pay-container').style.display = 'block';
    }
    if (unverified.checked) {
        document.getElementById('unverified-container').style.display = 'block';
    }

    commercial.addEventListener('change', function () {
        if (this.checked) {
            if (ValidationErrorStatus.payment_method) payment_method.setAttribute('error', '');
            document.getElementById('commercial-details-container').style.display = 'block';
        } else {
            commonFormOpeation.emptyTheValuesOfControls(commercialControles);
            document.getElementById('commercial-details-container').style.display = 'none';
        }
    });
    medicare.addEventListener('change', function () {
        if (this.checked) {
            if (ValidationErrorStatus.payment_method) payment_method.setAttribute('error', '');
            document.getElementById('medicare-container').style.display = 'block';
        } else {
            commonFormOpeation.emptyTheValuesOfControls(medicareControles);
            document.getElementById('medicare-container').style.display = 'none';
        }
    });
    medicaid.addEventListener('change', function () {
        if (this.checked) {
            if (ValidationErrorStatus.payment_method) payment_method.setAttribute('error', '');
            document.getElementById('medicaid-container').style.display = 'block';
        } else {
            document.getElementById('medicaid-container').style.display = 'none';
        }
    });
    private_pay.addEventListener('change', function () {
        if (this.checked) {
            if (ValidationErrorStatus.payment_method) payment_method.setAttribute('error', '');
            document.getElementById('private-pay-container').style.display = 'block';
        } else {
            document.getElementById('private-pay-container').style.display = 'none';
        }
    });
    unverified.addEventListener('change', function () {
        if (this.checked) {
            if (ValidationErrorStatus.payment_method) payment_method.setAttribute('error', '');
            document.getElementById('unverified-container').style.display = 'block';
        } else {
            document.getElementById('unverified-container').style.display = 'none';
        }
    });
}

const showPatientSignature = () => {
    // signature functinality
    const canvas = document.getElementById('patient_sign');
    const context = canvas.getContext('2d');
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        [lastX, lastY] = [e.offsetX, e.offsetY];
    });

    canvas.addEventListener('mousemove', (e) => {
        if (isDrawing) {
            draw(e.offsetX, e.offsetY);
        }
    });

    canvas.addEventListener('mouseup', () => {
        isDrawing = false;
    });

    canvas.addEventListener('mouseout', () => {
        isDrawing = false;
        if (ValidationErrorStatus.patient_sign) {
            canvas.style.borderColor = '#ccdae4';
            document.getElementById('signature_validation').style.display = 'none';
        }
    });

    function draw(x, y) {
        context.beginPath();
        context.moveTo(lastX, lastY);
        context.lineTo(x, y);
        context.strokeStyle = '#000';
        context.lineWidth = 2;
        context.stroke();
        [lastX, lastY] = [x, y];
    }

    // Function to clear the canvas
    document.getElementById('clearButton').addEventListener('click', () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        if (ValidationErrorStatus.patient_sign) {
            canvas.style.borderColor = 'red';
            document.getElementById('signature_validation').style.display = 'block';
        }
    });
}

function validateFormData() {
    // reset validation status.
    ValidationErrorStatus = { payment_method: false, patient_sign: false };
    let hasError = false;
    const selectors = Object.keys(requiredControls).map(id => `#${id}`).join(', ');
    const elements = document.querySelectorAll(selectors);
    elements.forEach(el => {
        const elementType = el.getAttribute('type') ?? el.type;
        if (elementType === 'checkbox') {
            const checkBoxElements = el.querySelectorAll('.form-check-input');
            const isAnyCheckBoxSelected = false;
            checkBoxElements.forEach(checkBoxEl => {
                if (checkBoxEl.checked) {
                    isAnyCheckBoxSelected = true;
                }
            });
            if (!isAnyCheckBoxSelected) {
                hasError = true;
                ValidationErrorStatus.payment_method = true;
                el.setAttribute('error', requiredControls[el.id]);
            }
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
        document.getElementById('signature_validation').style.display = 'block';
    }

    return hasError;
}

const isCanvasBlank = (canvas) => {
    return !canvas.getContext('2d')
        .getImageData(0, 0, canvas.width, canvas.height).data
        .some(channel => channel !== 0);
}

const prepareDataForPdf = (formResponses) => {
    const formResponseMap = {};
    Object.keys(formResponses).forEach(questionId => {
        const { value, type, answerId } = formResponses[questionId];
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

const getQuestionToIdMap = () => {
    const idToQueMap = {
        "fname": "448953d8-56cb-ee11-9078-6045bd09505e",
        "lname": "0acdb9dc-56cb-ee11-9078-6045bd095d14",
        "mrn": "50b182de-56cb-ee11-9078-6045bd09505e",
        "therapy": "3e7518e5-56cb-ee11-9078-6045bd09505e",
        "benefits_date": "9a1163f-58cb-ee11-9078-6045bd095ad6",
        "medicaid_id": "4bcd4f20-59cb-ee11-9078-6045bd09505e",
        "medicaid_resp": "b1b40f30-e3f1-ee11-904b-000d3a59f35d",
        "comm_insurance": "7aecd3c1-58cb-ee11-9078-6045bd09505e",
        "comm_authorized": "eb29d8c7-58cb-ee11-9078-6045bd09505e",
        "medi_part": "d3470f0b-59cb-ee11-9078-6045bd095ad6",
        "medicaid_days": "7b714c5f-e3f1-ee11-904b-000d3a59f246",
        "medicaid_hmo": "1e614b49-59cb-ee11-9078-6045bd09505e",
        "medicaid_copay": "725d784f-59cb-ee11-9078-6045bd09505e",
        "medi_authorized": "05bc0a0f-59cb-ee11-9078-6045bd095d14",
        "additional_notes": "30954373-58cb-ee11-9078-6045bd09505e",
        "contract": "03c1b06a-58cb-ee11-9078-6045bd095d14",
        "signature_date": "09a1163f-58cb-ee11-9078-6045bd095ad6",
        "private_initial": "a6ba403c-5acb-ee11-9078-6045bd09505e",
        "private_notes": "4630f85b-59cb-ee11-9078-6045bd09505e",
        "private_cost": "40f69655-59cb-ee11-9078-6045bd09505e",
        "private_per": "9637b057-59cb-ee11-9078-6045bd095d14",
        "private_orders": "31832a9f-f3cb-ee11-9078-6045bd095ad6",
        "payment_method": "ac3be061-58cb-ee11-9078-6045bd095ad6",
        "comm_billed": "3e0922d2-58cb-ee11-9078-6045bd095ad6",
        "comm_forwarded": "125527cc-58cb-ee11-9078-6045bd095ad6",
        "comm_deductible": "20100dd5-58cb-ee11-9078-6045bd09505e",
        "comm_d_met": "535f43db-58cb-ee11-9078-6045bd09505e",
        "medi_deductible": "d8dbe411-59cb-ee11-9078-6045bd09505e",
        "comm_pocket": "524d19e4-58cb-ee11-9078-6045bd095ad6",
        "comm_d_coverage_met": "b6b67aea-58cb-ee11-9078-6045bd095ad6",
        "comm_p_met": "cb405718-59cb-ee11-9078-6045bd095ad6",
        "comm_p_coverage_met": "ae7a3692-67f2-ee11-904b-000d3a59f35d",
        "medi_met": "c6f901eb-58cb-ee11-9078-6045bd095d14",
        "medicaid_state": "0dbedf44-59cb-ee11-9078-6045bd095d14",
        "unverified_assigned": "922b300d-28f4-ee11-a1fd-000d3a330f3f"
    };

    // const queToIdMap = Object.fromEntries(new Map(Object.keys(idToQueMap).map((k) => [idToQueMap[k], k])));
    return idToQueMap;
}
const getAnswerToIdMap = () => {
    const idToAnsMap = {
        "private_pay": "03744d65-58cb-ee11-9078-6045bd09505e",
        "unverified": "04744d65-58cb-ee11-9078-6045bd09505e",
        "medi_part_a": "298f070a-59cb-ee11-9078-6045bd09505e",
        "commercial": "b13be061-58cb-ee11-9078-6045bd095ad6",
        "medicare": "b63be061-58cb-ee11-9078-6045bd095ad6",
        "medicaid": "b73be061-58cb-ee11-9078-6045bd095ad6",
        "medi_part_b": "eb470f0b-59cb-ee11-9078-6045bd095ad6",
        "private_total": "36832a9f-f3cb-ee11-9078-6045bd095ad6",
        "private_partial": "d711ee9f-f3cb-ee11-9078-6045bd095d14",
    };
    return idToAnsMap;
}
