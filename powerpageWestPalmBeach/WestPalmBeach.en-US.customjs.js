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


let ValidationErrorStatus = {
  view_Privacy_Notice: false,
  patient_sign: false,
  patient_rp_sign: false,
  CGPatSignCanvas: false,
  legalRepresentative: false,
  PAuthorization: false
};



const showPatientSignature = () => {
  // signature functinality
  const canvas = document.getElementById('patient_sign');
  const context = canvas.getContext('2d');
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;

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

  function startDrawing(e) {
      isDrawing = true;
      const [x, y] = getCoordinates(e);
      [lastX, lastY] = [x, y];
  }

  function stopDrawing() {
      isDrawing = false;
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

  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDrawing);

  // for mobile view
  canvas.addEventListener('touchstart', startDrawing);
  canvas.addEventListener('touchmove', draw);
  canvas.addEventListener('touchend', stopDrawing);


  canvas.addEventListener('mouseout', () => {
      isDrawing = false;
      if (ValidationErrorStatus.patient_sign) {
          canvas.style.borderColor = '#ccdae4';
          document.getElementById('signature_validation').style.display = 'none';
      }
  });



  // Function to clear the canvas
  document.getElementById('clearButton').addEventListener('click', () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      if (ValidationErrorStatus.patient_sign) {
          canvas.style.borderColor = 'red';
          document.getElementById('signature_validation').style.display = 'block';
      }
  });
}


const showRPatientSignature = () => {
  // signature functinality
  const canvas = document.getElementById('patient_rp_sign');
  const context = canvas.getContext('2d');
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;

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

  function startDrawing(e) {
      isDrawing = true;
      const [x, y] = getCoordinates(e);
      [lastX, lastY] = [x, y];
  }

  function stopDrawing() {
      isDrawing = false;
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

  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDrawing);

  // for mobile view
  canvas.addEventListener('touchstart', startDrawing);
  canvas.addEventListener('touchmove', draw);
  canvas.addEventListener('touchend', stopDrawing);


  canvas.addEventListener('mouseout', () => {
      isDrawing = false;
      if (ValidationErrorStatus.patient_sign) {
          canvas.style.borderColor = '#ccdae4';
          document.getElementById('patient_rp_sign_validation').style.display = 'none';
      }
  });



  // Function to clear the canvas
  document.getElementById('RPClearButton').addEventListener('click', () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      if (ValidationErrorStatus.patient_sign) {
          canvas.style.borderColor = 'red';
          document.getElementById('patient_rp_sign_validation').style.display = 'block';
      }
  });
}

const showCGPatientSignature = () => {
  // signature functinality
  const canvas = document.getElementById('CGPatSignCanvas');
  const context = canvas.getContext('2d');
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;

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

  function startDrawing(e) {
      isDrawing = true;
      const [x, y] = getCoordinates(e);
      [lastX, lastY] = [x, y];
  }

  function stopDrawing() {
      isDrawing = false;
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

  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDrawing);

  // for mobile view
  canvas.addEventListener('touchstart', startDrawing);
  canvas.addEventListener('touchmove', draw);
  canvas.addEventListener('touchend', stopDrawing);


  canvas.addEventListener('mouseout', () => {
      isDrawing = false;
      if (ValidationErrorStatus.patient_sign) {
          canvas.style.borderColor = '#ccdae4';
          document.getElementById('CGPatSignCanvas_validation').style.display = 'none';
      }
  });



  // Function to clear the canvas
  document.getElementById('CGPatSignClearButton').addEventListener('click', () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      if (ValidationErrorStatus.patient_sign) {
          canvas.style.borderColor = 'red';
          document.getElementById('CGPatSignCanvas_validation').style.display = 'block';
      }
  });
}

const showLRPatientSignature = () => {
  // signature functinality
  const canvas = document.getElementById('legalRepresentative');
  const context = canvas.getContext('2d');
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;

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

  function startDrawing(e) {
      isDrawing = true;
      const [x, y] = getCoordinates(e);
      [lastX, lastY] = [x, y];
  }

  function stopDrawing() {
      isDrawing = false;
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

  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDrawing);

  // for mobile view
  canvas.addEventListener('touchstart', startDrawing);
  canvas.addEventListener('touchmove', draw);
  canvas.addEventListener('touchend', stopDrawing);


  canvas.addEventListener('mouseout', () => {
      isDrawing = false;
      if (ValidationErrorStatus.patient_sign) {
          canvas.style.borderColor = '#ccdae4';
          document.getElementById('legalRepresentative_validation').style.display = 'none';
      }
  });



  // Function to clear the canvas
  document.getElementById('LRClearButton').addEventListener('click', () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      if (ValidationErrorStatus.patient_sign) {
          canvas.style.borderColor = 'red';
          document.getElementById('legalRepresentative_validation').style.display = 'block';
      }
  });
}

const showAuthPatientSignature = () => {
  // signature functinality
  const canvas = document.getElementById('PAuthorization');
  const context = canvas.getContext('2d');
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;

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

  function startDrawing(e) {
      isDrawing = true;
      const [x, y] = getCoordinates(e);
      [lastX, lastY] = [x, y];
  }

  function stopDrawing() {
      isDrawing = false;
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

  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDrawing);

  // for mobile view
  canvas.addEventListener('touchstart', startDrawing);
  canvas.addEventListener('touchmove', draw);
  canvas.addEventListener('touchend', stopDrawing);


  canvas.addEventListener('mouseout', () => {
      isDrawing = false;
      if (ValidationErrorStatus.patient_sign) {
          canvas.style.borderColor = '#ccdae4';
          document.getElementById('PAuthorization_validation').style.display = 'none';
      }
  });



  // Function to clear the canvas
  document.getElementById('PAClearButton').addEventListener('click', () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      if (ValidationErrorStatus.patient_sign) {
          canvas.style.borderColor = 'red';
          document.getElementById('PAuthorization_validation').style.display = 'block';
      }
  });
}



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
              ValidationErrorStatus.payment_method = true;
              el.setAttribute('error', requiredControls[el.id]);
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


let formResponseId, signatureData;
document.addEventListener("DOMContentLoaded", async function() { 
  const checkboxes = [{
          checkbox: "#view_welcome_packet input",
          div: "#customer_policy"
      },
      {
          checkbox: "#view_Privacy_Notice input",
          div: "#notice_of_privacy_practices"
      },
      {
          checkbox: "#legal_represenative input",
          div: "#show_legal_represenative"
      },
      {
          checkbox: "#support_organizations input",
          div: "#Support_Organizations_area"
      },
      {
          checkbox: "#view_medicare_DMEPOS input",
          div: "#medicare_DMEPOS_english"
      },
      {
          checkbox: "#view_medicare_DMEPOS_spanish input",
          div: "#see_medicare_DMEPOS_sp_area"
      },
      {
          checkbox: "#click_pat_survey input",
          div: "#pat_satistaction_survey"
      }
  ];

  checkboxes.forEach(({
      checkbox,
      div
  }) => {
      const checkboxElem = document.querySelector(checkbox);
      const divElem = document.querySelector(div);

      checkboxElem.addEventListener("change", function() {
          divElem.style.display = checkboxElem.checked ? "block" : "none";
      });
  });

  const otherRadioButton = document.getElementById('resp_type_Other');
  const customInput = document.getElementById('txtRespTypeOther');
  const radioButtons = document.querySelectorAll('input[name="resp_type"]');
  

  radioButtons.forEach(radio => {
      radio.addEventListener('change', function() {
          if (otherRadioButton.checked) {
              customInput.style.display = 'block';
          } else {
              customInput.style.display = 'none';
          }
      });
  });

  const otherRadioButton1 = document.getElementById('insurance_type_Other');
    const customInput1 = document.getElementById('txtInsuranceTypeOther');
    const radioButtons1 = document.querySelectorAll('input[name="insurance_type"]');

    radioButtons1.forEach(radio => {
        radio.addEventListener('change', function() {
            if (otherRadioButton1.checked) {
                customInput1.style.display = 'inline-block';
            } else {
                customInput1.style.display = 'none';
            }
        });
    });

  // Step 3
  showPatientSignature('patient_sign', 'clearButton', 'patient_sign_validation', ValidationErrorStatus.patient_sign);
  // Step 4
  showRPatientSignature('patient_rp_sign', 'RPClearButton', 'patient_rp_sign_validation', ValidationErrorStatus.patient_rp_sign);
  // // Step 5
  showCGPatientSignature('CGPatSignCanvas', 'CGPatSignClearButton', 'CGPatSignCanvas_validation', ValidationErrorStatus.CGPatSignCanvas);
  // // Step 6
  showLRPatientSignature('legalRepresentative', 'LRClearButton', 'legalRepresentative_validation', ValidationErrorStatus.legalRepresentative);

  showAuthPatientSignature('PAuthorization', 'PAClearButton', 'PAuthorization_validation', ValidationErrorStatus.PAuthorization);



  commonFormOpeation.showSpinner('overlay-spinner', true);

  {
      const headerForm = document.getElementById('header_form');
      const headerFormText = document.getElementById('header_form_text');

      headerForm.style.display = 'block';
      headerFormText.innerText = 'Patient Admission Booklet - West Palm Beach';
  }
  const searchParams = new URLSearchParams(window.location.search);
  formResponseId = searchParams.get('id');
  showPatientSignature();
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

      var element = document.getElementById('form_hide');
      if (element !== null) {
        // Access the style property
        var style = element.style;
        alert(style);
      } else {
        // Handle the case where the element does not exist
      }

      document.getElementById('form_hide').style.display = 'none';
      commonFormOpeation.showSpinner('overlay-spinner', false);
      // showToast('failed', 'Not valid url.');
      document.getElementById('formInvalidCondition').innerText = 'Not valid url.';
      document.getElementById('formInvalidCondition').style.display = 'block';
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
          return;
      } else if (formData.happ_formstatus === statusMap.Expired) {
          document.getElementById('form_hide').style.display = 'none';
          commonFormOpeation.showSpinner('overlay-spinner', false);
          // showToast('success', 'Form is Submitted and it is under review by nurse.');
          document.getElementById('formInvalidCondition').innerText = 'Link is already expired.';
          document.getElementById('formInvalidCondition').style.display = 'block';
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
          fname: formData.happ_PatientList.happ_patientfirstname,
          lname: formData.happ_PatientList.happ_patientlastname,
          mrn: formData.happ_PatientList.happ_mrn
      });

      // signatureData = signatureData?.value;
      //
      console.log('formData', formData, fromResponses);

      commonFormOpeation.setFormDataFromSave(getQuestionToIdMap(), getAnswerToIdMap(), JSON.parse(fromResponses));
  }
  signatureData = await signatureTask;
  if (signatureData) {
      commonFormOpeation.setSignatureFromSave('patient_sign', signatureData[0]?.happ_signature /*window.localStorage.getItem(`${formResponseId}-sig`)*/ );
  }
  // hideAndShowLogic();
  if (formData) formViewOrEdit(formData.happ_formstatus);


  document.getElementById("save-draft").addEventListener('click', async () => {
      commonFormOpeation.showSpinner('overlay-spinner', true);
      const formDataMap = commonFormOpeation.getFormDataToSave(getQuestionToIdMap(), getAnswerToIdMap());
      console.log('formValues', formDataMap);
      await SaveFormResponse(formResponseId, statusMap.Pending, JSON.stringify(formDataMap));
      const signatureURLData = commonFormOpeation.getSignatureDataToSave('patient_sign');
      CreateHistoryByFormResponseId(formResponseId, 'SaveAsDraft', `Patient saved the form as a draft.`);
      if (signatureData) await SaveSignature(signatureData[0].happ_esignatureid, signatureURLData);
      commonFormOpeation.showSpinner('overlay-spinner', false);
      notify('Your form has been successfully saved as a draft!.', 'success');
  });

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

  [...document.querySelectorAll('input[name="fname"],input[name="lname"]')].forEach((e) => {
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

function handleNext() {
  // validateFormData();
  const stepper = document.querySelector('common-stepper');
  const currentStepAttr = stepper.getAttribute('current-step');
  const currentStep = currentStepAttr ? parseInt(currentStepAttr, 10) : 0;
  const stepsAttr = stepper.getAttribute('steps');
  const totalSteps = stepsAttr ? stepsAttr.split(',').length : 0;

  if (!validateForm(currentStep - 1)) {
      return;
  }
  const step6 = document.getElementById('stepContent6');
  if (currentStep < totalSteps) {
      stepper.setAttribute('current-step', currentStep + 1);


      if (getComputedStyle(step6).display === 'block') {
          onSubmit();
      }
  }
}

// Function to handle the previous step
function handlePrevious() {
  const stepper = document.querySelector('common-stepper');
  const currentStepAttr = stepper.getAttribute('current-step');
  const currentStep = currentStepAttr ? parseInt(currentStepAttr, 10) : 0;

  if (currentStep > 1) {
      stepper.setAttribute('current-step', currentStep - 1);
  }
}



const getQuestionToIdMap = () => {
  const idToQueMap = {
    // step 3
      "fname": "5f5b9926-2a18-ef11-9f89-002248095c06", 
      "lname": "853b7a6a-2a18-ef11-9f89-000d3a5c0fc6",  
      "mrn": "b14d4575-2a18-ef11-9f89-002248095c06",  
      "date_sign": "604c5a8e-2a18-ef11-9f89-002248095c06",  
      "LegalGName": "4b66d09d-2a18-ef11-9f89-000d3a371898",  
      "patient_sign": "0f3a1ff0-2a18-ef11-9f89-002248095c06", 
      "ProWitName": "2ab45561-2b18-ef11-9f89-000d3a371898", 
      "date": "17f8f269-2b18-ef11-9f89-002248095c06", 
    // step 4
      "NPPfname": "ebe2c243-2d18-ef11-9f89-002248095c06", 
      "NPPlname": "6aaf4059-2d18-ef11-9f89-002248095c06",  
      "sign_date": "b7952088-2d18-ef11-9f89-002248095c06",  
      "patient_rp_sign": "b7952088-2d18-ef11-9f89-002248095c06", 
    // step 4.1
      "LRfname": "41c2b4f7-2d18-ef11-9f89-002248095c06",  
      "LRlname": "c5011a09-2e18-ef11-9f89-000d3a371898", 
      "LRsign_date": "f6f2391b-2e18-ef11-9f89-000d3a371898", 
      "legalRepresentative": "ac962c2d-2e18-ef11-9f89-000d3a371898",  
    // step 5
      "PCGfname": "62b56506-2f18-ef11-9f89-002248095c06",  
      "PCGlname": "e4690516-2f18-ef11-9f89-000d3a371898", 
      "RelationshipToPatient": "10883d26-2f18-ef11-9f89-002248095c06", 
      "description_of_concern": "25de685e-2f18-ef11-9f89-000d3a371898", 
      "formCompletedBy": "4da2496c-2f18-ef11-9f89-002248095c06", 
      "ConcernGrievance_date": "65ea8079-2f18-ef11-9f89-002248095c06",  
      "CGPatSignCanvas": "03318d99-2f18-ef11-9f89-002248095c06", 
      "resp_type": "", 
      "insurance_type": "48b75668-cc0d-ef11-9f89-000d3a30dc90", 
      "PharmacySerLoc": "", 
      "whenYou_started": "6a44962d-3518-ef11-9f89-002248095c06", 
      "How_satisfied_are1": "f0da0744-3518-ef11-9f89-000d3a371898", 
      "How_satisfied_are2": "1a28dc4e-3518-ef11-9f89-000d3a5c0fc6", 
      "How_satisfied_are3": "7abf446c-3518-ef11-9f89-000d3a371898", 
      "How_satisfied_are4": "2c8e1a7b-3518-ef11-9f89-002248095c06", 
      "How_would_you_rate1": "998bec55-3518-ef11-9f89-002248095c06", 
      "How_would_you_rate2": "12663562-3518-ef11-9f89-002248095c06", 
      "How_would_you_rate3": "ca25c473-3518-ef11-9f89-000d3a371898",  
    // step 6
      "patient_fname": "84e40d28-3818-ef11-9f89-000d3a371898",  
      "patient_lname": "e9f21735-3818-ef11-9f89-002248095c06", 
      "do_date": "4540a883-3818-ef11-9f89-002248095c06", 
      "patient_address": "53e62765-3818-ef11-9f89-000d3a371898", 
      "patient_cell_phone": "3b7a0c71-3818-ef11-9f89-002248095c06", 
      "PA_DOB_date": "5a500e41-3818-ef11-9f89-002248095c06", 
      "PAuthorization": "0454a58f-3818-ef11-9f89-002248095c06", 
  };


  // const queToIdMap = Object.fromEntries(new Map(Object.keys(idToQueMap).map((k) => [idToQueMap[k], k])));
  return idToQueMap;
}
const getAnswerToIdMap = () => {
  const idToAnsMap = {
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
  };
  return idToAnsMap;
}