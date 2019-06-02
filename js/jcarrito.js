$(function () {

    var goToCartIcon = function($addTocartBtn){
    var $cartIcon = $(".my-cart-icon");
    var $image = $('<img width="30px" height="30px" src="' + $addTocartBtn.data("image") + '"/>').css({"position": "fixed", "z-index": "999"});
    $addTocartBtn.prepend($image);
    var position = $cartIcon.position();
    $image.animate({
      top: position.top,
      left: position.left
    }, 500 , "linear", function() {
      $image.remove();
    });
  }

  $('.my-cart-btn').myCart({
    currencySymbol: '$',
    classCartIcon: 'my-cart-icon',
    classCartBadge: 'my-cart-badge',
    classProductQuantity: 'my-product-quantity',
    classProductRemove: 'my-product-remove',
    classCheckoutCart: 'my-cart-checkout',
    classClearMyCart: 'my-cart-clear',
    classSendYourCard: 'my-cart-sendyourcard',
    affixCartIcon: true,
    showCheckoutModal: true,
    numberOfDecimals: 2,
//    cartItems: [
//      {id: 1, name: 'product 1', summary: 'summary 1', price: 10, quantity: 1, image: 'img_defend/AT-2002.jpg'},
//      {id: 2, name: 'product 2', summary: 'summary 2', price: 20, quantity: 1, image: 'img_defend/BF-3000.jpg'},
//      {id: 3, name: 'product 3', summary: 'summary 3', price: 30, quantity: 1, image: 'img_defend/LG-21XX.jpg'}
  //  ],
    clickOnAddToCart: function($addTocart){
      goToCartIcon($addTocart);
    },
    afterAddOnCart: function(products, totalPrice, totalQuantity) {
      console.log("afterAddOnCart", products, totalPrice, totalQuantity);
    },
    clickOnCartIcon: function($cartIcon, products, totalPrice, totalQuantity) {
      console.log("cart icon clicked", $cartIcon, products, totalPrice, totalQuantity);
    },
    checkoutCart: function () {
          var pdf = new jsPDF('p', 'pt', 'a4');

          // source can be HTML-formatted string, or a reference
          // to an actual DOM element from which the text will be scraped.
          // source = $('#my-cart-modal')[0];
          source = $('#cccxxx')[0];
          // we support special element handlers. Register them with jQuery-style
          // ID selector for either ID or node name. ("#iAmID", "div", "span" etc.)
          // There is no support for any other type of selectors
          // (class, of compound) at this time.
          specialElementHandlers = {
              // element with id of "bypass" - jQuery style selector
              '#bypassme': function (element, renderer) {
                  // true = "handled elsewhere, bypass text extraction"
                  return true
              }
          };
          margins = {
              top: 15,
              bottom: 10,
              left: 10,
              width: 522
          };
          // all coords and widths are in jsPDF instance's declared units
          // 'inches' in this case
          $('#cccxxx').css({"font-size": "8px"});
          pdf.setFontSize(8);
          pdf.setFontStyle('italic');
          pdf.setFont('helvetica');
          pdf.fromHTML(
              $('#cccxxx').html(), // HTML string or DOM elem ref.
              margins.left, // x coord
              margins.top, { // y coord
                  'width': margins.width, // max width of content on PDF
                  'elementHandlers': specialElementHandlers
              },

              function (dispose) {
                  // dispose: object with X, Y of the last line add to the PDF
                  //          this allow the insertion of new lines after html
                  pdf.save('Fesa-Orders.pdf');
              }, margins
          );
          return true;
      },

    solomensaje: function( products, totalPrice, totalQuantity) {
      var checkoutString = "Total Price $:    " + totalPrice + "\nTotal Quantity: " + totalQuantity;
      var xstrname = "";
      var xstrcode = "";
      checkoutString += "\n\n CODE___ \t\tPRODUCT NAME______________________________________\t\tPRICE__\t QTY_____";

      $.each(products, function(){
        //checkoutString += ("\n " + this.id + " \t " + this.name + " \t " + this.summary + " \t " + this.price + " \t " + this.quantity + " \t " + this.image);
        xstrname = this.name+"________________________________________";
        xstrcode = this.id+"          ";
        checkoutString += ("\n " + xstrcode.substr(0,9) + " \t " + xstrname.substr(0,49) + " \t\t " + this.price + " \t " + this.quantity);
      });
      console.log("checking out", products, totalPrice, totalQuantity);
      return checkoutString;
    },

    getDiscountPrice: function(products, totalPrice, totalQuantity) {
      console.log("calculating discount", products, totalPrice, totalQuantity);
      return totalPrice * 1;
    }
  });

  $("#addNewProduct").click(function(event) {
    var currentElementNo = $(".row").children().length + 1;
    $(".row").append('<div class="col-md-3 text-center"><img src="images/img_empty.png" width="150px" height="150px"><br>product ' + currentElementNo + ' - <strong>$' + currentElementNo + '</strong><br><button class="btn btn-danger my-cart-btn" data-id="' + currentElementNo + '" data-name="product ' + currentElementNo + '" data-summary="summary ' + currentElementNo + '" data-price="' + currentElementNo + '" data-quantity="1" data-image="images/img_empty.png">Add to Cart</button><a href="#" class="btn btn-info">Details</a></div>')
  });
});
