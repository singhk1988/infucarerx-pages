document.addEventListener("DOMContentLoaded", function () {
    const searchParams = new URLSearchParams(window.location.search);
    const formResponseId = searchParams.get('id');

    // FormResponse

    // Signature

    // Questions

    // answers

    console.log('commonFormOpeation', commonFormOpeation);
    showPatientSignature();
    hideAndShowLogic();
});


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
}

const hideAndShowLogic = () => {
    // checkbox hide and show
    let commercial = document.getElementById('commercial');
    let medicare = document.getElementById('medicare');
    let medicaid = document.getElementById('medicaid');
    let private_pay = document.getElementById('private_pay');
    let unverified = document.getElementById('unverified');

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
            document.getElementById('commercial-details-container').style.display = 'block';
        } else {
            document.getElementById('commercial-details-container').style.display = 'none';
        }
    });
    medicare.addEventListener('change', function () {
        if (this.checked) {
            document.getElementById('medicare-container').style.display = 'block';
        } else {
            document.getElementById('medicare-container').style.display = 'none';
        }
    });
    medicaid.addEventListener('change', function () {
        if (this.checked) {
            document.getElementById('medicaid-container').style.display = 'block';
        } else {
            document.getElementById('medicaid-container').style.display = 'none';
        }
    });
    private_pay.addEventListener('change', function () {
        if (this.checked) {
            document.getElementById('private-pay-container').style.display = 'block';
        } else {
            document.getElementById('private-pay-container').style.display = 'none';
        }
    });
    unverified.addEventListener('change', function () {
        if (this.checked) {
            document.getElementById('unverified-container').style.display = 'block';
        } else {
            document.getElementById('unverified-container').style.display = 'none';
        }
    });
}