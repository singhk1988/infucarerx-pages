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
    'vascular_access_site_other_textBox': 'Please Enter other',
    'vascular_sutures_textBox': 'Please enter the black field',
    'vascular_newIv_access_device_textBox': 'Please enter the black field',
    'saline_pre_textBox': 'Please enter sline pre',
    'saline_post_textBox': 'Please enter sline post',
    'heparin_pre_textBox': 'Please enter heparin pre',
    'heparin_post_textBox': 'Please enter heparin post',

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
// VASCULAR ACCESS SITE CONDITION

const handleVascularSection = () => {
    let vascularOtherCheckbox = document.getElementById('vascular_access_site_other');
    let vascularSuturesCheckbox = document.getElementById('vascular_sutures');
    let vascularNewIVAccessChecbox = document.getElementById('vascular_newIv_access_device');
    let salineFlushCheckbox = document.getElementById('saline_flush');
    let heparinFlushCheckbox = document.getElementById('heparin_flush');


    vascularOtherCheckbox.addEventListener('change', function () {
        if (this.checked) {
            document.getElementById('vascular_access_site_other_textBox').style.display = 'block';
            document.getElementById('vascular_access_site_other_textBox').setAttribute('required', 'required'); 
        } else {
            document.getElementById('vascular_access_site_other_textBox').style.display = 'none';
            document.getElementById('vascular_access_site_other_textBox').removeAttribute('required'); 
        }
    });

    vascularSuturesCheckbox.addEventListener('change', function() {
        if (this.checked) { 
            document.getElementById('vascular_sutures_textBox').style.display = 'block';
            document.getElementById('vascular_sutures_textBox').setAttribute('required', 'required'); 
        } else {
            document.getElementById('vascular_sutures_textBox').style.display = 'none';
            document.getElementById('vascular_sutures_textBox').removeAttribute('required'); 
        }
    });

    vascularNewIVAccessChecbox.addEventListener('change', function() {
        if (this.checked) { 
            document.getElementById('vascular_newIv_access_device_textBox').style.display = 'block';
            document.getElementById('vascular_newIv_access_device_textBox').setAttribute('required', 'required'); 
        } else {
            document.getElementById('vascular_newIv_access_device_textBox').style.display = 'none';
            document.getElementById('vascular_newIv_access_device_textBox').removeAttribute('required'); 
        }
    });

    salineFlushCheckbox.addEventListener('change', function() {
        if (this.checked) { 
            document.getElementById('saline_pre_textBox').style.display = 'block';
            document.getElementById('saline_post_textBox').style.display = 'block';
            document.getElementById('saline_pre_textBox').setAttribute('required', 'required'); 
            document.getElementById('saline_post_textBox').setAttribute('required', 'required'); 
        } else {
            document.getElementById('saline_pre_textBox').style.display = 'none';
            document.getElementById('saline_post_textBox').style.display = 'none';
            document.getElementById('saline_pre_textBox').removeAttribute('required'); 
            document.getElementById('saline_post_textBox').removeAttribute('required'); 
        }
    });

    heparinFlushCheckbox.addEventListener('change', function() {
        if (this.checked) { 
            document.getElementById('heparin_pre_textBox').style.display = 'block';
            document.getElementById('heparin_post_textBox').style.display = 'block';
            document.getElementById('heparin_pre_textBox').setAttribute('required', 'required'); 
            document.getElementById('heparin_post_textBox').setAttribute('required', 'required'); 
        } else {
            document.getElementById('heparin_pre_textBox').style.display = 'none';
            document.getElementById('heparin_post_textBox').style.display = 'none';
            document.getElementById('heparin_pre_textBox').removeAttribute('required'); 
            document.getElementById('heparin_post_textBox').removeAttribute('required'); 
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



    handleDisableAtStart();
    handleTherapySection();
    handleNeuroSection();
    handleCardiovascularSection();
    handleRespiratorySection();
    handleRespiratorySection();
    handleGastrointestinalSection();
    handleGenitourinarySection();
    handleMusculoskeletonSection();
    handleSkinSection();
    handleEndocrineSection();
    handleVascularSection();

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

        // sourabh
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
        "heparin_post_textBox": "heparin_post_textBox"

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
        "distended_Abdomen": "distended_Abdomen",
        "diarrhea": "diarrhea",
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
        "": "",



    };
    return idToAnsMap;
};