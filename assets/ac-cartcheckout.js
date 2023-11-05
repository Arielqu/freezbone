
  // Add a click event handler to the button with id "anncodde"
  jQuery('#anncodde').click(function (e) {
    
    // Get reference to the button
    const checkoutButton = jQuery('#anncodde');

    // Disable the button when clicked
    checkoutButton.prop('disabled', true);

    // Add a loader icon directly to the button
    checkoutButton.html('<i class="loader"></i> Loading...');

    // Simulate a delay (you can remove this in your actual code)
    setTimeout(function () {
      // Re-enable the button and restore its original text
      checkoutButton.prop('disabled', false);
      checkoutButton.html('Checkout');
    }, 2000); // Change 2000 to the actual time it takes for your checkout process

    // You can add your checkout logic here
    // For example, making an API request or performing other actions
  });

let tttr = $('.hs-content-discount-add .hs-apply-discount.btn.hs-event-static');

tttr.click(function() {
  console.log("Button clicked");
  alert(1233);
});









 
