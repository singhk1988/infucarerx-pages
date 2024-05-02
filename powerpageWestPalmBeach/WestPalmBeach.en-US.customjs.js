document.addEventListener("DOMContentLoaded", function () {
    // const searchParams = new URLSearchParams(window.location.search);
    // const formResponseId = searchParams.get('id');

    // FormResponse

    // Signature

    // Questions

    // answers

  //  console.log('commonFormOpeation', commonFormOpeation);
   // showPatientSignature();
    hideAndShowLogic();
});


// const showPatientSignature = () => {
//     // signature functinality
//     const canvas = document.getElementById('patient_sign');
//     const context = canvas.getContext('2d');
//     let isDrawing = false;
//     let lastX = 0;
//     let lastY = 0;

//     canvas.addEventListener('mousedown', (e) => {
//         isDrawing = true;
//         [lastX, lastY] = [e.offsetX, e.offsetY];
//     });

//     canvas.addEventListener('mousemove', (e) => {
//         if (isDrawing) {
//             draw(e.offsetX, e.offsetY);
//         }
//     });

//     canvas.addEventListener('mouseup', () => {
//         isDrawing = false;
//     });

//     canvas.addEventListener('mouseout', () => {
//         isDrawing = false;
//     });

//     function draw(x, y) {
//         context.beginPath();
//         context.moveTo(lastX, lastY);
//         context.lineTo(x, y);
//         context.strokeStyle = '#000';
//         context.lineWidth = 2;
//         context.stroke();
//         [lastX, lastY] = [x, y];
//     }

//     // Function to clear the canvas
//     document.getElementById('clearButton').addEventListener('click', () => {
//         context.clearRect(0, 0, canvas.width, canvas.height);
//     });
// }

const hideAndShowLogic = () => {
   
        let currentIndex = 0;
        const mainContainer = document.querySelector('.main-form-container');
        const pages = mainContainer.querySelectorAll('.rows');
        
        // Show initial page
        showPage(currentIndex);
        
        // Next button click event
        document.getElementById('nextBtn').addEventListener('click', function() {
          if (currentIndex < pages.length - 1) {
            hidePage(currentIndex);
            currentIndex++;
            showPage(currentIndex);
          }
        });
        
        // Previous button click event
        document.getElementById('prevBtn').addEventListener('click', function() {
          if (currentIndex > 0) {
            hidePage(currentIndex);
            currentIndex--;
            showPage(currentIndex);
          }
        });
        
        // Function to show page at given index
        function showPage(index) {
          pages[index].style.display = 'block';
        }
        
        // Function to hide page at given index
        function hidePage(index) {
          pages[index].style.display = 'none';
        }
      

}