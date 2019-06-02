/*
 * jQuery myCart - v1.7 - 2018-03-07
 * http://asraf-uddin-ahmed.github.io/
 * Copyright (c) 2017 Asraf Uddin Ahmed; Licensed None
 */

(function ($) {

  "use strict";

  var OptionManager = (function () {
    var objToReturn = {};

    var _options = null;
    var DEFAULT_OPTIONS = {
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
      cartItems: null,
      clickOnAddToCart: function ($addTocart) {},
      afterAddOnCart: function (products, totalPrice, totalQuantity) {},
      clickOnCartIcon: function ($cartIcon, products, totalPrice, totalQuantity) {},
      checkoutCart: function () {
        return false;
      },
      solomensaje: function (products, totalPrice, totalQuantity) {
        return false;
      },
      getDiscountPrice: function (products, totalPrice, totalQuantity) {
        return null;
      }
    };


    var loadOptions = function (customOptions) {
      _options = $.extend({}, DEFAULT_OPTIONS);
      if (typeof customOptions === 'object') {
        $.extend(_options, customOptions);
      }
    };
    var getOptions = function () {
      return _options;
    };

    objToReturn.loadOptions = loadOptions;
    objToReturn.getOptions = getOptions;
    return objToReturn;
  }());

  var MathHelper = (function () {
    var objToReturn = {};
    var getRoundedNumber = function (number) {
      if (isNaN(number)) {
        throw new Error('Parameter is not a Number');
      }
      number = number * 1;
      var options = OptionManager.getOptions();
      return number.toFixed(options.numberOfDecimals);
    };
    objToReturn.getRoundedNumber = getRoundedNumber;
    return objToReturn;
  }());

  var ProductManager = (function () {
    var objToReturn = {};

    /*
    PRIVATE
    */
    localStorage.products = localStorage.products ? localStorage.products : "";
    var getIndexOfProduct = function (id) {
      var productIndex = -1;
      var products = getAllProducts();
      $.each(products, function (index, value) {
        if (value.id == id) {
          productIndex = index;
          return;
        }
      });
      return productIndex;
    };
    var setAllProducts = function (products) {
      localStorage.products = JSON.stringify(products);
    };
    var addProduct = function (id, name, summary, price, quantity, image) {
      var products = getAllProducts();
      products.push({
        id: id,
        name: name,
        summary: summary,
        price: price,
        quantity: quantity,
        image: image
      });
      setAllProducts(products);
    };

    /*
    PUBLIC
    */
    var getAllProducts = function () {
      try {
        var products = JSON.parse(localStorage.products);
        return products;
      } catch (e) {
        return [];
      }
    };
    var updatePoduct = function (id, quantity) {
      var productIndex = getIndexOfProduct(id);
      if (productIndex < 0) {
        return false;
      }
      var products = getAllProducts();
      products[productIndex].quantity = typeof quantity === "undefined" ? products[productIndex].quantity * 1 + 1 : quantity;
      setAllProducts(products);
      return true;
    };
    var setProduct = function (id, name, summary, price, quantity, image) {
      if (typeof id === "undefined") {
        console.error("id required");
        return false;
      }
      if (typeof name === "undefined") {
        console.error("name required");
        return false;
      }
      if (typeof image === "undefined") {
        console.error("image required");
        return false;
      }
      if (!$.isNumeric(price)) {
        console.error("price is not a number");
        return false;
      }
      if (!$.isNumeric(quantity)) {
        console.error("quantity is not a number");
        return false;
      }
      summary = typeof summary === "undefined" ? "" : summary;

      if (!updatePoduct(id)) {
        addProduct(id, name, summary, price, quantity, image);
      }
    };
    var clearProduct = function () {
      setAllProducts([]);
    };
    var removeProduct = function (id) {
      var products = getAllProducts();
      products = $.grep(products, function (value, index) {
        return value.id != id;
      });
      setAllProducts(products);
    };

    var getTotalQuantity = function () {
      var total = 0;
      var products = getAllProducts();
      $.each(products, function (index, value) {
        total += value.quantity * 1;
      });
      return total;
    };

    var getTotalPrice = function () {
      var products = getAllProducts();
      var total = 0;
      $.each(products, function (index, value) {
        total += value.quantity * value.price;
        total = MathHelper.getRoundedNumber(total) * 1;
      });
      return total;
    };

    objToReturn.getAllProducts = getAllProducts;
    objToReturn.updatePoduct = updatePoduct;
    objToReturn.setProduct = setProduct;
    objToReturn.clearProduct = clearProduct;
    objToReturn.removeProduct = removeProduct;
    objToReturn.getTotalQuantity = getTotalQuantity;
    objToReturn.getTotalPrice = getTotalPrice;
    return objToReturn;
  }());


  var loadMyCartEvent = function (targetSelector) {

    var options = OptionManager.getOptions();
    var $cartIcon = $("." + options.classCartIcon);
    var $cartBadge = $("." + options.classCartBadge);
    var classProductQuantity = options.classProductQuantity;
    var classProductRemove = options.classProductRemove;
    var classCheckoutCart = options.classCheckoutCart;
    var classClearMyCart = options.classClearMyCart;
    var classSendYourCard = options.classSendYourCard;

    var idCartModal = 'my-cart-modal';
    var idCartTable = 'my-cart-table';
    var idGrandTotal = 'my-cart-grand-total';
    var idEmptyCartMessage = 'my-cart-empty-message';
    var idDiscountPrice = 'my-cart-discount-price';
    var classProductTotal = 'my-product-total';
    var classAffixMyCartIcon = 'my-cart-icon-affix';


    if (options.cartItems && options.cartItems.constructor === Array) {
      ProductManager.clearProduct();
      $.each(options.cartItems, function () {
        ProductManager.setProduct(this.id, this.name, this.summary, this.price, this.quantity, this.image);
      });
    }

    $cartBadge.text(ProductManager.getTotalQuantity());

    if (!$("#carrito" + idCartModal).length) {

      var d = new Date();

      $('body').append(
        '<div class="modal fade" id="' + idCartModal + '" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">' +
          '<div class="modal-dialog modal-lg" role="document">' +
            '<div class="modal-content">' +
              '<div class="modal-header">' +
                '<h4 class="modal-title" id="myModalLabel"><img class="glyphicon" width="30px" height="30px" src="images/fesalogosmall.png"> <span class="glyphicon glyphicon-shopping-cart"></span></img> My Cart</h4>' +
                '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
              '</div>' +
              '<div class="modal-body">' +
                '<table class="table-responsive" id="' + idCartTable + '"></table>' +
              '</div>' +
              '<div class="modal-footer">' +
                '<button type="button" class="btn btn-default " data-dismiss="modal">Continue Shopping</button>' +
                '<button type="button" class="btn btn-danger '    + classClearMyCart  + ' data-dismiss="modal">Clear My Cart</button>' +
                '<button type="button" class="btn btn-primary btn-block ' + classCheckoutCart + '">Save to PDF</button>' +
                '<form name="formsendmychart" method="post" action="contactus.php" target="_blank">' +
                '     <input type="hidden" id="txtlistproduct" name="txtlistproduct">' +
                '     <button class="btn btn-warning btn-block ' + classSendYourCard + '" onclick="" type="submit">' +
                '     <i class="fa fa-paper-plane"></i> Send Your Cart' +
                '     </button>' +
                '</form>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>'+

        '<div class="mf-div-noshow" id="cccxxx">' +
            '<h2 style="color: green"><img width="30px" style="float:left;width:42px;height:30px;" src="images/fesaicon.png"></img>Fesa Dental Supply Inc.</h2>' +
            '<br></br>' +
            '<h6>Address: 43-47 44th ST SunnySide NY 11104</h6>' +
            '<h6>Telephone: (718) 592-6783</h6>' +
            '<h6>Date : ' + d +  '</h6>' +
            '<br>' +
            '<h4 >My Cart</h4>' +
            '<table class ="mf-class-pdftext" id="tableforpdf">'  +
              '<tr>' +
                '<td>Code</td>' +
                '<td>Product Name</td>' +
                '<td>Price</td>' +
                '<td>Qty</td>' +
                '<td>Total</td>' +
              '</tr>' +
            '</table>' +
        '</div>'
      );
    }

    var xxxx = function () {
      $("#tableforpdf").empty();
      $("#tableforpdf").append(
                    '<tr>' +
                      '<td>Code</td>' +
                      '<td>Product Name</td>' +
                      '<td>Price</td>' +
                      '<td>Qty</td>' +
                      '<td>Total</td>' +
                    '</tr>'
      );
      var prod = ProductManager.getAllProducts();
      $.each(prod, function () {
        var total = this.quantity * this.price;
        $("#tableforpdf").append(
          '<tr>' +
            '<td>' + this.id + '</td>' +
            '<td>' + this.name + '</td>' +
            '<td class="text-right">' + options.currencySymbol + MathHelper.getRoundedNumber(this.price) + '</td>' +
            '<td>' + this.quantity + '</td>' +
            '<td class="text-right ' + classProductTotal + '">' + options.currencySymbol + MathHelper.getRoundedNumber(total) + '</td>' +
          '</tr>'
        );
      });

      $("#tableforpdf").append(
        '<tr>' +
          '<td></td>' +
          '<td><strong>Total</strong></td>' +
          '<td></td>' +
          '<td></td>' +
          '<td class="text-right"><strong id="idGrandTotal2"></strong></td>' +
        '</tr>'
      );

      showGrandTotal2();

    }

    var drawTable = function () {
      var $cartTable = $("#" + idCartTable);
      $cartTable.empty();

      var products = ProductManager.getAllProducts();
      $cartTable.append(
        '<tr>' +
          '<td>Image</td>' +
          '<td>Code</td>' +
          '<td>Product Name</td>' +
          '<td>Price</td>' +
          '<td>Qty</td>' +
          '<td>Total</td>' +
          '<td>Action</td>' +
        '</tr>'
      );

      $.each(products, function () {
        var total = this.quantity * this.price;
        $cartTable.append(
          '<tr data-id="' + this.id + '" data-price="' + this.price + '">' +
            '<td ><img width="30px" height="30px" src="' + this.image + '"/></td>' +
            '<td>' + this.id + '</td>' +
            '<td>' + this.name + '</td>' +
            '<td class="text-right">' + options.currencySymbol + MathHelper.getRoundedNumber(this.price) + '</td>' +
            '<td ><input type="number" min="1" style="width: 70px;" class="' + classProductQuantity + '" value="' + this.quantity + '"/></td>' +
            '<td class="text-right ' + classProductTotal + '">' + options.currencySymbol + MathHelper.getRoundedNumber(total) + '</td>' +
            '<td title="Remove from Cart" class="text-center" style="width: 30px;"><a href="javascript:void(0);" class="btn btn-xs btn-danger ' + classProductRemove + '">X</a></td>' +
          '</tr>'
        );
      });

      $cartTable.append(products.length ?
        '<tr>' +
          '<td></td>' +
          '<td></td>' +
          '<td><strong>Total</strong></td>' +
          '<td></td>' +
          '<td></td>' +
          '<td class="text-right"><strong id="' + idGrandTotal + '"></strong></td>' +
          '<td></td>' +
        '</tr>' :
        '<div class="alert alert-danger" role="alert" id="' + idEmptyCartMessage + '">Your cart is empty</div>'
      );

      var discountPrice = options.getDiscountPrice(products, ProductManager.getTotalPrice(), ProductManager.getTotalQuantity());
      if (products.length && discountPrice !== null) {
        $cartTable.append(
          '<tr style="color: red">' +
            '<td></td>' +
            '<td></td>' +
            '<td><strong>Total Quote</strong></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td class="text-right"><strong id="' + idDiscountPrice + '"></strong></td>' +
            '<td></td>' +
          '</tr>'
        );
      }

      showGrandTotal();
      showDiscountPrice();
    };

    var showModal = function () {
      drawTable();
      xxxx();
      $("#" + idCartModal).modal('show');
    };

    var updateCart = function () {
      $.each($("." + classProductQuantity), function () {
        var id = $(this).closest("tr").data("id");
        ProductManager.updatePoduct(id, $(this).val());
      });
    };

    var showGrandTotal = function () {
      $("#" + idGrandTotal).text(options.currencySymbol + MathHelper.getRoundedNumber(ProductManager.getTotalPrice()));
    };

    var showGrandTotal2 = function () {
      $("#idGrandTotal2").text(options.currencySymbol + MathHelper.getRoundedNumber(ProductManager.getTotalPrice()));
    };

    var showDiscountPrice = function () {
      $("#" + idDiscountPrice).text(options.currencySymbol + MathHelper.getRoundedNumber(options.getDiscountPrice(ProductManager.getAllProducts(), ProductManager.getTotalPrice(), ProductManager.getTotalQuantity())));
    };

    /*
    EVENT
    */
    if (options.affixCartIcon) {
      var cartIconBottom = $cartIcon.offset().top * 1 + $cartIcon.css("height").match(/\d+/) * 1;
      var cartIconPosition = $cartIcon.css('position');
      $(window).scroll(function () {
        $(window).scrollTop() >= cartIconBottom ? $cartIcon.addClass(classAffixMyCartIcon) : $cartIcon.removeClass(classAffixMyCartIcon);
      });
    }

    $cartIcon.click(function () {
      options.showCheckoutModal ? showModal() : options.clickOnCartIcon($cartIcon, ProductManager.getAllProducts(), ProductManager.getTotalPrice(), ProductManager.getTotalQuantity());
    });

    $(document).on("input", "." + classProductQuantity, function () {
      var price = $(this).closest("tr").data("price");
      var id = $(this).closest("tr").data("id");
      var quantity = $(this).val();

      $(this).parent("td").next("." + classProductTotal).text(options.currencySymbol + MathHelper.getRoundedNumber(price * quantity));
      ProductManager.updatePoduct(id, quantity);

      $cartBadge.text(ProductManager.getTotalQuantity());
      showGrandTotal();
      showDiscountPrice();
    });

    $(document).on('keypress', "." + classProductQuantity, function (evt) {
      if (evt.keyCode == 38 || evt.keyCode == 40) {
        return;
      }
      evt.preventDefault();
    });

    $(document).on('click', "." + classProductRemove, function () {
      var $tr = $(this).closest("tr");
      var id = $tr.data("id");
      $tr.hide(500, function () {
        ProductManager.removeProduct(id);
        drawTable();
        $cartBadge.text(ProductManager.getTotalQuantity());
      });
    });

    $(document).on('click', "." + classClearMyCart, function () {
      ProductManager.clearProduct();
      $cartBadge.text(ProductManager.getTotalQuantity());
      alert("The list was completely dropped");
      $("#" + idCartModal).modal("hide");
    });

    $(document).on('click', "." + classCheckoutCart, function () {
      var products = ProductManager.getAllProducts();
      if (!products.length) {
        $("#" + idEmptyCartMessage).fadeTo('fast', 0.5).fadeTo('fast', 1.0);
        return;
      }
      var xxx = options.checkoutCart();
    });

    $(document).on('click', "." + classSendYourCard, function () {
      var isCheckedOut = options.solomensaje(ProductManager.getAllProducts(), ProductManager.getTotalPrice(), ProductManager.getTotalQuantity());
      $("#txtlistproduct").val(isCheckedOut);
    });

    $(document).on('click', targetSelector, function () {
      var $target = $(this);
      options.clickOnAddToCart($target);

      var id = $target.data('id');
      var name = $target.data('name');
      var summary = $target.data('summary');
      var price = $target.data('price');
      var quantity = $target.data('quantity');
      var image = $target.data('image');

      ProductManager.setProduct(id, name, summary, price, quantity, image);
      $cartBadge.text(ProductManager.getTotalQuantity());

      options.afterAddOnCart(ProductManager.getAllProducts(), ProductManager.getTotalPrice(), ProductManager.getTotalQuantity());
    });

  };


  $.fn.myCart = function (userOptions) {
    OptionManager.loadOptions(userOptions);
    loadMyCartEvent(this.selector);
    return this;
  };


})(jQuery);
