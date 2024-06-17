const requiredControls = {
    'fname': 'Please enter first name.',
    'lname': 'Please enter last name.',
    'mrn': 'Please enter patient MRN.',
    'dob': 'Please enter date of birth.',
    'visit_date': 'Please enter date of visit.',
    'time_in': 'Please enter time-in.',
    'time_out': 'Please enter time-out.',
    'total_time': 'Please enter total time.',
    'schedule_type': 'Please select schedule type.',
    'therapy': 'Please select therapy.',
    'reason_for_visit': 'Please select reason for visit.',
    'bp': 'Please Enter BP.',
    'pulse': 'Please enter pulse.',
    'rr': 'Please enter rr.',
    'temp': 'Please enter temperture.',
    'weight': 'Please enter weight.'
};
let ValidationErrorStatus = { schedule_type: false, therapy: false, reason_for_visit: false, };

function validateFormData() {
    let hasError = false;
    const selectors = Object.keys(requiredControls)
        .filter(id => id.trim())  // Ensure there are no empty keys
        .map(id => `#${id}`)
        .join(', ');

    if (!selectors) {
        console.error("No valid selectors found for required controls.");
        return true; // Return true indicating there are errors
    }

    const elements = document.querySelectorAll(selectors);
    
    elements.forEach(el => {
        const elementType = el.getAttribute('type') ?? el.type;
        if (elementType === 'checkbox' || elementType === 'radio') {
            validateInputGroup(el, elementType);

            // Add change event listener for immediate validation
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
    
    return hasError;
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
        if (elementType === 'checkbox') {
            ValidationErrorStatus.therapy = true;
            ValidationErrorStatus.visit_date = true;
        } else if (elementType === 'radio') {
            ValidationErrorStatus.schedule_type = true;
        }
        el.setAttribute('error', requiredControls[el.id]);
    } else {
        el.setAttribute('error', '');
    }
}

const hideAndShowLogic = () => { 
    let therapy_other = document.getElementById('therapy_other');
    let therapy_delivery_other = document.getElementById('therapy_delivery_other');
    let pump_type = document.getElementById('pump');
    let visit_other = document.getElementById('visit_other');
    let pump_type_other = document.getElementById('pump_type_other');
    let otherRadiosDelivery = document.querySelectorAll('input[type="radio"][name="therapy_delivery_method"]');
    let otherRadiosPumpType = document.querySelectorAll('input[type="radio"][name="pump_type"]');
    let Medication_changes_yes=document.getElementById('medication_changes_yes');
    let Medication_changes_No=document.getElementById('medication_changes_no');
    let NEURO_PSYCH_yes=document.getElementById('NEURO_PSYCH_yes');
    let NEURO_PSYCH_no=document.getElementById('NEURO_PSYCH_no');
    const checkboxes = document.querySelectorAll('.form-check-input[type="checkbox"]')


    therapy_other.addEventListener('change', function () {
        if (this.checked) {
            if (ValidationErrorStatus.therapy) therapy.setAttribute('error', '');
            document.getElementById('visibleOtherTextBox_therapy_other').style.display = 'block';
        } else {
            // commonFormOpeation.emptyTheValuesOfControls(commercialControles);
            document.getElementById('visibleOtherTextBox_therapy_other').style.display = 'none';
        }
    });
    therapy_delivery_other.addEventListener('change', function () {
        if (!this.checked) {
            document.getElementById('visibleOtherTextBox_delivery').style.display = 'none';
        } else {
            // commonFormOpeation.emptyTheValuesOfControls(commercialControles);
            document.getElementById('visibleOtherTextBox_delivery').style.display = 'block';
        }
    });
    pump_type.addEventListener('change', function () {
        if (this.checked) {
            document.getElementById('show_pump_type').style.display = 'block';
        } else {
            // commonFormOpeation.emptyTheValuesOfControls(commercialControles);
            document.getElementById('show_pump_type').style.display = 'none';
        }
        
    });
    visit_other.addEventListener('change', function () {
        if (this.checked) {
            document.getElementById('visibleOtherTextBox_visit_other').style.display = 'block';
        } else {
            // commonFormOpeation.emptyTheValuesOfControls(commercialControles);
            document.getElementById('visibleOtherTextBox_visit_other').style.display = 'none';
        }
    });
    pump_type_other.addEventListener('change', function () {
        if (this.checked) {
            document.getElementById('visibleOtherTextBox_pump_type').style.display = 'block';
        } else {
            // commonFormOpeation.emptyTheValuesOfControls(commercialControles);
            document.getElementById('visibleOtherTextBox_pump_type').style.display = 'none';
        }
    });
    otherRadiosDelivery.forEach(radio => {
        radio.addEventListener('change', function () {
            if (radio.checked) {
                if (radio.id !== 'pump') {
                    document.getElementById('show_pump_type').style.display = 'none';
                    pump_type.checked = false;
                }
                if (radio.id !== 'therapy_delivery_other') {
                    document.getElementById('visibleOtherTextBox_delivery').style.display = 'none';
                    therapy_delivery_other.checked = false;
                }
            }
        });
    });
    otherRadiosPumpType.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.checked) {
                if (radio.id !== 'pump_type_other') {
                    document.getElementById('visibleOtherTextBox_pump_type').style.display = 'none';
                    pump_type_other = false;
                }
            }
        });
    })


    Medication_changes_yes.addEventListener('click', function () {
        document.getElementById('Medication').style.display='block';
    });

    Medication_changes_No.addEventListener('click', function () {
        document.getElementById('Medication').style.display = 'none';
    });


    NEURO_PSYCH_yes.addEventListener('click', function() {
        if (yesRadio.checked) {
            checkboxes.forEach(checkbox => checkbox.disabled = true);
        }

    });

   NEURO_PSYCH_no.addEventListener('click', function() {
        disableCheckboxes(false);
    });

    function disableCheckboxes(disable) {
        const checkboxes = document.getElementById('Neurology/Psychosocial Abnormalities:')
        checkboxes.forEach(function(checkbox) {
            checkbox.disabled = disable;
        });
    }


}

document.addEventListener("DOMContentLoaded", async function () {
    const searchParams = new URLSearchParams(window.location.search);
    const formResponseId = searchParams.get('id');
    const savedFormData = window.localStorage.getItem(formResponseId);
    hideAndShowLogic();

    if (savedFormData) {
        commonFormOpeation.setFormDataFromSave(getQuestionToIdMap(), getAnswerToIdMap(), JSON.parse(savedFormData));
        }
        
        document.getElementById("saveBtn").addEventListener('click', async () => {
            const hasError = validateFormData();
        if (!hasError) {
            const formDataMap = commonFormOpeation.getFormDataToSave(getQuestionToIdMap(), getAnswerToIdMap());
            window.localStorage.setItem(formResponseId, JSON.stringify(formDataMap));
            commonFormOpeation.showModalPopup('exampleModal', true);
        }
    });
    
});

const getQuestionToIdMap = () => {
    const idToQueMap = {
        "fname": "fname",
        "lname": "lname",
        "dob": "dob",
        "mrn": "mrn",
        "visit_date": "visit_date",
        "time_in": "time_in",
        "time_out": "time_out",
        "total_time": "total_time",
        "schedule_type": "schedule_type",
        "has_the_patient_side_effect": "has_the_patient_side_effect",
        "emergency_department_visit": "emergency_department_visit",
        "was_the_patient_hospitialized": "was_the_patient_hospitialized",
        "patient_serious_infections": "patient_serious_infections",
        "therapy": "therapy",
        "visibleOtherTextBox_therapy_other": "visibleOtherTextBox_therapy_other",
        "therapy_delivery_method": "therapy_delivery_method",
        "visibleOtherTextBox_delivery": "visibleOtherTextBox_delivery",
        "reason_for_visit": "reason_for_visit",
        "visibleOtherTextBox_visit_other": "visibleOtherTextBox_visit_other",
        "pump_type": "pump_type",
        "visibleOtherTextBox_pump_type": "visibleOtherTextBox_pump_type",
        "bp": "bp",
        "pulse": "pulse",
        "rr": "rr",
        "temp": "temp",
        "weight": "weight"

    };
    return idToQueMap;
};

const getAnswerToIdMap = () => {
    const idToAnsMap = {
        "unscheduled_type_Patient": "unscheduled_type_Patient",
        "scheduled_type_Patient": "scheduled_type_Patient",
        "has_the_patient_side_effect_yes": "has_the_patient_side_effect_yes",
        "has_the_patient_side_effect_no": "has_the_patient_side_effect_no",
        "emergency_department_visit_yes": "emergency_department_visit_yes",
        "emergency_department_visit_no": "emergency_department_visit_no",
        "was_the_patient_hospitialized_yes": "was_the_patient_hospitialized_yes",
        "was_the_patient_hospitialized_no": "was_the_patient_hospitialized_no",
        "patient_serious_infections_yes": "patient_serious_infections_yes",
        "patient_serious_infections_no": "patient_serious_infections_no",
        "antiboitics": "antiboitics",
        "steriods": "steriods",
        "therapy_other": "therapy_other",
        "total_parenteral_nutrition": "total_parenteral_nutrition",
        "intravenous_immunoglobulin": "intravenous_immunoglobulin",
        "subcutaneous_immunoglobulin": "subcutaneous_immunoglobulin",
        "gravity": "gravity",
        "pump": "pump",
        "dial_flow": "dial_flow",
        "home_pump": "home_pump",
        "iv_push": "iv_push",
        "therapy_delivery_other": "therapy_delivery_other",
        "instruction": "instruction",
        "line_care": "line_care",
        "line_draw" : "line_draw",
        "port_access": "port_access",
        "assessment": "assessment",
        "medication_admin": "medication_admin",
        "re_start": "re_start",
        "visit_other": "visit_other",
        "freedom": "freedom",
        "curlin": "curlin",
        "pump_type_other": "pump_type_other"

    };
    return idToAnsMap;
};