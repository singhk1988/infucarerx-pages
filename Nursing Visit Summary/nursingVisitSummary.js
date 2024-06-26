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
    // 'vascular_access_site_other_textBox': 'Please Enter other',
    // 'vascular_sutures_textBox': 'Please enter the black field',
    // 'vascular_newIv_access_device_textBox': 'Please enter the black field',
    // 'saline_pre_textBox': 'Please enter sline pre',
    // 'saline_post_textBox': 'Please enter sline post',
    // 'heparin_pre_textBox': 'Please enter heparin pre',
    // 'heparin_post_textBox': 'Please enter heparin post',
    'access_Device_Care_Option': 'Please check access device',
    'access_Device_Care_InputField_Length': 'Please enter length.',
    'access_Device_Care_InputField_Gauge': 'Please enter gauge.',
    'access_Device_Care_InputField_Gauge_Fr': 'Please enter gauge fr.',
    'access_Device_Care_InputField_Line_Brand': 'Please enter line brand.',
    'access_Device_Care_InputField_Access_Location':    'Please enter location',
    'access_Device_Care_InputField_Insert_date': 'Please enter insertion date.',
    'access_Device_Care_InputField_Inserted_By': 'Please enter inserted by.',
    'nurse_credentials': 'Please enter nurse credentials.',
    'nurse_fname': 'Please enter nurse fisrt name.',
    'nurse_lname': 'Please enter nurse last name.',
    'nurse_date': 'Please enter nursery date.',
    'nurse_sign': 'Please enter nursery sign.',
    'patient_sign': 'Please enter patient sign.',
};
let ValidationErrorStatus = { schedule_type: false, therapy: false, reason_for_visit: false, };

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
    var skin_incision_LocationInputField = document.getElementById('incision_LocationInputField');
    var skin_Incision_DescriptionInputField = document.getElementById('Incision_DescriptionInputField');

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

const handleAccess_Device_Care_Section=()=>{
    
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


   access_Device_Care_Option_PICC.addEventListener('click', function(){

            access_Device_Care_InputField_Gauge.style.display='none';
            access_Device_Care_InputField_Gauge_Fr.style.display='block';
   
   })
   access_Device_Care_Option_Midline.addEventListener('click', function(){
  
            access_Device_Care_InputField_Gauge.style.display='none';
            access_Device_Care_InputField_Gauge_Fr.style.display='block';
          
    })

    access_Device_Care_Option_PIV.addEventListener('click', function(){

        access_Device_Care_InputField_Gauge.style.display='block';
        access_Device_Care_InputField_Gauge_Fr.style.display='none';

    })
    access_Device_Care_Option_Port.addEventListener('click', function(){

        access_Device_Care_InputField_Gauge.style.display='block';
        access_Device_Care_InputField_Gauge_Fr.style.display='none';
   
   })
   access_Device_Care_Option_SUBQ.addEventListener('click', function(){
        access_Device_Care_InputField_Gauge.style.display='block';
        access_Device_Care_InputField_Gauge_Fr.style.display='none';
   
   })
   access_Device_Care_Option_Tunneled_Catheter.addEventListener('click', function(){

        access_Device_Care_InputField_Gauge.style.display='block';
        access_Device_Care_InputField_Gauge_Fr.style.display='none';
   })
   sterile_site_care_other.addEventListener('change', function(){
        if(this.checked)
        sterile_site_care_otherInputField.style.display='block';
        else
        sterile_site_care_otherInputField.style.display='none';
   })

}

const handleLaboratory=()=>{
    let labs_Drawn_Yes = document.getElementById('labs_Drawn_Yes');
    let labs_Drawn_No = document.getElementById('labs_Drawn_No');
    let location_of_Labs_Drawn = document.getElementById('location_of_Labs_Drawn');
    let location_of_Labs_Drawn_Peripheral_Site = document.getElementById('location_of_Labs_Drawn_Peripheral_Site');
    let location_of_Labs_Drawn_Central_Line_Draw = document.getElementById('location_of_Labs_Drawn_Central_Line_Draw');
    let processing_Lab = document.getElementById('processing_Lab');
    let processing_Lab_Quest = document.getElementById('processing_Lab_Quest');
    let processing_Lab_Other = document.getElementById('processing_Lab_Others');
    let processing_Lab_OtherInputField = document.getElementById('processing_Lab_OthersInputField');
    let Laboratory_InputFields = document.getElementById('Laboratory_InputFields');
    let processing_Lab_ListLabsDrawnInputField = document.getElementById('processing_Lab_ListLabsDrawnInputField');
    let processing_Lab_NumberofAttemptsInputField = document.getElementById('processing_Lab_NumberofAttemptsInputField');

    labs_Drawn_Yes.addEventListener('click', function(){

        location_of_Labs_Drawn.style.display='block'

    })
    labs_Drawn_No.addEventListener('click', function(){

        location_of_Labs_Drawn.style.display='none'
        processing_Lab.style.display='none'
        Laboratory_InputFields.style.display='none'
        processing_Lab_OtherInputField.style.display='none'
    })
    location_of_Labs_Drawn_Peripheral_Site.addEventListener('click', function(){

        processing_Lab.style.display='block'
        Laboratory_InputFields.style.display='block'
        

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

    const handletherapyadherence=()=>{
        
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

    const handlePATIENT_EDUCATION_PROVIDED=()=>{
        const patient_Education_Provided_other = document.getElementById('patient_Education_Provided_other')
        const patient_Education_Provided_Medication_management = document.getElementById('patient_Education_Provided_Medication_management')
        patient_Education_Provided_other.addEventListener('change', function () {
            if(this.checked)
                document.getElementById('patient_Education_Provided_Inputtextfield').style.display = 'block';
            else
                document.getElementById('patient_Education_Provided_Inputtextfield').style.display = 'none';
        });
        patient_Education_Provided_Medication_management.addEventListener('change', function () {
            if(this.checked)
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
     document.getElementById('pateint_unable_to_sign').addEventListener('change', function() {
        if (this.checked) {
            document.getElementById('why_patient_cannot_sign').style.display = 'block';
        }
        else{
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

document.addEventListener("DOMContentLoaded", async function () {
    const searchParams = new URLSearchParams(window.location.search);
    const formResponseId = searchParams.get('id');
    const savedFormData = window.localStorage.getItem(formResponseId);
    const savedSignature = window.localStorage.getItem(`${formResponseId}-sig`);
    


    handleDisableAtStart();
    handleTherapySection();
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

   


    if (savedSignature) {
        commonFormOpeation.setSignatureFromSave('patient_sign', savedSignature);
        commonFormOpeation.setSignatureFromSave('nurse_sign', savedSignature);
    }

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
            const signatureURLData = commonFormOpeation.getSignatureDataToSave('patient_sign');
            window.localStorage.setItem(`${formResponseId}-sig`, signatureURLData);
            commonFormOpeation.showModalPopup('exampleModal', true);
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
        "bp1": "bp1",
        "bp2": "bp2",
        "pulse": "pulse",
        "rr": "rr",
        "temp": "temp",
        "weight": "weight",
        "Medication_Profile": "Medication_Profile",
        "neuro_Psych": "neuro_Psych",
        "neurology_Psychosocial_Abnormalities": "neurology_Psychosocial_Abnormalities",
        "neuro_Psych_otherInputField": "neuro_Psych_otherInputField",
        "neuro_Psych_tingling_InputField": "neuro_Psych_tingling_InputField",
        "neuro_Psych_burning_InputField": "neuro_Psych_burning_InputField",
        "neuro_Psych_headache_InputField": "neuro_Psych_headache_InputField",
        "neuro_Psych_foot_Drop_Left_InputField": "neuro_Psych_foot_Drop_Left_InputField",
        "neuro_Psych_foot_Drop_Right_InputField": "neuro_Psych_foot_Drop_Right_InputField",
        "neuro_Psych_tremor_InputField": "neuro_Psych_tremor_InputField",
        "neuro_Psych_Numbness_InputField": "neuro_Psych_Numbness_InputField",

        "cardiovascular": "cardiovascular",
        "cardiovascular_Abnormalities": "cardiovascular_Abnormalities",
        "cardiovascular_otherInputField": "cardiovascular_otherInputField",
        "edema_Radiobuttons": "edema_Radiobuttons",
        "cardiovascular_edemaInputField": "cardiovascular_edemaInputField",
        "cardiovascular_Peripheral_PulsesInputField": "cardiovascular_Peripheral_PulsesInputField",
        "cardiovascular_extremities_Not_Equal_In_Color_Temprature_SensationInputField": "cardiovascular_extremities_Not_Equal_In_Color_Temprature_SensationInputField",

        "respiratory": "respiratory",
        "respiratory_Abnormalities": "respiratory_Abnormalities",
        "adventious_Lung_Sounds_radiobuttons": "adventious_Lung_Sounds_radiobuttons",
        "respiratory_otherInputField": "respiratory_otherInputField",
        "adventious_Lung_Sounds_OtherInputField": "adventious_Lung_Sounds_OtherInputField",
        "cough_radiobuttons": "cough_radiobuttons",
        "respiratory_use_of_Supplemetal_OxygenInputField": "respiratory_use_of_Supplemetal_OxygenInputField",
        "cough_OtherInputField": "cough_OtherInputField",


        "gastrointestinal": "gastrointestinal",
        "gastrointestinal_Abnormalities": "gastrointestinal_Abnormalities",
        "gastrointestinal_otherInputField": "gastrointestinal_otherInputField",

        "genitourinary": "genitourinary",
        "genitourinary_Abnormalities": "genitourinary_Abnormalities",
        "genitourinary_otherInputField": "genitourinary_otherInputField",

        "musculoskeleton": "musculoskeleton",
        "musculoskeleton_Abnormalities": "musculoskeleton_Abnormalities",
        "Ambulatory_assist_device_OtherInputField": "Ambulatory_assist_device_OtherInputField",
        "Ambulatory_assist_device_radiobuttons": "Ambulatory_assist_device_radiobuttons",
        "musculoskeleton_otherInputField": "musculoskeleton_otherInputField",

        "skin": "skin",
        "skin_Abnormalities": "skin_Abnormalities",
        "Medication": "Medication",
        "skin_otherInputField": "skin_otherInputField",
        "skin_DiscolorationInputField": "skin_DiscolorationInputField",
        "skin_BreakdownInputField": "skin_BreakdownInputField",
        "incision_DescriptionInputField": "incision_DescriptionInputField",
        "incision_LocationInputField": "incision_LocationInputField",

        "pain_Experienced_radioButton": "pain_Experienced_radioButton",
        "pain_Currently_Present_radioButton": "pain_Currently_Present_radioButton",
        "pain_Comfort_Checkbox": "pain_Comfort_Checkbox",
        "pain_Currently_Present_Adult_Form": "pain_Currently_Present_Adult_Form",
        "pain_Currently_Present_Pediatric_Form": "pain_Currently_Present_Pediatric_Form",
        "pain_Experienced_Adult_Form": "pain_Experienced_Adult_Form",
        "pain_Experienced_Pediatric_Form": "pain_Experienced_Pediatric_Form",
        "pain_Currently_Present_Pediatric_facesLocation": "pain_Currently_Present_Pediatric_facesLocation",

        "pain_Currently_Present_Adult_Painlocation": "pain_Currently_Present_Adult_Painlocation",
        "pain_Currently_Present_Adult_ReliefMeasure": "pain_Currently_Present_Adult_ReliefMeasure",
        "pain_Currently_Present_Adult_Precipitatingfactors": "pain_Currently_Present_Adult_Precipitatingfactors",
        "pain_Currently_Present_Adult_Qualitydescription": "pain_Currently_Present_Adult_Qualitydescription",
        "pain_Currently_Present_Adult_Radiates": "pain_Currently_Present_Adult_Radiates",
        "pain_Currently_Present_Adult_TimingOnset": "pain_Currently_Present_Adult_TimingOnset",
        "pain_Currently_Present_Adult_TimingFrequency": "pain_Currently_Present_Adult_TimingFrequency",
        "pain_Currently_Present_Adult_TimingDuration": "pain_Currently_Present_Adult_TimingDuration",
        "pain_Experienced_Adult_Severity": "pain_Experienced_Adult_Severity",
        "pain_Experienced": "pain_Experienced",
        "pain_Currently_Present": "pain_Currently_Present",

        "pain_Experienced_Adult_Painlocation": "pain_Experienced_Adult_Painlocation",
        "pain_Experienced_Adult_ReliefMeasure": "pain_Experienced_Adult_ReliefMeasure",
        "pain_Experienced_Adult_Precipitatingfactors": "pain_Experienced_Adult_Precipitatingfactors",
        "pain_Experienced_Adult_Qualitydescription": "pain_Experienced_Adult_Qualitydescription",
        "pain_Experienced_Adult_Radiates": "pain_Experienced_Adult_Radiates",
        "pain_Experienced_Adult_TimingOnset": "pain_Experienced_Adult_TimingOnset",
        "pain_Experienced_Adult_TimingFrequency": "pain_Experienced_Adult_TimingFrequency",
        "pain_Experienced_Adult_TimingDuration": "pain_Experienced_Adult_TimingDuration",
        "pain_Currently_Present_Adult_Severity": "pain_Currently_Present_Adult_Severity",

        "pain_Experienced_Pediatric_facesLocation": "pain_Experienced_Pediatric_facesLocation",




        "endocrine": "endocrine",
        "last_glucose_level": "last_glucose_level",
        "last_glucose_date": "last_glucose_date",

        "vascular_access_site": "vascular_access_site",
        "vascular_access_site_other_textBox": "vascular_access_site_other_textBox",
        "vascular_sutures_textBox": "vascular_sutures_textBox",
        "vascular_newIv_access_device_textBox": "vascular_newIv_access_device_textBox",

        "flushes": "flushes",
        "saline_pre_textBox": "saline_pre_textBox",
        "saline_post_textBox": "saline_post_textBox",
        "heparin_pre_textBox": "heparin_pre_textBox",
        "heparin_post_textBox": "heparin_post_textBox",

        // access device care options
        "access_Device_Care_Option":"access_Device_Care_Option",
        "access_Device_Care_InputField_Length":"access_Device_Care_InputField_Length",
        "access_Device_Care_InputField_Gauge":"access_Device_Care_InputField_Gauge",
        "access_Device_Care_InputField_Gauge_Fr":"access_Device_Care_InputField_Gauge_Fr",
        "access_Device_Care_InputField_Line_Brand":"access_Device_Care_InputField_Line_Brand",
        "access_Device_Care_InputField_Access_Location":"access_Device_Care_InputField_Access_Location",
        "access_Device_Care_InputField_Internal_Length":"access_Device_Care_InputField_Internal_Length",
        "access_Device_Care_InputField_No_of_lumens":"access_Device_Care_InputField_No_of_lumens",
        "access_Device_Care_Option_Tunneled":"access_Device_Care_Option_Tunneled",
        "access_Device_Care_InputField_Exact_Cath_Measurement":"access_Device_Care_InputField_Exact_Cath_Measurement",
        "access_Device_Care_InputField_Arm_circ_above_site":"access_Device_Care_InputField_Arm_circ_above_site",
        "access_Device_Care_InputField_Insert_date":"access_Device_Care_InputField_Insert_date",
        "access_Device_Care_InputField_Inserted_By":"access_Device_Care_InputField_Inserted_By",
        "sterile_site_care":"sterile_site_care",
        "sterile_site_care_otherInputField":"sterile_site_care_otherInputField",
        "sterile_site_car_Access_Insertion_AttemptsInputField":"sterile_site_car_Access_Insertion_AttemptsInputField",
        "labs_Drawn":"labs_Drawn",
        "location_of_Labs_Drawn":"location_of_Labs_Drawn",
        "processing_Lab":"processing_Lab",
        "processing_Lab_OthersInputField":"processing_Lab_OthersInputField",
        "processing_Lab_ListLabsDrawnInputField":"processing_Lab_ListLabsDrawnInputField",
        "processing_Lab_NumberofAttemptsInputField":"processing_Lab_NumberofAttemptsInputField",
        "therapy_interruption_SchoolMissedInputField":"therapy_interruption_SchoolMissedInputField",
        "therapy_interruption_YesInputField":"therapy_interruption_YesInputField",
        "therapy_interruption":"therapy_interruption",

        // patient education provided
        "patient_Education_Provided_Insert_date":"patient_Education_Provided_Insert_date",
        "patient_Education_Provided_MEdicationmanagementEducation":"patient_Education_Provided_MEdicationmanagementEducation",
        "patient_Education_Provided_Inputtextfield":"patient_Education_Provided_Inputtextfield",
        "patient_Education_Provided":"patient_Education_Provided",


        // PreMedication
        "premedications_administered": "premedications_administered",
        "premedications_administered_other_textBox": "premedications_administered_other_textBox",

        "premedication_1": "premedication_1",
        "time_administered_1": "time_administered_1",
        "time_administered_completed_1": "time_administered_completed_1",
        "premedications_administered_by": "premedications_administered_by",
        "premedication_please_specify_textBox": "premedication_please_specify_textBox",
        "addAdditional_parent": "addAdditional_parent",

        "premedication_2": "premedication_2",
        "time_administered_2": "time_administered_2",
        "time_administered_completed_2": "time_administered_completed_2",
        "premedications_administered_by_2": "premedications_administered_by_2",
        "premedication_please_specify_textBox_2": "premedication_please_specify_textBox_2",
        "addAdditional_parent_2": "addAdditional_parent_2",

        "premedication_3": "premedication_3",
        "time_administered_3": "time_administered_3",
        "time_administered_completed_3": "time_administered_completed_3",
        "premedications_administered_by_3": "premedications_administered_by_3",
        "premedication_please_specify_textBox_3": "premedication_please_specify_textBox_3",
        "addAdditional_parent_3": "addAdditional_parent_3",

        "premedication_4": "premedication_4",
        "time_administered_4": "time_administered_4",
        "time_administered_completed_4": "time_administered_completed_4",
        "premedications_administered_by_4": "premedications_administered_by_4",
        "premedication_please_specify_textBox_4": "premedication_please_specify_textBox_4",
        "addAdditional_parent_4": "addAdditional_parent_4",

        "premedication_5": "premedication_5",
        "time_administered_5": "time_administered_5",
        "time_administered_completed_5": "time_administered_completed_5",
        "premedications_administered_by_5": "premedications_administered_by_5",
        "premedication_please_specify_textBox_5": "premedication_please_specify_textBox_5",
        "addAdditional_parent_5": "addAdditional_parent_5",



        "medication1": "medication1",
        "medication1_dosage": "medication1_dosage",
        "medication1_startTime": "medication1_startTime",
        "medication1_endTime": "medication1_endTime",
        "medication2": "medication2",
        "medication2_dosage": "medication2_dosage",
        "medication2_startTime": "medication2_startTime",
        "medication2_endTime": "medication2_endTime",
        "medication3": "medication3",
        "medication3_dosage": "medication3_dosage",
        "medication3_startTime": "medication3_startTime",
        "medication3_endTime": "medication3_endTime",

        
        //PostMedication
        "postmedications_administered": "postmedications_administered",
        "postmedications_administered_other_textBox": "postmedications_administered_other_textBox",

        "postmedication_1": "postmedication_1",
        "post_time_administered_1": "post_time_administered_1",
        "post_time_administered_completed_1": "post_time_administered_completed_1",
        "postmedications_administered_by": "postmedications_administered_by",
        "postmedication_please_specify_textBox": "postmedication_please_specify_textBox",
        "postaddAdditional_parent": "postaddAdditional_parent",

        "postmedication_2": "postmedication_2",
        "post_time_administered_2": "post_time_administered_2",
        "post_time_administered_completed_2": "post_time_administered_completed_2",
        "postmedications_administered_by_2": "postmedications_administered_by_2",
        "postmedication_please_specify_textBox_2": "postmedication_please_specify_textBox_2",
        "postaddAdditional_parent_2": "postaddAdditional_parent_2",

        "postmedication_3": "postmedication_3",
        "post_time_administered_3": "post_time_administered_3",
        "post_time_administered_completed_3": "post_time_administered_completed_3",
        "postmedications_administered_by_3": "postmedications_administered_by_3",
        "postmedication_please_specify_textBox_3": "postmedication_please_specify_textBox_3",
        "postaddAdditional_parent_3": "postaddAdditional_parent_3",

        "postmedication_4": "postmedication_4",
        "post_time_administered_4": "post_time_administered_4",
        "post_time_administered_completed_4": "post_time_administered_completed_4",
        "postmedications_administered_by_4": "postmedications_administered_by_4",
        "postmedication_please_specify_textBox_4": "postmedication_please_specify_textBox_4",
        "postaddAdditional_parent_4": "postaddAdditional_parent_4",

        "postmedication_5": "postmedication_5",
        "post_time_administered_5": "post_time_administered_5",
        "post_time_administered_completed_5": "post_time_administered_completed_5",
        "postmedications_administered_by_5": "postmedications_administered_by_5",
        "postmedication_please_specify_textBox_5": "postmedication_please_specify_textBox_5",
        "postaddAdditional_parent_5": "postaddAdditional_parent_5",

        // last section
        "comments_notes": "comments_notes",
        "nurse_credentials": "nurse_credentials",
        "nurse_fname": "nurse_fname",
        "nurse_lname": "nurse_lname",
        "nurse_date": "nurse_date",
        "pateint_unable": "pateint_unable",
        "why_patient_cannot_sign": "why_patient_cannot_sign",
        "nurse_sign": "nurse_sign",
        "patient_sign": "patient_sign",

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
        "line_draw": "line_draw",
        "port_access": "port_access",
        "assessment": "assessment",
        "medication_admin": "medication_admin",
        "re_start": "re_start",
        "visit_other": "visit_other",
        "freedom": "freedom",
        "curlin": "curlin",
        "pump_type_other": "pump_type_other",
        "medication_changes_yes": "medication_changes_yes",
        "medication_changes_no": "medication_changes_no",

        "neuro_Psych_yes": "neuro_Psych_yes",
        "neuro_Psych_no": "neuro_Psych_no",
        "lethargic": "lethargic",
        "restlessness": "restlessness",
        "memory_Loss": "memory_Loss",
        "sluggish": "sluggish",
        "confusion": "confusion",
        "numbness": "numbness",
        "difficulty_Concentrating": "difficulty_Concentrating",
        "anxious": "anxious",
        "tingling": "tingling",
        "depressed_Hopeless": "depressed_Hopeless",
        "burning": "burning",
        "tremor": "tremor",
        "headache": "headache",
        "foot_Drop_Left": "foot_Drop_Left",
        "foot_Drop_Right": "foot_Drop_Right",
        "neuro_Psych_Other": "neuro_Psych_Other",

        "cardiovascular_yes": "cardiovascular_yes",
        "cardiovascular_no": "cardiovascular_no",
        "irregular_Heart_rate": "irregular_Heart_rate",
        "edema": "edema",
        "peripheral_Pulse_Not_Palpable": "peripheral_Pulse_Not_Palpable",
        "extremities_Not_Equal_In_Color_Temprature_Sensation": "extremities_Not_Equal_In_Color_Temprature_Sensation",
        "cardiovascular_Other": "cardiovascular_Other",
        "cardiovascular_edema_trace": "cardiovascular_edema_trace",
        "cardiovascular_edema_1": "cardiovascular_edema_1",
        "cardiovascular_edema_2": "cardiovascular_edema_2",
        "cardiovascular_edema_3": "cardiovascular_edema_3",
        "cardiovascular_edema_4": "cardiovascular_edema_4",

        "respiratory_yes": "respiratory_yes",
        "respiratory_no": "respiratory_no",
        "adventious_Lung_Sounds": "adventious_Lung_Sounds",
        "short_of_Breath_at_Rest": "short_of_Breath_at_Rest",
        "short_of_Breath_at_Exertion": "short_of_Breath_at_Exertion",
        "use_of_Supplemetal_Oxygen": "use_of_Supplemetal_Oxygen",
        "cough": "cough",
        "respiratory_Other": "respiratory_Other",
        "adventious_Lung_Sounds_Crackles": "adventious_Lung_Sounds_Crackles",
        "adventious_Lung_Sounds_Wheezes": "adventious_Lung_Sounds_Wheezes",
        "adventious_Lung_Sounds_Diminished": "adventious_Lung_Sounds_Diminished",
        "adventious_Lung_Sounds_Other": "adventious_Lung_Sounds_Other",
        "cough_Dry": "cough_Dry",
        "cough_Productive": "cough_Productive",
        "cough_Persistent": "cough_Persistent",
        "cough_Other": "cough_Other",


        "gastrointestinal_yes": "gastrointestinal_yes",
        "gastrointestinal_no": "gastrointestinal_no",
        "incontinence": "incontinence",
        "constipation": "constipation",
        "diarrhea": "diarrhea",
        "abdomen_Firm_to_Palpitation": "abdomen_Firm_to_Palpitation",
        "poor_Appetite": "poor_Appetite",
        "nausea": "nausea",
        "fair_Appetite": "fair_Appetite",
        "distended_Abdomen": "distended_Abdomen",
        "vomiting": "vomiting",
        "heartburn": "heartburn",
        "gastrointestinal_Other": "gastrointestinal_Other",


        "genitourinary_yes": "genitourinary_yes",
        "genitourinary_no": "genitourinary_no",
        "urinary_Frequency": "urinary_Frequency",
        "urinary_Odor": "urinary_Odor",
        "urgency": "urgency",
        "hematuria": "hematuria",
        "dysuria": "dysuria",
        "cloudy": "cloudy",
        "genitourinary_incontinence": "genitourinary_incontinence",
        "nocturia": "nocturia",
        "oliguria": "oliguria",
        "genitourinary_Other": "genitourinary_Other",

        "musculoskeleton_yes": "musculoskeleton_yes",
        "musculoskeleton_no": "musculoskeleton_no",
        "unsteady_Gait": "unsteady_Gait",
        "impaired_ROM": "impaired_ROM",
        "weakness": "weakness",
        "weakness": "weakness",
        "required_Assistance_to_Ambulate": "required_Assistance_to_Ambulate",
        "required_Assistance_to_Transfer_OOB_OOC": "required_Assistance_to_Transfer_OOB_OOC",
        "Ambulatory_assist_device": "Ambulatory_assist_device",
        "fall_Prevention_Education": "fall_Prevention_Education",
        "musculoskeleton_Other": "musculoskeleton_Other",
        "Ambulatory_assist_device_Walker": "Ambulatory_assist_device_Walker",
        "Ambulatory_assist_device_Crutches": "Ambulatory_assist_device_Crutches",
        "Ambulatory_assist_device_Cane": "Ambulatory_assist_device_Cane",
        "Ambulatory_assist_device_WheelChair": "Ambulatory_assist_device_WheelChair",
        "Ambulatory_assist_device_Other": "Ambulatory_assist_device_Other",

        "skin_yes": "skin_yes",
        "skin_no": "skin_no",
        "dry_Skin": "dry_Skin",
        "dry_Mucus_Membrane": "dry_Mucus_Membrane",
        "skin_Discoloration": "skin_Discoloration",
        "skin_Breakdown": "skin_Breakdown",
        "incision": "incision",
        "skin_Other": "skin_Other",


        "denise_Pain": "denise_Pain",
        "pain_Currently_Present": "pain_Currently_Present",
        "Pain_Experienced_Since_Last_Visit": "Pain_Experienced_Since_Last_Visit",
        "pain_Currently_Present_Adult": "pain_Currently_Present_Adult",
        "pain_Currently_Present_Pediatric": "pain_Currently_Present_Pediatric",
        "pain_Experienced_Pediatric": "pain_Experienced_Pediatric",
        "pain_Experienced_Adult": "pain_Experienced_Adult",
        "pain_Currently_Present_Adult_TimingDuration": "pain_Currently_Present_Adult_TimingDuration",


        "pain_Experienced_Adult_Severity1": "pain_Experienced_Adult_Severity1",
        "pain_Experienced_Adult_Severity2": "pain_Experienced_Adult_Severity2",
        "pain_Experienced_Adult_Severity3": "pain_Experienced_Adult_Severity3",
        "pain_Experienced_Adult_Severity4": "pain_Experienced_Adult_Severity4",
        "pain_Experienced_Adult_Severity5": "pain_Experienced_Adult_Severity5",
        "pain_Experienced_Adult_Severity6": "pain_Experienced_Adult_Severity6",
        "pain_Experienced_Adult_Severity7": "pain_Experienced_Adult_Severity7",
        "pain_Experienced_Adult_Severity8": "pain_Experienced_Adult_Severity8",
        "pain_Experienced_Adult_Severity9": "pain_Experienced_Adult_Severity9",
        "pain_Experienced_Adult_Severity10": "pain_Experienced_Adult_Severity10",
        "pain_Experienced_Adult_Severity0": "pain_Experienced_Adult_Severity0",

        "pain_Currently_Present_Adult_Severity1": "pain_Currently_Present_Adult_Severity1",
        "pain_Currently_Present_Adult_Severity2": "pain_Currently_Present_Adult_Severity2",
        "pain_Currently_Present_Adult_Severity3": "pain_Currently_Present_Adult_Severity3",
        "pain_Currently_Present_Adult_Severity4": "pain_Currently_Present_Adult_Severity4",
        "pain_Currently_Present_Adult_Severity5": "pain_Currently_Present_Adult_Severity5",
        "pain_Currently_Present_Adult_Severity6": "pain_Currently_Present_Adult_Severity6",
        "pain_Currently_Present_Adult_Severity7": "pain_Currently_Present_Adult_Severity7",
        "pain_Currently_Present_Adult_Severity8": "pain_Currently_Present_Adult_Severity8",
        "pain_Currently_Present_Adult_Severity9": "pain_Currently_Present_Adult_Severity9",
        "pain_Currently_Present_Adult_Severity10": "pain_Currently_Present_Adult_Severity10",
        "pain_Currently_Present_Adult_Severity0": "pain_Currently_Present_Adult_Severity0",

        "pain_Currently_Present_Pediatric_facesLocation_0": "pain_Currently_Present_Pediatric_facesLocation_0",
        "pain_Currently_Present_Pediatric_facesLocation_2": "pain_Currently_Present_Pediatric_facesLocation_2",
        "pain_Currently_Present_Pediatric_facesLocation_4": "pain_Currently_Present_Pediatric_facesLocation_4",
        "pain_Currently_Present_Pediatric_facesLocation_6": "pain_Currently_Present_Pediatric_facesLocation_6",
        "pain_Currently_Present_Pediatric_facesLocation_8": "pain_Currently_Present_Pediatric_facesLocation_8",
        "pain_Currently_Present_Pediatric_facesLocation_10": "pain_Currently_Present_Pediatric_facesLocation_10",

        "pain_Experienced_Pediatric_facesLocation_0": "pain_Experienced_Pediatric_facesLocation_0",
        "pain_Experienced_Pediatric_facesLocation_2": "pain_Experienced_Pediatric_facesLocation_2",
        "pain_Experienced_Pediatric_facesLocation_4": "pain_Experienced_Pediatric_facesLocation_4",
        "pain_Experienced_Pediatric_facesLocation_6": "pain_Experienced_Pediatric_facesLocation_6",
        "pain_Experienced_Pediatric_facesLocation_10": "pain_Experienced_Pediatric_facesLocation_10",




        //Sourabh
        "endocrine_na": "endocrine_na",
        "endocrine_yes": "endocrine_yes",
        "endocrine_no": "endocrine_no",

        "vascular_clean": "vascular_clean",
        "vascular_dry": "vascular_dry",
        "vascular_drainage": "vascular_drainage",
        "vascular_red": "vascular_red",
        "vascular_tender": "vascular_tender",
        "vascular_bruised": "vascular_bruised",
        "vascular_infiltrated": "vascular_infiltrated",
        "vascular_sutures": "vascular_sutures",
        "vascular_phlebitis": "vascular_phlebitis",
        "vascular_Dressing": "vascular_Dressing",
        "vascular_positive_blood_return": "vascular_positive_blood_return",
        "vascular_patent": "vascular_patent",
        "vascular_cord_formation": "vascular_cord_formation",
        "vascular_swelling": "vascular_swelling",
        "vascular_occluded": "vascular_occluded",
        "vascular_newIv_access_device": "vascular_newIv_access_device",
        "vascular_na": "vascular_na",
        "vascular_access_site_other": "vascular_access_site_other",

        "saline_flush": "saline_flush",
        "heparin_flush": "heparin_flush",

        // Access Device acre options
        "access_Device_Care_Option_PIV":"access_Device_Care_Option_PIV",
        "access_Device_Care_Option_Port":"access_Device_Care_Option_Port",
        "access_Device_Care_Option_PICC":"access_Device_Care_Option_PICC",
        "access_Device_Care_Option_Midline":"access_Device_Care_Option_Midline",
        "access_Device_Care_Option_SUBQ":"access_Device_Care_Option_SUBQ",
        "access_Device_Care_Option_Tunneled_Catheter":"access_Device_Care_Option_Tunneled_Catheter",
        "access_Device_Care_Option_Yes":"access_Device_Care_Option_Yes",
        "access_Device_Care_Option_No":"access_Device_Care_Option_No",
        "access_Device_Care_Option_NA":"access_Device_Care_Option_NA",
        "sterile_site_care_Chlorhexidine":"sterile_site_care_Chlorhexidine",
        "sterile_site_care_Alcohol":"sterile_site_care_Alcohol",
        "sterile_site_care_Betadine":"sterile_site_care_Betadine",
        "sterile_site_care_Skin_Prep":"sterile_site_care_Skin_Prep",
        "sterile_site_care_Steri_Strips":"sterile_site_care_Steri_Strips",
        "sterile_site_care_Biopatch":"sterile_site_care_Biopatch",
        "sterile_site_care_Securement_Device":"sterile_site_care_Securement_Device",
        "sterile_site_care_Tegaderm":"sterile_site_care_Tegaderm",
        "sterile_site_care_IV_3000":"sterile_site_care_IV_3000", 
        "sterile_site_care_Sorbaview":"sterile_site_care_Sorbaview",
        "sterile_site_care_Opsite":"sterile_site_care_Opsite",
        "sterile_site_care_Gauze_Tape_Dressing":"sterile_site_care_Gauze_Tape_Dressing",
        "sterile_site_care_Cap_Change":"sterile_site_care_Cap_Change",
        "sterile_site_care_Extension_Tubing_Change":"sterile_site_care_Extension_Tubing_Change",
        "sterile_site_care_other":"sterile_site_care_other",

        "labs_Drawn_Yes":"labs_Drawn_Yes",
        "labs_Drawn_No":"labs_Drawn_No",
        "location_of_Labs_Drawn_Peripheral_Site":"location_of_Labs_Drawn_Peripheral_Site",
        "location_of_Labs_Drawn_Central_Line_Draw":"location_of_Labs_Drawn_Central_Line_Draw",
        "processing_Lab_Lab_Corp":"processing_Lab_Lab_Corp",
        "processing_Lab_Quest":"processing_Lab_Quest",
        "processing_Lab_Others":"processing_Lab_Others",


        "therapy_interruption_Yes":"therapy_interruption_Yes",
        "therapy_interruption_No":"therapy_interruption_No",
        "therapy_interruption_NA":"therapy_interruption_NA",

        
        "patient_Education_Provided_Pain_Management":"patient_Education_Provided_Pain_Management",
        "patient_Education_Provided_Disease_Process":"patient_Education_Provided_Disease_Process",
        "patient_Education_Provided_Hydration":"patient_Education_Provided_Hydration",
        "patient_Education_Provided_Pump_Alarm_and_Troubleshooting":"patient_Education_Provided_Pump_Alarm_and_Troubleshooting",
        "patient_Education_Provided_Pump_Alarm_and_Troubleshooting":"patient_Education_Provided_Pump_Alarm_and_Troubleshooting",
        "patient_Education_Provided_Aseptic_Technique":"patient_Education_Provided_Aseptic_Technique",
        "patient_Education_Provided_Infection_Control":"patient_Education_Provided_Infection_Control",
        "patient_Education_Provided_Bag_Change":"patient_Education_Provided_Bag_Change",
        "patient_Education_Provided_PIV_removal":"patient_Education_Provided_PIV_removal",
        "patient_Education_Provided_other":"patient_Education_Provided_other",
        "patient_Education_Provided_Safety_Enhancement":"patient_Education_Provided_Safety_Enhancement",
        "patient_Education_Provided_Access_Device_Care":"patient_Education_Provided_Access_Device_Care",
        "patient_Education_Provided_Medication_management":"patient_Education_Provided_Medication_management",

        // Premedications
        "premedications_administered_yes": "premedications_administered_yes",
        "premedications_administered_no": "premedications_administered_no",
        "premedications_administered_declined": "premedications_administered_declined",
        "premedications_administered_other": "premedications_administered_other",

        "premedications_administered_patient": "premedications_administered_patient",
        "premedications_administered_nurse": "premedications_administered_nurse",
        "premedications_administered_care_provider": "premedications_administered_care_provider",
        "premedications_administered_patient_please_specify": "premedications_administered_patient_please_specify",
        "addAdditional_2": "additional_2",

        "premedications_administered_patient_2": "premedications_administered_patient_2",
        "premedications_administered_nurse_2": "premedications_administered_nurse_2",
        "premedications_administered_care_provider_2": "premedications_administered_care_provider_2",
        "premedications_administered_patient_please_specify_2": "premedications_administered_patient_please_specify_2",
        "addAdditional_2": "additional_3",

        "premedications_administered_patient_3": "premedications_administered_patient_3",
        "premedications_administered_nurse_3": "premedications_administered_nurse_3",
        "premedications_administered_care_provider_3": "premedications_administered_care_provider_3",
        "premedications_administered_patient_please_specify_3": "premedications_administered_patient_please_specify_3",
        "addAdditional_2": "additional_4",

        "premedications_administered_patient_4": "premedications_administered_patient_4",
        "premedications_administered_nurse_4": "premedications_administered_nurse_4",
        "premedications_administered_care_provider_4": "premedications_administered_care_provider_4",
        "premedications_administered_patient_please_specify_4": "premedications_administered_patient_please_specify_4",
        "addAdditional_2": "additional_5",

        "premedications_administered_patient_5": "premedications_administered_patient_5",
        "premedications_administered_nurse_5": "premedications_administered_nurse_5",
        "premedications_administered_care_provider_5": "premedications_administered_care_provider_5",
        "premedications_administered_patient_please_specify_5": "premedications_administered_patient_please_specify_5",

        //postmedication
        "postmedications_administered_yes": "postmedications_administered_yes",
        "postmedications_administered_no": "postmedications_administered_no",
        "postmedications_administered_declined": "postmedications_administered_declined",
        "postmedications_administered_other": "postmedications_administered_other",

        "postmedications_administered_patient": "postmedications_administered_patient",
        "postmedications_administered_nurse": "postmedications_administered_nurse",
        "postmedications_administered_care_provider": "postmedications_administered_care_provider",
        "postmedications_administered_patient_please_specify": "postmedications_administered_patient_please_specify",
        "post_addAdditional_2": "post_addAdditional_2",

        "postmedications_administered_patient_2": "postmedications_administered_patient_2",
        "postmedications_administered_nurse_2": "postmedications_administered_nurse_2",
        "postmedications_administered_care_provider_2": "postmedications_administered_care_provider_2",
        "postmedications_administered_patient_please_specify_2": "postmedications_administered_patient_please_specify_2",
        "post_addAdditional_3": "post_addAdditional_3",

        "postmedications_administered_patient_3": "postmedications_administered_patient_3",
        "postmedications_administered_nurse_3": "postmedications_administered_nurse_3",
        "postmedications_administered_care_provider_3": "postmedications_administered_care_provider_3",
        "postmedications_administered_patient_please_specify_3": "postmedications_administered_patient_please_specify_3",
        "post_addAdditional_4": "post_addAdditional_4",

        "postmedications_administered_patient_4": "postmedications_administered_patient_4",
        "postmedications_administered_nurse_4": "postmedications_administered_nurse_4",
        "postmedications_administered_care_provider_4": "postmedications_administered_care_provider_4",
        "postmedications_administered_patient_please_specify_4": "postmedications_administered_patient_please_specify_4",
        "post_addAdditional_5": "post_addAdditional_5",

        "postmedications_administered_patient_5": "postmedications_administered_patient_5",
        "postmedications_administered_nurse_5": "postmedications_administered_nurse_5",
        "postmedications_administered_care_provider_5": "postmedications_administered_care_provider_5",
        "postmedications_administered_patient_please_specify_5": "postmedications_administered_patient_please_specify_5",

        "pateint_unable_to_sign": "pateint_unable_to_sign",

    };
    return idToAnsMap;
};