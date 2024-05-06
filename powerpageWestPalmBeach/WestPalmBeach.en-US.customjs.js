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
document.addEventListener("DOMContentLoaded", function() {
  var vwpCheckbox = document.querySelector("#view_welcome_packet input");
  var vpnCheckbox = document.querySelector("#view_Privacy_Notice input");
  var lrCheckbox = document.querySelector("#legal_represenative input");
  var welcomePacketDiv = document.querySelector("#customer_policy");
  var termsConditionsDiv = document.querySelector("#notice_of_privacy_practices");
  var privacyPolicyDiv = document.querySelector("#show_legal_represenative");

  // Add event listener to each checkbox
  vwpCheckbox.addEventListener("change", function() {
      if (vwpCheckbox.checked) {
          welcomePacketDiv.style.display = "block";
      } else {
          welcomePacketDiv.style.display = "none";
      }
  });

  vpnCheckbox.addEventListener("change", function() {
      if (vpnCheckbox.checked) {
          termsConditionsDiv.style.display = "block";
      } else {
          termsConditionsDiv.style.display = "none";
      }
  });

  lrCheckbox.addEventListener("change", function() {
      if (lrCheckbox.checked) {
          privacyPolicyDiv.style.display = "block";
      } else {
          privacyPolicyDiv.style.display = "none";
      }
  });
});
 