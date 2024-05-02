document.addEventListener("DOMContentLoaded", function () {
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
    });
});

function getFormData() {
    const form = document.getElementById('form');
    const formData = new FormData(form);
    const formDataObject = {};
    formData.forEach((value, key) => {
        formDataObject[key] = value;
    });

    console.log(formDataObject);
}



const patientUnableToSignCheckbox = document.getElementById('unableToSign');
const patientUnableToSignDiv = document.getElementById('patient-unable-sign-check');

patientUnableToSignCheckbox.addEventListener('change', function() {
  if (this.checked) {
    patientUnableToSignDiv.style.display = 'block';
  } else {
    patientUnableToSignDiv.style.display = 'none';
  }
});
