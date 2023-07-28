ACDiscountApp.PDPage.DisplayTiers = function () {

  function makeTimer(end_date) {
    if(globalFields.isProduct_Page){
      if(end_date != null){
      jQuery("#ac_countDown").css("display", "block");
        var endTime =  new Date(end_date);			
          endTime = (Date.parse(endTime) / 1000);
          var now = new Date();
          now = (Date.parse(now) / 1000);
          var timeLeft = endTime - now;
          var days = Math.floor(timeLeft / 86400); 
          var hours = Math.floor(timeLeft / 3600);
          var exactHour = hours % 24;
          var minutes = Math.floor((timeLeft - (hours * 3600 )) / 60);
          var seconds = Math.floor((timeLeft - (hours * 3600) - (minutes * 60)));
          var isDays = false;
          if (days > 0 || hours > 24){isDays = true;}
          if (days < 0) { days = "00"; /*hours = "0"; minutes = "0"; seconds = "0";*/ }
          if (hours < 10) { hours = "0" + hours; }
          if (minutes < 10) { minutes = "0" + minutes; }
          if (seconds < 10) { seconds = "0" + seconds; }
          if(timeLeft > 0){
            if(isDays){
              $(".ac__days").html(days); $(".ac__hours").html(exactHour); $(".ac__minutes").html(minutes);
              $(".ac_sec, .ac__colon.seconds").hide();
            }
            else{
              $(".ac__hours").html(exactHour); $(".ac__minutes").html(minutes); $(".ac__seconds").html(seconds);		
              $(".ac_day, .ac__colon.hours").hide(); $(".ac_sec, .ac__colon.seconds").show();
            }
          }
          else{jQuery('.ac__settings__table, #ac_countDown').remove();}
        
        setTimeout(function () {
          jQuery('.ac__settings__table').after(jQuery("#ac_countDown"));
        }, 500);
      }
    }
}   

  var hide_buttons = null;
  var HideAdditionalPayments = function() {      
    hide_buttons = setInterval(function() {
      console.log('pdp buttons and tiered');
      if(jQuery('.shopify-payment-button__button').length>0){
        jQuery('.shopify-payment-button__button').hide();
        clearInterval(hide_buttons);
      }
    }, 500);
  }

  this.DisplayTiersFn = function () {
      setTimeout(function () {
          jQuery('.ac__settings__table').remove();
          var selectedVariant = jQuery('input[name^=id]:checked, select[name^=id], input[name=id], hidden[name^=id]', jQuery('form[action="/cart/add"]')).val();
        console.log("selectedVariant",selectedVariant)
        let ProductPage = globalFields.TableProductPage != undefined && globalFields.TableProductPage !=  '' ? globalFields.TableProductPage : 'true';
          ProductPage =  ProductPage == 'true' ? true: false;
         if (selectedVariant != null && globalFieldsProductPage_AC.productMetafield != '[]' && globalFieldsProductPage_AC.productMetafield != undefined && ProductPage) {
           let tierObj = globalFields.GetTierObject(globalFieldsProductPage_AC.productMetafield, selectedVariant);
           let DiscountAppliedOn = tierObj.DiscountAppliedON != null &&  tierObj.DiscountAppliedON  != '' &&  tierObj.DiscountAppliedON != undefined ? true : false;
            let Location_Tag_s = tierObj.Location_Tag_ != null &&  tierObj.Location_Tag_  != '' &&  tierObj.Location_Tag_ != undefined ? true : false;
           if(DiscountAppliedOn){
             // 1
             if(Location_Tag_s){
               // 2
              let DiscountAppliedOnTag = tierObj.DiscountAppliedON == 'Both_Store' || tierObj.DiscountAppliedON == 'Online_Store' ? true : false;
           
              let LocationObject = Object.keys(tierObj.Location_Tag_);
              if(LocationObject[0] == 'StoreLocation'){
              let StoreLocationcheck =  tierObj.Location_Tag_[LocationObject[0]].includes(globalFields.Storecountry) || tierObj.Location_Tag_[LocationObject[0]].includes(globalFields.Storecity) ? true : false;
              if (tierObj != undefined && tierObj.status && globalFields.StartEndDateValid(tierObj.start_date, tierObj.end_date) && DiscountAppliedOnTag && StoreLocationcheck) {
              var getDates = globalFields.TimerStartEndDateValid(tierObj.start_date, tierObj.end_date);
              getDates.valid; getDates.start_date; getDates.end_date;
              let timer_settings = parsed_timer_settings;                
              WriteTableHeading(tierObj);
              WriteTableRows(tierObj, selectedVariant);
              if(timer_settings != undefined){                
                if(timer_settings.TimerStatus){  
                  if(getDates.valid){
                      setInterval(function() { makeTimer(getDates.end_date); }, 1000);
                  }
                }
            }
                jQuery('.shopify-payment-button__button').hide();
                setTimeout(function(){
                  jQuery('.shopify-payment-button__button').hide();
                HideAdditionalPayments();
                }, 2000);
                setTimeout(function(){
                  clearInterval(hide_buttons);
                }, 5000);
              } 
              }
              else{
                // 3
                   let TierLocation = tierObj.Location_Tag_[LocationObject[0]];
                   let CusotmerCountryLocation = globalFields.Customercountry;
                   let CusotmerCityLocation = globalFields.Customercity;
                   let CustomerLocationcheck_1 = (arr, arr1) =>{return arr.some(item => arr1.includes(item))};
                   let CustomerLocationcheck_2 = (arr2, arr3) =>{return arr2.some(item => arr3.includes(item))};
                   let CityValue = CustomerLocationcheck_1(TierLocation,CusotmerCountryLocation);
                   let CountryValue = CustomerLocationcheck_2(TierLocation,CusotmerCityLocation);
                  
              if (tierObj != undefined && tierObj.status && globalFields.StartEndDateValid(tierObj.start_date, tierObj.end_date) && DiscountAppliedOnTag && (CityValue || CountryValue)) {
              var getDates = globalFields.TimerStartEndDateValid(tierObj.start_date, tierObj.end_date);
              getDates.valid; getDates.start_date; getDates.end_date;
              let timer_settings = parsed_timer_settings;                
              WriteTableHeading(tierObj);
              WriteTableRows(tierObj, selectedVariant);
              if(timer_settings != undefined){                
                if(timer_settings.TimerStatus){  
                  if(getDates.valid){
                      setInterval(function() { makeTimer(getDates.end_date); }, 1000);
                  }
                }
            }
                jQuery('.shopify-payment-button__button').hide();
                setTimeout(function(){
                  jQuery('.shopify-payment-button__button').hide();
                HideAdditionalPayments();
                }, 2000);
                setTimeout(function(){
                  clearInterval(hide_buttons);
                }, 5000);
              } 
               }
          
              }
             else{
               // 4
              if (tierObj != undefined && tierObj.status && globalFields.StartEndDateValid(tierObj.start_date, tierObj.end_date) && (tierObj.DiscountAppliedON == 'Both_Store' || tierObj.DiscountAppliedON == 'Online_Store')) {
              var getDates = globalFields.TimerStartEndDateValid(tierObj.start_date, tierObj.end_date);
              getDates.valid; getDates.start_date; getDates.end_date;
              let timer_settings = parsed_timer_settings;                
              WriteTableHeading(tierObj);
              WriteTableRows(tierObj, selectedVariant);
              if(timer_settings != undefined){                
                if(timer_settings.TimerStatus){  
                  if(getDates.valid){
                      setInterval(function() { makeTimer(getDates.end_date); }, 1000);
                  }
                }
            }
                jQuery('.shopify-payment-button__button').hide();
                setTimeout(function(){
                  jQuery('.shopify-payment-button__button').hide();
                HideAdditionalPayments();
                }, 2000);
                setTimeout(function(){
                  clearInterval(hide_buttons);
                }, 5000);
              } 
             }
           }
           else{
             // 5
              if (tierObj != undefined && tierObj.status && globalFields.StartEndDateValid(tierObj.start_date, tierObj.end_date)) {
              var getDates = globalFields.TimerStartEndDateValid(tierObj.start_date, tierObj.end_date);
              getDates.valid; getDates.start_date; getDates.end_date;
              let timer_settings = parsed_timer_settings;                
              WriteTableHeading(tierObj);
              WriteTableRows(tierObj, selectedVariant);
              if(timer_settings != undefined){                
                if(timer_settings.TimerStatus){  
                  if(getDates.valid){
                      setInterval(function() { makeTimer(getDates.end_date); }, 1000);
                  }
                }
            }
                jQuery('.shopify-payment-button__button').hide();
                setTimeout(function(){
                  jQuery('.shopify-payment-button__button').hide();
                HideAdditionalPayments();
                }, 2000);
                setTimeout(function(){
                  clearInterval(hide_buttons);
                }, 5000);
              }
           }   
          }
          }, 200);
    
    }
  
  setTimeout(function(){
    clearInterval(hide_buttons);
  }, 10000);

  this.OnVariantChange = function () {
      setTimeout(function () {
          $(".swatch_options label").click(function () {
              displayTiers.DisplayTiersFn();
          });
      }, 2000);
  }

  var TableHeadHtml = function (contentHtml, tableSelector, position) {
      jQuery(tableSelector).before(contentHtml)
  }

  var WriteTableHeading = function (tierObj) {
   
    var tableSelector = '.purchase-details button[name="add"]';
      if (globalFields.settings.selected_table == "table1") {
          TableHeadHtml('<div class="ac__settings__table ac_table1" id="ac_table1"><div class="ac__tbody"><div class="ac__tr ac__tr1"><th class="ac__th ac__th1">' + globalFields.settings.table_headers.header1_value + '</th><th class="ac__th ac__th2">' + globalFields.settings.table_headers.header2_value + '</th></div></div></div>', tableSelector);
      }
      if (globalFields.settings.selected_table == "table2") {

          TableHeadHtml('<div class="ac__settings__table ac_table2" id="ac_table2"><div class="ac_table_heading ac__tr ac__tr1"><th class="ac__th ac__th1">' + globalFields.settings.table_headers.header1_value + '</th><th class="ac__th ac__th2">' + globalFields.settings.table_headers.header2_value + '</th><th class="ac__th ac__th3">' + globalFields.settings.table_headers.header3_value + '</th></div><div class="ac__tbody ac_grid_box"></div></div>', tableSelector);
      }
      if (globalFields.settings.selected_table == "table3") {
          TableHeadHtml('<div class="ac__settings__table" id="ac_table3"><div class="ac__tbody"><div class="ac__tr ac__tr1"><th class="ac__th ac__th1">'+ '<span class="ac_tire_table_heading">'+globalFields.settings.table_headers.header1_value +  globalFields.settings.table_headers.header2_value+ globalFields.settings.table_headers.header3_value+ '</span></th></div></div></div>', tableSelector);
      }
      if (globalFields.settings.selected_table == "table4") {
          TableHeadHtml('<div class="ac__settings__table ac_table4" id="ac_table4"><div class="ac__tbody"></div></div>', tableSelector);
      }
  }

  var TableRowHtml = function (contentHtml, tableSelector) {
      jQuery(tableSelector).append(contentHtml);
    
  }

  var TableRowSingle = function (tieredMin_, tieredMax_, discountedPrice, tieredOff,percentSymoby,offvalue, index,lastindex) {
     
      var plusSign = tieredMin_ == tieredMax_ ? '' : '+', buyText = 'Buy ';
      var priceHtml = '<span class="money" data-currency-' + globalFields.currency.toLowerCase() + '="' + globalFields.currencySymbol + discountedPrice + '" data-currency="' + globalFields.currency + '">' + globalFields.formatMoney(discountedPrice, globalFields.amount) + '</span>';
      if (globalFields.settings.selected_table == "table1") {
          TableRowHtml('<div class="ac__tr ac__tr' + (index + 1) + '"><input type="checkbox"/>Buy<span class="">' + tieredMin_ + plusSign + '</span><span class="">' + tieredOff + '</span></div>', '#ac_table1 .ac__tbody');
      }

      if (globalFields.settings.selected_table == "table2") {

         if(index  == lastindex){
  TableRowHtml('<div class="ac_border_right ac__tr ac__tr' + (index + 1) + '"> <span class="ac__td ac__td3" style="font-size:32px;font-weight:500;">' + tieredOff  + ' </span>' +  percentSymoby + offvalue+' <p class="ac_items_value"><span style="font-weight:500;padding-right:2px;">Any</span><span class="ac__td ac__td1">' + tieredMin_ + '</span><span class="ac__td ac__td2">' + tieredMax_ + '</span><span style="font-weight:500;padding-left:2px;">items</span></p></div>', '#ac_table2 .ac__tbody');
         }else{
             TableRowHtml('<div class="ac_border_right ac__tr ac__tr' + (index + 1) + '"> <span class="ac__td ac__td3" style="font-size:32px;font-weight:500;">' + tieredOff  + ' </span>' +  percentSymoby + offvalue+' <p class="ac_items_value"><span style="font-weight:500;padding-right:2px;">Any</span><span class="ac__td ac__td1">' + tieredMin_ + '</span>-<span class="ac__td ac__td2">' + tieredMax_ + '</span><span style="font-weight:500;padding-left:2px;">items</span></p></div>', '#ac_table2 .ac__tbody');
         }
        
      }

      if (globalFields.settings.selected_table == "table3") {
       TableRowHtml('<div class="ac__tr ac__tr' + (index + 1) + '"><div class="ac_tier_discount"><span class="ac__td ac__td1"><input type="radio" title="selectedcheckbox" name="buyOption" id="selectedcheckbox'+tieredMin_+'" value="' + tieredMin_ + '"> <span class="ac_tire_padding_left">Buy</span> <span class="ac_tire_padding_left1">' + tieredMin_ + '</span></span><span class="ac__td ac__td2 ac_tire_green_clr">' + tieredOff + '</span></div><div><span class="ac__td ac__td3">' + priceHtml + '</span></div></div>', '#ac_table3 .ac__tbody');
      }

      if (globalFields.settings.selected_table == "table4") {
          var quantityTextTable4 = tieredMin_ + "-" + tieredMax_;
          if (tieredMax_ == "+") {
              quantityTextTable4 = tieredMin_ + "+";
          }
          TableRowHtml('<div class="ac__tr ac__tr' + index + '"> <span class="ac__td ac__td1">' + globalFields.settings.table_body.body1_value + ' ' + tieredMin_ + ' ' + globalFields.settings.table_body.body2_value + ' ' + tieredOff + '</span></div>', '#ac_table4');
      }



  }

  var WriteTableRows = function (tierObj, selectedVariant_) {
 
      var originalPrice_ = globalFieldsProductPage_AC.variantsPriceArray_PD[selectedVariant_]; originalPrice_ = originalPrice_ / 100;
      for (i = 0; i < tierObj.tier_min.length; i++) {
          var isBreakLoop = false, tieredOff = Number(tierObj.tier_values[i]),percentSymoby= "",offvalue = '';
          var tieredMin_ = parseInt(tierObj.tier_min[i]), tieredMax_ = tierObj.tier_max[i], discountedPrice = 0;

          if (tieredMax_ != "max") {
              tieredMax_ = parseInt(tieredMax_);
          }
          else {
              tieredMax_ = "+";
          }

          if (tierObj.discount_type == "percentage") {
              discountedPrice = Number(originalPrice_.toFixed(2));
              var p = parseFloat(tieredOff) / 100, originalPriceCut_ = Number(parseFloat(p * discountedPrice).toFixed(2));
              discountedPrice = discountedPrice - originalPriceCut_;
              if (discountedPrice <= 0) {
                  discountedPrice = 0;
                  tieredOff = "100";
                  isBreakLoop = true;
                  tieredMax_ = "+";
                percentSymoby =  '<span style="position: relative;bottom: 15px;font-size: 18px;right: 5px;font-weight:500;">%</span>';
                 offvalue = '<span style="position: relative;right: 20px;top: 5px;font-weight: 500;">OFF</span>';
              }
              else {
                  discountedPrice = discountedPrice.toFixed(2);
                  tieredOff = tieredOff;
                  percentSymoby =  "<span style='position: relative;bottom: 15px;font-size: 18px;right: 5px;font-weight:500;'>%</span>";
                  offvalue = '<span style="position: relative;right: 20px;top: 5px;font-weight: 500;">OFF</span>';
              }
          }
          else if (tierObj.discount_type == "fixed_price") {
              discountedPrice = tieredOff.toFixed(2);
              tieredOff = globalFields.formatMoney(tieredOff.toFixed(2), globalFields.amount);
          }
          else {
              discountedPrice = Number((originalPrice_ - tieredOff).toFixed(2));
              if (discountedPrice <= 0) {
                  discountedPrice = 0;
                  tieredOff = globalFields.formatMoney(originalPrice_.toFixed(2), globalFields.amount);
                  isBreakLoop = true;
                  tieredMax_ = "+";
              }
              else {
                  discountedPrice = discountedPrice.toFixed(2);
                  tieredOff = globalFields.formatMoney(tieredOff.toFixed(2), globalFields.amount);
                  offvalue = '<span>OFF</span>';
              }
          }

          TableRowSingle(tieredMin_, tieredMax_, discountedPrice, tieredOff,percentSymoby,offvalue, i + 1,tierObj.tier_min.length);

          if (isBreakLoop) { break; }
      }

    // let selectedValue = 0
// $(document).ready(function() {
//     $('input[name="buyOption"]').click(function() {
//       // 
//       alert(2345)
//     });
//   });
$(document).ready(function() {
    $('input[name="buyOption"]').click(function() {
      // Remove the class "ac_tire_orange_clr" from all spans with the class "ac_tire_padding_left"
      $('.ac_tire_padding_left').removeClass('ac_tire_orange_clr');
      
      // Remove the class "ac_tire_orange_clr" from all spans with the class "ac_tire_padding_left1"
      $('.ac_tire_padding_left1').removeClass('ac_tire_orange_clr');
      
      // Add the class "ac_tire_orange_clr" to the clicked radio button's span with the class "ac_tire_padding_left"
      $(this).next('.ac_tire_padding_left').addClass('ac_tire_orange_clr');
      
      // Add the class "ac_tire_orange_clr" to the clicked radio button's span with the class "ac_tire_padding_left1"
      $(this).closest('.ac__tr').find('.ac_tire_padding_left1').addClass('ac_tire_orange_clr');
      
      // Add the class "ac_tire_orange_clr" to the clicked radio button's div with class "ac__td ac__td3"
      $(this).closest('.ac__tr').find('.ac__td.ac__td3').addClass('ac_tire_orange_clr');
      
      // Remove the class "ac_tire_orange_clr" from other radio buttons' div with class "ac__td ac__td3"
      $('input[name="buyOption"]').not(this).closest('.ac__tr').find('.ac__td.ac__td3').removeClass('ac_tire_orange_clr');
    });
});
    
  } 
   setTimeout(function(){
  jQuery('.hs-drawer-checkout form').replaceWith('<button id="anncodde" class="hs-checkout-purchase checkout-x-buy-now-btn hs-button-100-w btn hs-event-static">Checkout</button>')  
  },500)
  
  setTimeout(function(){
  jQuery('.hs-drawer-checkout form').replaceWith('<button id="anncodde" class="hs-checkout-purchase checkout-x-buy-now-btn hs-button-100-w btn hs-event-static">Checkout</button>')  
  },800)
   jQuery('.hs-drawer-checkout form').replaceWith('<button id="anncodde" class="hs-checkout-purchase checkout-x-buy-now-btn hs-button-100-w btn hs-event-static">Checkout</button>')
    jQuery('.search-cart-head-m-div .cart_container').click(function () {
    jQuery('.hs-drawer-checkout form').replaceWith('<button id="anncodde" class="hs-checkout-purchase checkout-x-buy-now-btn hs-button-100-w btn hs-event-static">Checkout</button>')
    setTimeout(function(){
  jQuery('.hs-drawer-checkout form').replaceWith('<button id="anncodde" class="hs-checkout-purchase checkout-x-buy-now-btn hs-button-100-w btn hs-event-static">Checkout</button>')  
  },800)
     });
}

 // jQuery('.hs-drawer-checkout form').replaceWith('<button id="anncodde" class="hs-checkout-purchase checkout-x-buy-now-btn hs-button-100-w btn hs-event-static">Checkout</button>')
  //  setTimeout(function(){
  // jQuery('.hs-drawer-checkout form').replaceWith('<button id="anncodde" class="hs-checkout-purchase checkout-x-buy-now-btn hs-button-100-w btn hs-event-static">Checkout</button>')
  //   }, 1500);
//  jQuery('#myAdd').click(function() {
//     
//    alert(234)
//   // Find the button inside the hs-content-checkout-button class and add the id
//   jQuery('.hs-content-buttons .hs-checkout-purchase').attr('id', 'anncodde');
// });
// $('.swatch_options label').click(function(){
//  
//   // setTimeout(function(){
//    let data = $('.ac__tbody');

// if (data.length > 1) {
//   data.slice(0, data.length - 1).remove();
// }
// // }, 500);
// })
$('input[name="paywhirl-plan-selector-group"]').click(function() {
 
      if ($(this).is(':checked') && $(this).siblings('span').text() === "Subscribe & Save 15%") {
        $('#ac_table2').hide();
      } else {
        $('#ac_table2').show();
      }
});
var globalFieldsProductPage_AC = new ACDiscountApp.PDPage.Global(), displayTiers = new ACDiscountApp.PDPage.DisplayTiers();
displayTiers.DisplayTiersFn(); displayTiers.OnVariantChange();
