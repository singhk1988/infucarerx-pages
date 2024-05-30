const requiredControlsStep3 = {
    'lname': 'Please enter last name.',
    'fname': 'Please enter first name.',
    'mrn': 'Please select mrn.',
    'date_sign': 'Please select signature date.',
    //'date': 'Please select witness date.',
  
  };
  
  const requiredControlsStep4 = {
    'view_Privacy_Notice': 'Please check.', 
    'sign_date': 'Please select signature date.',
    'NPPlname': 'Please enter last name.',
    'NPPfname': 'Please enter first name.', 
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
    document.addEventListener("DOMContentLoaded", async function() {
      nextAndprevbtnwithsavedraft();
      checkboxHideandShow();
      showOtherInputOnchecked();
    
      setupSignatureCanvas('patient_sign', 'clearButton', 'patient_sign_validation');
      setupSignatureCanvas('patient_rp_sign', 'RPClearButton', 'patient_rp_sign_validation');
      setupSignatureCanvas('CGPatSignCanvas', 'CGPatSignClearButton', 'CGPatSignCanvas_validation');
      setupSignatureCanvas('legalRepresentative', 'LRClearButton', 'legalRepresentative_validation');
      setupSignatureCanvas('PAuthorization', 'PAClearButton', 'PAuthorization_validation');
    
      commonFormOpeation.showSpinner('overlay-spinner', true);
    
      {
          const headerForm = document.getElementById('header_form');
          const headerFormText = document.getElementById('header_form_text');
    
          headerForm.style.display = 'block';
          headerFormText.innerText = 'Patient Admission Booklet - West Palm Beach';
      }
      const searchParams = new URLSearchParams(window.location.search);
      formResponseId = searchParams.get('id');
  
      fromResponses = window.localStorage.getItem(formResponseId);
      commonFormOpeation.setFormDataFromSave(getQuestionToIdMap(), getAnswerToIdMap(), fromResponses ? JSON.parse(fromResponses) : undefined, 'False');
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
  
  
  function showOtherInputOnchecked(){
      const otherRadioButton = document.getElementById('respodent_type_Other');
  const customInput = document.getElementById('respodent_type_Other-text');
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
  
  
  // class CommonStepper extends HTMLElement {
  //   constructor() {
  //       super();
  //       this.currentStep = 1;
  //       this.steps = [];
  //       this.render();
  //   }
  
  //   connectedCallback() {
  //       // Parse the steps attribute value as JSON array
  //       this.steps = JSON.parse(this.getAttribute('steps'));
  //       this.render();
  //   }
  
  //   render() {
  //       const steps = JSON.parse(this.getAttribute('steps'));
  //       const totalSteps = steps.length;
  //       this.innerHTML = `
  //     <style>
  //     .steps {
  //         display: flex;
  //         align-items: flex-start;
  //         justify-content: center;
  //     }
  //     p {
  //         margin-top: 0 !important; 
  //         margin-bottom: 0 !important;
  //     }
  //     h4 {
  //         margin-top: 0 !important; 
  //         margin-bottom: 0 !important;
  //     }
  //     .step {
  //         display: flex;
  //         justify-content: center;
  //         align-items: center;
  //         flex-direction:column;
  //         gap: 5px;
  //         flex: 1;
  //         cursor: pointer;
          
  //     }
  //     .step-number {
  //         width: 40px;
  //         height: 40px;
  //         border: 2px solid #ddd;
  //         border-radius: 50%;
  //         display: flex;
  //         justify-content: center;
  //         align-items: center;
          
  //     }
  //     .step h4 {  
  //         font-size: 12px;
  //         text-align: center;
  //     }
  //     .step .active {
  //         background-color: #007bff;
  //         color: #fff;
  //     }
  //     .active-header {
  //         color: #444;
  //         font-weight: bold;
  //         font-size:20px;
  //     }
  //     .progress-bar {
  //         height: 4px;
  //         background-color: #007bff;
  //         margin-top: 10px;
  //     }
  //     .line-wrapper {
  //         width: 100%;
  //     }
  //     .line1 {
  //         height:50px;
  //         width: 100%;
  //         display: flex;
  //         align-items: center;
  //     }
  //     .line {
  //         width: 100%;
  //         height: 4px;
  //         background-color: #ddd;
          
  //     }
  //     .line-completed .line{
  //         background-color: green;
  //     }
  //     .line-blue .line {
  //         background-color: #007bff;
  //     }
  //     .completed {
  //         background-color: green;
  //         color: white;
  //     }
  //     .step-number .check {
  //         display: none;
  //     }
      
  //     .completed .check {
  //         display: block !important;
  //     }
  
      
      
  //     </style>
  //     <div class="steps mt-2">
  //         ${steps.map((label, index) => `
  //             <div class="step" data-step="${index + 1}">
  //             <p class="step-number ${index === 0 ? 'active' : ''}">
  //                 <span class="step-index-number">${index + 1}</span>
  //                 <span class="check">✔</span>
  //             </p>
  
  //             <h4 class="step-header ${index === 0 ? 'active-header' : ''}">${label}</h4>
  //             </div>
  //             ${index < totalSteps - 1 ? '<div class="line1"><div class="line" id="line"></div></div>' : ''}
  //         `).join('')}
  //     </div>
  //     <!-- <div class="progress-bar-container">
  //         <div class="progress-bar" style="width: ${this.currentStep * (100 / totalSteps)}%;"></div>
  //         <div class="content"></div>
  //     </div> -->
  // `;
  //       this.loadStepContent(1);
  //   }
  
  //   static get observedAttributes() {
  //       return ['steps', 'current-step', 'next-button', 'prev-button'];
  //   }
  
  //   attributeChangedCallback(name, oldValue, newValue) {
  //       console.log("Attribute changed:", name, "Old value:", oldValue, "New value:", newValue);
  //       if (name === 'current-step' && newValue) {
  //           this.currentStep = parseInt(newValue);
  //           this.loadStepContent(this.currentStep);
  //       }
  //   }
  //   loadStepContent(step) {
  //       const stepContentDiv = document.getElementById(`stepContent${step}`);
  //       if (stepContentDiv) {
  //           const stepContentDivs = document.querySelectorAll('.step-content');
  //           stepContentDivs.forEach(div => div.style.display = 'none');
  //           stepContentDiv.style.display = 'block';
  
  //           const steps = this.querySelectorAll('.step-number');
  //           const stepsHeader = this.querySelectorAll('.step-header');
  //           const stepsLine = this.querySelectorAll('.line1');
  
  //           if (steps && stepsHeader && stepsLine) {
  //               steps.forEach(stepEl => stepEl.classList.remove('active', 'completed'));
  //               stepsHeader.forEach(header => header.classList.remove('active-header'));
  //               stepsLine.forEach(line => line.classList.remove('line-completed', 'line-blue'));
  
  //               for (let i = 0; i < step - 1; i++) {
  //                   if (steps[i] && stepsLine[i]) {
  //                       steps[i].classList.add('completed');
  //                       stepsLine[i].classList.add('line-completed');
  //                       steps[i].querySelector('.step-index-number').style.display = 'none';
  //                   }
  //               }
  
  //               if (steps[step - 1] && stepsHeader[step - 1]) {
  //                   steps[step - 1].querySelector('.step-index-number').style.display = 'block';
  //                   steps[step - 1].classList.add('active');
  //                   stepsHeader[step - 1].classList.add('active-header');
  //               }
  
  //               if (step > 1 && stepsLine[step - 2]) {
  //                   stepsLine[step - 2].classList.add('line-blue');
  //               }
  //               if (step < steps.length && stepsLine[step - 1]) {
  //                   stepsLine[step - 1].classList.add('line-green');
  //               }
  //           }
  //       }
  //   }
  
  //   getStepLabel(stepIndex) {
  //       const steps = JSON.parse(this.getAttribute('steps'));
  //       if (stepIndex >= 0 && stepIndex < steps.length) {
  //           return steps[stepIndex];
  //       } else {
  //           return null;
  //       }
  //   }
  
  //   setStepLabel(stepIndex, newLabel) {
  //       const steps = JSON.parse(this.getAttribute('steps'));
  //       if (stepIndex >= 0 && stepIndex < steps.length) {
  //           steps[stepIndex] = newLabel;
  //           this.setAttribute('steps', JSON.stringify(steps));
  //           this.render();
  //       }
  //   }
  // }
  
  // customElements.define('common-stepper', CommonStepper);
  
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
          if(prevButton) prevButton.style.display = 'none';
      } else {
          if(prevButton) prevButton.style.display = 'inline-block';
      }
      const saveBtnStep = document.getElementById('saveBtn');
      const nextButton = document.getElementById('nextButton');
      if (currentStep === totalSteps) {
        if(nextButton) nextButton.style.display = 'none';
        if(saveBtnStep) saveBtnStep.style.display = 'inline-block';
    
      } else {
          if(nextButton) nextButton.style.display = 'inline-block';
          if(saveBtnStep) saveBtnStep.style.display = 'none';
      }
    }
    
    function nextAndprevbtnwithsavedraft(){
      const stepper = document.querySelector('common-stepper');
      const currentStep = parseInt(stepper.getAttribute('current-step'));
      const totalSteps = stepper.getAttribute('steps').split(',').length;
      updateButtonVisibility(currentStep, totalSteps);
  }
   
   
  
  
  const getQuestionToIdMap = () => {
    const idToQueMap = {
  
              
          // step 2
          "view_welcome_packet": "e8179d84-981d-ef11-840a-002248095c06", 
          
          // step 4
      
          "legal_represenative":"4712c396-981d-ef11-840a-000d3a5c0fc6", 
          "view_Privacy_Notice":"90ec274a-991d-ef11-840a-000d3a371898",
      
          // step 5
          
          "click_pat_survey":"7356c25b-991d-ef11-840a-000d3a371898",
          // step 6
      
          "support_organizations":"2b48f87a-991d-ef11-840a-000d3a371898",
          "view_medicare_DMEPOS":"c540b182-991d-ef11-840a-000d3a5c0fc6",
          "view_medicare_DMEPOS_spanish":"1210ab94-991d-ef11-840a-002248095c06",
  
  
        // step 3
        "fname": "c0c72e46-eb1b-ef11-840a-000d3a371898",
        "lname": "18d6454e-eb1b-ef11-840a-000d3a371898", 
        "date_sign": "68a4b554-eb1b-ef11-840a-000d3a371898",
        "LegalGName": "b9d18769-eb1b-ef11-840a-002248095c06",
        "patient_sign": "8ab7c590-eb1b-ef11-840a-002248095c06",
        "ProWitName": "4e8bfb72-eb1b-ef11-840a-000d3a371898",
        "date": "88c61f7b-eb1b-ef11-840a-002248095c06",
        // step 4 
        "sign_date": "ad2813a7-eb1b-ef11-840a-000d3a371898",
        "patient_rp_sign": "1f4b2dbb-eb1b-ef11-840a-002248095c06",
        // step 4.1
        "LRfname": "daca68ce-eb1b-ef11-840a-002248095c06",
        "LRlname": "c16c5fde-eb1b-ef11-840a-002248095c06",
        "LRsign_date": "eaf5111a-ec1b-ef11-840a-000d3a371898",
        "legalRepresentative": "36073d22-ec1b-ef11-840a-000d3a371898",
        // step 5
        "PCGfname": "e2cab33a-ec1b-ef11-840a-000d3a371898",
        "PCGlname": "5aa54150-ec1b-ef11-840a-000d3a371898",
        "RelationshipToPatient": "f8f80964-ec1b-ef11-840a-000d3a371898",
        "description_of_concern": "96a7d06e-ec1b-ef11-840a-000d3a371898",
        "formCompletedBy": "0f77c574-ec1b-ef11-840a-002248095c06",
        "ConcernGrievance_date": "bf577b7b-ec1b-ef11-840a-000d3a371898",
        "CGPatSignCanvas": "dbcff89f-ec1b-ef11-840a-002248095c06",
        "resp_type": "d0d9edc0-ec1b-ef11-840a-000d3a371898",
        "insurance_type": "5c36f70a-ed1b-ef11-840a-000d3a371898",
        "PharmacySerLoc": "0ad9d93f-ed1b-ef11-840a-002248095c06",
  
        "whenYou_started": "ddc5f884-ed1b-ef11-840a-002248095c06",
  
        "How_satisfied_are1": "30366088-ed1b-ef11-840a-000d3a371898",      
        "How_satisfied_are2": "df0c4f92-ed1b-ef11-840a-002248095c06",
        "How_satisfied_are3": "c5cab1aa-ed1b-ef11-840a-002248095c06",
        "How_satisfied_are4": "df9679ba-ed1b-ef11-840a-000d3a371898",
  
        "How_would_you_rate1": "00fa4e9b-ed1b-ef11-840a-002248095c06",
        "How_would_you_rate2": "a1ce0da4-ed1b-ef11-840a-002248095c06",
        "How_would_you_rate3": "a25018b4-ed1b-ef11-840a-000d3a371898",
        // step 6
        "patient_fname": "43e056d2-ed1b-ef11-840a-000d3a371898",
        "patient_lname": "a574f7db-ed1b-ef11-840a-000d3a371898",
        "do_date": "abc2f9fe-ed1b-ef11-840a-002248095c06",
        "patient_address": "31abf0f0-ed1b-ef11-840a-002248095c06",
        "patient_cell_phone": "bb69d7f7-ed1b-ef11-840a-002248095c06",
        "PA_DOB_date": "e47610e8-ed1b-ef11-840a-002248095c06",
        "PAuthorization": "0c6bb405-ee1b-ef11-840a-000d3a371898",
    };
  
  
    // const queToIdMap = Object.fromEntries(new Map(Object.keys(idToQueMap).map((k) => [idToQueMap[k], k])));
    return idToQueMap;
  }
  const getAnswerToIdMap = () => {
    const idToAnsMap = {
  
           // step 2
       "chkWelcomePacket": "e9179d84-981d-ef11-840a-002248095c06",
       // step 4
       "chkPrivacyNotice":"c28d5c4a-991d-ef11-840a-000d3a5c0fc6",
       "see_legal_represenative":"4b12c396-981d-ef11-840a-000d3a5c0fc6",
       // step 5 
       "chkCGClickPatSurvey":"345d395d-991d-ef11-840a-000d3a5c0fc6",
       // step 6 
        
       "see_medicare_DMEPOS_span":"a18e7881-991d-ef11-840a-000d3a371898",
       "see_medicare_DMEPOS":"df9eda94-991d-ef11-840a-000d3a5c0fc6",
       "see_SupportOrganizations":"c2feae76-991d-ef11-840a-000d3a5c0fc6",
  
  
        // step 5
        "resp_type_Patient": "d1d9edc0-ec1b-ef11-840a-000d3a371898",
        "resp_type_Caregiver": "d2d9edc0-ec1b-ef11-840a-000d3a371898",
        "txtRespTypeOther": "d41f1811-ed1b-ef11-840a-000d3a371898",
        "insurance_type_Medicare": "1fb88e7c-e118-ef11-9f89-002248095c06",
        "insurance_type_Medicaid": "5e36f70a-ed1b-ef11-840a-000d3a371898",
        "insurance_type_Prime_Therapeutics": "5f36f70a-ed1b-ef11-840a-000d3a371898",
        "insurance_type_CIGNA": "e86d7f0c-ed1b-ef11-840a-002248095c06",
        "insurance_type_United_Healthcare": "d01f1811-ed1b-ef11-840a-000d3a371898",
        "insurance_type_Anthem": "e96d7f0c-ed1b-ef11-840a-002248095c06",
        "insurance_type_Humana": "ea6d7f0c-ed1b-ef11-840a-002248095c06",
        "insurance_type_BCBS": "d31f1811-ed1b-ef11-840a-000d3a371898",
        "txtInsuranceTypeOther": "ab0612c2-ec1b-ef11-840a-002248095c06",
        // location
        "PharmacySerLoc_CA": "8e32383d-ed1b-ef11-840a-000d3a371898",
        "PharmacySerLoc_LA": "8f32383d-ed1b-ef11-840a-000d3a371898",
        "PharmacySerLoc_MD": "0bd9d93f-ed1b-ef11-840a-002248095c06",
        "PharmacySerLoc_NJ": "9032383d-ed1b-ef11-840a-000d3a371898",
        "PharmacySerLoc_PA": "9132383d-ed1b-ef11-840a-000d3a371898",
        "PharmacySerLoc_TX": "0cd9d93f-ed1b-ef11-840a-002248095c06",
        "PharmacySerLoc_FL": "9232383d-ed1b-ef11-840a-000d3a371898",
        "PharmacySerLoc_Unknown": "9332383d-ed1b-ef11-840a-000d3a371898",
        // table answerId
        "1stflexRadioDefault5": "dec5f884-ed1b-ef11-840a-002248095c06",
        "1stflexRadioDefault4": "99d56782-ed1b-ef11-840a-000d3a371898",
        "1stflexRadioDefault3": "dfc5f884-ed1b-ef11-840a-002248095c06",
        "1stflexRadioDefault2": "9ad56782-ed1b-ef11-840a-000d3a371898",
        "1stflexRadioDefault1": "9bd56782-ed1b-ef11-840a-000d3a371898",
  
        "2stflexRadioDefault5": "3f0d088c-ed1b-ef11-840a-002248095c06",
        "2stflexRadioDefault4": "31366088-ed1b-ef11-840a-000d3a371898",
        "2stflexRadioDefault3": "32366088-ed1b-ef11-840a-000d3a371898",
        "2stflexRadioDefault2": "450d088c-ed1b-ef11-840a-002248095c06",
        "2stflexRadioDefault1": "460d088c-ed1b-ef11-840a-002248095c06",
  
        "3stflexRadioDefault5": "1a9c828f-ed1b-ef11-840a-000d3a371898",
        "3stflexRadioDefault4": "1b9c828f-ed1b-ef11-840a-000d3a371898",
        "3stflexRadioDefault3": "e00c4f92-ed1b-ef11-840a-002248095c06",
        "3stflexRadioDefault2": "e10c4f92-ed1b-ef11-840a-002248095c06",
        "3stflexRadioDefault1": "1c9c828f-ed1b-ef11-840a-000d3a371898",
  
        "4stflexRadioDefault5": "d0d34d9d-ed1b-ef11-840a-000d3a371898",
        "4stflexRadioDefault4": "d1d34d9d-ed1b-ef11-840a-000d3a371898",
        "4stflexRadioDefault3": "d2d34d9d-ed1b-ef11-840a-000d3a371898",
        "4stflexRadioDefault2": "01fa4e9b-ed1b-ef11-840a-002248095c06",
        "4stflexRadioDefault1": "02fa4e9b-ed1b-ef11-840a-002248095c06",
  
        "5stflexRadioDefault5": "a2ce0da4-ed1b-ef11-840a-002248095c06",
        "5stflexRadioDefault4": "3e73e7a4-ed1b-ef11-840a-000d3a371898",
        "5stflexRadioDefault3": "a3ce0da4-ed1b-ef11-840a-002248095c06",
        "5stflexRadioDefault2": "a4ce0da4-ed1b-ef11-840a-002248095c06",
        "5stflexRadioDefault1": "a5ce0da4-ed1b-ef11-840a-002248095c06",
  
        "6stflexRadioDefault5": "bb54a3ab-ed1b-ef11-840a-000d3a371898",
        "6stflexRadioDefault4": "bc54a3ab-ed1b-ef11-840a-000d3a371898",
        "6stflexRadioDefault3": "bd54a3ab-ed1b-ef11-840a-000d3a371898",
        "6stflexRadioDefault2": "be54a3ab-ed1b-ef11-840a-000d3a371898",
        "6stflexRadioDefault1": "c6cab1aa-ed1b-ef11-840a-002248095c06",
  
        "7stflexRadioDefault5": "d6e557b4-ed1b-ef11-840a-002248095c06",
        "7stflexRadioDefault4": "d7e557b4-ed1b-ef11-840a-002248095c06",
        "7stflexRadioDefault3": "d8e557b4-ed1b-ef11-840a-002248095c06",
        "7stflexRadioDefault2": "a35018b4-ed1b-ef11-840a-000d3a371898",
        "7stflexRadioDefault1": "d9e557b4-ed1b-ef11-840a-002248095c06",
  
        "8stflexRadioDefault5": "e09679ba-ed1b-ef11-840a-000d3a371898",
        "8stflexRadioDefault4": "f8bcb9bc-ed1b-ef11-840a-002248095c06",
        "8stflexRadioDefault3": "f9bcb9bc-ed1b-ef11-840a-002248095c06",
        "8stflexRadioDefault2": "169879ba-ed1b-ef11-840a-000d3a371898",
        "8stflexRadioDefault1": "5a9879ba-ed1b-ef11-840a-000d3a371898",
  
    };
    return idToAnsMap;
  }