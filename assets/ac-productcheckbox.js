// document.getElementById("myAdd").addEventListener("click", function(event){
//   event.preventDefault();
 
//   var selectedVariant = jQuery('input[name^=id]:checked, select[name^=id], input[name=id], hidden[name^=id]', jQuery('form[action="/cart/add"]')).val();

//   var inputCheck = document.querySelectorAll('input[name="buyOption"]');
  
//   var selectedValue = 0;

//   // Loop through the NodeList and check if any input element is checked
//   for (var i = 0; i < inputCheck.length; i++) {
//     if (inputCheck[i].checked) {
//       selectedValue = inputCheck[i].value-1;
      
//       break; // Break the loop once a checked element is found
//     }
//   }
// console.log(selectedValue);
//   if (selectedValue) {
//     setTimeout(function() {
//       fetch('/cart/add.js', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           quantity: Number(selectedValue),
//           id: Number(selectedVariant)
//         })
        
//       });
      
//     }, 1200);

   
        
       
  
    
//     // Add a 1000ms (1 second) delay using setTimeout before making the fetch request
//   } else {
//     console.log("No option selected.");
//   }
// });
// // function mydata() {
  
// // console.log(1)
// // }

// //   var inputCheckRemoveTable = document.querySelectorAll('.paywhirl-plan-selector-group.paywhirl-group-available.paywhirl-group-selected input[name="paywhirl-plan-selector-group"]');
// // if(inputCheckRemoveTable.checked){
// //   $('#ac_table3').hide()
// // }else{
// //   $('#ac_table3').show()
// // }
// $('input[name="paywhirl-plan-selector-group"]').click(function() {
 
//       if ($(this).is(':checked') && $(this).siblings('span').text() === "Subscribe & Save 15%") {
//         $('#ac_table3').hide();
//       } else {
//         $('#ac_table3').show();
//       }
// });








