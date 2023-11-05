ACDiscountApp.CartPage.Show_CalculateTier = function () {
   var checkbuttonflag = false;

       let cartDrawerDiscount
       setInterval(function(){
         // if($(".hs-price-total").length >=2){
         //   $(".hs-cart-content-price div:eq(1)").remove()
         // }
         cartDrawerDiscount = $(".hs-code-text").text();
        let originalDiscount = $('.hs-total-price-global').val()
        let updatedDiscount = $('.hs-discount-price-global').val()
        if(cartDrawerDiscount != ""){
          jQuery('.hs-sub-total-cart .hs-mount-sub-total').html(`<span><s><span class="money" style="text-decoration: line-through;" >${globalFields.formatMoney(Number(originalDiscount), globalFields.amount)}</span></s>   <span class="money">${globalFields.formatMoney(Number(updatedDiscount), globalFields.amount)}</span></span>`);
        }
      },800) 

  
    var UpdateCartItem = function (item, updatedItemPrice, updatedLinePrice, isUpdate, index) {
        if (isUpdate) {
            var originalItemPrice = globalFields.ConvertToFixedDecimalNumber(item.original_price / 100), originalLinePrice = globalFields.ConvertToFixedDecimalNumber(item.original_line_price / 100);
            var condition1 = updatedItemPrice == originalItemPrice;
            updatedItemPrice = globalFields.ConvertToFixedDecimalString(updatedItemPrice), updatedLinePrice = globalFields.ConvertToFixedDecimalString(updatedLinePrice);
            if (condition1) {
/* Uncomment for unit price strike off */
                  jQuery('.section.clearfix.cart__wrapper .modal_price').eq(index).html('<div class="hs-price-total hs-desktop"><span class="money" data-currency-' + globalFields.currency.toLowerCase() + '="' + globalFields.currencySymbol + updatedItemPrice + '" data-currency="' + globalFields.currency + '">' + globalFields.formatMoney(updatedItemPrice, globalFields.amount) + '</span></div>');

                  jQuery('.section.clearfix.cart__wrapper .price_total').eq(index).html('<div><span class="money" data-currency-' + globalFields.currency.toLowerCase() + '="' + globalFields.currencySymbol + updatedLinePrice + '" data-currency="' + globalFields.currency + '">' + globalFields.formatMoney(updatedLinePrice, globalFields.amount) + '</span></div>');
                  if(cartDrawerDiscount == ""){
                    jQuery('.hs-sticky-cart .hs-cart-content-price').eq(index).html('<div class="hs-price-total hs-desktop"><span class="money acp" data-currency-' + globalFields.currency.toLowerCase() + '="' + globalFields.currencySymbol + updatedItemPrice + '" data-currency="' + globalFields.currency + '">' + globalFields.formatMoney(updatedItemPrice, globalFields.amount) + '</span></div>');
                  }
                  //setTimeout(function () { 
                // jQuery('.hs-rewards-content').remove()
                // }, 1500);
            }
            else {
                originalItemPrice = globalFields.ConvertToFixedDecimalString(originalItemPrice), originalLinePrice = globalFields.ConvertToFixedDecimalString(originalLinePrice);
               
              jQuery('.section.clearfix.cart__wrapper .modal_price').eq(index).html('<div class="hs-price-total hs-desktop"><s><span class="money acp_drawer" data-currency-' + globalFields.currency.toLowerCase() + '="' + globalFields.currencySymbol + originalItemPrice + '" data-currency="' + globalFields.currency + '">' + globalFields.formatMoney(originalItemPrice, globalFields.amount) + '</span></s></div> <div class="hs-price-total hs-desktop"><span class="money" data-currency-' + globalFields.currency.toLowerCase() + '="' + globalFields.currencySymbol + updatedItemPrice + '" data-currency="' + globalFields.currency + '">' + globalFields.formatMoney(updatedItemPrice, globalFields.amount) + '</span></div>');
              jQuery('.section.clearfix.cart__wrapper .price_total').eq(index).html('<div class="cart-item__original-price"><s><span class="money" data-currency-' + globalFields.currency.toLowerCase() + '="' + globalFields.currencySymbol + originalLinePrice + '" data-currency="' + globalFields.currency + '">' + globalFields.formatMoney(originalLinePrice, globalFields.amount) + '</span></s></div> <div style="margin-left:5px"><span class="money" data-currency-' + globalFields.currency.toLowerCase() + '="' + globalFields.currencySymbol + updatedLinePrice + '" data-currency="' + globalFields.currency + '">' + globalFields.formatMoney(updatedLinePrice, globalFields.amount) + '</span></div>');
              
              // setTimeout(function () { 
              if(cartDrawerDiscount == ""){
              jQuery('.hs-sticky-cart .hs-cart-content-price').eq(index).html('<div class="hs-price-total hs-desktop"><s><span class="money acp_drawer acp_lineThrough" data-currency-' + globalFields.currency.toLowerCase() + '="' + globalFields.currencySymbol + originalItemPrice + '" data-currency="' + globalFields.currency + '">' + globalFields.formatMoney(originalItemPrice, globalFields.amount) + '</span></s></div> <div class="hs-price-total hs-desktop"><span class="money" data-currency-' + globalFields.currency.toLowerCase() + '="' + globalFields.currencySymbol + updatedItemPrice + '" data-currency="' + globalFields.currency + '">' + globalFields.formatMoney(updatedItemPrice, globalFields.amount) + '</span></div>');
              }
                // }, 1000);
              
              //setTimeout(function () { 
              // jQuery('.hs-rewards-content').remove()
              //}, 1500);
            }
        }
    }


 

      var UpdateCartSubtotal = function (isUpdate, updatedTotalPrice, originalTotalPrice) {
    
        if (isUpdate) {
            updatedTotalPrice = globalFields.ConvertToFixedDecimalString(updatedTotalPrice), originalTotalPrice = globalFields.ConvertToFixedDecimalString(originalTotalPrice);
            if (originalTotalPrice != updatedTotalPrice) {
                jQuery('.subtotal .cart_subtotal.js-cart_subtotal .right').html('<s><span class="money" data-currency-' + globalFields.currency.toLowerCase() + '="' + globalFields.currencySymbol + originalTotalPrice + '" data-currency="' + globalFields.currency + '">' + globalFields.formatMoney(originalTotalPrice, globalFields.amount) + '</span></s> <span class="money" data-currency-' + globalFields.currency.toLowerCase() + '="' + globalFields.currencySymbol + updatedTotalPrice + '" data-currency="' + globalFields.currency + '">' + globalFields.formatMoney(updatedTotalPrice, globalFields.amount) + '</span>');
                jQuery('.hs-sub-total-cart .hs-mount-sub-total').html('<span class="money acp_drawer acp_lineThrough" data-currency-' + globalFields.currency.toLowerCase() + '="' + globalFields.currencySymbol + originalTotalPrice + '" data-currency="' + globalFields.currency + '">' + globalFields.formatMoney(originalTotalPrice, globalFields.amount) + '</span>&nbsp;<span class="money" data-currency-' + globalFields.currency.toLowerCase() + '="' + globalFields.currencySymbol + updatedTotalPrice + '" data-currency="' + globalFields.currency + '">' + globalFields.formatMoney(updatedTotalPrice, globalFields.amount) + '</span>');
            }
            else {
              jQuery('.subtotal .cart_subtotal.js-cart_subtotal .right').html('<span class="money" data-currency-' + globalFields.currency.toLowerCase() + '="' + globalFields.currencySymbol + updatedTotalPrice + '" data-currency="' + globalFields.currency + '">' + globalFields.formatMoney(updatedTotalPrice, globalFields.amount) + '</span>');
            //  jQuery('.hs-sub-total-cart .hs-mount-sub-total').html('<span class="money" data-currency-' + globalFields.currency.toLowerCase() + '="' + globalFields.currencySymbol + updatedTotalPrice + '" data-currency="' + globalFields.currency + '">' + globalFields.formatMoney(updatedTotalPrice, globalFields.amount) + '</span>');
              setTimeout(function(){
                let originalDiscount = $('.hs-total-price-global').val()
                let updatedDiscount = $('.hs-discount-price-global').val()
                if(cartDrawerDiscount != ""){
                  jQuery('.hs-sub-total-cart .hs-mount-sub-total').html(`<span><s><span class="money" style="text-decoration: line-through;" >${globalFields.formatMoney(Number(originalDiscount), globalFields.amount)}</span></s>   <span class="money">${globalFields.formatMoney(Number(updatedDiscount), globalFields.amount)}</span></span>`);
                }else{
                  jQuery('.hs-sub-total-cart .hs-mount-sub-total').html('<span class="money" data-currency-' + globalFields.currency.toLowerCase() + '="' + globalFields.currencySymbol + updatedTotalPrice + '" data-currency="' + globalFields.currency + '">' + globalFields.formatMoney(updatedTotalPrice, globalFields.amount) + '</span>');
                }
              },2000)
            }

          // setTimeout(function(){
          // let cartDrawerDiscount = $(".hs-code-text").text();
          // let originalDiscount = $('.hs-total-price-global').val()
          // let updatedDiscount = $('.hs-discount-price-global').val()
          //   if(cartDrawerDiscount != ""){
          //     jQuery('.hs-sub-total-cart .hs-mount-sub-total').html(`<span><s><span class="money" style="text-decoration: line-through;" >${globalFields.formatMoney(Number(originalDiscount), globalFields.amount)}</span></s>   <span class="money">${globalFields.formatMoney(Number(updatedDiscount), globalFields.amount)}</span></span>`);
          //   }
          // },1500)
        }
    }
  
     var UpdateSavingMessage = function (isUpdate) {
        if (priceDiff > 0 && isUpdate && globalFields.isCartPage) {
            var saveMessage = globalFields.settings.cart_saving_message.replace('{{discount_amount}}', '<span class="money" data-currency-' + globalFields.currency.toLowerCase() + '="' + globalFields.currencySymbol + priceDiff.toFixed(2) + '" data-currency="' + globalFields.currency + '">' + globalFields.formatMoney(priceDiff.toFixed(2), globalFields.amount) + '</span>');
            var saveHtml = '<span id="saved-banner">' + saveMessage + '</span>';
          if (jQuery(window).width() < 700) {
            jQuery('#saved-banner-div').length == 0 ? jQuery('.cart_subtotal.js-cart_subtotal').after('<div id="saved-banner-div" style="text-align: center;" class="col-md-14">' + saveHtml + '</div>') : jQuery('#saved-banner-div').html(saveHtml);
          }
          else{
            jQuery('#saved-banner-div').length == 0 ? jQuery('.cart_subtotal.js-cart_subtotal').after('<div id="saved-banner-div" style="text-align: end;" class="col-md-14">' + saveHtml + '</div>') : jQuery('#saved-banner-div').html(saveHtml);
          }
        }
        else if (globalFields.isCartPage) {
            jQuery('#saved-banner-div').remove();
        }
    }
  
    var CheckoutClickCart = function () {
        jQuery('.section.clearfix .tos_warning.checkout_button').click(function () {
            // jQuery('[name="updates[]"]').each(function () {
            //     var qtyValue = this.value; var idAtrbtValue = jQuery(this).attr('id'); idAtrbtValue = idAtrbtValue.split('_'); idAtrbtValue = idAtrbtValue[1];
            //     idAtrbtValue = idAtrbtValue.split(':'); idAtrbtValue = idAtrbtValue[0];
            //     for (i = 0; i < globalFieldsCartPage_AC.cartObj.items.length; i++) {
            //         if (globalFieldsCartPage_AC.cartObj.items[i].variant_id == Number(idAtrbtValue)) { globalFieldsCartPage_AC.cartObj.items[i].quantity = Number(qtyValue); }
            //     }
            // });
            TieredPricingCart(globalFieldsCartPage_AC.cartObj, false);
            GetCode(false);
        });
    }

    var CheckoutClickAjax = function () {
        jQuery('#anncodde').click(function (e) {
            e.preventDefault();
            GetCode(true);
        });
    }

    var GetCode = function (isUpper) {
         if (cartDrawerDiscount != "") {
            window.location.href = '/checkout?discount=' + cartDrawerDiscount
          }
         else if (priceDiff > 0 && !checkbuttonflag) {
            $.ajax({
                type: "POST", async: false, url: "https://customerapp.anncode.com/tier/ACPGenerateCartCode",
              	data: { discountOff: priceDiff, subTotal: minimumDiscountSubtotal, discounType: "fixed_amount" },
                success: function (result) {
                  try{
                    if(result.status != 'error' || result.DiscountCode){
                      var data_ = JSON.stringify(result); var parsed_data = JSON.parse(data_); var PRID = parsed_data.PRID;
                      var DCID = parsed_data.DCID; var DiscountCode = parsed_data.DiscountCode;
                      SetCookie("discountCodes", PRID + "-" + DCID + "-" + DiscountCode, 30);
                      if (!isUpper) {
                          DiscountCodeCookie(DiscountCode);
                          jQuery('form[action="/cart"]').append('<input id="discount_input" type="hidden" name="discount" value="' + DiscountCode + '">');
                      } else {
                          DiscountCodeCookie(DiscountCode);
                          //jQuery('form.cart-form').append('<input id="discount_input" type="hidden" name="discount" value="' + DiscountCode + '">');
                          window.location.href = '/checkout?discount=' + DiscountCode;
                      }
                    }
                    else{ 
                      window.location.href = '/checkout';
                    }
                  }
                  catch(e){console.log(e);}
                },
                error: function (e) { console.log(e.statusText); }
            });
          }else{ 
           window.location.href = '/checkout';
          }
         }
    
 jQuery(' hs-text-free-shipping').remove()
    var ReInvokeAjaxCartButton = function () {
        jQuery('.mb_cart.mb_item button.btn, .top-header .dropdown-cart button.btn').off("click"); CheckoutClickAjax();
    }

    var variantIdsToSend = [], minimumDiscountSubtotal = 0, priceDiff = 0;
  


  
        var TieredPricingCart = function (cartObject, isUpdate) {
        let noItemWithSellingPlan = !cartObject.items.some(item => item.hasOwnProperty('selling_plan_allocation'));
        if (noItemWithSellingPlan) {
        checkbuttonflag = false;
        
        variantIdsToSend = []; minimumDiscountSubtotal = 0; priceDiff = 0; var updatedTotalPrice = 0; var actualTotalPrice = 0;
        var tierObj = globalFieldsCartPage_AC.cartSubTotalMetafield;
        var  itemTiers =  globalFieldsCartPage_AC.cartSubTotalMetafield
        if (tierObj != undefined && tierObj != "[]" && tierObj.status && globalFields.StartEndDateValid(tierObj.start_date, tierObj.end_date)) {
            var calculatedTier = CalculateTierCartSubTotal(tierObj, globalFieldsCartPage_AC.is_quantity_total, true);
          //encorage msg
              var rslt = cartObject.item_count;
              for (let km = 0; km < itemTiers.tier_min.length; km++) {

                // // input bar enable disabled
                //    if(rslt <  itemTiers.tier_min[0]){
                //   jQuery('#hs-id-discount').prop("disabled", false);
                //   }else{
                //   jQuery('#hs-id-discount').prop("disabled", true);
                //   }
                
                if(itemTiers.tier_min[itemTiers.tier_min.length - 1] <= rslt){
                  let MessageRemove  = jQuery(`.anncode_Message`) != undefined ? true : false;
                  if(MessageRemove){
                    jQuery(`.anncode_Message`).remove();
                    jQuery('.section.clearfix .sixteen.columns h1').after(`<p class="anncode_Message" style=" padding-top: 12px; font-size:20px; text-align:center; ">Congrats You got <b> ${itemTiers.tier_values[itemTiers.tier_values.length - 1]}%</b> Off! </p>`)
                    jQuery(' hs-text-free-shipping').remove()
                    jQuery('.hs-close-popup-cart .hs-header-close-empty').after(`<p class="anncode_Message" style=" padding-top: 12px; font-size:20px; text-align:center; ">Congrats You got <b> ${itemTiers.tier_values[itemTiers.tier_values.length - 1]}%</b> Off! </p>`)
                  }else if(!MessageRemove){
                  jQuery('.section.clearfix .sixteen.columns h1').after(`<p class="anncode_Message" style=" padding-top: 12px; font-size:20px; text-align:center; ">Congrats You got <b>  ${itemTiers.tier_values[itemTiers.tier_values.length - 1]}%</b> Off! </p>`)
                  jQuery
                  jQuery('.section.clearfix .sixteen.columns h1').after(`<p class="anncode_Message" style=" padding-top: 12px; font-size:20px; text-align:center; ">Congrats You got <b>  ${itemTiers.tier_values[itemTiers.tier_values.length - 1]}%</b> Off! </p>`)
                  }
                break;
                }
                else if(itemTiers.tier_min[km] > rslt){
                let MessageRemove  = jQuery(`.anncode_Message`) != undefined ? true : false;
                if(MessageRemove){
                  // let strFirstThree = CollectionName.substring(0,3);
                  // if(strFirstThree.includes('THE') || strFirstThree.includes('The') || strFirstThree.includes('the')){
                      jQuery(`.removecheck`).remove()
                      jQuery(`.anncode_Message`).remove();
                      if(itemTiers.tier_min[km] - rslt  == 1 ){
                      $('.hs-rewards-content').remove()
                    
                      jQuery('.hs-close-popup-cart .hs-header-close-empty').after(`<p class="anncode_Message" style="font-size:12px; text-align:center;color:black;text-transform: uppercase;">ADD  ANY <b>${itemTiers.tier_min[km] - rslt }</b>       ITEM TO GET  <b>${itemTiers.tier_values[km]}% </b> off! </p>`);
                  if(globalFields.PageOption == "cart"){
                      $('.hs-rewards-content').remove()
                      jQuery('.section.clearfix .sixteen.columns h1').after(`<p class="anncode_Message" style=" padding-top: 12px; font-size:20px;color:black;text-align:center;text-transform: uppercase;">ADD ANY <b>${itemTiers.tier_min[km] - rslt }</b>      ITEM TO GET <b>${itemTiers.tier_values[km]}% </b> off! </p>`)
                  }
                  }else{
                  jQuery('.hs-close-popup-cart .hs-header-close-empty').after(`<p class="anncode_Message" style="font-size:12px; text-align:center;color:black;text-transform: uppercase;">ADD ANY <b>${itemTiers.tier_min[km] - rslt }</b>     ITEMS TO GET <b>${itemTiers.tier_values[km]}% </b> off! </p>`);
                    if(globalFields.PageOption == "cart"){
                      $('.hs-rewards-content').remove()
                      jQuery('.section.clearfix .sixteen.columns h1').after(`<p class="anncode_Message" style=" padding-top: 12px; font-size:20px;color:black;text-align:center;text-transform: uppercase;">ADD  ANY <b>${itemTiers.tier_min[km] - rslt }</b>       ITEMS TO GET <b>${itemTiers.tier_values[km]}% </b> off! </p>`)
                    }
                  }
                }
                break;
                }
              }

          if(globalFieldsCartPage_AC.cartObj.item_count == 0 ){
           $('.anncode_Message').remove();
          } 
//end subtotal 
//end encorage msg 
          
              if (!calculatedTier[3]) {
                  for (k = 0; k < globalFieldsCartPage_AC.cartTiersArray.length; k++) {
                    var item = globalFieldsCartPage_AC.cartTiersArray[k];
                    actualTotalPrice += globalFields.ConvertToFixedDecimalNumber(item.item.original_line_price / 100);
                    if (!item.is_exclude) {
                      variantIdsToSend.push(item.item.variant_id);
                    }
                    if (tierObj.discount_type == 'percentage') {
                      var rslt = CalculateTier(item.item, calculatedTier[2], tierObj, isUpdate, k);
                    }
                  }
                }else{
                  for (k = 0; k < globalFieldsCartPage_AC.cartTiersArray.length; k++) {
                    var item = globalFieldsCartPage_AC.cartTiersArray[k];
                     actualTotalPrice += globalFields.ConvertToFixedDecimalNumber(item.item.original_line_price / 100);
                  }
              }
          
              // if(actualTotalPrice < calculatedTier[5]){ calculatedTier[5] = actualTotalPrice }
                minimumDiscountSubtotal = actualTotalPrice;
                updatedTotalPrice = actualTotalPrice - calculatedTier[5];
                setTimeout(()=>{
                UpdateCartSubtotal(isUpdate, globalFields.ConvertToFixedDecimalNumber(updatedTotalPrice), globalFields.ConvertToFixedDecimalNumber(actualTotalPrice));
                },800)
              priceDiff = calculatedTier[5];
                UpdateSavingMessage(isUpdate);
            

        }
       if(!checkbuttonflag){
          jQuery('.hs-drawer-checkout form').replaceWith('<button id="anncodde" class="hs-checkout-purchase checkout-x-buy-now-btn hs-button-100-w btn hs-event-static">Checkout</button>')
          }
    } else {
    checkbuttonflag = true;
        setTimeout(()=>{
          if(cartObject != undefined){
            jQuery('.hs-sub-total-cart .hs-mount-sub-total').html('<span class="money" data-currency-' + globalFields.currency.toLowerCase() + '="' + globalFields.currencySymbol + cartObject.total_price + '" data-currency="' + globalFields.currency + '">' + globalFields.formatMoney(cartObject.original_total_price/100*100, globalFields.amount) + '</span>');
          }
        },800)
      // jQuery('.anncode_Message').hide()
       var  displaymessage = document.querySelector('.anncode_Message');
       if(displaymessage != null){
         displaymessage.style.display = 'none';
       }
   
       if(!checkbuttonflag){
          jQuery('.hs-drawer-checkout form').replaceWith('<button id="anncodde" class="hs-checkout-purchase checkout-x-buy-now-btn hs-button-100-w btn hs-event-static">Checkout</button>')
          }
     } 
          
    }

    var CalculateTierCartSubTotal = function (tiers, is_quantity_total, isNotInRange) {
        var eligibleItems = jQuery.grep(globalFieldsCartPage_AC.cartTiersArray, function (n) { return !n.is_exclude; });
        var allVariantItemQty = 0;
        var eligibleSubtotal = 0;
        var discount_total = 0;
        for (j = 0; j < eligibleItems.length; j++) {
            allVariantItemQty += eligibleItems[j].item.quantity;
            eligibleSubtotal += globalFields.ConvertToFixedDecimalNumber(eligibleItems[j].item.original_line_price / 100);
        }
        var tierPrice = 0, minTier = 0, maxTier = '';
        for (i = 0; i < tiers.tier_min.length; i++) {
            tierPrice = parseFloat(tiers.tier_values[i]);
            minTier = parseInt(tiers.tier_min[i]), maxTier = tiers.tier_max[i] != 'max' ? parseInt(tiers.tier_max[i]) : tiers.tier_max[i];
            var condition1 = false, condition2 = false;
            if (is_quantity_total) {
                condition1 = allVariantItemQty >= minTier;
                condition2 = maxTier == "max" || allVariantItemQty <= maxTier;
            } else {
                condition1 = eligibleSubtotal >= minTier;
                condition2 = maxTier == "max" || eligibleSubtotal <= maxTier;
            }

          
            
            if (condition1 && condition2) {
              //  setTimeout(()=>{
              // // jQuery('.hs-tag .hs-close-discount-slide-cart').click()
              // // jQuery('#hs-id-discount').val("")
              // },1000)
                isNotInRange = false;
                if (tiers.discount_type == 'percentage') {
                    discount_total = parseFloat(globalFields.ConvertToFixedDecimalNumber((parseFloat(tierPrice) / 100) * globalFields.ConvertToFixedDecimalNumber(eligibleSubtotal)));
                }
                else if (tiers.discount_type == 'fixed') {
                    discount_total = globalFields.ConvertToFixedDecimalNumber(parseFloat(tierPrice));
                }
                break;
            }
        }
        return [minTier, maxTier, tierPrice, isNotInRange, eligibleSubtotal, discount_total];
    }

    var CalculateTier = function (item, tierPrice, itemTiers, isUpdate, index) {
        var updatedItemPrice = 0, updatedLinePrice = 0;
        if (itemTiers.discount_type == 'percentage') {
            var originalPriceCut = parseFloat(globalFields.ConvertToFixedDecimalNumber((parseFloat(tierPrice) / 100) * globalFields.ConvertToFixedDecimalNumber(item.original_price / 100)));
            updatedItemPrice = globalFields.ConvertToFixedDecimalNumber(globalFields.ConvertToFixedDecimalNumber(item.original_price / 100) - originalPriceCut);
        }
        //else if (itemTiers.discount_type == 'fixed') {
        //    updatedItemPrice = globalFields.ConvertToFixedDecimalNumber(globalFields.ConvertToFixedDecimalNumber(item.original_price / 100) - parseFloat(tierPrice));
        //}

        if (updatedItemPrice < 0) { updatedItemPrice = 0; }
        updatedLinePrice = globalFields.ConvertToFixedDecimalNumber(updatedItemPrice * item.quantity);
        UpdateCartItem(item, updatedItemPrice, updatedLinePrice, isUpdate, index);
    }

    var DiscountCodeCookie = function (discount_code) {
        $.ajax({
            type: "HEAD", url: "/discount/" + discount_code,
            success: function (_result) { },
            error: function (e) { console.log(e.statusText); }
        });
    };
  

    var FetchCartTiers = function () {
      
        jQuery.ajax({
            async: false,
            url: "/cart/?view=ac_cart_subtotal_tiers",
            success: function (result) {
                globalFieldsCartPage_AC.cartTiersArray = JSON.parse(result);
                TieredPricingCart(globalFieldsCartPage_AC.cartObj, true);
                CheckoutClickAjax();
              console.log(globalFieldsCartPage_AC.cartSubTotalMetafield.tier_min[0])
          

            },
            error: function (e) { console.log(e.statusText); }
        });
    }
    /*
        var open = window.XMLHttpRequest.prototype.open, send = window.XMLHttpRequest.prototype.send, onReadyStateChange;
        function openReplacement(method, url, async, user, password) { return open.apply(this, arguments); }
        function sendReplacement(data) {
            this.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    ProcessCartResponse(this._url, this.responseText);
                }
            };
            return send.apply(this, arguments);
        }
        window.XMLHttpRequest.prototype.open = openReplacement; window.XMLHttpRequest.prototype.send = sendReplacement;
    */
    jQuery(document).ajaxComplete(function (event, xhr, settings) {
        ProcessCartResponse(settings.url, xhr.responseText);
    });

    try {
        var nativeFetch = window.fetch;
        window.fetch = function (...args) {
            if(args[0].includes("/cart/change") || args[0].includes("/cart/add")){
              setTimeout(function () {
                fetch('/cart.js')
                .then(r => r.json().then(data => ({ status: r.status, body: data })))
                .then(obj => ProcessCartResponse("/cart.js", JSON.stringify(obj.body)));
              }, 500);
            }
            return nativeFetch.apply(window, args);
        }
    }
    catch (e) { }

    var ProcessCartResponse = function (splittedUrl, responseText) {
      
        if (splittedUrl != 'undefined' && splittedUrl != "" && splittedUrl != null) {
            splittedUrl = splittedUrl.split("?");
            if (splittedUrl[0] == "/cart.js" || splittedUrl[0] == "/cart/change.js") {
                globalFieldsCartPage_AC.cartObj = JSON.parse(responseText);
                setTimeout(function () {
                    FetchCartTiers();
                  jQuery('canvas').remove();
                }, 500);
            }
        }
    }
    var AddToCartProduct = function () {
       setTimeout(function(){
        jQuery('#myAdd').click(function () {
          setTimeout(function(){
            jQuery('button[title="Apply"]').click(function () {
              setTimeout(function(){
                TieredPricingCart(globalFieldsCartPage_AC.cartObj, true);
                 }, 800);
                        //remove discount 
          setTimeout(function(){
              let cartDrawerDiscount = $(".hs-code-text").text();
                if(cartDrawerDiscount != ""){
                  jQuery('.hs-close-discount-slide-cart').click(function () {
                    setTimeout(function(){
                      TieredPricingCart(globalFieldsCartPage_AC.cartObj, true);
                    }, 800);
                  })
                }
              }, 1500);
            })
          }, 1500);
        })
      }, 1500);;
    }
    var discountRemoveOnCart = function () {
        setTimeout(function(){
        jQuery('#myAdd').click(function () {
          setTimeout(function(){
            jQuery('button[title="Apply"]').click(function () {
              setTimeout(function(){
                TieredPricingCart(globalFieldsCartPage_AC.cartObj, true);
                 }, 800);
                        //remove discount 
          setTimeout(function(){
              let cartDrawerDiscount = $(".hs-code-text").text();
                if(cartDrawerDiscount != ""){
                  jQuery('.hs-close-discount-slide-cart').click(function () {
                    setTimeout(function(){
                      TieredPricingCart(globalFieldsCartPage_AC.cartObj, true);
                    }, 800);
                  })
                }
              }, 1500);
            })
          }, 1500);
        })
      }, 1500);
    }

     window.addEventListener('load', function () {
       setTimeout(function(){
        jQuery('#myAdd').click(function () {
          setTimeout(function(){
            jQuery('button[title="Apply"]').click(function () {
              setTimeout(function(){
                TieredPricingCart(globalFieldsCartPage_AC.cartObj, true);
                 }, 800);
                        //remove discount 
          setTimeout(function(){
              let cartDrawerDiscount = $(".hs-code-text").text();
                if(cartDrawerDiscount != ""){
                  jQuery('.hs-close-discount-slide-cart').click(function () {
                    setTimeout(function(){
                      TieredPricingCart(globalFieldsCartPage_AC.cartObj, true);
                    }, 800);
                  })
                }
              }, 1500);
            })
          }, 1500);
        })
      }, 1500);
    })


$('.hs-progess-content.hs-hidden-percentages').remove()
    if(!checkbuttonflag){
         jQuery('.hs-drawer-checkout form').replaceWith('<button id="anncodde" class="hs-checkout-purchase checkout-x-buy-now-btn hs-button-100-w btn hs-event-static">Checkout</button>')
      }
   // jQuery('.hs-drawer-checkout form').replaceWith('<button id="anncodde"  class="hs-checkout-purchase checkout-x-buy-now-btn hs-button-100-w btn hs-event-static">Checkout</button>')
      setTimeout(function(){
        $('.hs-progess-content.hs-hidden-percentages').remove()
        if(!checkbuttonflag){
          jQuery('.hs-drawer-checkout form').replaceWith('<button id="anncodde" class="hs-checkout-purchase checkout-x-buy-now-btn hs-button-100-w btn hs-event-static">Checkout</button>')
        }
        // jQuery('.hs-drawer-checkout form').replaceWith('<button id="anncodde" class="hs-checkout-purchase checkout-x-buy-now-btn hs-button-100-w btn hs-event-static">Checkout</button>')
      }, 2000);

      let start = null;
      let requestInterval = function() {      
        start = setInterval(function() {
          fetch('/cart.js')
          .then(r => r.json().then(data => ({ status: r.status, body: data })))
          .then(obj => ProcessCartResponse("/cart.js", JSON.stringify(obj.body)));
          if(!checkbuttonflag){
          jQuery('.hs-drawer-checkout form').replaceWith('<button id="anncodde" class="hs-checkout-purchase checkout-x-buy-now-btn hs-button-100-w btn hs-event-static">Checkout</button>')
          }
        // jQuery('.hs-drawer-checkout form').replaceWith('<button id="anncodde" class="hs-checkout-purchase checkout-x-buy-now-btn hs-button-100-w btn hs-event-static">Checkout</button>')
        }, 1000);
      }
      requestInterval();
      setTimeout(function(){
      clearInterval(start);
      },5000);

      jQuery('#saved-banner-div').remove();
      $('.hs-rewards-content').remove()

   // jQuery('.hs-drawer-checkout form').replaceWith('<button id="anncodde"  class="hs-checkout-purchase checkout-x-buy-now-btn hs-button-100-w btn hs-event-static">Checkout</button>')
    setTimeout(function(){
      $('.hs-rewards-content').remove()
      $(' hs-text-free-shipping').remove()
      if(!checkbuttonflag){
        jQuery('.hs-drawer-checkout form').replaceWith('<button id="anncodde" class="hs-checkout-purchase checkout-x-buy-now-btn hs-button-100-w btn hs-event-static">Checkout</button>')
      }
    }, 2000);


      jQuery('.search-cart-head-m-div .cart_container').click(function () {
        if(!checkbuttonflag){
          jQuery('.hs-drawer-checkout form').replaceWith('<button id="anncodde" class="hs-checkout-purchase checkout-x-buy-now-btn hs-button-100-w btn hs-event-static">Checkout</button>')
        }
       });
      

      $('#ac-add-cart').click(function(){
        setTimeout(function() {
          jQuery.getJSON('/cart.js', function(cart) {
            let cartData = cart.items;
            document.dispatchEvent(new CustomEvent('cart:build' , {bubbles: true})); 
            document.dispatchEvent(new CustomEvent('cart:refresh', {
                bubbles: true,
                 detail: cartData
            })); 
          });
        }, 400);
      })
  

  
    var SetCookie = function (cname, cvalue, exdays) { var d = new Date(); d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000)); var expires = "expires=" + d.toUTCString(); document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/"; }
     jQuery('canvas').remove()
    TieredPricingCart(globalFieldsCartPage_AC.cartObj, true); CheckoutClickCart(); CheckoutClickAjax();  AddToCartProduct();discountRemoveOnCart();
  
    window.addEventListener('load', function () { AddToCartProduct(); discountRemoveOnCart(); })
  
   setTimeout(function() {   AddToCartProduct();  discountRemoveOnCart();   }, 3000); setTimeout(function() {   AddToCartProduct(); discountRemoveOnCart();    }, 5000); setTimeout(function() {   AddToCartProduct(); discountRemoveOnCart();   }, 8000);
}

var globalFieldsCartPage_AC = new ACDiscountApp.CartPage.Global(); var cartObject = new ACDiscountApp.CartPage.Show_CalculateTier();