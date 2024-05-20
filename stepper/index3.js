 // Function to handle next step
 function handleNext() {
  const stepper = document.querySelector('common-stepper');
  const currentStep = parseInt(stepper.getAttribute('current-step'));
  const totalSteps = stepper.getAttribute('steps').split(',').length;

  if (currentStep < totalSteps) {
    stepper.setAttribute('current-step', currentStep + 1);
  }
}

// Function to handle previous step
function handlePrevious() {
const stepper = document.querySelector('common-stepper');
const currentStep = parseInt(stepper.getAttribute('current-step'));

if (currentStep > 1) {
    stepper.setAttribute('current-step', currentStep - 1);
}
}



// const currentSteps = JSON.parse(document.querySelector('common-stepper').getAttribute('steps'));

// // Append the new step label to the end of the array
// const newStepLabel = "New Step"; // Your new step label
// currentSteps.push(newStepLabel);

// // Set the 'steps' attribute with the updated steps array
// document.querySelector('common-stepper').setAttribute('steps', JSON.stringify(currentSteps));
// undefined
// document.querySelector('common-stepper').render();