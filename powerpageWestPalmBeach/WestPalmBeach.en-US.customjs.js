 
 const requiredControlsStep3 = {
  'lname': 'Please enter last name.',
  'fname': 'Please enter first name.',
  'mrn': 'Please select mrn.',
  'date_sign': 'Please select signature date.',
  'ProWitName': 'Please select witness date.',
};
const requiredControlsStep4 = {
  'view_Privacy_Notice': 'Please check.',
  'sign_date': 'Please select signature date.',
  'NPPlname': 'Please enter last name.',
  'NPPfname': 'Please enter first name.',
};
const requiredControlsStep6 = {
  'patient_fname': 'Please enter last name.',
  'patient_lname': 'Please enter first name.',
  'PA_DOB_date': 'Please enter date of birth.',
  'do_date': 'Please select signature date.',
  'patient_cell_phone': 'Please enter cell phone. ',
};

let ValidationErrorStatus = {
  view_Privacy_Notice:false, 
  patient_sign: false,
  patient_rp_sign: false,
  CGPatSignCanvas: false,
  legalRepresentative: false,
  PAuthorization: false
 };
 document.addEventListener("DOMContentLoaded", function() {
    const checkboxes = [
      { checkbox: "#view_welcome_packet input", div: "#customer_policy" },
      { checkbox: "#view_Privacy_Notice input", div: "#notice_of_privacy_practices" },
      { checkbox: "#legal_represenative input", div: "#show_legal_represenative" },
      { checkbox: "#support_organizations input", div: "#Support_Organizations_area" },
      { checkbox: "#view_medicare_DMEPOS input", div: "#medicare_DMEPOS_english" },
      { checkbox: "#view_medicare_DMEPOS_spanish input", div: "#see_medicare_DMEPOS_sp_area" },
      { checkbox: "#click_pat_survey input", div: "#pat_satistaction_survey" }
    ];

    checkboxes.forEach(({ checkbox, div }) => {
      const checkboxElem = document.querySelector(checkbox);
      const divElem = document.querySelector(div);

      if (checkboxElem && divElem) {
        checkboxElem.addEventListener("change", function () {
          divElem.style.display = checkboxElem.checked ? "block" : "none";
        });
      } else {
        console.warn(`Element not found for selector: ${checkbox} or ${div}`);
      }
    });
  
  // Step 3
  showPatientSignature('patient_sign', 'clearButton', 'patient_sign_validation',ValidationErrorStatus.patient_sign);
 
  
  // Step 4
  showPatientSignature('patient_rp_sign', 'RPClearButton','patient_rp_sign_validation',ValidationErrorStatus.patient_rp_sign );
  // Step 5
  showPatientSignature('CGPatSignCanvas', 'CGPatSignClearButton','CGPatSignCanvas_validation',ValidationErrorStatus.CGPatSignCanvas);
  // Step 6
  showPatientSignature('legalRepresentative', 'LRClearButton','legalRepresentative_validation',ValidationErrorStatus.legalRepresentative);
  showPatientSignature('PAuthorization', 'PAClearButton','PAuthorization_validation',ValidationErrorStatus.PAuthorization);
 

});


function showPatientSignature(canvasId,clearButtonId,ValidationCanvasID,ValSignErrorName) {
  // signature functinality
  const canvas = document.getElementById(canvasId);
  if (!canvas) { 
    return;
  }
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
      if (ValSignErrorName) {
          canvas.style.borderColor = '#ccdae4';
          document.getElementById(ValidationCanvasID).style.display = 'none';
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
  document.getElementById(clearButtonId).addEventListener('click', () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      if (ValSignErrorName) {
          canvas.style.borderColor = 'red';
          document.getElementById(ValidationCanvasID).style.display = 'block';
      }
  });
}
 
const isCanvasBlank = (canvas) => {
  return !canvas.getContext('2d')
      .getImageData(0, 0, canvas.width, canvas.height).data
      .some(channel => channel !== 0);
};
   

   
const getQuestionToIdMap = () => {
  const idToQueMap = {
    "satisfied_process": "656c9d72-cd0d-ef11-9f89-000d3a5c0fc6",
    "satisfied_delivery": "778c2887-cd0d-ef11-9f89-0022480aba6f",
    "satisfied_quality": "988a66a8-cd0d-ef11-9f89-000d3a5c0fc6",
    "rate_effectiveness": "96c668bf-cd0d-ef11-9f89-00224804e6b7",
    "rate_pharmacy_services": "a8a1a9d4-cd0d-ef11-9f8a-000d3a344bb4",
    "satisfied_nursing_services": "652338ea-cd0d-ef11-9f89-000d3a5c0fc6",
    "rate_information_education": "fde0ccfe-cd0d-ef11-9f89-002248083e6b",
    "satisfied_employees_politeness": "b6684b33-ce0d-ef11-9f89-0022480aba6f",
    "survey_link": "b9902001-cc0d-ef11-9f89-00224809cc82",
    "date": "27479fb0-0c0d-ef11-9f89-000d3a5c0fc6",
    "concern_description": "156e1ee0-cb0d-ef11-9f89-0022480aba6f",
    "form_completed_by": "81ad9de5-cb0d-ef11-9f89-00224804e6b7",
    "insurance_type_other": "48b75668-cc0d-ef11-9f89-000d3a30dc90",
    "insurance_type": "50438646-cc0d-ef11-9f89-002248095c06",
    "legal_guardian_name": "9fbaf7b7-0c0d-ef11-9f89-00224809cc82",
    "legal_representative": "fb6cc2ac-cb0d-ef11-9f89-000d3a5c0fc6",
    "legal_representative_2": "3c2794ba-cb0d-ef11-9f89-0022480aba6f",
    "legal_representative_signature": "1fe2bfc6-cb0d-ef11-9f89-000d3a30dc90",
    "lp_date": "d2759abb-cb0d-ef11-9f89-002248095c06",
    "npp_date": "2fc00c95-cb0d-ef11-9f89-0022480aba6f",
    "npp_patient_name": "2bc00c95-cb0d-ef11-9f89-0022480aba6f",
    "npp_patient_signature": "ef53b79d-cb0d-ef11-9f89-002248095c06",
    "patient_address": "3d16c78d-ce0d-ef11-9f89-0022480aba6f",
    "patient_cell_phone": "f9b80090-ce0d-ef11-9f89-002248095c06",
    "patient_date_of_birth": "c6d9c584-ce0d-ef11-9f8a-000d3a344bb4",
    "patient_first_name": "de06efa9-0c0d-ef11-9f89-002248095c06",
    "patient_signature": "5e90b4a2-ce0d-ef11-9f8a-000d3a344bb4",
    "pauth_date": "4632d397-ce0d-ef11-9f89-000d3a5c0fc6",
    "pauth_patient_last_name": "19a4486e-ce0d-ef11-9f89-0022480aba6f",
    "pauth_patient_name": "2b77f959-ce0d-ef11-9f89-0022480aba6f",
    "pcg_date": "c6d6b2eb-cb0d-ef11-9f89-002248095c06",
    "pcg_patient_name": "eacb89d7-cb0d-ef11-9f89-000d3a301454",
    "pcg_relationship": "a205b7dc-cb0d-ef11-9f89-000d3a5c0fc6",
    "pcg_signature": "26b090f1-cb0d-ef11-9f89-00224804e6b7",
    "pharmacy_location": "8c255c8e-cc0d-ef11-9f89-002248095c06",
    "provider_witness": "f4390acc-0c0d-ef11-9f89-002248095c06",
    "pv_date": "db05c9cf-0c0d-ef11-9f89-000d3a5c0fc6",
    "respondent_other": "f11e3e1f-cc0d-ef11-9f89-000d3a301454",
    "respondent_type": "50fe6018-cc0d-ef11-9f89-0022480aba6f",
    "patient_guardian_signature": "0ac90ebc-0c0d-ef11-9f89-002248083e6b",
    "medicare_dme_standards_english": "eafd26c4-ce0d-ef11-9f89-00224809cc82",
    "medicare_dme_standards_spanish": "43e965ce-ce0d-ef11-9f89-00224809cc82",
    "privacy_practices_notice": "7434e286-ca0d-ef11-9f89-00224804e6b7",
    "support_organizations": "145d88ad-ce0d-ef11-9f89-000d3a301454",
    "welcome_packet": "0cc44dd0-f60d-ef11-9f89-000d3a5c0fc6"
  };


  // const queToIdMap = Object.fromEntries(new Map(Object.keys(idToQueMap).map((k) => [idToQueMap[k], k])));
  return idToQueMap;
}
const getAnswerToIdMap = () => {
  const idToAnsMap = {
    "respondent_patient": "fccf4519-cc0d-ef11-9f89-000d3a301454",
    "respondent_other": "4456a618-cc0d-ef11-9f89-000d3a5c0fc6",
    "respondent_caregiver": "bba4b016-cc0d-ef11-9f89-002248095c06",
    "satisfaction_very_dissatisfied_1_1": "4f8cd0c2-cd0d-ef11-9f89-000d3a301454",
    "satisfaction_very_dissatisfied_1_2": "c772e901-ce0d-ef11-9f89-000d3a30dc90",
    "satisfaction_very_dissatisfied_1_3": "71cb0a38-ce0d-ef11-9f89-000d3a30dc90",
    "satisfaction_very_dissatisfied_1_4": "0f56b389-cd0d-ef11-9f8a-000d3a344bb4",
    "satisfaction_very_dissatisfied_1_5": "43a2a9d4-cd0d-ef11-9f8a-000d3a344bb4",
    "satisfaction_very_dissatisfied_1_6": "b7ae6fa7-cd0d-ef11-9f89-00224804e6b7",
    "satisfaction_very_dissatisfied_1_7": "c74e40e8-cd0d-ef11-9f89-00224804e6b7",
    "satisfaction_very_dissatisfied_1_8": "2555db78-cd0d-ef11-9f89-002248095c06",
    "satisfaction_somewhat_dissatisfied_2_1": "d006e1aa-cd0d-ef11-9f89-000d3a301454",
    "satisfaction_somewhat_dissatisfied_2_1": "2675b9d4-cd0d-ef11-9f89-000d3a301454",
    "satisfaction_somewhat_dissatisfied_2_3": "f1809a78-cd0d-ef11-9f89-000d3a5c0fc6",
    "satisfaction_somewhat_dissatisfied_2_4": "d9b50838-ce0d-ef11-9f89-000d3a5c0fc6",
    "satisfaction_somewhat_dissatisfied_2_5": "31c768bf-cd0d-ef11-9f89-00224804e6b7",
    "satisfaction_somewhat_dissatisfied_2_6": "50819bea-cd0d-ef11-9f89-002248083e6b",
    "satisfaction_somewhat_dissatisfied_2_7": "ffe0ccfe-cd0d-ef11-9f89-002248083e6b",
    "satisfaction_somewhat_dissatisfied_2_8": "447fe08d-cd0d-ef11-9f89-0022480aba6f",
    "satisfaction_neutral_3_1": "2534f98c-cd0d-ef11-9f89-000d3a301454",
    "satisfaction_neutral_3_2": "9a221dc1-cd0d-ef11-9f8a-000d3a344bb4",
    "satisfaction_neutral_3_3": "a3f74ad2-cd0d-ef11-9f89-000d3a5c0fc6",
    "satisfaction_neutral_3_4": "2c020278-cd0d-ef11-9f89-002248083e6b",
    "satisfaction_neutral_3_5": "273d7ffe-cd0d-ef11-9f89-002248095c06",
    "satisfaction_neutral_3_6": "30efae34-ce0d-ef11-9f89-002248095c06",
    "satisfaction_neutral_3_7": "6a1bbfaa-cd0d-ef11-9f89-00224809cc82",
    "satisfaction_neutral_3_8": "60fad4ec-cd0d-ef11-9f89-00224809cc82",
    "satisfaction_somewhat_satisfied_4_1": "c9808ffe-cd0d-ef11-9f89-000d3a301454",
    "satisfaction_somewhat_satisfied_4_2": "61cb0a38-ce0d-ef11-9f89-000d3a30dc90",
    "satisfaction_somewhat_satisfied_4_3": "0ff99977-cd0d-ef11-9f89-00224804e6b7",
    "satisfaction_somewhat_satisfied_4_4": "8dae6fa7-cd0d-ef11-9f89-00224804e6b7",
    "satisfaction_somewhat_satisfied_4_5": "26415bd1-cd0d-ef11-9f89-00224804e6b7",
    "satisfaction_somewhat_satisfied_4_6": "bfe8a2c0-cd0d-ef11-9f89-002248095c06",
    "satisfaction_somewhat_satisfied_4_7": "427fe08d-cd0d-ef11-9f89-0022480aba6f",
    "satisfaction_somewhat_satisfied_4_8": "82fc52eb-cd0d-ef11-9f89-0022480aba6f",
    "satisfaction_very_satisfied_5_1": "8ef5e3a4-cd0d-ef11-9f89-000d3a301454",
    "satisfaction_very_satisfied_5_2": "1173e901-ce0d-ef11-9f89-000d3a30dc90",
    "satisfaction_very_satisfied_5_3": "7e6ec377-cd0d-ef11-9f8a-000d3a344bb4",
    "satisfaction_very_satisfied_5_4": "a9c668bf-cd0d-ef11-9f89-00224804e6b7",
    "satisfaction_very_satisfied_5_5": "420d7035-ce0d-ef11-9f89-00224804e6b7",
    "satisfaction_very_satisfied_5_6": "065f35d1-cd0d-ef11-9f89-002248083e6b",
    "satisfaction_very_satisfied_5_7": "c1bfc98b-cd0d-ef11-9f89-00224809cc82",
    "satisfaction_very_satisfied_5_8": "7ffc52eb-cd0d-ef11-9f89-0022480aba6f",
    "insurance_aetna": "81438646-cc0d-ef11-9f89-002248095c06",
    "insurance_anthem": "49766a48-cc0d-ef11-9f8a-000d3a344bb4",
    "insurance_bcbs": "680fa145-cc0d-ef11-9f89-00224804e6b7",
    "state_ca": "44422e8d-cc0d-ef11-9f89-000d3a5c0fc6",
    "insurance_cigna": "98438646-cc0d-ef11-9f89-002248095c06",
    "survey_link": "ba902001-cc0d-ef11-9f89-00224809cc82",
    "state_fl": "f8684c8e-cc0d-ef11-9f89-00224809cc82",
    "insurance_humana": "a68af146-cc0d-ef11-9f89-00224809cc82",
    "state_la": "17194291-cc0d-ef11-9f89-000d3a301454",
    "legal_representative": "41bd09ae-cb0d-ef11-9f89-00224809cc82",
    "state_md": "f5684c8e-cc0d-ef11-9f89-00224809cc82",
    "insurance_medicaid": "400fa145-cc0d-ef11-9f89-00224804e6b7",
    "insurance_medicare": "35627a45-cc0d-ef11-9f89-0022480aba6f",
    "state_nj": "70d39691-cc0d-ef11-9f8a-000d3a344bb4",
    "insurance_other": "d2438646-cc0d-ef11-9f89-002248095c06",
    "state_pa": "6933e68e-cc0d-ef11-9f89-0022480aba6f",
    "insurance_prime_therapeutics": "b1fe2b49-cc0d-ef11-9f89-000d3a301454",
    "state_tx": "b9255c8e-cc0d-ef11-9f89-002248095c06",
    "insurance_united_healthcare": "37627a45-cc0d-ef11-9f89-0022480aba6f",
    "state_unknown": "f9684c8e-cc0d-ef11-9f89-00224809cc82",
    "medicare_dme_standards_english": "ebfd26c4-ce0d-ef11-9f89-00224809cc82",
    "medicare_dme_standards_spanish": "f8ebc4cc-ce0d-ef11-9f89-002248083e6b",
    "privacy_practices_notice": "a9c79889-ca0d-ef11-9f89-0022480aba6f",
    "support_organizations": "7a38b9af-ce0d-ef11-9f89-000d3a5c0fc6"
  };
  return idToAnsMap;
}

