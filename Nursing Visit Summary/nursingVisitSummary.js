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
    'bp1': 'Please Enter BP.',
    'bp2': 'Please Enter BP.',
    'pulse': 'Please enter pulse.',
    'rr': 'Please enter rr.',
    'temp': 'Please enter temperture.',
    'weight': 'Please enter weight.',
    'vascular_access_site': 'Please check',
    'access_Device_Care_Option': 'Please check access device',
    'access_Device_Care_InputField_Length': 'Please enter length.',
    'access_Device_Care_InputField_Gauge': 'Please enter gauge.',
    // 'access_Device_Care_InputField_Gauge_Fr': 'Please enter gauge fr.',
    'access_Device_Care_InputField_Line_Brand': 'Please enter line brand.',
    'access_Device_Care_InputField_Access_Location': 'Please enter location',
    'access_Device_Care_InputField_Insert_date': 'Please enter insertion date.',
    'access_Device_Care_InputField_Inserted_By': 'Please enter inserted by.',
    'pain_Comfort_Checkbox': 'please check.',
    'nurse_credentials': 'Please enter nurse credentials.',
    'nurse_fname': 'Please enter nurse fisrt name.',
    'nurse_lname': 'Please enter nurse last name.',
    'nurse_date': 'Please enter nursery date.',
};
let ValidationErrorStatus = { schedule_type: false, therapy: false, reason_for_visit: false, nurse_sign: false, patient_sign: false };


function validateFormData() {
    let hasError = false;
    ValidationErrorStatus = {
        nurse_sign: false,
        patient_sign: false,
    }
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
    // Validate signature canvases
    const nurseSignCanvas = document.getElementById('nurse_sign');
    const patientSignCanvas = document.getElementById('patient_sign');
    if (isCanvasBlank(nurseSignCanvas)) {
        hasError = true;
        ValidationErrorStatus.nurse_sign = true;
        nurseSignCanvas.style.borderColor = 'red';
        document.getElementById('nurse_sign_validation').style.display = 'block';
    } else {
        document.getElementById('nurse_sign_validation').style.display = 'none';
    }
    if (isCanvasBlank(patientSignCanvas)) {
        hasError = true;
        ValidationErrorStatus.patient_sign = true;
        patientSignCanvas.style.borderColor = 'red';
        document.getElementById('patient_sign_validation').style.display = 'block';
    } else {
        document.getElementById('patient_sign_validation').style.display = 'none';
    }

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

const isCanvasBlank = (canvas) => {
    return !canvas.getContext('2d')
        .getImageData(0, 0, canvas.width, canvas.height).data
        .some(channel => channel !== 0);
};

document.getElementById('time_in').addEventListener('input', calculateTotalTime);
document.getElementById('time_out').addEventListener('input', calculateTotalTime);
let total_time = document.getElementById('total_time')
function calculateTotalTime() {
    const timeIn = document.getElementById('time_in').value;
    const timeOut = document.getElementById('time_out').value;

    if (timeIn && timeOut) {
        const timeInDate = new Date(`1970-01-01T${timeIn}:00`);
        const timeOutDate = new Date(`1970-01-01T${timeOut}:00`);

        let diff = (timeOutDate - timeInDate) / 1000 / 60; // difference in minutes

        if (diff < 0) {
            // document.getElementById('total_time').style.color('red')

            total_time.value = 'Error';
            total_time.style.color = 'red'
        }
        else {
            const hours = Math.floor(diff / 60);
            const minutes = diff % 60;

            total_time.value = `${hours}h ${minutes}m`;
            total_time.style.color = 'black';
            total_time.removeAttribute('error');
        }
    } else {
        document.getElementById('total_time').value = '';
    }
}

// therapy, reason for visit and vital signs and medication changes
const handleTherapySection = () => {
    let therapy_other = document.getElementById('therapy_other');
    let therapy_delivery_other = document.getElementById('therapy_delivery_other');
    let pump_type = document.getElementById('pump');
    let visit_other = document.getElementById('visit_other');
    let pump_type_other = document.getElementById('pump_type_other');
    let otherRadiosDelivery = document.querySelectorAll('input[type="radio"][name="therapy_delivery_method"]');
    let otherRadiosPumpType = document.querySelectorAll('input[type="radio"][name="pump_type"]');


    let Medication_changes_yes = document.getElementById('medication_changes_yes');
    let Medication_changes_No = document.getElementById('medication_changes_no');
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
        document.getElementById('Medication').style.display = 'block';
    });

    Medication_changes_No.addEventListener('click', function () {
        document.getElementById('Medication').style.display = 'none';
    });
}

const handleEmergencySection = () =>{
    let sideEffectRadioYes = document.getElementById('has_the_patient_side_effect_yes');
    let sideEffectRadioNo = document.getElementById('has_the_patient_side_effect_no');
    let sideEffectDetails = document.getElementById('sideEffectDetails');
    let yesRadio = document.getElementById('emergency_department_visit_yes');
    let noRadio = document.getElementById('emergency_department_visit_no');
    let formContainer = document.getElementById('emergency_hospital_visit_infusion_options');
    let yesPatientHospitalised = document.getElementById('was_the_patient_hospitialized_yes');
    let noPatientHospitalised = document.getElementById('was_the_patient_hospitialized_no');
    let optionsPatientHospitalised = document.getElementById('was_the_patient_hospitialized_options');
    let yesPatientInfection = document.getElementById('patient_serious_infections_yes');
    let noPatientInfection = document.getElementById('patient_serious_infections_no');
    let commentPatientInfection = document.getElementById('patient_serious_infections_comment');
    
    sideEffectRadioYes.addEventListener('change', function() {
        if (this.checked) {
            sideEffectDetails.style.display = 'block';
            // console.log(sideEffectDetails)
        }
    });
    
    sideEffectRadioNo.addEventListener('change', function() {
        if (this.checked) {
            sideEffectDetails.style.display = 'none';
        }
    });
 
 
    yesRadio.addEventListener('click', function () {
         formContainer.style.display = 'block';
    });
 
    noRadio.addEventListener('click', function () {
         formContainer.style.display = 'none';
    });
 
 
    yesPatientHospitalised.addEventListener('click', function () {
        optionsPatientHospitalised.style.display = 'block';
   });
 
    noPatientHospitalised.addEventListener('click', function () {
        optionsPatientHospitalised.style.display = 'none';
   });
    
 
    yesPatientInfection.addEventListener('click', function () {
        commentPatientInfection.style.display = 'block';
    });
 
    noPatientInfection.addEventListener('click', function () {
        commentPatientInfection.style.display = 'none';
    });
}

const handleNeuroSection = () => {

    let neuro_Psych_yes = document.getElementById('neuro_Psych_yes');
    let neuro_Psych_no = document.getElementById('neuro_Psych_no');
    var checkradio = document.querySelector('custom-input-checkradio[id="neurology_Psychosocial_Abnormalities"]');
    var NEURO_PSYCH_otherCheckbox = document.getElementById('neuro_Psych_Other');

    var NEURO_PSYCH_tinglingCheckbox = document.getElementById('tingling');
    var NEURO_PSYCH_burningCheckbox = document.getElementById('burning');
    var NEURO_PSYCH_headacheCheckbox = document.getElementById('headache');
    var NEURO_PSYCH_foot_Drop_LeftCheckbox = document.getElementById('foot_Drop_Left');
    var NEURO_PSYCH_foot_Drop_RightCheckbox = document.getElementById('foot_Drop_Right');
    var NEURO_PSYCH_tremorCheckbox = document.getElementById('tremor');
    var NEURO_PSYCH_numbnessCheckbox = document.getElementById('numbness');

    var neuro_Psych_otherInputField = document.getElementById('neuro_Psych_otherInputField');
    var neuro_Psych_tingling_InputField = document.getElementById('neuro_Psych_tingling_InputField');
    var neuro_Psych_burning_InputField = document.getElementById('neuro_Psych_burning_InputField');
    var neuro_Psych_headache_InputField = document.getElementById('neuro_Psych_headache_InputField');
    var neuro_Psych_foot_Drop_Left_InputField = document.getElementById('neuro_Psych_foot_Drop_Left_InputField');
    var neuro_Psych_foot_Drop_Right_InputField = document.getElementById('neuro_Psych_foot_Drop_Right_InputField');
    var neuro_Psych_tremor_InputField = document.getElementById('neuro_Psych_tremor_InputField');
    var neuro_Psych_Numbness_InputField = document.getElementById('neuro_Psych_Numbness_InputField');

    // NEURO_PSYCH
    neuro_Psych_yes.addEventListener('change', function () {

        toggleCheckboxes(true); // Disable checkboxes
    });

    neuro_Psych_no.addEventListener('change', function () {

        toggleCheckboxes(false); // Enable checkboxes

    });
    function toggleCheckboxes(enable) {
        if (checkradio) {
            // Select all input elements inside the custom-input-checkradio
            var inputs = checkradio.querySelectorAll('input[type="radio"], input[type="checkbox"]');

            // Iterate through each input and disable it
            inputs.forEach(function (input) {
                input.disabled = enable;
            });
        }
    }
    NEURO_PSYCH_otherCheckbox.addEventListener('change', function () {
        if (this.checked) {
            neuro_Psych_otherInputField.style.display = 'block';  // Show the input text field
            document.getElementById('NEURO/PSYCH_otherDescription').setAttribute('required', 'required');  // Make the input field required
        } else {
            neuro_Psych_otherInputField.style.display = 'none';  // Hide the input text field
            document.getElementById('NEURO/PSYCH_otherDescription').removeAttribute('required');  // Remove the required attribute
        }
    });

    NEURO_PSYCH_tinglingCheckbox.addEventListener('change', function () {
        if (this.checked) {
            neuro_Psych_tingling_InputField.style.display = 'block';  // Show the input text field
            document.getElementById('NEURO/PSYCH_otherDescription').setAttribute('required', 'required');  // Make the input field required
        } else {
            neuro_Psych_tingling_InputField.style.display = 'none';  // Hide the input text field
            document.getElementById('NEURO/PSYCH_otherDescription').removeAttribute('required');  // Remove the required attribute
        }
    });

    NEURO_PSYCH_burningCheckbox.addEventListener('change', function () {
        if (this.checked) {
            neuro_Psych_burning_InputField.style.display = 'block';  // Show the input text field
            document.getElementById('NEURO/PSYCH_otherDescription').setAttribute('required', 'required');  // Make the input field required
        } else {
            neuro_Psych_burning_InputField.style.display = 'none';  // Hide the input text field
            document.getElementById('NEURO/PSYCH_otherDescription').removeAttribute('required');  // Remove the required attribute
        }
    });

    NEURO_PSYCH_headacheCheckbox.addEventListener('change', function () {
        if (this.checked) {
            neuro_Psych_headache_InputField.style.display = 'block';  // Show the input text field
            document.getElementById('NEURO/PSYCH_otherDescription').setAttribute('required', 'required');  // Make the input field required
        } else {
            neuro_Psych_headache_InputField.style.display = 'none';  // Hide the input text field
            document.getElementById('NEURO/PSYCH_otherDescription').removeAttribute('required');  // Remove the required attribute
        }
    });

    NEURO_PSYCH_foot_Drop_LeftCheckbox.addEventListener('change', function () {
        if (this.checked) {
            neuro_Psych_foot_Drop_Left_InputField.style.display = 'block';  // Show the input text field
            document.getElementById('NEURO/PSYCH_otherDescription').setAttribute('required', 'required');  // Make the input field required
        } else {
            neuro_Psych_foot_Drop_Left_InputField.style.display = 'none';  // Hide the input text field
            document.getElementById('NEURO/PSYCH_otherDescription').removeAttribute('required');  // Remove the required attribute
        }
    });

    NEURO_PSYCH_foot_Drop_RightCheckbox.addEventListener('change', function () {
        if (this.checked) {
            neuro_Psych_foot_Drop_Right_InputField.style.display = 'block';  // Show the input text field
            document.getElementById('NEURO/PSYCH_otherDescription').setAttribute('required', 'required');  // Make the input field required
        } else {
            neuro_Psych_foot_Drop_Right_InputField.style.display = 'none';  // Hide the input text field
            document.getElementById('NEURO/PSYCH_otherDescription').removeAttribute('required');  // Remove the required attribute
        }
    });

    NEURO_PSYCH_tremorCheckbox.addEventListener('change', function () {
        if (this.checked) {
            neuro_Psych_tremor_InputField.style.display = 'block';  // Show the input text field
            document.getElementById('NEURO/PSYCH_otherDescription').setAttribute('required', 'required');  // Make the input field required
        } else {
            neuro_Psych_tremor_InputField.style.display = 'none';  // Hide the input text field
            document.getElementById('NEURO/PSYCH_otherDescription').removeAttribute('required');  // Remove the required attribute
        }
    });
    NEURO_PSYCH_numbnessCheckbox.addEventListener('change', function () {
        if (this.checked) {
            neuro_Psych_Numbness_InputField.style.display = 'block';  // Show the input text field
            document.getElementById('NEURO/PSYCH_otherDescription').setAttribute('required', 'required');  // Make the input field required
        } else {
            neuro_Psych_Numbness_InputField.style.display = 'none';  // Hide the input text field
            document.getElementById('NEURO/PSYCH_otherDescription').removeAttribute('required');  // Remove the required attribute
        }
    });
}

const handleCardiovascularSection = () => {
    let Cardiovascular_yes = document.getElementById('cardiovascular_yes');
    let Cardiovascular_no = document.getElementById('cardiovascular_no');
    var Cardiovascular_checkradio = document.querySelector('custom-input-checkradio[id="cardiovascular_Abnormalities"]');
    var Cardiovascular_otherCheckbox = document.getElementById('cardiovascular_Other');
    var Cardiovascular_otherInputField = document.getElementById('cardiovascular_otherInputField');
    var Cardiovascular_edemaCheckbox = document.getElementById('edema');
    var Cardiovascular_Peripheral_PulsesCheckbox = document.getElementById('peripheral_Pulse_Not_Palpable');
    var Cardiovascular_extremities_Not_Equal_In_Color_Temprature_SensationCheckbox = document.getElementById('extremities_Not_Equal_In_Color_Temprature_Sensation');

    var Cardiovascular_Peripheral_PulsesInputField = document.getElementById('cardiovascular_Peripheral_PulsesInputField');
    var Cardiovascular_extremities_Not_Equal_In_Color_Temprature_SensationInputField = document.getElementById('cardiovascular_extremities_Not_Equal_In_Color_Temprature_SensationInputField');



    //Cardiovascular
    Cardiovascular_yes.addEventListener('change', function () {

        Cardiovascular_toggleCheckboxes(true); // Disable checkboxes
    });

    Cardiovascular_no.addEventListener('change', function () {

        Cardiovascular_toggleCheckboxes(false); // Enable checkboxes

    });
    function Cardiovascular_toggleCheckboxes(enable) {
        if (Cardiovascular_checkradio) {
            // Select all input elements inside the custom-input-checkradio
            var inputs = Cardiovascular_checkradio.querySelectorAll('input[type="radio"], input[type="checkbox"]');

            // Iterate through each input and disable it
            inputs.forEach(function (input) {
                input.disabled = enable;
            });
        }
    }
    Cardiovascular_otherCheckbox.addEventListener('change', function () {
        if (this.checked) {
            Cardiovascular_otherInputField.style.display = 'block';  // Show the input text field
            document.getElementById('Cardiovascular_otherDescription').setAttribute('required', 'required');  // Make the input field required
        } else {
            Cardiovascular_otherInputField.style.display = 'none';  // Hide the input text field
            document.getElementById('Cardiovascular_otherDescription').removeAttribute('required');  // Remove the required attribute
        }
    });

    Cardiovascular_edemaCheckbox.addEventListener('change', function () {
        if (this.checked) {
            edema_input.style.display = 'block';  // Show the input text field
            document.getElementById('NEURO/PSYCH_otherDescription').setAttribute('required', 'required');  // Make the input field required
        } else {
            edema_input.style.display = 'none';  // Hide the input text field
            document.getElementById('NEURO/PSYCH_otherDescription').removeAttribute('required');  // Remove the required attribute
        }
    });

    Cardiovascular_Peripheral_PulsesCheckbox.addEventListener('change', function () {
        if (this.checked) {
            Cardiovascular_Peripheral_PulsesInputField.style.display = 'block';  // Show the input text field
            document.getElementById('NEURO/PSYCH_otherDescription').setAttribute('required', 'required');  // Make the input field required
        } else {
            Cardiovascular_Peripheral_PulsesInputField.style.display = 'none';  // Hide the input text field
            document.getElementById('NEURO/PSYCH_otherDescription').removeAttribute('required');  // Remove the required attribute
        }
    });

    Cardiovascular_extremities_Not_Equal_In_Color_Temprature_SensationCheckbox.addEventListener('change', function () {
        if (this.checked) {
            Cardiovascular_extremities_Not_Equal_In_Color_Temprature_SensationInputField.style.display = 'block';  // Show the input text field
            document.getElementById('NEURO/PSYCH_otherDescription').setAttribute('required', 'required');  // Make the input field required
        } else {
            Cardiovascular_extremities_Not_Equal_In_Color_Temprature_SensationInputField.style.display = 'none';  // Hide the input text field
            document.getElementById('NEURO/PSYCH_otherDescription').removeAttribute('required');  // Remove the required attribute
        }
    });
}

const handleRespiratorySection = () => {
    let respiratory_yes = document.getElementById('respiratory_yes');
    let respiratory_no = document.getElementById('respiratory_no');
    var respiratory_checkradio = document.querySelector('custom-input-checkradio[id="respiratory_Abnormalities"]');
    var respiratory_otherCheckbox = document.getElementById('respiratory_Other');
    var respiratory_otherInputField = document.getElementById('respiratory_otherInputField');
    var respiratory_adventious_Lung_SoundsCheckbox = document.getElementById('adventious_Lung_Sounds');
    var respiratory_use_of_Supplemetal_OxygenCheckbox = document.getElementById('use_of_Supplemetal_Oxygen');
    var respiratory_use_of_Supplemetal_OxygenInputField = document.getElementById('respiratory_use_of_Supplemetal_OxygenInputField');
    var respiratory_cough_Checkbox = document.getElementById('cough');

    var adventious_Lung_Sounds_OtherCheckbox = document.getElementById('adventious_Lung_Sounds_Other');
    var adventious_Lung_Sounds_OtherInputField = document.getElementById('adventious_Lung_Sounds_OtherInputField');
    var cough_OtherCheckbox = document.getElementById('cough_Other');
    var cough_OtherInputField = document.getElementById('cough_OtherInputField');
    //respiratory_

    respiratory_yes.addEventListener('change', function () {

        respiratory_toggleCheckboxes(true); // Disable checkboxes
    });

    respiratory_no.addEventListener('change', function () {

        respiratory_toggleCheckboxes(false); // Enable checkboxes

    });
    function respiratory_toggleCheckboxes(enable) {
        if (respiratory_checkradio) {
            // Select all input elements inside the custom-input-checkradio
            var inputs = respiratory_checkradio.querySelectorAll('input[type="radio"], input[type="checkbox"]');

            // Iterate through each input and disable it
            inputs.forEach(function (input) {
                input.disabled = enable;
            });
        }
    }
    respiratory_otherCheckbox.addEventListener('change', function () {
        if (this.checked) {
            respiratory_otherInputField.style.display = 'block';  // Show the input text field
            document.getElementById('respiratory_otherDescription').setAttribute('required', 'required');  // Make the input field required
        } else {
            respiratory_otherInputField.style.display = 'none';  // Hide the input text field
            document.getElementById('respiratory_otherDescription').removeAttribute('required');  // Remove the required attribute
        }
    });

    respiratory_adventious_Lung_SoundsCheckbox.addEventListener('change', function () {
        if (this.checked) {
            adventious_Lung_Sounds_Options.style.display = 'block';  // Show the input text field
            document.getElementById('NEURO/PSYCH_otherDescription').setAttribute('required', 'required');  // Make the input field required
        } else {
            adventious_Lung_Sounds_Options.style.display = 'none';  // Hide the input text field
            document.getElementById('NEURO/PSYCH_otherDescription').removeAttribute('required');  // Remove the required attribute
        }
    });

    adventious_Lung_Sounds_OtherCheckbox.addEventListener('change', function () {
        if (this.checked) {
            adventious_Lung_Sounds_OtherInputField.style.display = 'block';  // Show the input text field
            document.getElementById('NEURO/PSYCH_otherDescription').setAttribute('required', 'required');  // Make the input field required
        } else {
            adventious_Lung_Sounds_OtherInputField.style.display = 'none';  // Hide the input text field
            document.getElementById('NEURO/PSYCH_otherDescription').removeAttribute('required');  // Remove the required attribute
        }
    });

    respiratory_use_of_Supplemetal_OxygenCheckbox.addEventListener('change', function () {
        if (this.checked) {
            respiratory_use_of_Supplemetal_OxygenInputField.style.display = 'block';  // Show the input text field
            document.getElementById('NEURO/PSYCH_otherDescription').setAttribute('required', 'required');  // Make the input field required
        } else {
            respiratory_use_of_Supplemetal_OxygenInputField.style.display = 'none';  // Hide the input text field
            document.getElementById('NEURO/PSYCH_otherDescription').removeAttribute('required');  // Remove the required attribute
        }
    });
    respiratory_cough_Checkbox.addEventListener('change', function () {
        if (this.checked) {
            cough_Options.style.display = 'block';  // Show the input text field
            document.getElementById('NEURO/PSYCH_otherDescription').setAttribute('required', 'required');  // Make the input field required
        } else {
            cough_Options.style.display = 'none';  // Hide the input text field
            document.getElementById('NEURO/PSYCH_otherDescription').removeAttribute('required');  // Remove the required attribute
        }
    });

    cough_OtherCheckbox.addEventListener('change', function () {
        if (this.checked) {
            cough_OtherInputField.style.display = 'block';  // Show the input text field
            document.getElementById('NEURO/PSYCH_otherDescription').setAttribute('required', 'required');  // Make the input field required
        } else {
            cough_OtherInputField.style.display = 'none';  // Hide the input text field
            document.getElementById('NEURO/PSYCH_otherDescription').removeAttribute('required');  // Remove the required attribute
        }
    });

}

const handleGastrointestinalSection = () => {
    let gastrointestinal_yes = document.getElementById('gastrointestinal_yes');
    let gastrointestinal_no = document.getElementById('gastrointestinal_no');
    var gastrointestinal_checkradio = document.querySelector('custom-input-checkradio[id="gastrointestinal_Abnormalities"]');
    var gastrointestinal_otherCheckbox = document.getElementById('gastrointestinal_Other');
    var gastrointestinal_otherInputField = document.getElementById('gastrointestinal_otherInputField');

    //gastrointestinal       
    gastrointestinal_yes.addEventListener('change', function () {

        gastrointestinal_toggleCheckboxes(true); // Disable checkboxes
    });

    gastrointestinal_no.addEventListener('change', function () {

        gastrointestinal_toggleCheckboxes(false); // Enable checkboxes

    });
    function gastrointestinal_toggleCheckboxes(enable) {
        if (gastrointestinal_checkradio) {
            // Select all input elements inside the custom-input-checkradio
            var inputs = gastrointestinal_checkradio.querySelectorAll('input[type="radio"], input[type="checkbox"]');

            // Iterate through each input and disable it
            inputs.forEach(function (input) {
                input.disabled = enable;
            });
        }
    }
    gastrointestinal_otherCheckbox.addEventListener('change', function () {
        if (this.checked) {
            gastrointestinal_otherInputField.style.display = 'block';  // Show the input text field
            document.getElementById('gastrointestinal_otherDescription').setAttribute('required', 'required');  // Make the input field required
        } else {
            gastrointestinal_otherInputField.style.display = 'none';  // Hide the input text field
            document.getElementById('gastrointestinal_otherDescription').removeAttribute('required');  // Remove the required attribute
        }
    });

}

const handleGenitourinarySection = () => {

    let genitourinary_yes = document.getElementById('genitourinary_yes');
    let genitourinary_no = document.getElementById('genitourinary_no');
    var genitourinary_checkradio = document.querySelector('custom-input-checkradio[id="genitourinary_Abnormalities"]');
    var genitourinary_otherCheckbox = document.getElementById('genitourinary_Other');
    var genitourinary_otherInputField = document.getElementById('genitourinary_otherInputField');

    //Genitourinary    

    genitourinary_yes.addEventListener('change', function () {

        genitourinary_toggleCheckboxes(true); // Disable checkboxes
    });

    genitourinary_no.addEventListener('change', function () {

        genitourinary_toggleCheckboxes(false); // Enable checkboxes

    });
    function genitourinary_toggleCheckboxes(enable) {
        if (genitourinary_checkradio) {
            // Select all input elements inside the custom-input-checkradio
            var inputs = genitourinary_checkradio.querySelectorAll('input[type="radio"], input[type="checkbox"]');

            // Iterate through each input and disable it
            inputs.forEach(function (input) {
                input.disabled = enable;
            });
        }
    }
    genitourinary_otherCheckbox.addEventListener('change', function () {
        if (this.checked) {
            genitourinary_otherInputField.style.display = 'block';  // Show the input text field
            document.getElementById('genitourinary_otherDescription').setAttribute('required', 'required');  // Make the input field required
        } else {
            genitourinary_otherInputField.style.display = 'none';  // Hide the input text field
            document.getElementById('genitourinary_otherDescription').removeAttribute('required');  // Remove the required attribute
        }
    });

}

const handleMusculoskeletonSection = () => {
    let musculoskeleton_yes = document.getElementById('musculoskeleton_yes');
    let musculoskeleton_no = document.getElementById('musculoskeleton_no');
    var musculoskeleton_checkradio = document.querySelector('custom-input-checkradio[id="musculoskeleton_Abnormalities"]');
    var musculoskeleton_otherCheckbox = document.getElementById('musculoskeleton_Other');
    var musculoskeleton_otherInputField = document.getElementById('musculoskeleton_otherInputField');
    var musculoskeleton_Ambulatory_assist_deviceCheckbox = document.getElementById('Ambulatory_assist_device');

    var musculoskeleton_Ambulatory_assist_device_Other = document.getElementById('Ambulatory_assist_device_Other');
    var musculoskeleton_Ambulatory_assist_device_OtherInputField = document.getElementById('Ambulatory_assist_device_OtherInputField');

    //Musculoskeleton
    musculoskeleton_yes.addEventListener('change', function () {

        musculoskeleton_toggleCheckboxes(true); // Disable checkboxes
    });

    musculoskeleton_no.addEventListener('change', function () {

        musculoskeleton_toggleCheckboxes(false); // Enable checkboxes

    });
    function musculoskeleton_toggleCheckboxes(enable) {
        if (musculoskeleton_checkradio) {
            // Select all input elements inside the custom-input-checkradio
            var inputs = musculoskeleton_checkradio.querySelectorAll('input[type="radio"], input[type="checkbox"]');

            // Iterate through each input and disable it
            inputs.forEach(function (input) {
                input.disabled = enable;
            });
        }
    }
    musculoskeleton_otherCheckbox.addEventListener('change', function () {
        if (this.checked) {
            musculoskeleton_otherInputField.style.display = 'block';  // Show the input text field
            document.getElementById('musculoskeleton_otherDescription').setAttribute('required', 'required');  // Make the input field required
        } else {
            musculoskeleton_otherInputField.style.display = 'none';  // Hide the input text field
            document.getElementById('musculoskeleton_otherDescription').removeAttribute('required');  // Remove the required attribute
        }
    });

    musculoskeleton_Ambulatory_assist_deviceCheckbox.addEventListener('change', function () {
        if (this.checked) {
            Ambulatory_assist_device_Options.style.display = 'block';  // Show the input text field
            document.getElementById('NEURO/PSYCH_otherDescription').setAttribute('required', 'required');  // Make the input field required
        } else {
            Ambulatory_assist_device_Options.style.display = 'none';  // Hide the input text field
            document.getElementById('NEURO/PSYCH_otherDescription').removeAttribute('required');  // Remove the required attribute
        }
    });

    musculoskeleton_Ambulatory_assist_device_Other.addEventListener('change', function () {
        if (this.checked) {
            musculoskeleton_Ambulatory_assist_device_OtherInputField.style.display = 'block';  // Show the input text field
            document.getElementById('NEURO/PSYCH_otherDescription').setAttribute('required', 'required');  // Make the input field required
        } else {
            musculoskeleton_Ambulatory_assist_device_OtherInputField.style.display = 'none';  // Hide the input text field
            document.getElementById('NEURO/PSYCH_otherDescription').removeAttribute('required');  // Remove the required attribute
        }
    });

}

const handleSkinSection = () => {

    let skin_yes = document.getElementById('skin_yes');
    let skin_no = document.getElementById('skin_no');
    var skin_checkradio = document.querySelector('custom-input-checkradio[id="skin_Abnormalities"]');
    var skin_otherCheckbox = document.getElementById('skin_Other');
    var skin_otherInputField = document.getElementById('skin_otherInputField');

    var skin_DiscolorationCheckbox = document.getElementById('skin_Discoloration');
    var skin_DiscolorationInputField = document.getElementById('skin_DiscolorationInputField');

    var skin_BreakdownCheckbox = document.getElementById('skin_Breakdown');
    var skin_BreakdownInputField = document.getElementById('skin_BreakdownInputField');

    var skin_incisionCheckbox = document.getElementById('incision');
    //SKIN

    skin_yes.addEventListener('change', function () {

        skin_toggleCheckboxes(true); // Disable checkboxes
    });

    skin_no.addEventListener('change', function () {

        skin_toggleCheckboxes(false); // Enable checkboxes

    });
    function skin_toggleCheckboxes(enable) {
        if (skin_checkradio) {
            // Select all input elements inside the custom-input-checkradio
            var inputs = skin_checkradio.querySelectorAll('input[type="radio"], input[type="checkbox"]');

            // Iterate through each input and disable it
            inputs.forEach(function (input) {
                input.disabled = enable;
            });
        }
    }
    skin_otherCheckbox.addEventListener('change', function () {
        if (this.checked) {
            skin_otherInputField.style.display = 'block';  // Show the input text field
            document.getElementById('skin_otherDescription').setAttribute('required', 'required');  // Make the input field required
        } else {
            skin_otherInputField.style.display = 'none';  // Hide the input text field
            document.getElementById('skin_otherDescription').removeAttribute('required');  // Remove the required attribute
        }
    });

    skin_DiscolorationCheckbox.addEventListener('change', function () {
        if (this.checked) {
            skin_DiscolorationInputField.style.display = 'block';  // Show the input text field
            document.getElementById('skin_otherDescription').setAttribute('required', 'required');  // Make the input field required
        } else {
            skin_DiscolorationInputField.style.display = 'none';  // Hide the input text field
            document.getElementById('skin_otherDescription').removeAttribute('required');  // Remove the required attribute
        }
    });

    skin_BreakdownCheckbox.addEventListener('change', function () {
        if (this.checked) {
            skin_BreakdownInputField.style.display = 'block';  // Show the input text field
            document.getElementById('skin_otherDescription').setAttribute('required', 'required');  // Make the input field required
        } else {
            skin_BreakdownInputField.style.display = 'none';  // Hide the input text field
            document.getElementById('skin_otherDescription').removeAttribute('required');  // Remove the required attribute
        }
    });

    skin_incisionCheckbox.addEventListener('change', function () {
        if (this.checked) {

            incision_Options.style.display = 'flex';  // Show the input text field
            document.getElementById('skin_otherDescription').setAttribute('required', 'required');  // Make the input field required
        } else {
            incision_Options.style.display = 'none';  // Hide the input text field
            document.getElementById('skin_otherDescription').removeAttribute('required');  // Remove the required attribute
        }
    });


}

const handleEndocrineSection = () => {
    const endocrine_check_na = document.getElementById('endocrine_na')
    const endocrine_check_yes = document.getElementById('endocrine_yes')
    const endocrine_check_no = document.getElementById('endocrine_no')

    endocrine_check_na.addEventListener('click', function () {
        document.getElementById('endocrine_wrapper').style.display = 'none';
    });

    endocrine_check_yes.addEventListener('click', function () {
        document.getElementById('endocrine_wrapper').style.display = 'block';
    });

    endocrine_check_no.addEventListener('click', function () {
        document.getElementById('endocrine_wrapper').style.display = 'block';
    });

}

const handleVascularSection = () => {
    let vascularOtherCheckbox = document.getElementById('vascular_access_site_other');
    let vascularSuturesCheckbox = document.getElementById('vascular_sutures');
    let vascularNewIVAccessChecbox = document.getElementById('vascular_newIv_access_device');
    let salineFlushCheckbox = document.getElementById('saline_flush');
    let heparinFlushCheckbox = document.getElementById('heparin_flush');


    vascularOtherCheckbox.addEventListener('change', function () {
        if (this.checked) {
            document.getElementById('vascular_access_site_other_textBox').style.display = 'block';
            // document.getElementById('vascular_access_site_other_textBox').setAttribute('required', 'required');
        } else {
            document.getElementById('vascular_access_site_other_textBox').style.display = 'none';
            // document.getElementById('vascular_access_site_other_textBox').removeAttribute('required');
        }
    });

    vascularSuturesCheckbox.addEventListener('change', function () {
        if (this.checked) {
            document.getElementById('vascular_sutures_textBox').style.display = 'block';
            // document.getElementById('vascular_sutures_textBox').setAttribute('required', 'required');
        } else {
            document.getElementById('vascular_sutures_textBox').style.display = 'none';
            // document.getElementById('vascular_sutures_textBox').removeAttribute('required');
        }
    });

    vascularNewIVAccessChecbox.addEventListener('change', function () {
        if (this.checked) {
            document.getElementById('vascular_newIv_access_device_textBox').style.display = 'block';
            // document.getElementById('vascular_newIv_access_device_textBox').setAttribute('required', 'required');
        } else {
            document.getElementById('vascular_newIv_access_device_textBox').style.display = 'none';
            // document.getElementById('vascular_newIv_access_device_textBox').removeAttribute('required');
        }
    });

    salineFlushCheckbox.addEventListener('change', function () {
        if (this.checked) {
            document.getElementById('saline_pre_textBox').style.display = 'block';
            document.getElementById('saline_post_textBox').style.display = 'block';
            // document.getElementById('saline_pre_textBox').setAttribute('required', 'required');
            // document.getElementById('saline_post_textBox').setAttribute('required', 'required');
        } else {
            document.getElementById('saline_pre_textBox').style.display = 'none';
            document.getElementById('saline_post_textBox').style.display = 'none';
            // document.getElementById('saline_pre_textBox').removeAttribute('required');
            // document.getElementById('saline_post_textBox').removeAttribute('required');
        }
    });

    heparinFlushCheckbox.addEventListener('change', function () {
        if (this.checked) {
            document.getElementById('heparin_pre_textBox').style.display = 'block';
            document.getElementById('heparin_post_textBox').style.display = 'block';
            // document.getElementById('heparin_pre_textBox').setAttribute('required', 'required');
            // document.getElementById('heparin_post_textBox').setAttribute('required', 'required');
        } else {
            document.getElementById('heparin_pre_textBox').style.display = 'none';
            document.getElementById('heparin_post_textBox').style.display = 'none';
            // document.getElementById('heparin_pre_textBox').removeAttribute('required');
            // document.getElementById('heparin_post_textBox').removeAttribute('required');
        }
    });

}

//Pain and comfort
const handlePainComfortSection = () => {
    var pain_Currently_Present_checkradio = document.getElementById('pain_Currently_Present');
    var Pain_Experienced_Since_Last_Visit_checkbox = document.getElementById('Pain_Experienced_Since_Last_Visit');
    var pain_Currently_Present_radioButton = document.getElementById('pain_Currently_Present_radioButton');
    var pain_Experienced_radioButton = document.getElementById('pain_Experienced_radioButton');
    var denise_Pain_checkbox = document.getElementById('denise_Pain');
    var pain_Comfort_Checkbox = document.querySelector('custom-input-checkradio[id="pain_Comfort_Checkbox"]');
    var clearButton = document.getElementById('clearPainComfort');
    var pain_Currently_Present_Adult_Button = document.getElementById('pain_Currently_Present_Adult');
    var pain_Currently_Present_Pediatric_Button = document.getElementById('pain_Currently_Present_Pediatric');
    var pain_Currently_Present_Adult_Form = document.getElementById('pain_Currently_Present_Adult_Form');
    var pain_Currently_Present_Pediatric_Form = document.getElementById('pain_Currently_Present_Pediatric_Form');
    var pain_Currently_Present_Form = document.getElementById('pain_Currently_Present_Form');

    var pain_Experienced_Adult_Button = document.getElementById('pain_Experienced_Adult');
    var pain_Experienced_Pediatric_Button = document.getElementById('pain_Experienced_Pediatric');
    var pain_Experienced_Adult_Form = document.getElementById('pain_Experienced_Adult_Form');
    var pain_Experienced_Pediatric_Form = document.getElementById('pain_Experienced_Pediatric_Form');
    var pain_Experienced_Form = document.getElementById('pain_Experienced_Form');

    denise_Pain_checkbox.addEventListener('change', function () {
        if (pain_Comfort_Checkbox) {
            // Select all input elements inside the custom-input-checkradio
            var inputs = pain_Comfort_Checkbox.querySelectorAll('input[type="radio"], input[type="checkbox"]');

            // Iterate through each input and disable it

            inputs.forEach(function (input) {
                input.disabled = true;
            });

        }
    })

    clearButton.addEventListener('click', function () {
        var inputs = pain_Comfort_Checkbox.querySelectorAll('input[type="radio"], input[type="checkbox"]');
        inputs.forEach(function (checkbox) {
            checkbox.disabled = false;
            checkbox.checked = false;
        });
        pain_Currently_Present_radioButton.style.display = 'none';
        pain_Experienced_radioButton.style.display = 'none';

    });

    pain_Currently_Present_checkradio.addEventListener('change', function () {
        if (this.checked) {
            pain_Currently_Present_radioButton.style.display = 'block';  // Show the input text field

        } else {
            pain_Currently_Present_radioButton.style.display = 'none';  // Hide the input text field
            pain_Currently_Present_Form.style.display = 'none'
        }
    });
    Pain_Experienced_Since_Last_Visit_checkbox.addEventListener('change', function () {
        if (this.checked) {
            pain_Experienced_radioButton.style.display = 'block';  // Show the input text field

        } else {
            pain_Experienced_radioButton.style.display = 'none';  // Hide the input text field
            pain_Experienced_Form.style.display = 'none'
        }
    });

    pain_Currently_Present_Adult_Button.addEventListener('change', function () {
        if (this.checked) {
            pain_Currently_Present_Adult_Form.style.display = 'block';  // Show the input text field
            pain_Currently_Present_Pediatric_Form.style.display = 'none';
            pain_Currently_Present_Form.style.display = 'block'

        }
    });
    pain_Currently_Present_Pediatric_Button.addEventListener('change', function () {
        if (this.checked) {
            pain_Currently_Present_Pediatric_Form.style.display = 'block';  // Show the input text field
            pain_Currently_Present_Adult_Form.style.display = 'none';
            pain_Currently_Present_Form.style.display = 'block'
        }
    });

    pain_Experienced_Adult_Button.addEventListener('change', function () {
        if (this.checked) {
            pain_Experienced_Adult_Form.style.display = 'block';  // Show the input text field
            pain_Experienced_Pediatric_Form.style.display = 'none';
            pain_Experienced_Form.style.display = 'block'

        }
    });
    pain_Experienced_Pediatric_Button.addEventListener('change', function () {
        if (this.checked) {
            pain_Experienced_Pediatric_Form.style.display = 'block';  // Show the input text field
            pain_Experienced_Adult_Form.style.display = 'none';
            pain_Experienced_Form.style.display = 'block'
        }
    });


}

const handleAccess_Device_Care_Section = () => {

    let access_Device_Care_InputField_Length = document.getElementById('access_Device_Care_InputField_Length');
    let access_Device_Care_InputField_Gauge = document.getElementById('access_Device_Care_InputField_Gauge');
    let access_Device_Care_InputField_Gauge_Fr = document.getElementById('access_Device_Care_InputField_Gauge_Fr');
    let access_Device_Care_InputField_Line_Brand = document.getElementById('access_Device_Care_InputField_Line_Brand');
    let access_Device_Care_InputField_Access_Location = document.getElementById('access_Device_Care_InputField_Access_Location');
    let access_Device_Care_InputField_Internal_Length = document.getElementById('access_Device_Care_InputField_Internal_Length');
    let access_Device_Care_InputField_No_of_lumens = document.getElementById('access_Device_Care_InputField_No_of_lumens');

    var access_Device_Care_Option_radioButton = document.getElementById('access_Device_Care_Option');
    let access_Device_Care_Option_PIV = document.getElementById('access_Device_Care_Option_PIV');
    let access_Device_Care_Option_Port = document.getElementById('access_Device_Care_Option_Port');
    let access_Device_Care_Option_PICC = document.getElementById('access_Device_Care_Option_PICC');
    let access_Device_Care_Option_Midline = document.getElementById('access_Device_Care_Option_Midline');
    let access_Device_Care_Option_SUBQ = document.getElementById('access_Device_Care_Option_SUBQ');
    let access_Device_Care_Option_Tunneled_Catheter = document.getElementById('access_Device_Care_Option_Tunneled_Catheter');
    let sterile_site_care_other = document.getElementById('sterile_site_care_other');
    let sterile_site_care_otherInputField = document.getElementById('sterile_site_care_otherInputField');


    access_Device_Care_Option_PICC.addEventListener('click', function () {

        access_Device_Care_InputField_Gauge.style.display = 'none';
        access_Device_Care_InputField_Gauge_Fr.style.display = 'block';
        delete requiredControls['access_Device_Care_InputField_Gauge'];
        requiredControls['access_Device_Care_InputField_Gauge_Fr'] = 'Please enter gauge fr.';

    })
    access_Device_Care_Option_Midline.addEventListener('click', function () {

        access_Device_Care_InputField_Gauge.style.display = 'none';
        access_Device_Care_InputField_Gauge_Fr.style.display = 'block';
        delete requiredControls['access_Device_Care_InputField_Gauge'];
        requiredControls['access_Device_Care_InputField_Gauge_Fr'] = 'Please enter gauge fr.';
    })

    access_Device_Care_Option_PIV.addEventListener('click', function () {

        access_Device_Care_InputField_Gauge.style.display = 'block';
        access_Device_Care_InputField_Gauge_Fr.style.display = 'none';
        delete requiredControls['access_Device_Care_InputField_Gauge_Fr'];

    })
    access_Device_Care_Option_Port.addEventListener('click', function () {

        access_Device_Care_InputField_Gauge.style.display = 'block';
        access_Device_Care_InputField_Gauge_Fr.style.display = 'none';
        delete requiredControls['access_Device_Care_InputField_Gauge_Fr'];

    })
    access_Device_Care_Option_SUBQ.addEventListener('click', function () {
        access_Device_Care_InputField_Gauge.style.display = 'block';
        access_Device_Care_InputField_Gauge_Fr.style.display = 'none';
        delete requiredControls['access_Device_Care_InputField_Gauge_Fr'];

    })
    access_Device_Care_Option_Tunneled_Catheter.addEventListener('click', function () {

        access_Device_Care_InputField_Gauge.style.display = 'block';
        access_Device_Care_InputField_Gauge_Fr.style.display = 'none';
        delete requiredControls['access_Device_Care_InputField_Gauge_Fr'];
    })
    sterile_site_care_other.addEventListener('change', function () {
        if (this.checked)
            sterile_site_care_otherInputField.style.display = 'block';
        else
            sterile_site_care_otherInputField.style.display = 'none';
    })

}

const handleLaboratory = () => {
    let labs_Drawn_Yes = document.getElementById('labs_Drawn_Yes');
    let labs_Drawn_No = document.getElementById('labs_Drawn_No');
    let location_of_Labs_Drawn = document.getElementById('location_of_Labs_Drawn');
    let location_of_Labs_Drawn_Peripheral_Site = document.getElementById('location_of_Labs_Drawn_Peripheral_Site');
    let location_of_Labs_Drawn_Central_Line_Draw = document.getElementById('location_of_Labs_Drawn_Central_Line_Draw');
    let processing_Lab = document.getElementById('processing_Lab');
    let processing_Lab_Other = document.getElementById('processing_Lab_Others');
    let processing_Lab_OtherInputField = document.getElementById('processing_Lab_OthersInputField');
    let Laboratory_InputFields = document.getElementById('Laboratory_InputFields');
    labs_Drawn_Yes.addEventListener('click', function () {

        location_of_Labs_Drawn.style.display = 'block'

    })
    labs_Drawn_No.addEventListener('click', function () {

        location_of_Labs_Drawn.style.display = 'none'
        processing_Lab.style.display = 'none'
        Laboratory_InputFields.style.display = 'none'
        processing_Lab_OtherInputField.style.display = 'none'
    })
    location_of_Labs_Drawn_Peripheral_Site.addEventListener('click', function () {

        processing_Lab.style.display = 'block'
        Laboratory_InputFields.style.display = 'block'

    })
    location_of_Labs_Drawn_Central_Line_Draw.addEventListener('click', function () {
        processing_Lab.style.display = 'none'
        Laboratory_InputFields.style.display = 'block'
    })
    let otherRadiosPumpType = document.querySelectorAll('input[type="radio"][name="processing_Lab"]');

    otherRadiosPumpType.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.checked) {
                if (radio.id !== 'processing_Lab_Others') {
                    document.getElementById('processing_Lab_OthersInputField').style.display = 'none';
                    processing_Lab_Other = false;
                }
                else
                    document.getElementById('processing_Lab_OthersInputField').style.display = 'block';
            }
        });
    })

}


const handletherapyadherence = () => {

    let otherRadiosPumpType = document.querySelectorAll('input[type="radio"][name="therapy_interruption"]');
    let therapy_interruption_Yes = document.getElementById('therapy_interruption_Yes');
    otherRadiosPumpType.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.checked) {
                if (radio.id == 'therapy_interruption_Yes') {
                    document.getElementById('therapy_interruption_YesInputField').style.display = 'block';
                    therapy_interruption_Yes = false;
                }
                else
                    document.getElementById('therapy_interruption_YesInputField').style.display = 'none';
            }
        });
    })
}
const handlePATIENT_EDUCATION_PROVIDED = () => {
    const patient_Education_Provided_other = document.getElementById('patient_Education_Provided_other')
    const patient_Education_Provided_Medication_management = document.getElementById('patient_Education_Provided_Medication_management')
    patient_Education_Provided_other.addEventListener('change', function () {
        if (this.checked)
            document.getElementById('patient_Education_Provided_Inputtextfield').style.display = 'block';
        else
            document.getElementById('patient_Education_Provided_Inputtextfield').style.display = 'none';
    });
    patient_Education_Provided_Medication_management.addEventListener('change', function () {
        if (this.checked)
            document.getElementById('patient_Education_Provided_MEdicationmanagementEducation').style.display = 'block';
        else
            document.getElementById('patient_Education_Provided_MEdicationmanagementEducation').style.display = 'none';
    });
}

// PREMEDICATIONS ADMINISTERED section 
const handlePreMedicationAdministeredSection = () => {
    let premedicationsAdministeredOther = document.getElementById('premedications_administered_other');
    let premedicationAdministeredYes = document.getElementById('premedications_administered_yes');
    let premedications_administered_please_specify = document.getElementById('premedications_administered_patient_please_specify');
    let premedications_administered_please_specify_2 = document.getElementById('premedications_administered_patient_please_specify_2');
    let premedications_administered_please_specify_3 = document.getElementById('premedications_administered_patient_please_specify_3');
    let premedications_administered_please_specify_4 = document.getElementById('premedications_administered_patient_please_specify_4');
    let premedications_administered_please_specify_5 = document.getElementById('premedications_administered_patient_please_specify_5');
    let otherRadiosPremedications = document.querySelectorAll('input[type="radio"][name="premedications_administered"]')
    let otherRdioPremedicationsAdministeredBy = document.querySelectorAll('input[type="radio"][name="premedications_administered_by"]')
    let otherRdioPremedicationsAdministeredBy_2 = document.querySelectorAll('input[type="radio"][name="premedications_administered_by_2"]')
    let otherRdioPremedicationsAdministeredBy_3 = document.querySelectorAll('input[type="radio"][name="premedications_administered_by_3"]')
    let otherRdioPremedicationsAdministeredBy_4 = document.querySelectorAll('input[type="radio"][name="premedications_administered_by_4"]')
    let otherRdioPremedicationsAdministeredBy_5 = document.querySelectorAll('input[type="radio"][name="premedications_administered_by_5"]')

    premedicationsAdministeredOther.addEventListener('change', function () {
        if (this.checked) {
            document.getElementById('premedications_administered_other_textBox').style.display = 'block';
        } else {
            document.getElementById('premedications_administered_other_textBox').style.display = 'none';
        }
    });

    premedicationAdministeredYes.addEventListener('change', function () {
        if (this.checked) {
            document.getElementById('pre_medication1').style.display = 'block';
        } else {
            document.getElementById('pre_medication1').style.display = 'none';
        }
    });

    premedications_administered_please_specify.addEventListener('change', function () {
        if (this.checked) {
            document.getElementById('premedication_please_specify_textBox').style.display = 'block';
        } else {
            document.getElementById('premedication_please_specify_textBox').style.display = 'none';
        }
    });
    premedications_administered_please_specify_2.addEventListener('change', function () {
        if (this.checked) {
            document.getElementById('premedication_please_specify_textBox_2').style.display = 'block';
        } else {
            document.getElementById('premedication_please_specify_textBox_2').style.display = 'none';
        }
    });
    premedications_administered_please_specify_3.addEventListener('change', function () {
        if (this.checked) {
            document.getElementById('premedication_please_specify_textBox_3').style.display = 'block';
        } else {
            document.getElementById('premedication_please_specify_textBox_3').style.display = 'none';
        }
    });
    premedications_administered_please_specify_4.addEventListener('change', function () {
        if (this.checked) {
            document.getElementById('premedication_please_specify_textBox_4').style.display = 'block';
        } else {
            document.getElementById('premedication_please_specify_textBox_4').style.display = 'none';
        }
    });
    premedications_administered_please_specify_5.addEventListener('change', function () {
        if (this.checked) {
            document.getElementById('premedication_please_specify_textBox_5').style.display = 'block';
        } else {
            document.getElementById('premedication_please_specify_textBox_5').style.display = 'none';
        }
    });


    otherRadiosPremedications.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.checked) {

                if (radio.id !== 'premedications_administered_yes') {
                    document.getElementById('pre_medication1').style.display = 'none';
                    premedicationAdministeredYes = false;
                    // premedicationAdministeredYes.checked = false;

                }
                if (radio.id !== 'premedications_administered_other') {
                    document.getElementById('premedications_administered_other_textBox').style.display = 'none';
                    premedicationsAdministeredOther = false;
                }
            }
        });
    })

    otherRdioPremedicationsAdministeredBy.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.checked) {
                if (radio.id !== 'premedications_administered_patient_please_specify') {
                    document.getElementById('premedication_please_specify_textBox').style.display = 'none';
                    premedications_administered_patient_please_specify = false;
                    // premedications_administered_patient_please_specify.checked = false;

                }
            }
        });
    })
    otherRdioPremedicationsAdministeredBy_2.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.checked) {
                if (radio.id !== 'premedications_administered_patient_please_specify_2') {
                    document.getElementById('premedication_please_specify_textBox_2').style.display = 'none';
                    premedications_administered_patient_please_specify_2 = false;
                    // premedications_administered_patient_please_specify.checked = false;

                }
            }
        });
    })
    otherRdioPremedicationsAdministeredBy_3.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.checked) {
                if (radio.id !== 'premedications_administered_patient_please_specify_3') {
                    document.getElementById('premedication_please_specify_textBox_3').style.display = 'none';
                    premedications_administered_patient_please_specify_3 = false;
                    // premedications_administered_patient_please_specify.checked = false;

                }
            }
        });
    })
    otherRdioPremedicationsAdministeredBy_4.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.checked) {
                if (radio.id !== 'premedications_administered_patient_please_specify_4') {
                    document.getElementById('premedication_please_specify_textBox_4').style.display = 'none';
                    premedications_administered_patient_please_specify_4 = false;
                    // premedications_administered_patient_please_specify.checked = false;

                }
            }
        });
    })
    otherRdioPremedicationsAdministeredBy_5.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.checked) {
                if (radio.id !== 'premedications_administered_patient_please_specify_5') {
                    document.getElementById('premedication_please_specify_textBox_5').style.display = 'none';
                    premedications_administered_patient_please_specify_5 = false;
                    // premedications_administered_patient_please_specify.checked = false;

                }
            }
        });
    })


    document.getElementById('addAdditional_2').addEventListener('change', function () {
        if (this.checked) {
            document.getElementById('preMedicationForm2').style.display = 'block';
        } else {
            document.getElementById('preMedicationForm2').style.display = 'none';
            document.getElementById('preMedicationForm3').style.display = 'none';
            document.getElementById('preMedicationForm4').style.display = 'none';
            document.getElementById('preMedicationForm5').style.display = 'none';
        }
    });

    document.getElementById('addAdditional_3').addEventListener('change', function () {
        if (this.checked) {
            document.getElementById('preMedicationForm3').style.display = 'block';
        } else {
            document.getElementById('preMedicationForm3').style.display = 'none';
            document.getElementById('preMedicationForm4').style.display = 'none';
            document.getElementById('preMedicationForm5').style.display = 'none';
        }
    });
    document.getElementById('addAdditional_4').addEventListener('change', function () {
        if (this.checked) {
            document.getElementById('preMedicationForm4').style.display = 'block';
        } else {
            document.getElementById('preMedicationForm4').style.display = 'none';
            document.getElementById('preMedicationForm5').style.display = 'none';
        }
    });
    document.getElementById('addAdditional_5').addEventListener('change', function () {
        if (this.checked) {
            document.getElementById('preMedicationForm5').style.display = 'block';
        } else {
            document.getElementById('preMedicationForm5').style.display = 'none';
        }
    });
}

//POSTMEDICATION ADMINISTERED section

const handlePostMedicationAdministeredSection = () => {
    let postmedicationsAdministeredOther = document.getElementById('postmedications_administered_other');
    let postmedicationAdministeredYes = document.getElementById('postmedications_administered_yes');
    let postmedications_administered_please_specify = document.getElementById('postmedications_administered_patient_please_specify');
    let postmedications_administered_please_specify_2 = document.getElementById('postmedications_administered_patient_please_specify_2');
    let postmedications_administered_please_specify_3 = document.getElementById('postmedications_administered_patient_please_specify_3');
    let postmedications_administered_please_specify_4 = document.getElementById('postmedications_administered_patient_please_specify_4');
    let postmedications_administered_please_specify_5 = document.getElementById('postmedications_administered_patient_please_specify_5');
    let otherRadiospostmedications = document.querySelectorAll('input[type="radio"][name="postmedications_administered"]')
    let otherRdiopostmedicationsAdministeredBy = document.querySelectorAll('input[type="radio"][name="postmedications_administered_by"]')
    let otherRdiopostmedicationsAdministeredBy_2 = document.querySelectorAll('input[type="radio"][name="postmedications_administered_by_2"]')
    let otherRdiopostmedicationsAdministeredBy_3 = document.querySelectorAll('input[type="radio"][name="postmedications_administered_by_3"]')
    let otherRdiopostmedicationsAdministeredBy_4 = document.querySelectorAll('input[type="radio"][name="postmedications_administered_by_4"]')
    let otherRdiopostmedicationsAdministeredBy_5 = document.querySelectorAll('input[type="radio"][name="postmedications_administered_by_5"]')

    postmedicationsAdministeredOther.addEventListener('change', function () {
        if (this.checked) {
            document.getElementById('postmedications_administered_other_textBox').style.display = 'block';
        } else {
            document.getElementById('postmedications_administered_other_textBox').style.display = 'none';
        }
    });

    postmedicationAdministeredYes.addEventListener('change', function () {
        if (this.checked) {
            document.getElementById('post_medication1').style.display = 'block';
        } else {
            document.getElementById('post_medication1').style.display = 'none';
        }
    });

    postmedications_administered_please_specify.addEventListener('change', function () {
        if (this.checked) {
            document.getElementById('postmedication_please_specify_textBox').style.display = 'block';
        } else {
            document.getElementById('postmedication_please_specify_textBox').style.display = 'none';
        }
    });
    postmedications_administered_please_specify_2.addEventListener('change', function () {
        if (this.checked) {
            document.getElementById('postmedication_please_specify_textBox_2').style.display = 'block';
        } else {
            document.getElementById('postmedication_please_specify_textBox_2').style.display = 'none';
        }
    });
    postmedications_administered_please_specify_3.addEventListener('change', function () {
        if (this.checked) {
            document.getElementById('postmedication_please_specify_textBox_3').style.display = 'block';
        } else {
            document.getElementById('postmedication_please_specify_textBox_3').style.display = 'none';
        }
    });
    postmedications_administered_please_specify_4.addEventListener('change', function () {
        if (this.checked) {
            document.getElementById('postmedication_please_specify_textBox_4').style.display = 'block';
        } else {
            document.getElementById('postmedication_please_specify_textBox_4').style.display = 'none';
        }
    });
    postmedications_administered_please_specify_5.addEventListener('change', function () {
        if (this.checked) {
            document.getElementById('postmedication_please_specify_textBox_5').style.display = 'block';
        } else {
            document.getElementById('postmedication_please_specify_textBox_5').style.display = 'none';
        }
    });

    otherRadiospostmedications.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.checked) {

                if (radio.id !== 'postmedications_administered_yes') {
                    document.getElementById('post_medication1').style.display = 'none';
                    postmedicationAdministeredYes = false;
                    // postmedicationAdministeredYes.checked = false;

                }
                if (radio.id !== 'postmedications_administered_other') {
                    document.getElementById('postmedications_administered_other_textBox').style.display = 'none';
                    postmedicationsAdministeredOther = false;
                }
            }
        });
    })

    otherRdiopostmedicationsAdministeredBy.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.checked) {
                if (radio.id !== 'postmedications_administered_patient_please_specify') {
                    document.getElementById('postmedication_please_specify_textBox').style.display = 'none';
                    postmedications_administered_patient_please_specify = false;
                    // postmedications_administered_patient_please_specify.checked = false;

                }
            }
        });
    })
    otherRdiopostmedicationsAdministeredBy_2.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.checked) {
                if (radio.id !== 'postmedications_administered_patient_please_specify_2') {
                    document.getElementById('postmedication_please_specify_textBox_2').style.display = 'none';
                    postmedications_administered_patient_please_specify_2 = false;
                    // postmedications_administered_patient_please_specify.checked = false;

                }
            }
        });
    })
    otherRdiopostmedicationsAdministeredBy_3.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.checked) {
                if (radio.id !== 'postmedications_administered_patient_please_specify_3') {
                    document.getElementById('postmedication_please_specify_textBox_3').style.display = 'none';
                    postmedications_administered_patient_please_specify_3 = false;
                    // postmedications_administered_patient_please_specify.checked = false;

                }
            }
        });
    })
    otherRdiopostmedicationsAdministeredBy_4.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.checked) {
                if (radio.id !== 'postmedications_administered_patient_please_specify_4') {
                    document.getElementById('postmedication_please_specify_textBox_4').style.display = 'none';
                    postmedications_administered_patient_please_specify_4 = false;
                    // postmedications_administered_patient_please_specify.checked = false;

                }
            }
        });
    })
    otherRdiopostmedicationsAdministeredBy_5.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.checked) {
                if (radio.id !== 'postmedications_administered_patient_please_specify_5') {
                    document.getElementById('postmedication_please_specify_textBox_5').style.display = 'none';
                    postmedications_administered_patient_please_specify_5 = false;
                    // postmedications_administered_patient_please_specify.checked = false;

                }
            }
        });
    })

    document.getElementById('post_addAdditional_2').addEventListener('change', function () {
        if (this.checked) {
            document.getElementById('postMedicationForm2').style.display = 'block';
        } else {
            document.getElementById('postMedicationForm2').style.display = 'none';
            document.getElementById('postMedicationForm3').style.display = 'none';
            document.getElementById('postMedicationForm4').style.display = 'none';
            document.getElementById('postMedicationForm5').style.display = 'none';
        }
    });

    document.getElementById('post_addAdditional_3').addEventListener('change', function () {
        if (this.checked) {
            document.getElementById('postMedicationForm3').style.display = 'block';
        } else {
            document.getElementById('postMedicationForm3').style.display = 'none';
            document.getElementById('postMedicationForm4').style.display = 'none';
            document.getElementById('postMedicationForm5').style.display = 'none';
        }
    });
    document.getElementById('post_addAdditional_4').addEventListener('change', function () {
        if (this.checked) {
            document.getElementById('postMedicationForm4').style.display = 'block';
        } else {
            document.getElementById('postMedicationForm4').style.display = 'none';
            document.getElementById('postMedicationForm5').style.display = 'none';
        }
    });
    document.getElementById('post_addAdditional_5').addEventListener('change', function () {
        if (this.checked) {
            document.getElementById('postMedicationForm5').style.display = 'block';
        } else {
            document.getElementById('postMedicationForm5').style.display = 'none';
        }
    });
}


const handlePatientUnableToSignIn = () => {
    // patient unable to sign
    document.getElementById('pateint_unable_to_sign').addEventListener('change', function () {
        if (this.checked) {
            document.getElementById('why_patient_cannot_sign').style.display = 'block';
        }
        else {
            document.getElementById('why_patient_cannot_sign').style.display = 'none';

        }
    });
}

const handleDisableAtStart = () => {
    var checkradio = document.querySelector('custom-input-checkradio[id="neurology_Psychosocial_Abnormalities"]');
    let neuro_Psych_no = document.getElementById('neuro_Psych_no');
    var Cardiovascular_checkradio = document.querySelector('custom-input-checkradio[id="cardiovascular_Abnormalities"]');
    let Cardiovascular_no = document.getElementById('cardiovascular_no');
    var respiratory_checkradio = document.querySelector('custom-input-checkradio[id="respiratory_Abnormalities"]');
    let respiratory_no = document.getElementById('respiratory_no');
    var gastrointestinal_checkradio = document.querySelector('custom-input-checkradio[id="gastrointestinal_Abnormalities"]');
    let gastrointestinal_no = document.getElementById('gastrointestinal_no');
    var genitourinary_checkradio = document.querySelector('custom-input-checkradio[id="genitourinary_Abnormalities"]');
    let genitourinary_no = document.getElementById('genitourinary_no');
    var musculoskeleton_checkradio = document.querySelector('custom-input-checkradio[id="musculoskeleton_Abnormalities"]');
    let musculoskeleton_no = document.getElementById('musculoskeleton_no');
    var skin_checkradio = document.querySelector('custom-input-checkradio[id="skin_Abnormalities"]');
    let skin_no = document.getElementById('skin_no');
    //NEURO/PSYCH
    if (checkradio) {
        // Select all input elements inside the custom-input-checkradio
        var inputs = checkradio.querySelectorAll('input[type="radio"], input[type="checkbox"]');

        // Iterate through each input and disable it
        if (neuro_Psych_no.checked) {
            inputs.forEach(function (input) {
                input.disabled = false;
            });
        }
        else {
            inputs.forEach(function (input) {
                input.disabled = true;
            });
        }
    }
    //CARDIOVASCULAR
    if (Cardiovascular_checkradio) {
        // Select all input elements inside the custom-input-checkradio
        var inputs = Cardiovascular_checkradio.querySelectorAll('input[type="radio"], input[type="checkbox"]');

        // Iterate through each input and disable it
        if (Cardiovascular_no.checked) {
            inputs.forEach(function (input) {
                input.disabled = false;
            });
        }
        else {
            inputs.forEach(function (input) {
                input.disabled = true;
            });
        }
    }

    //respiratory
    if (respiratory_checkradio) {
        // Select all input elements inside the custom-input-checkradio
        var inputs = respiratory_checkradio.querySelectorAll('input[type="radio"], input[type="checkbox"]');

        // Iterate through each input and disable it
        if (respiratory_no.checked) {
            inputs.forEach(function (input) {
                input.disabled = false;
            });
        }
        else {
            inputs.forEach(function (input) {
                input.disabled = true;
            });
        }
    }

    //gastrointestinal
    if (gastrointestinal_checkradio) {
        // Select all input elements inside the custom-input-checkradio
        var inputs = gastrointestinal_checkradio.querySelectorAll('input[type="radio"], input[type="checkbox"]');

        // Iterate through each input and disable it
        if (gastrointestinal_no.checked) {
            inputs.forEach(function (input) {
                input.disabled = false;
            });
        }
        else {
            inputs.forEach(function (input) {
                input.disabled = true;
            });
        }
    }

    //genitourinary
    if (genitourinary_checkradio) {
        // Select all input elements inside the custom-input-checkradio
        var inputs = genitourinary_checkradio.querySelectorAll('input[type="radio"], input[type="checkbox"]');

        // Iterate through each input and disable it
        if (genitourinary_no.checked) {
            inputs.forEach(function (input) {
                input.disabled = false;
            });
        }
        else {
            inputs.forEach(function (input) {
                input.disabled = true;
            });
        }
    }

    //musculoskeleton
    if (musculoskeleton_checkradio) {
        // Select all input elements inside the custom-input-checkradio
        var inputs = musculoskeleton_checkradio.querySelectorAll('input[type="radio"], input[type="checkbox"]');

        // Iterate through each input and disable it
        if (musculoskeleton_no.checked) {
            inputs.forEach(function (input) {
                input.disabled = false;
            });
        }
        else {
            inputs.forEach(function (input) {
                input.disabled = true;
            });
        }
    }
    //skin
    if (skin_checkradio) {
        // Select all input elements inside the custom-input-checkradio
        var inputs = skin_checkradio.querySelectorAll('input[type="radio"], input[type="checkbox"]');

        // Iterate through each input and disable it
        if (skin_no.checked) {
            inputs.forEach(function (input) {
                input.disabled = false;
            });
        }
        else {
            inputs.forEach(function (input) {
                input.disabled = true;
            });
        }
    }
}
const setSignatureDatas = (elementId) => {
    commonFormOpeation.setSignatureFromSave(elementId, window.localStorage.getItem(`${formResponseId}-${elementId}-sig`));
}
const saveSignatureDatas = (elementId) => {
    const signatureURLData = commonFormOpeation.getSignatureDataToSave(elementId);
    window.localStorage.setItem(`${formResponseId}-${elementId}-sig`, signatureURLData);
}
let formResponseId, signatureData, fromResponses;
document.addEventListener("DOMContentLoaded", async function () {
    const searchParams = new URLSearchParams(window.location.search);
    const formResponseId = searchParams.get('id');
    const savedFormData = window.localStorage.getItem(formResponseId);
    const savedSignature = window.localStorage.getItem(`${formResponseId}-sig`);



    handleDisableAtStart();
    handleTherapySection();
    handleEmergencySection();
    handleNeuroSection();
    handleCardiovascularSection();
    handleRespiratorySection();
    handleGastrointestinalSection();
    handleGenitourinarySection();
    handleMusculoskeletonSection();
    handleSkinSection();
    handleEndocrineSection();
    handleVascularSection();
    handlePainComfortSection();
    handleAccess_Device_Care_Section();
    handleLaboratory();
    handletherapyadherence();
    handlePATIENT_EDUCATION_PROVIDED();
    handlePreMedicationAdministeredSection();
    handlePatientUnableToSignIn();
    handlePostMedicationAdministeredSection();


    //set visit date to current date
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    document.getElementById('visit_date').value = formattedDate;

    if (savedSignature) {
        commonFormOpeation.setSignatureFromSave('patient_sign', savedSignature);
        commonFormOpeation.setSignatureFromSave('nurse_sign', savedSignature);
    }
    setSignatureDatas('patient_sign');
    setSignatureDatas('nurse_sign');

    setupSignatureCanvas('patient_sign', 'clearButton_patient', 'patient_sign_validation');
    setupSignatureCanvas('nurse_sign', 'clearButton_nurse', 'nurse_sign_validation');

    if (savedFormData) {
        commonFormOpeation.setFormDataFromSave(getQuestionToIdMap(), getAnswerToIdMap(), JSON.parse(savedFormData));
    }

    document.getElementById("saveBtn").addEventListener('click', async () => {
        const hasError = validateFormData();
        if (!hasError) {
            const formDataMap = commonFormOpeation.getFormDataToSave(getQuestionToIdMap(), getAnswerToIdMap());
            window.localStorage.setItem(formResponseId, JSON.stringify(formDataMap));
            // const signatureURLData = commonFormOpeation.getSignatureDataToSave('patient_sign');
            // const signatureURLData2 = commonFormOpeation.getSignatureDataToSave('nurse_sign');
            // window.localStorage.setItem(`${formResponseId}-sig`, signatureURLData);
            // window.localStorage.setItem(`${formResponseId}-sig2`, signatureURLData2);
            saveSignatureDatas('patient_sign');
            saveSignatureDatas('nurse_sign');
            // commonFormOpeation.showModalPopup('exampleModal', true);

        }
    });



});

const setupSignatureCanvas = (canvasId, clearButtonId, validationId) => {
    const canvas = document.getElementById(canvasId);
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

    function stopDrawing(e) {
        isDrawing = false;
        if (e.type.startsWith('touch')) {
            enableScrolling();
        }
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


    canvas.addEventListener('mouseup', () => {
        isDrawing = false;
        enableScrolling();
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


const getQuestionToIdMap = () => {
    const idToQueMap = {
        "fname": "18d108fb-8b37-ef11-8409-000d3a5d2bf5",
        "lname": "c8e39aab-1439-ef11-8409-000d3a5d2bf5",
        "dob": "9fb604f6-8b37-ef11-8409-000d3a5a3fab",
        "mrn": "5e8d99bc-1439-ef11-8409-000d3a3b9a57",
        "visit_date": "6056caf7-8b37-ef11-8409-000d3a3b9a57",
        "time_in": "6f99f183-8a37-ef11-8409-000d3a3b9a57",
        "time_out": "d126e25c-8c37-ef11-8409-000d3a5a3fab",
        "total_time": "4feda78b-8a37-ef11-8409-6045bd04aa22",
        "schedule_type": "4de99647-1839-ef11-8409-000d3a5d2bf5",
        "has_the_patient_side_effect": "43a0ad0a-8c37-ef11-8409-000d3a3b9a57",
        "emergency_department_visit": "0caebd7d-8a37-ef11-8409-000d3a3b9a57",
        "was_the_patient_hospitialized": "6299f183-8a37-ef11-8409-000d3a3b9a57",
        "patient_serious_infections": "38711b19-8c37-ef11-8409-000d3a5d2bf5",

        "sideEffectDetails": "05225e0a-8c37-ef11-8409-000d3a5a3fab",

        "infusion_date": "f6dd84fc-8b37-ef11-8409-000d3a5a3fab",
        "reason_for_visit_emergency": "f9dd84fc-8b37-ef11-8409-000d3a5a3fab",
        "additional_comments_emergency": "fadd84fc-8b37-ef11-8409-000d3a5a3fab",
        "hospitalised_date": "f8dd84fc-8b37-ef11-8409-000d3a5a3fab",
        "discharged_date": "db8d4afe-8b37-ef11-8409-000d3a3b9a57",
        "reason_for_hospitalisation": "89b7f0ff-8b37-ef11-8409-6045bd04aa22",
        "additional_comments_hospitalisation": "d88d4afe-8b37-ef11-8409-000d3a3b9a57",
        "explanation_comment": "597b0301-8c37-ef11-8409-000d3a5d2bf5",


        "therapy": "ad8fbed0-8837-ef11-8409-000d3a3b9a57",
        "visibleOtherTextBox_therapy_other": "545d2c3d-8c37-ef11-8409-6045bd04aa22",
        "therapy_delivery_method": "155abed6-8837-ef11-8409-000d3a3b9a57",
        "visibleOtherTextBox_delivery": "edcd8a49-8c37-ef11-8409-6045bd04aa22",
        "reason_for_visit": "c1fef7d0-8837-ef11-8409-6045bd04aa22",
        "visibleOtherTextBox_visit_other": "578f7d3b-8c37-ef11-8409-000d3a3b9a57",
        "pump_type": "00dd70dd-8837-ef11-8409-000d3a3b9a57",
        "visibleOtherTextBox_pump_type": "be383249-8c37-ef11-8409-000d3a5d2bf5",
        "bp1": "225e2ed7-8837-ef11-8409-6045bd04aa22",
        "bp2": "96406f87-1739-ef11-8409-000d3a5a3fab",
        "pulse": "295e2ed7-8837-ef11-8409-6045bd04aa22",
        "rr": "125abed6-8837-ef11-8409-000d3a3b9a57",
        "temp": "135abed6-8837-ef11-8409-000d3a3b9a57",
        "weight": "145abed6-8837-ef11-8409-000d3a3b9a57",
        "Medication_Profile": "5b0ed468-8a37-ef11-8409-000d3a5a3fab",
        "neuro_Psych": "1aea08db-8837-ef11-8409-000d3a5d2bf5",
        "neurology_Psychosocial_Abnormalities": "6b834add-8837-ef11-8409-6045bd04aa22",
        "neuro_Psych_otherInputField": "595d2c3d-8c37-ef11-8409-6045bd04aa22",
        "neuro_Psych_tingling_InputField": "2e8c122c-1c39-ef11-8409-000d3a3b9a57",
        "neuro_Psych_burning_InputField": "cd383249-8c37-ef11-8409-000d3a5d2bf5",
        "neuro_Psych_headache_InputField": "d1383249-8c37-ef11-8409-000d3a5d2bf5",
        "neuro_Psych_foot_Drop_Left_InputField": "9eb7ab4f-8c37-ef11-8409-6045bd04aa22",
        "neuro_Psych_foot_Drop_Right_InputField": "ed0b344f-8c37-ef11-8409-00224806dfec",
        "neuro_Psych_tremor_InputField": "5bf04b4c-8c37-ef11-8409-000d3a5a3fab",
        "neuro_Psych_Numbness_InputField": "1cc90f4e-8c37-ef11-8409-000d3a3b9a57",
 
        "cardiovascular": "9617d9df-8837-ef11-8409-000d3a5a3fab",
        "cardiovascular_Abnormalities": "d16d4ce3-8837-ef11-8409-6045bd04aa22",
        "cardiovascular_otherInputField": "5d5d2c3d-8c37-ef11-8409-6045bd04aa22",
        "edema_Radiobuttons": "00e1bf02-8c37-ef11-8409-000d3a5a3fab",
        "cardiovascular_edemaInputField": "b5db8004-8c37-ef11-8409-000d3a3b9a57",
        "cardiovascular_Peripheral_PulsesInputField": "b7db8004-8c37-ef11-8409-000d3a3b9a57",
        "cardiovascular_extremities_Not_Equal_In_Color_Temprature_SensationInputField": "badb8004-8c37-ef11-8409-000d3a3b9a57",
 
        "respiratory": "34403ae6-8837-ef11-8409-000d3a5a3fab",
        "respiratory_Abnormalities": "36403ae6-8837-ef11-8409-000d3a5a3fab",
        "adventious_Lung_Sounds_radiobuttons": "08e1bf02-8c37-ef11-8409-000d3a5a3fab",
        "respiratory_otherInputField": "0b303e3d-8c37-ef11-8409-000d3a5d2bf5",
        "adventious_Lung_Sounds_OtherInputField": "0e93993d-8c37-ef11-8409-000d3a5a3fab",
        "cough_radiobuttons": "0ce1bf02-8c37-ef11-8409-000d3a5a3fab",
        "respiratory_use_of_Supplemetal_OxygenInputField": "0be1bf02-8c37-ef11-8409-000d3a5a3fab",
        "cough_OtherInputField": "16303e3d-8c37-ef11-8409-000d3a5d2bf5",
 
 
        "gastrointestinal": "8aae73ea-8837-ef11-8409-000d3a3b9a57",
        "gastrointestinal_Abnormalities": "b57f55e9-8837-ef11-8409-6045bd04aa22",
        "gastrointestinal_otherInputField": "735d2c3d-8c37-ef11-8409-6045bd04aa22",
 
        "genitourinary": "151c3bee-8837-ef11-8409-000d3a5d2bf5",
        "genitourinary_Abnormalities": "952d9aef-8837-ef11-8409-6045bd04aa22",
        "genitourinary_otherInputField": "1393993d-8c37-ef11-8409-000d3a5a3fab",
 
        "musculoskeleton": "a1e3adf2-8837-ef11-8409-000d3a5a3fab",
        "musculoskeleton_Abnormalities": "a4e3adf2-8837-ef11-8409-000d3a5a3fab",
        "Ambulatory_assist_device_OtherInputField": "1d93993d-8c37-ef11-8409-000d3a5a3fab",
        "Ambulatory_assist_device_radiobuttons": "967beb05-8c37-ef11-8409-6045bd04aa22",
        "musculoskeleton_otherInputField": "1a93993d-8c37-ef11-8409-000d3a5a3fab",
 
        "skin": "8cffe9a6-8937-ef11-8409-000d3a3b9a57",
        "skin_Abnormalities": "8fffe9a6-8937-ef11-8409-000d3a3b9a57",
        // "Medication": "Medication",
        "skin_otherInputField": "1f93993d-8c37-ef11-8409-000d3a5a3fab",
        "skin_DiscolorationInputField": "25a0ad0a-8c37-ef11-8409-000d3a3b9a57",
        "skin_BreakdownInputField": "f4870007-8c37-ef11-8409-000d3a5d2bf5",
        "incision_DescriptionInputField": "2ba0ad0a-8c37-ef11-8409-000d3a3b9a57",
        "incision_LocationInputField": "f7870007-8c37-ef11-8409-000d3a5d2bf5",
 
        // div ids are not included in mapping
        // "pain_Experienced_radioButton": "pain_Experienced_radioButton",  //div ids
        // "pain_Currently_Present_radioButton": "pain_Currently_Present_radioButton",  //div ids
        // "pain_Currently_Present_Adult_Form": "pain_Currently_Present_Adult_Form",  //div ids
        // "pain_Currently_Present_Pediatric_Form": "pain_Currently_Present_Pediatric_Form", //div ids
        // "pain_Experienced_Adult_Form": "pain_Experienced_Adult_Form",  //div ids
        // "pain_Experienced_Pediatric_Form": "pain_Experienced_Pediatric_Form",  //div ids

        "pain_Comfort_Checkbox": "a08eefa7-8937-ef11-8409-000d3a5a3fab",
        "pain_Currently_Present_Pediatric_facesLocation": "f7382f18-8c37-ef11-8409-6045bd04aa22",
        "pain_Currently_Present_option": "6d65ed0b-8c37-ef11-8409-6045bd04aa22",
 
        "pain_Currently_Present_Adult_Painlocation": "3138e8ab-8937-ef11-8409-000d3a5d2bf5",
        "pain_Currently_Present_Adult_ReliefMeasure": "6f4a3bad-8937-ef11-8409-000d3a3b9a57",
        "pain_Currently_Present_Adult_Precipitatingfactors": "3438e8ab-8937-ef11-8409-000d3a5d2bf5",
        "pain_Currently_Present_Adult_Qualitydescription": "4a413763-8a37-ef11-8409-000d3a3b9a57",
        "pain_Currently_Present_Adult_Radiates": "4c413763-8a37-ef11-8409-000d3a3b9a57",
        "pain_Currently_Present_Adult_TimingOnset": "4603a361-8a37-ef11-8409-000d3a5d2bf5",
        "pain_Currently_Present_Adult_TimingFrequency": "1fbac917-8c37-ef11-8409-000d3a5a3fab",
        "pain_Currently_Present_Adult_TimingDuration": "6cef141d-8c37-ef11-8409-000d3a3b9a57",
        "pain_Experienced_Adult_Severity": "78793260-8a37-ef11-8409-6045bd04aa22",
        "pain_Experienced": "02880007-8c37-ef11-8409-000d3a5d2bf5",
        "pain_Currently_Present": "6d65ed0b-8c37-ef11-8409-6045bd04aa22",
 
        "pain_Experienced_Adult_Painlocation": "e328e811-8c37-ef11-8409-6045bd04aa22",
        "pain_Experienced_Adult_ReliefMeasure": "df9ef410-8c37-ef11-8409-000d3a3b9a57",
        "pain_Experienced_Adult_Precipitatingfactors": "ea28e811-8c37-ef11-8409-6045bd04aa22",
        "pain_Experienced_Adult_Qualitydescription": "71574e11-8c37-ef11-8409-000d3a5a3fab",
        "pain_Experienced_Adult_Radiates": "ecc62013-8c37-ef11-8409-000d3a5d2bf5",
        "pain_Experienced_Adult_TimingOnset": "f0c62013-8c37-ef11-8409-000d3a5d2bf5",
        "pain_Experienced_Adult_TimingFrequency": "78711b19-8c37-ef11-8409-000d3a5d2bf5",
        "pain_Experienced_Adult_TimingDuration": "16392f18-8c37-ef11-8409-6045bd04aa22",
        "pain_Currently_Present_Adult_Severity": "f3c62013-8c37-ef11-8409-000d3a5d2bf5",
 
        "pain_Experienced_Pediatric_facesLocation": "1129e811-8c37-ef11-8409-6045bd04aa22",
 
 
        "pain_Currently_Present_Pediatric_Painlocation": "3138e8ab-8937-ef11-8409-000d3a5d2bf5",
        "pain_Experienced_Pediatric_Painlocation": "e328e811-8c37-ef11-8409-6045bd04aa22",
 
 
        "endocrine": "57413763-8a37-ef11-8409-000d3a3b9a57",
        "last_glucose_level": "4023755c-7d39-ef11-8409-000d3a3b9a57",
        "last_glucose_date": "7f01a262-7d39-ef11-8409-000d3a3b9a57",
 
        "vascular_access_site": "669c1b6a-8a37-ef11-8409-000d3a3b9a57",
        "vascular_access_site_other_textBox": "2093993d-8c37-ef11-8409-000d3a5a3fab",
        "vascular_sutures_textBox": "61711b19-8c37-ef11-8409-000d3a5d2bf5",
        "vascular_newIv_access_device_textBox": "259a3737-8c37-ef11-8409-000d3a5d2bf5",
 
        "flushes": "d6ef4529-8c37-ef11-8409-000d3a3b9a57",
        "saline_pre_textBox": "bbeeb82a-8c37-ef11-8409-6045bd04aa22",
        "saline_post_textBox": "fb04432f-8c37-ef11-8409-000d3a3b9a57",
        "heparin_pre_textBox": "ee8d3a31-8c37-ef11-8409-000d3a5d2bf5",
        "heparin_post_textBox": "6575f630-8c37-ef11-8409-6045bd04aa22",
 
        // access device care options
        "access_Device_Care_Option": "8464e86f-8a37-ef11-8409-000d3a5a3fab",
        "access_Device_Care_InputField_Length": "5883e172-8a37-ef11-8409-6045bd04aa22",
        "access_Device_Care_InputField_Gauge": "5c83e172-8a37-ef11-8409-6045bd04aa22",
        "access_Device_Care_InputField_Gauge_Fr": "f8d94c6b-8c37-ef11-8409-000d3a5a3fab",
        "access_Device_Care_InputField_Line_Brand": "545eaf6e-8a37-ef11-8409-000d3a5d2bf5",
        "access_Device_Care_InputField_Access_Location": "8764e86f-8a37-ef11-8409-000d3a5a3fab",
        "access_Device_Care_InputField_Internal_Length": "fb866e70-8a37-ef11-8409-000d3a3b9a57",
        "access_Device_Care_InputField_No_of_lumens": "347be575-8a37-ef11-8409-000d3a5a3fab",
        "access_Device_Care_Option_Tunneled": "6783e172-8a37-ef11-8409-6045bd04aa22",
        "access_Device_Care_InputField_Exact_Cath_Measurement": "049cde74-8a37-ef11-8409-000d3a5d2bf5",
        "access_Device_Care_InputField_Arm_circ_above_site": "307be575-8a37-ef11-8409-000d3a5a3fab",
        "access_Device_Care_InputField_Insert_date": "50d108fb-8b37-ef11-8409-000d3a5d2bf5",
        "access_Device_Care_InputField_Inserted_By": "a016f416-8c37-ef11-8409-000d3a3b9a57",
        "sterile_site_care": "6f940979-8a37-ef11-8409-6045bd04aa22",
        "sterile_site_care_otherInputField": "00069c41-8c37-ef11-8409-000d3a3b9a57",
        "sterile_site_car_Access_Insertion_AttemptsInputField": "6675f630-8c37-ef11-8409-6045bd04aa22",
        "labs_Drawn": "c543107f-8a37-ef11-8409-6045bd04aa22",
        "location_of_Labs_Drawn": "8cc2f42f-8c37-ef11-8409-000d3a5a3fab",
        "processing_Lab": "7475f630-8c37-ef11-8409-6045bd04aa22",
        "processing_Lab_OthersInputField": "ea7ad947-8c37-ef11-8409-000d3a3b9a57",
        "processing_Lab_ListLabsDrawnInputField": "d2a57c7d-8a37-ef11-8409-000d3a5a3fab",
        "processing_Lab_NumberofAttemptsInputField": "14056b35-8c37-ef11-8409-000d3a3b9a57",
        "therapy_interruption_SchoolMissedInputField": "d9dd4185-8a37-ef11-8409-6045bd04aa22",
        "therapy_interruption_YesInputField": "07392f18-8c37-ef11-8409-6045bd04aa22",
        "therapy_interruption": "6ec64881-8a37-ef11-8409-000d3a5d2bf5",
 
        // patient education provided
        "patient_Education_Provided_Insert_date": "3abb9df9-8b37-ef11-8409-6045bd04aa22",
        "patient_Education_Provided_MEdicationmanagementEducation": "d69ef410-8c37-ef11-8409-000d3a3b9a57",
        "patient_Education_Provided_Inputtextfield": "04069c41-8c37-ef11-8409-000d3a3b9a57",
        "patient_Education_Provided": "10b7e93c-8b37-ef11-8409-6045bd04aa22",
 
 
        // PreMedication
        "premedications_administered": "17392f18-8c37-ef11-8409-6045bd04aa22",
        "premedications_administered_other_textBox": "23c90f4e-8c37-ef11-8409-000d3a3b9a57",
 
        "premedication_1": "75c04d1e-8c37-ef11-8409-6045bd04aa22",
        "time_administered_1": "7eb78e55-8c37-ef11-8409-000d3a5d2bf5",
        "time_administered_completed_1": "2e9a3737-8c37-ef11-8409-000d3a5d2bf5",
        "premedications_administered_by": "d6f22d1f-8c37-ef11-8409-000d3a5d2bf5",
        "premedication_please_specify_textBox": "c47ad947-8c37-ef11-8409-000d3a3b9a57",
        "addAdditional_parent": "d0ef4529-8c37-ef11-8409-000d3a3b9a57",
 
        "premedication_2": "def22d1f-8c37-ef11-8409-000d3a5d2bf5",
        "time_administered_2": "time_administered_2",
        "time_administered_completed_2": "4a8f7d3b-8c37-ef11-8409-000d3a3b9a57",
        "premedications_administered_by_2": "e2f22d1f-8c37-ef11-8409-000d3a5d2bf5",
        "premedication_please_specify_textBox_2": "65101445-8c37-ef11-8409-000d3a5a3fab",
        "addAdditional_parent_2": "c488d967-8c37-ef11-8409-6045bd04aa22",
 
        "premedication_3": "24041223-8c37-ef11-8409-000d3a3b9a57",
        "time_administered_3": "a2c04d1e-8c37-ef11-8409-6045bd04aa22",
        "time_administered_completed_3": "25fc3337-8c37-ef11-8409-6045bd04aa22",
        "premedications_administered_by_3": "30041223-8c37-ef11-8409-000d3a3b9a57",
        "premedication_please_specify_textBox_3": "e3cd8a49-8c37-ef11-8409-6045bd04aa22",
        "addAdditional_parent_3": "5d1c2366-8c37-ef11-8409-000d3a3b9a57",
 
        "premedication_4": "f6113e25-8c37-ef11-8409-000d3a5d2bf5",
        "time_administered_4": "2bbcbf24-8c37-ef11-8409-6045bd04aa22",
        "time_administered_completed_4": "28fc3337-8c37-ef11-8409-6045bd04aa22",
        "premedications_administered_by_4": "fc113e25-8c37-ef11-8409-000d3a5d2bf5",
        "premedication_please_specify_textBox_4": "b6383249-8c37-ef11-8409-000d3a5d2bf5",
        "addAdditional_parent_4": "1489d967-8c37-ef11-8409-6045bd04aa22",
 
        "premedication_5": "00123e25-8c37-ef11-8409-000d3a5d2bf5",
        "time_administered_5": "380d4128-8c37-ef11-8409-000d3a5a3fab",
        "time_administered_completed_5": "349a3737-8c37-ef11-8409-000d3a5d2bf5",
        "premedications_administered_by_5": "41bcbf24-8c37-ef11-8409-6045bd04aa22",
        "premedication_please_specify_textBox_5": "69101445-8c37-ef11-8409-000d3a5a3fab",
 
 
 
        "medication1": "cd26e25c-8c37-ef11-8409-000d3a5a3fab",
        "medication1_dosage": "ce26e25c-8c37-ef11-8409-000d3a5a3fab",
        "medication1_startTime": "00b7e93c-8b37-ef11-8409-6045bd04aa22",
        "medication1_endTime": "0db7e93c-8b37-ef11-8409-6045bd04aa22",
        "medication2": "afeebe8c-8a37-ef11-8409-000d3a3b9a57",
        "medication2_dosage": "0ab7e93c-8b37-ef11-8409-6045bd04aa22",
        "medication2_startTime": "25056b35-8c37-ef11-8409-000d3a3b9a57",
        "medication2_endTime": "2b9a3737-8c37-ef11-8409-000d3a5d2bf5",
        "medication3": "5ba52360-8c37-ef11-8409-000d3a3b9a57",
        "medication3_dosage": "e4108663-8c37-ef11-8409-000d3a5a3fab",
        "medication3_startTime": "f28ac461-8c37-ef11-8409-6045bd04aa22",
        "medication3_endTime": "018bc461-8c37-ef11-8409-6045bd04aa22",
 
 
        //PostMedication
        "postmedications_administered": "1cb8ab4f-8c37-ef11-8409-6045bd04aa22",
        "postmedications_administered_other_textBox": "3d1db661-8c37-ef11-8409-000d3a5d2bf5",
 
        "postmedication_1": "b7c9b455-8c37-ef11-8409-6045bd04aa22",
        "post_time_administered_1": "bcc9b455-8c37-ef11-8409-6045bd04aa22",
        "post_time_administered_completed_1": "348bc461-8c37-ef11-8409-6045bd04aa22",
        "postmedications_administered_by": "3ac3df54-8c37-ef11-8409-000d3a5a3fab",
        "postmedication_please_specify_textBox": "068bc461-8c37-ef11-8409-6045bd04aa22",
        "postaddAdditional_parent": "641c2366-8c37-ef11-8409-000d3a3b9a57",
 
        "postmedication_2": "c47b0a54-8c37-ef11-8409-000d3a3b9a57",
        "post_time_administered_2": "269a3737-8c37-ef11-8409-000d3a5d2bf5",
        "post_time_administered_completed_2": "e6108663-8c37-ef11-8409-000d3a5a3fab",
        "postmedications_administered_by_2": "82b78e55-8c37-ef11-8409-000d3a5d2bf5",
        "postmedication_please_specify_textBox_2": "62a52360-8c37-ef11-8409-000d3a3b9a57",
        "postaddAdditional_parent_2": "f7d94c6b-8c37-ef11-8409-000d3a5a3fab",
 
        "postmedication_3": "ce7b0a54-8c37-ef11-8409-000d3a3b9a57",
        "post_time_administered_3": "d17b0a54-8c37-ef11-8409-000d3a3b9a57",
        "post_time_administered_completed_3": "4d1c2366-8c37-ef11-8409-000d3a3b9a57",
        "postmedications_administered_by_3": "5a550c5a-8c37-ef11-8409-000d3a3b9a57",
        "postmedication_please_specify_textBox_3": "64a52360-8c37-ef11-8409-000d3a3b9a57",
        "postaddAdditional_parent_3": "0aaf1968-8c37-ef11-8409-000d3a5d2bf5",
 
        "postmedication_4": "2873bb5b-8c37-ef11-8409-000d3a5d2bf5",
        "post_time_administered_4": "ca26e25c-8c37-ef11-8409-000d3a5a3fab",
        "post_time_administered_completed_4": "e7108663-8c37-ef11-8409-000d3a5a3fab",
        "postmedications_administered_by_4": "6b550c5a-8c37-ef11-8409-000d3a3b9a57",
        "postmedication_please_specify_textBox_4": "3b1c2366-8c37-ef11-8409-000d3a3b9a57",
        "postaddAdditional_parent_4": "0baf1968-8c37-ef11-8409-000d3a5d2bf5",
 
        "postmedication_5": "5fdbbd5b-8c37-ef11-8409-6045bd04aa22",
        "post_time_administered_5": "72550c5a-8c37-ef11-8409-000d3a3b9a57",
        "post_time_administered_completed_5": "e8108663-8c37-ef11-8409-000d3a5a3fab",
        "postmedications_administered_by_5": "76550c5a-8c37-ef11-8409-000d3a3b9a57",
        "postmedication_please_specify_textBox_5": "288bc461-8c37-ef11-8409-6045bd04aa22",

 
    
        // last section
        "comments_notes": "f3dd84fc-8b37-ef11-8409-000d3a5a3fab",
        "nurse_credentials": "39dae0f4-8b37-ef11-8409-000d3a5d2bf5",
        "nurse_fname": "f5dd84fc-8b37-ef11-8409-000d3a5a3fab",
        "nurse_lname": "c5633548-1a39-ef11-8409-000d3a5d2bf5",
        "nurse_date": "08392f18-8c37-ef11-8409-6045bd04aa22",
        "pateint_unable": "759011fe-1e39-ef11-8409-000d3a5a3fab",
        "why_patient_cannot_sign": "14af1968-8c37-ef11-8409-000d3a5d2bf5",
        "nurse_sign": "6ed108fb-8b37-ef11-8409-000d3a5d2bf5",
        "patient_sign": "5756caf7-8b37-ef11-8409-000d3a3b9a57",
 
    };
    return idToQueMap;
};

const getAnswerToIdMap = () => {
    const idToAnsMap = {
        "unscheduled_type_Patient": "28c7cc49-1839-ef11-8409-000d3a3b9a57",
        "scheduled_type_Patient": "8a46454a-1839-ef11-8409-000d3a5a3fab",
        "has_the_patient_side_effect_yes": "44a0ad0a-8c37-ef11-8409-000d3a3b9a57",
        "has_the_patient_side_effect_no": "03225e0a-8c37-ef11-8409-000d3a5a3fab",
        "emergency_department_visit_yes": "7e32c183-8a37-ef11-8409-000d3a5a3fab",
        "emergency_department_visit_no": "6099f183-8a37-ef11-8409-000d3a3b9a57",
        "was_the_patient_hospitialized_yes": "6399f183-8a37-ef11-8409-000d3a3b9a57",
        "was_the_patient_hospitialized_no": "6ac64881-8a37-ef11-8409-000d3a5d2bf5",
        "patient_serious_infections_yes": "9416f416-8c37-ef11-8409-000d3a3b9a57",
        "patient_serious_infections_no": "1ebac917-8c37-ef11-8409-000d3a5a3fab",

        "emergency_visit_yes_rash": "08225e0a-8c37-ef11-8409-000d3a5a3fab",
        "emergency_visit_yes_headache": "55931c0d-8c37-ef11-8409-000d3a5d2bf5",
        "emergency_visit_yes_nausea": "8665ed0b-8c37-ef11-8409-6045bd04aa22",
        "emergency_visit_yes_difficulty_swallowing": "59931c0d-8c37-ef11-8409-000d3a5d2bf5",
        "emergency_visit_yes_difficulty_breathing": "8a65ed0b-8c37-ef11-8409-6045bd04aa22",
        "emergency_visit_yes_flushing": "9165ed0b-8c37-ef11-8409-6045bd04aa22",
        "emergency_visit_yes_chills": "d39ef410-8c37-ef11-8409-000d3a3b9a57",
        "emergency_visit_yes_myalgia": "9365ed0b-8c37-ef11-8409-6045bd04aa22",
        "emergency_visit_yes_emergency_other": "6f574e11-8c37-ef11-8409-000d3a5a3fab",

        "antiboitics": "40d86ed3-8837-ef11-8409-000d3a5a3fab",
        "steriods": "db8fbed0-8837-ef11-8409-000d3a3b9a57",
        "therapy_other": "7cd86ed3-8837-ef11-8409-000d3a5a3fab",
        "total_parenteral_nutrition": "b6fef7d0-8837-ef11-8409-6045bd04aa22",
        "intravenous_immunoglobulin": "0d27b2d3-8837-ef11-8409-000d3a5d2bf5",
        "subcutaneous_immunoglobulin": "7dd86ed3-8837-ef11-8409-000d3a5a3fab",
        "gravity": "56c896d9-8837-ef11-8409-000d3a5a3fab",
        "pump": "57c896d9-8837-ef11-8409-000d3a5a3fab",
        "dial_flow": "51834add-8837-ef11-8409-6045bd04aa22",
        "home_pump": "fddc70dd-8837-ef11-8409-000d3a3b9a57",
        "iv_push": "10ea08db-8837-ef11-8409-000d3a5d2bf5",
        "therapy_delivery_other": "11ea08db-8837-ef11-8409-000d3a5d2bf5",
        "instruction": "c059bed6-8837-ef11-8409-000d3a3b9a57",
        "line_care": "9ad86ed3-8837-ef11-8409-000d3a5a3fab",
        "line_draw": "125e2ed7-8837-ef11-8409-6045bd04aa22",
        "port_access": "155e2ed7-8837-ef11-8409-6045bd04aa22",
        "assessment": "1327b2d3-8837-ef11-8409-000d3a5d2bf5",
        "medication_admin": "185e2ed7-8837-ef11-8409-6045bd04aa22",
        "re_start": "b1d86ed3-8837-ef11-8409-000d3a5a3fab",
        "visit_other": "1927b2d3-8837-ef11-8409-000d3a5d2bf5",
        "freedom": "01dd70dd-8837-ef11-8409-000d3a3b9a57",
        "curlin": "02dd70dd-8837-ef11-8409-000d3a3b9a57",
        "pump_type_other": "19ea08db-8837-ef11-8409-000d3a5d2bf5",
        "medication_changes_yes": "649c1b6a-8a37-ef11-8409-000d3a3b9a57",
        "medication_changes_no": "5d0ed468-8a37-ef11-8409-000d3a5a3fab",
 
        "neuro_Psych_yes": "645a5be2-9137-ef11-8409-000d3a5d2bf5",
        "neuro_Psych_no": "8f17d9df-8837-ef11-8409-000d3a5a3fab",
        "lethargic": "9f7708e1-8837-ef11-8409-000d3a5d2bf5",
        "restlessness": "6e834add-8837-ef11-8409-6045bd04aa22",
        "memory_Loss": "a07708e1-8837-ef11-8409-000d3a5d2bf5",
        "sluggish": "05dd70dd-8837-ef11-8409-000d3a3b9a57",
        "confusion": "9117d9df-8837-ef11-8409-000d3a5a3fab",
        "numbness": "a17708e1-8837-ef11-8409-000d3a5d2bf5",
        "difficulty_Concentrating": "a37708e1-8837-ef11-8409-000d3a5d2bf5",
        "anxious": "a47708e1-8837-ef11-8409-000d3a5d2bf5",
        "tingling": "06dd70dd-8837-ef11-8409-000d3a3b9a57",
        "depressed_Hopeless": "a57708e1-8837-ef11-8409-000d3a5d2bf5",
        "burning": "9517d9df-8837-ef11-8409-000d3a5a3fab",
        "tremor": "bb6d4ce3-8837-ef11-8409-6045bd04aa22",
        "headache": "bd6d4ce3-8837-ef11-8409-6045bd04aa22",
        "foot_Drop_Left": "523936e4-8837-ef11-8409-000d3a3b9a57",
        "foot_Drop_Right": "a87708e1-8837-ef11-8409-000d3a5d2bf5",
        "neuro_Psych_Other": "ba6d4ce3-8837-ef11-8409-6045bd04aa22",
 
        "cardiovascular_yes": "77691745-9237-ef11-8409-000d3a3b9a57",
        "cardiovascular_no": "cf6d4ce3-8837-ef11-8409-6045bd04aa22",
        "irregular_Heart_rate": "5e3936e4-8837-ef11-8409-000d3a3b9a57",
        "edema": "30403ae6-8837-ef11-8409-000d3a5a3fab",
        "peripheral_Pulse_Not_Palpable": "d86d4ce3-8837-ef11-8409-6045bd04aa22",
        "extremities_Not_Equal_In_Color_Temprature_Sensation": "d96d4ce3-8837-ef11-8409-6045bd04aa22",
        "cardiovascular_Other": "32403ae6-8837-ef11-8409-000d3a5a3fab",
        "cardiovascular_edema_trace": "a0b7f0ff-8b37-ef11-8409-6045bd04aa22",
        "cardiovascular_edema_1": "677b0301-8c37-ef11-8409-000d3a5d2bf5",
        "cardiovascular_edema_2": "a5b7f0ff-8b37-ef11-8409-6045bd04aa22",
        "cardiovascular_edema_3": "01e1bf02-8c37-ef11-8409-000d3a5a3fab",
        "cardiovascular_edema_4": "04e1bf02-8c37-ef11-8409-000d3a5a3fab",
 
        "respiratory_yes": "1cc12fe8-8837-ef11-8409-000d3a5d2bf5",
        "respiratory_no": "6c3936e4-8837-ef11-8409-000d3a3b9a57",
        "adventious_Lung_Sounds": "9f7f55e9-8837-ef11-8409-6045bd04aa22",
        "short_of_Breath_at_Rest": "6e3936e4-8837-ef11-8409-000d3a3b9a57",
        "short_of_Breath_at_Exertion": "23c12fe8-8837-ef11-8409-000d3a5d2bf5",
        "use_of_Supplemetal_Oxygen": "6f3936e4-8837-ef11-8409-000d3a3b9a57",
        "cough": "a57f55e9-8837-ef11-8409-6045bd04aa22",
        "respiratory_Other": "89ae73ea-8837-ef11-8409-000d3a3b9a57",
        "adventious_Lung_Sounds_Crackles": "bbdb8004-8c37-ef11-8409-000d3a3b9a57",
        "adventious_Lung_Sounds_Wheezes": "09e1bf02-8c37-ef11-8409-000d3a5a3fab",
        "adventious_Lung_Sounds_Diminished": "0ae1bf02-8c37-ef11-8409-000d3a5a3fab",
        "adventious_Lung_Sounds_Other": "857beb05-8c37-ef11-8409-6045bd04aa22",
        "cough_Dry": "0de1bf02-8c37-ef11-8409-000d3a5a3fab",
        "cough_Productive": "8c7beb05-8c37-ef11-8409-6045bd04aa22",
        "cough_Persistent": "c7db8004-8c37-ef11-8409-000d3a3b9a57",
        "cough_Other": "c8db8004-8c37-ef11-8409-000d3a3b9a57",
 
 
        "gastrointestinal_yes": "2fcab49a-9237-ef11-8409-00224806dfec",
        "gastrointestinal_no": "3e403ae6-8837-ef11-8409-000d3a5a3fab",
        "incontinence": "b97f55e9-8837-ef11-8409-6045bd04aa22",
        "constipation": "35c12fe8-8837-ef11-8409-000d3a5d2bf5",
        "diarrhea": "01b7a9ec-8837-ef11-8409-000d3a5a3fab",
        "abdomen_Firm_to_Palpitation": "36c12fe8-8837-ef11-8409-000d3a5d2bf5",
        "poor_Appetite": "3ac12fe8-8837-ef11-8409-000d3a5d2bf5",
        "nausea": "99ae73ea-8837-ef11-8409-000d3a3b9a57",
        "fair_Appetite": "3cc12fe8-8837-ef11-8409-000d3a5d2bf5",
        "distended_Abdomen": "9dae73ea-8837-ef11-8409-000d3a3b9a57",
        "vomiting": "9eae73ea-8837-ef11-8409-000d3a3b9a57",
        "heartburn": "05b7a9ec-8837-ef11-8409-000d3a5a3fab",
        "gastrointestinal_Other": "06b7a9ec-8837-ef11-8409-000d3a5a3fab",
 
 
        "genitourinary_yes": "d77f55e9-8837-ef11-8409-6045bd04aa22",
        "genitourinary_no": "912d9aef-8837-ef11-8409-6045bd04aa22",
        "urinary_Frequency": "a7ae73ea-8837-ef11-8409-000d3a3b9a57",
        "urinary_Odor": "0ab7a9ec-8837-ef11-8409-000d3a5a3fab",
        "urgency": "0cb7a9ec-8837-ef11-8409-000d3a5a3fab",
        "hematuria": "154bb8f0-8837-ef11-8409-000d3a3b9a57",
        "dysuria": "164bb8f0-8837-ef11-8409-000d3a3b9a57",
        "cloudy": "174bb8f0-8837-ef11-8409-000d3a3b9a57",
        "genitourinary_incontinence": "0eb7a9ec-8837-ef11-8409-000d3a5a3fab",
        "nocturia": "184bb8f0-8837-ef11-8409-000d3a3b9a57",
        "oliguria": "0fb7a9ec-8837-ef11-8409-000d3a5a3fab",
        "genitourinary_Other": "a12d9aef-8837-ef11-8409-6045bd04aa22",
 
        "musculoskeleton_yes": "cff063c1-9237-ef11-8409-000d3a5d2bf5",
        "musculoskeleton_no": "1c4bb8f0-8837-ef11-8409-000d3a3b9a57",
        "unsteady_Gait": "84ffe9a6-8937-ef11-8409-000d3a3b9a57",
        "impaired_ROM": "85ffe9a6-8937-ef11-8409-000d3a3b9a57",
        "weakness": "eb7bc7a1-8937-ef11-8409-000d3a5a3fab",
        "required_Assistance_to_Ambulate": "87ffe9a6-8937-ef11-8409-000d3a3b9a57",
        "required_Assistance_to_Transfer_OOB_OOC": "40b51ea6-8937-ef11-8409-6045bd04aa22",
        "Ambulatory_assist_device": "41b51ea6-8937-ef11-8409-6045bd04aa22",
        "fall_Prevention_Education": "928eefa7-8937-ef11-8409-000d3a5a3fab",
        "musculoskeleton_Other": "938eefa7-8937-ef11-8409-000d3a5a3fab",
        "Ambulatory_assist_device_Walker": "9b7beb05-8c37-ef11-8409-6045bd04aa22",
        "Ambulatory_assist_device_Crutches": "9c7beb05-8c37-ef11-8409-6045bd04aa22",
        "Ambulatory_assist_device_Cane": "a07beb05-8c37-ef11-8409-6045bd04aa22",
        "Ambulatory_assist_device_WheelChair": "a47beb05-8c37-ef11-8409-6045bd04aa22",
        "Ambulatory_assist_device_Other": "f9215e0a-8c37-ef11-8409-000d3a5a3fab",
 
        "skin_yes": "7cbc1f20-9337-ef11-8409-000d3a5a3fab",
        "skin_no": "978eefa7-8937-ef11-8409-000d3a5a3fab",
        "dry_Skin": "9c8eefa7-8937-ef11-8409-000d3a5a3fab",
        "dry_Mucus_Membrane": "2038e8ab-8937-ef11-8409-000d3a5d2bf5",
        "skin_Discoloration": "9d8eefa7-8937-ef11-8409-000d3a5a3fab",
        "skin_Breakdown": "2138e8ab-8937-ef11-8409-000d3a5d2bf5",
        "incision": "2338e8ab-8937-ef11-8409-000d3a5d2bf5",
        "skin_Other": "9e8eefa7-8937-ef11-8409-000d3a5a3fab",
 
 
        "denise_Pain": "6d4a3bad-8937-ef11-8409-000d3a3b9a57",
        "pain_Currently_Present": "2938e8ab-8937-ef11-8409-000d3a5d2bf5",
        "Pain_Experienced_Since_Last_Visit": "2d38e8ab-8937-ef11-8409-000d3a5d2bf5",
        "pain_Currently_Present_Adult": "fd870007-8c37-ef11-8409-000d3a5d2bf5",
        "pain_Currently_Present_Pediatric": "30a0ad0a-8c37-ef11-8409-000d3a3b9a57",
        "pain_Experienced_Pediatric": "37a0ad0a-8c37-ef11-8409-000d3a3b9a57",
        "pain_Experienced_Adult": "06880007-8c37-ef11-8409-000d3a5d2bf5",
 
 
        "pain_Experienced_Adult_Severity1": "590e5b62-8a37-ef11-8409-000d3a5a3fab",
        "pain_Experienced_Adult_Severity2": "51413763-8a37-ef11-8409-000d3a3b9a57",
        "pain_Experienced_Adult_Severity3": "52413763-8a37-ef11-8409-000d3a3b9a57",
        "pain_Experienced_Adult_Severity4": "91013266-8a37-ef11-8409-6045bd04aa22",
        "pain_Experienced_Adult_Severity5": "93013266-8a37-ef11-8409-6045bd04aa22",
        "pain_Experienced_Adult_Severity6": "5a0e5b62-8a37-ef11-8409-000d3a5a3fab",
        "pain_Experienced_Adult_Severity7": "98013266-8a37-ef11-8409-6045bd04aa22",
        "pain_Experienced_Adult_Severity8": "5c0e5b62-8a37-ef11-8409-000d3a5a3fab",
        "pain_Experienced_Adult_Severity9": "5d0e5b62-8a37-ef11-8409-000d3a5a3fab",
        "pain_Experienced_Adult_Severity10": "5e0e5b62-8a37-ef11-8409-000d3a5a3fab",
        "pain_Experienced_Adult_Severity0": "580e5b62-8a37-ef11-8409-000d3a5a3fab",
 
        "pain_Currently_Present_Adult_Severity1": "ee9ef410-8c37-ef11-8409-000d3a3b9a57",
        "pain_Currently_Present_Adult_Severity2": "73574e11-8c37-ef11-8409-000d3a5a3fab",
        "pain_Currently_Present_Adult_Severity3": "0329e811-8c37-ef11-8409-6045bd04aa22",
        "pain_Currently_Present_Adult_Severity4": "f39ef410-8c37-ef11-8409-000d3a3b9a57",
        "pain_Currently_Present_Adult_Severity5": "0429e811-8c37-ef11-8409-6045bd04aa22",
        "pain_Currently_Present_Adult_Severity6": "f59ef410-8c37-ef11-8409-000d3a3b9a57",
        "pain_Currently_Present_Adult_Severity7": "0929e811-8c37-ef11-8409-6045bd04aa22",
        "pain_Currently_Present_Adult_Severity8": "0c29e811-8c37-ef11-8409-6045bd04aa22",
        "pain_Currently_Present_Adult_Severity9": "f89ef410-8c37-ef11-8409-000d3a3b9a57",
        "pain_Currently_Present_Adult_Severity10": "16c72013-8c37-ef11-8409-000d3a5d2bf5",
        "pain_Currently_Present_Adult_Severity0": "eb9ef410-8c37-ef11-8409-000d3a3b9a57",
 
        "pain_Currently_Present_Pediatric_facesLocation_0": "f9382f18-8c37-ef11-8409-6045bd04aa22",
        "pain_Currently_Present_Pediatric_facesLocation_2": "1dbac917-8c37-ef11-8409-000d3a5a3fab",
        "pain_Currently_Present_Pediatric_facesLocation_4": "8c16f416-8c37-ef11-8409-000d3a3b9a57",
        "pain_Currently_Present_Pediatric_facesLocation_6": "8d16f416-8c37-ef11-8409-000d3a3b9a57",
        "pain_Currently_Present_Pediatric_facesLocation_8": "27711b19-8c37-ef11-8409-000d3a5d2bf5",
        "pain_Currently_Present_Pediatric_facesLocation_10": "ff382f18-8c37-ef11-8409-6045bd04aa22",
 
        "pain_Experienced_Pediatric_facesLocation_0": "1bbac917-8c37-ef11-8409-000d3a5a3fab",
        "pain_Experienced_Pediatric_facesLocation_2": "37c72013-8c37-ef11-8409-000d3a5d2bf5",
        "pain_Experienced_Pediatric_facesLocation_4": "ef382f18-8c37-ef11-8409-6045bd04aa22",
        "pain_Experienced_Pediatric_facesLocation_6": "7716f416-8c37-ef11-8409-000d3a3b9a57",
        "pain_Experienced_Pediatric_facesLocation_8": "1cbac917-8c37-ef11-8409-000d3a5a3fab",
        "pain_Experienced_Pediatric_facesLocation_10": "7c16f416-8c37-ef11-8409-000d3a3b9a57",
 
 
 
 
        //Sourabh
        "endocrine_na": "a4013266-8a37-ef11-8409-6045bd04aa22",
        "endocrine_yes": "580ed468-8a37-ef11-8409-000d3a5a3fab",
        "endocrine_no": "590ed468-8a37-ef11-8409-000d3a5a3fab",
 
        "vascular_clean": "679c1b6a-8a37-ef11-8409-000d3a3b9a57",
        "vascular_dry": "689c1b6a-8a37-ef11-8409-000d3a3b9a57",
        "vascular_drainage": "5e0ed468-8a37-ef11-8409-000d3a5a3fab",
        "vascular_red": "7d85cc6c-8a37-ef11-8409-6045bd04aa22",
        "vascular_tender": "8085cc6c-8a37-ef11-8409-6045bd04aa22",
        "vascular_bruised": "3b5eaf6e-8a37-ef11-8409-000d3a5d2bf5",
        "vascular_infiltrated": "8685cc6c-8a37-ef11-8409-6045bd04aa22",
        "vascular_sutures": "8a85cc6c-8a37-ef11-8409-6045bd04aa22",
        "vascular_phlebitis": "6b9c1b6a-8a37-ef11-8409-000d3a3b9a57",
        "vascular_Dressing": "8c85cc6c-8a37-ef11-8409-6045bd04aa22",
        "vascular_positive_blood_return": "8f85cc6c-8a37-ef11-8409-6045bd04aa22-8a37-ef11-8409-000d3a5d2bf5",
        "vascular_patent": "8164e86f-8a37-ef11-8409-000d3a5a3fab",
        "vascular_cord_formation": "425eaf6e-8a37-ef11-8409-000d3a5d2bf5",
        "vascular_swelling": "f4866e70-8a37-ef11-8409-000d3a3b9a57",
        "vascular_occluded": "435eaf6e-8a37-ef11-8409-000d3a5d2bf5",
        "vascular_newIv_access_device": "9a85cc6c-8a37-ef11-8409-6045bd04aa22",
        "vascular_na": "8264e86f-8a37-ef11-8409-000d3a5a3fab",
        "vascular_access_site_other": "f5866e70-8a37-ef11-8409-000d3a3b9a57",
 
        "saline_flush": "f845422b-8c37-ef11-8409-000d3a5d2bf5",
        "heparin_flush": "0146422b-8c37-ef11-8409-000d3a5d2bf5",
 
        // Access Device acre options
        "access_Device_Care_Option_PIV": "4a5eaf6e-8a37-ef11-8409-000d3a5d2bf5",
        "access_Device_Care_Option_Port": "f6866e70-8a37-ef11-8409-000d3a3b9a57",
        "access_Device_Care_Option_PICC": "4a5eaf6e-8a37-ef11-8409-000d3a5d2bf5",
        "access_Device_Care_Option_Midline": "a685cc6c-8a37-ef11-8409-6045bd04aa22",
        "access_Device_Care_Option_SUBQ": "8564e86f-8a37-ef11-8409-000d3a5a3fab",
        "access_Device_Care_Option_Tunneled_Catheter": "5583e172-8a37-ef11-8409-6045bd04aa22",
        "access_Device_Care_Option_Yes":"8864e86f-8a37-ef11-8409-000d3a5a3fab",
        "access_Device_Care_Option_No":"8964e86f-8a37-ef11-8409-000d3a5a3fab",
        "access_Device_Care_Option_NA":"f7be575-8a37-ef11-8409-000d3a5a3fab",
        "sterile_site_care_Chlorhexidine":"cda57c7d-8a37-ef11-8409-000d3a5a3fab",
        "sterile_site_care_Alcohol": "73940979-8a37-ef11-8409-6045bd04aa22",
        "sterile_site_care_Betadine": "cea57c7d-8a37-ef11-8409-000d3a5a3fab",
        "sterile_site_care_Skin_Prep": "04aebd7d-8a37-ef11-8409-000d3a3b9a57",
        "sterile_site_care_Steri_Strips": "05aebd7d-8a37-ef11-8409-000d3a3b9a57",
        "sterile_site_care_Biopatch": "cfa57c7d-8a37-ef11-8409-000d3a5a3fab",
        "sterile_site_care_Securement_Device": "7b940979-8a37-ef11-8409-6045bd04aa22",
        "sterile_site_care_Tegaderm": "06aebd7d-8a37-ef11-8409-000d3a3b9a57",
        "sterile_site_care_IV_3000": "07aebd7d-8a37-ef11-8409-000d3a3b9a57",
        "sterile_site_care_Sorbaview": "b443107f-8a37-ef11-8409-6045bd04aa22",
        "sterile_site_care_Opsite": "c2f7e97a-8a37-ef11-8409-000d3a5d2bf5",
        "sterile_site_care_Gauze_Tape_Dressing": "d0a57c7d-8a37-ef11-8409-000d3a5a3fab",
        "sterile_site_care_Cap_Change": "c5f7e97a-8a37-ef11-8409-000d3a5d2bf5",
        "sterile_site_care_Extension_Tubing_Change": "08aebd7d-8a37-ef11-8409-000d3a3b9a57",
        "sterile_site_care_other": "c6f7e97a-8a37-ef11-8409-000d3a5d2bf5",
 
        "labs_Drawn_Yes": "5dc64881-8a37-ef11-8409-000d3a5d2bf5",
        "labs_Drawn_No": "d1a57c7d-8a37-ef11-8409-000d3a5a3fab",
        "location_of_Labs_Drawn_Peripheral_Site": "0c05432f-8c37-ef11-8409-000d3a3b9a57",
        "location_of_Labs_Drawn_Central_Line_Draw": "8dc2f42f-8c37-ef11-8409-000d3a5a3fab",
        "processing_Lab_Lab_Corp": "8ec2f42f-8c37-ef11-8409-000d3a5a3fab",
        "processing_Lab_Quest": "1a8e3a31-8c37-ef11-8409-000d3a5d2bf5",
        "processing_Lab_Others": "7a75f630-8c37-ef11-8409-6045bd04aa22",
 
 
        "therapy_interruption_Yes": "d1dd4185-8a37-ef11-8409-6045bd04aa22",
        "therapy_interruption_No": "6c99f183-8a37-ef11-8409-000d3a3b9a57",
        "therapy_interruption_NA": "6d99f183-8a37-ef11-8409-000d3a3b9a57",
 
 
        "patient_Education_Provided_Pain_Management": "aaa76643-8b37-ef11-8409-000d3a3b9a57",
        "patient_Education_Provided_Disease_Process": "a9a76643-8b37-ef11-8409-000d3a3b9a57",
        "patient_Education_Provided_Hydration": "68aa0641-8b37-ef11-8409-000d3a5a3fab",
        "patient_Education_Provided_Pump_Alarm_and_Troubleshooting": "24ef1843-8b37-ef11-8409-6045bd04aa22",
        "patient_Education_Provided_Aseptic_Technique": "a8a76643-8b37-ef11-8409-000d3a3b9a57",
        "patient_Education_Provided_Infection_Control": "59183643-8b37-ef11-8409-000d3a5d2bf5",
        "patient_Education_Provided_Bag_Change": "20ef1843-8b37-ef11-8409-6045bd04aa22",
        "patient_Education_Provided_PIV_removal": "aba76643-8b37-ef11-8409-000d3a3b9a57",
        "patient_Education_Provided_other": "61183643-8b37-ef11-8409-000d3a5d2bf5",
        "patient_Education_Provided_Safety_Enhancement": "a7a76643-8b37-ef11-8409-000d3a3b9a57",
        "patient_Education_Provided_Access_Device_Care": "3f5b283d-8b37-ef11-8409-000d3a5d2bf5",
        "patient_Education_Provided_Medication_management": "3c5b283d-8b37-ef11-8409-000d3a5d2bf5",
        "patient_Education_Provided_Nutrition": "55183643-8b37-ef11-8409-000d3a5d2bf5",
 
        // Premedications
        "premedications_administered_yes": "80711b19-8c37-ef11-8409-000d3a5d2bf5",
        "premedications_administered_no": "83711b19-8c37-ef11-8409-000d3a5d2bf5",
        "premedications_administered_declined": "84711b19-8c37-ef11-8409-000d3a5d2bf5",
        "premedications_administered_other": "5e715f1e-8c37-ef11-8409-000d3a5a3fab",
 
        "premedications_administered_patient": "5f715f1e-8c37-ef11-8409-000d3a5a3fab",
        "premedications_administered_nurse": "daf22d1f-8c37-ef11-8409-000d3a5d2bf5",
        "premedications_administered_care_provider": "81ef141d-8c37-ef11-8409-000d3a3b9a57",
        "premedications_administered_patient_please_specify": "60715f1e-8c37-ef11-8409-000d3a5a3fab",
        "addAdditional_2": "additional_2",
 
        "premedications_administered_patient_2": "95c04d1e-8c37-ef11-8409-6045bd04aa22",
        "premedications_administered_nurse_2": "8bef141d-8c37-ef11-8409-000d3a3b9a57",
        "premedications_administered_care_provider_2": "8cef141d-8c37-ef11-8409-000d3a3b9a57",
        "premedications_administered_patient_please_specify_2": "61715f1e-8c37-ef11-8409-000d3a5a3fab",
        "addAdditional_2": "additional_3",
 
        "premedications_administered_patient_3": "22bcbf24-8c37-ef11-8409-6045bd04aa22",
        "premedications_administered_nurse_3": "f4f22d1f-8c37-ef11-8409-000d3a5d2bf5",
        "premedications_administered_care_provider_3": "f1113e25-8c37-ef11-8409-000d3a5d2bf5",
        "premedications_administered_patient_please_specify_3": "25bcbf24-8c37-ef11-8409-6045bd04aa22",
        "addAdditional_2": "additional_4",
 
        "premedications_administered_patient_4": "fd113e25-8c37-ef11-8409-000d3a5d2bf5",
        "premedications_administered_nurse_4": "32bcbf24-8c37-ef11-8409-6045bd04aa22",
        "premedications_administered_care_provider_4": "35bcbf24-8c37-ef11-8409-6045bd04aa22",
        "premedications_administered_patient_please_specify_4": "36bcbf24-8c37-ef11-8409-6045bd04aa22",
        "addAdditional_2": "additional_5",
 
        "premedications_administered_patient_5": "0c123e25-8c37-ef11-8409-000d3a5d2bf5",
        "premedications_administered_nurse_5": "49bcbf24-8c37-ef11-8409-6045bd04aa22",
        "premedications_administered_care_provider_5": "13123e25-8c37-ef11-8409-000d3a5d2bf5",
        "premedications_administered_patient_please_specify_5": "17123e25-8c37-ef11-8409-000d3a5d2bf5",
 
        //postmedication
        "postmedications_administered_yes": "1fb8ab4f-8c37-ef11-8409-6045bd04aa22",
        "postmedications_administered_no": "38c3df54-8c37-ef11-8409-000d3a5a3fab",
        "postmedications_administered_declined": "24b8ab4f-8c37-ef11-8409-6045bd04aa22",
        "postmedications_administered_other": "39c3df54-8c37-ef11-8409-000d3a5a3fab",
 
        "postmedications_administered_patient": "3bc3df54-8c37-ef11-8409-000d3a5a3fab",
        "postmedications_administered_nurse": "c2c9b455-8c37-ef11-8409-6045bd04aa22",
        "postmedications_administered_care_provider": "b97b0a54-8c37-ef11-8409-000d3a3b9a57",
        "postmedications_administered_patient_please_specify": "75b78e55-8c37-ef11-8409-000d3a5d2bf5",
        "post_addAdditional_2": "post_addAdditional_2",
 
        "postmedications_administered_patient_2": "3ec3df54-8c37-ef11-8409-000d3a5a3fab",
        "postmedications_administered_nurse_2": "dfc9b455-8c37-ef11-8409-6045bd04aa22",
        "postmedications_administered_care_provider_2": "85b78e55-8c37-ef11-8409-000d3a5d2bf5",
        "postmedications_administered_patient_please_specify_2": "87b78e55-8c37-ef11-8409-000d3a5d2bf5",
        "post_addAdditional_3": "post_addAdditional_3",
 
        "postmedications_administered_patient_3": "ebc9b455-8c37-ef11-8409-6045bd04aa22",
        "postmedications_administered_nurse_3": "eec9b455-8c37-ef11-8409-6045bd04aa22",
        "postmedications_administered_care_provider_3": "44dbbd5b-8c37-ef11-8409-6045bd04aa22",
        "postmedications_administered_patient_please_specify_3": "61550c5a-8c37-ef11-8409-000d3a3b9a57",
        "post_addAdditional_4": "post_addAdditional_4",
 
        "postmedications_administered_patient_4": "51dbbd5b-8c37-ef11-8409-6045bd04aa22",
        "postmedications_administered_nurse_4": "2f73bb5b-8c37-ef11-8409-000d3a5d2bf5",
        "postmedications_administered_care_provider_4": "cb26e25c-8c37-ef11-8409-000d3a5a3fab",
        "postmedications_administered_patient_please_specify_4": "5bdbbd5b-8c37-ef11-8409-6045bd04aa22",
        "post_addAdditional_5": "post_addAdditional_5",
 
        "postmedications_administered_patient_5": "cc26e25c-8c37-ef11-8409-000d3a5a3fab",
        "postmedications_administered_nurse_5": "69dbbd5b-8c37-ef11-8409-6045bd04aa22",
        "postmedications_administered_care_provider_5": "6fdbbd5b-8c37-ef11-8409-6045bd04aa22",
        "postmedications_administered_patient_please_specify_5": "70dbbd5b-8c37-ef11-8409-6045bd04aa22",
 
        "pateint_unable_to_sign": "8f1c9600-1f39-ef11-8409-000d3a3b9a57",
 
    };
    return idToAnsMap;
};