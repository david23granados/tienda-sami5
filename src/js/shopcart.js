verProductos()
let html_product = `
  <tr id="product_section" name="[[PRODUCT_SKU]]">
      <td>
          <figure class="itemside">
              <div class="aside">
                  <img src="[[PRODUCT_IMG]]" class="img-sm" alt="[[PRODUCT_TITLE]]">
              </div>
              <figcaption class="info">
                  <small class="title text-dark">[[PRODUCT_TITLE]]</small>
                  <p class="text-muted small" id="product-variations" name="[[PRODUCT_SKU]]">[[PRODUCT_VARIATIONS]]</p>
                  <div class="price-wrap"> 
                      <var class="price">${MODENA_PRINCIPAL} [[PRODUCT_PRICE]]</var> 
                      <small style="text-decoration: line-through;"> [[PRODUCT_PRICE_REGULAR]]</small> 
                  </div>
              </figcaption>
          </figure>    
      </td>
      <td class="carrito-botones"> 
          <div class="sm-contenedor-interno">
              <div id="product_delete" name="[[PRODUCT_SKU]]"> 
                  <img src="${DOMINIO_CLOUD}/images/iconos/borrar.svg" alt="borrar"> 
              </div>
              <div class="sm-contenedor-interno">  
                  <button class="btn btn-light [[VALIDAR_VALUE]]" type="button" id="button-minus" name="[[PRODUCT_SKU]]"> - </button> 
                  <input type="text" class="form-control" id="product_quantity" name="[[PRODUCT_SKU]]" value="[[PRODUCT_QUANTITY]]" aria-label="valor de producto"> 
                  <button class="btn btn-light" type="button" id="button-plus" name="[[PRODUCT_SKU]]"> + </button>
              </div>
              <em class="alert-danger" id="product_message" name="[[PRODUCT_SKU]]"></em>
          </div>
      </td>  
  </tr>`
$(document).ready(function () {
  let cart = getCookie(PRODUCTOS_COOKIE)

  if (cart !== null) {
    cart.summary.subTotal = 0
    cart.summary.disccount = 0
    cart.summary.quantity = 0
    cart.summary.total = 0

    for (let i = 0; i < cart.products.length; i++) {
      const product = cart.products[i]
      const price = parseFloat(product.price).toFixed(2)
      const salePrice = parseFloat(product.sale_price).toFixed(2)
      const quantity = product.quantity
      const disccount = (price - salePrice) * quantity
      const subtotal = salePrice * quantity

      cart.summary.subTotal += price * quantity
      cart.summary.disccount += disccount
      cart.summary.quantity += quantity
      cart.summary.total = cart.summary.subTotal - cart.summary.disccount
    }

    setCookie(PRODUCTOS_COOKIE, cart, 0)
  }

  if (getCookie(PRODUCTOS_COOKIE) != null) {
    const cart = getCookie(PRODUCTOS_COOKIE)

    const cart_summary_subTotal = cart.summary.subTotal || 0.0
    const cart_summary_disccount = cart.summary.disccount || 0.0
    const cart_summary_total = cart.summary.total || 0.0

    let html_product_edit_general = ''
    $('.botones-pagar').addClass('activo')
    for (i = 0; i < cart.products.length; i++) {
      if (cart.products[i] != null) {
        const datos_Catalogo_sku_padre = cart.products[i].sku || ''
        const datos_Catalogo_item_title = cart.products[i].item_title || ''
        const datos_variaciones_sale_price = cart.products[i].sale_price || 0
        const datos_variaciones_price_regular = cart.products[i].price || 0
        const datos_variaciones_quantity = cart.products[i].quantity || 0
        const datos_variaciones_url1_imagen_sku = cart.products[i].url1_imagen_sku || ''

        let ProductsVariations = ''
        for (let j = 1; j <= 3; j++) {
          const titulo = cart.products[i]['atributo' + j + '_titulo']
          const valor = cart.products[i]['atributo' + j + '_valor']
          if (titulo && valor) {
            ProductsVariations += (ProductsVariations ? ', ' : '') + titulo + ': ' + valor
          }
        }

        const SubTotaProduct = datos_variaciones_sale_price * datos_variaciones_quantity

        html_product_edit = html_product
          .replaceAll('[[PRODUCT_IMG]]', datos_variaciones_url1_imagen_sku)
          .replaceAll('[[PRODUCT_TITLE]]', datos_Catalogo_item_title)
          .replaceAll('[[PRODUCT_PRICE]]', parseFloat(datos_variaciones_sale_price).toFixed(2))
          .replaceAll('[[PRODUCT_VARIATIONS]]', ProductsVariations)
          .replaceAll('[[PRODUCT_QUANTITY]]', datos_variaciones_quantity)
          .replaceAll('[[PRODUCT_SKU]]', datos_Catalogo_sku_padre)
          .replaceAll('[[PRODUCT_SUBTOTAL]]', parseFloat(SubTotaProduct).toFixed(2))
          .replaceAll('[[VALIDAR_VALUE]]', datos_variaciones_quantity == 1 ? 'd-none' : '')

        if (datos_variaciones_sale_price == datos_variaciones_price_regular) {
          html_product_edit = html_product_edit.replace('[[PRODUCT_PRICE_REGULAR]]', '')
        } else {
          html_product_edit = html_product_edit.replace('[[PRODUCT_PRICE_REGULAR]]', MODENA_PRINCIPAL+" "+ parseFloat(datos_variaciones_price_regular).toFixed(2))
        }

        html_product_edit_general = html_product_edit_general + html_product_edit
      }
    }

    document.getElementById('products_items').innerHTML = html_product_edit_general

    document.getElementById('total_price').textContent = cart_summary_subTotal.toFixed(2)
    document.getElementById('total_discount').textContent = cart_summary_disccount.toFixed(2)
    $('.total_total').text(cart_summary_total.toFixed(2))
  }

  $(document).on('click', '#button-plus', function () {
    const sku = $(this).attr('name')
    const is_valid = calculateValidQuantityPlus(sku)
    if (is_valid === true) {
      $("[id='product_message'][name='" + sku + "']").text('')
      const cartResult = calculateCartPlus(sku)
      setCookie(PRODUCTOS_COOKIE, cartResult, 0)
    } else {
      $("[id='product_message'][name='" + sku + "']").text('No tenemos stock suficiente')
    }
    carritoResumen()
  })
  $(document).on('click', '#button-minus', function () {
    const sku = $(this).attr('name')
    const is_valid = calculateValidQuantityMinus(sku)
    if (is_valid === true) {
      $("[id='product_message'][name='" + sku + "']").text('')
      const cartResult = calculateCartMinus(sku)
      setCookie(PRODUCTOS_COOKIE, cartResult, 0)
    } else {
      asignateQuantityProductChange(sku, 1)
    }
    carritoResumen()
  })
  $(document).on('keyup', '#product_quantity', function () {
    const sku = $(this).attr('name')
    let quantity = $(this).val()
    const is_valid = calculateValidQuantityKeypress(sku, quantity)
    if (is_valid === false) {
      $("[id='product_message'][name='" + sku + "']").text('No tenemos stock suficiente')
    } else {
      $("[id='product_message'][name='" + sku + "']").text('')
    }
  })
  $(document).on('change', '#product_quantity', function () {
    const sku = $(this).attr('name')
    let quantity = $(this).val()
    $("[id='product_message'][name='" + sku + "']").text('')

    if (quantity <= 0 || quantity === null || quantity === '') {
      quantity = 1
    }
    const is_valid = calculateValidQuantityChange(sku, quantity)
    if (is_valid === true) {
      const cartResult = calculateCart(sku, quantity)
      setCookie(PRODUCTOS_COOKIE, cartResult, 0)
    }
  })

  $(document).on('click', '#product_delete', function () {
    const sku = $(this).attr('name')
    const cartResult = setProductDelete(sku)
    setProductDeleteElement(sku)
    setCookie(PRODUCTOS_COOKIE, cartResult, 0)
    carritoResumen()
  })

  function calculateValidQuantityPlus(sku) {
    let cart = getCookie(PRODUCTOS_COOKIE)
    for (i = 0; i < cart.products.length; i++) {
      if (cart.products[i] != null && cart.products[i].sku == sku) {
        const datos_variaciones_quantity = cart.products[i].quantity
        const datos_variaciones_cantidad = cart.products[i].cantidad

        if (datos_variaciones_cantidad > datos_variaciones_quantity) {
          return true
        }
        return false
      }
    }
    return false
  }
  function calculateValidQuantityMinus(sku) {
    let cart = getCookie(PRODUCTOS_COOKIE)
    for (i = 0; i < cart.products.length; i++) {
      if (cart.products[i] != null && cart.products[i].sku == sku) {
        const datos_variaciones_quantity = cart.products[i].quantity - 1
        if (datos_variaciones_quantity > 0) {
          return true
        }
      }
    }
    return false
  }
  function calculateValidQuantityKeypress(sku, quantity) {
    let cart = getCookie(PRODUCTOS_COOKIE)
    for (i = 0; i < cart.products.length; i++) {
      if (cart.products[i] != null && cart.products[i].sku == sku) {
        const datos_variaciones_cantidad = cart.products[i].cantidad
        if (datos_variaciones_cantidad >= quantity) {
          return true
        } else {
          return false
        }
      }
    }
    return false
  }
  function calculateValidQuantityChange(sku, quantity) {
    let cart = getCookie(PRODUCTOS_COOKIE)
    let datos_variaciones_quantity = 0
    for (i = 0; i < cart.products.length; i++) {
      if (cart.products[i] != null && cart.products[i].sku == sku) {
        const datos_variaciones_cantidad = cart.products[i].cantidad
        datos_variaciones_quantity = cart.products[i].quantity
        if (datos_variaciones_cantidad < quantity) {
          asignateQuantityProductChange(sku, datos_variaciones_quantity)
          return false
        } else {
          asignateQuantityProductChange(sku, quantity)
          return true
        }
      }
    }
    asignateQuantityProductChange(sku, datos_variaciones_quantity)
    return true
  }
  function asignateQuantityProduct(sku, value, subTotal, disccount, total) {
    console.log(total);
    $("[id='product_quantity'][name='" + sku + "']").val(value)
    $("[id='product_message'][name='" + sku + "']").text('')
    if (value == 1) {
      $(`[id="button-minus"][name="${sku}"]`).addClass("d-none")
    }else{
      $(`[id="button-minus"][name="${sku}"]`).removeClass("d-none")
    }
    document.getElementById('total_price').textContent = subTotal.toFixed(2)
    document.getElementById('total_discount').textContent = disccount.toFixed(2)
    $('.total_total').text(total.toFixed(2))
  }
  function asignateQuantityProductChange(sku, quantity) {
    $("[id='product_quantity'][name='" + sku + "']").val(quantity)
  }
  function calculateCartPlus(sku) {
    const cart = getCookie(PRODUCTOS_COOKIE)

    const product = cart.products.find((product) => product.sku === sku)

    if (product) {
      const value = 1
      const price = parseFloat(product.price)
      const salePrice = parseFloat(product.sale_price)
      const quantity = product.quantity + value
      const discount = (price - salePrice) * quantity
      const subtotal = price * quantity
      const subtotalProduct = salePrice * quantity

      product.quantity = quantity
      product.observacion = ''

      cart.summary.subTotal += price
      cart.summary.disccount += (price - salePrice)
      cart.summary.quantity += value
      cart.summary.total = cart.summary.subTotal - cart.summary.disccount

      setProductSubTotalElement(sku, parseFloat(subtotalProduct).toFixed(2))
      asignateQuantityProduct(sku, quantity, cart.summary.subTotal, cart.summary.disccount, cart.summary.total)
    }

    return cart
  }
  function calculateCartMinus(sku) {
    const cart = getCookie(PRODUCTOS_COOKIE)

    const product = cart.products.find((product) => product.sku === sku)

    if (product) {
      const value = -1
      const price = parseFloat(product.price)
      const salePrice = parseFloat(product.sale_price)
      const quantity = product.quantity + value
      const discount = (price - salePrice) * quantity
      const subtotal = price * quantity
      const subtotalProduct = salePrice * quantity

      product.quantity = quantity
      product.observacion = ''

      cart.summary.subTotal -= price
      cart.summary.disccount -= (price - salePrice)
      cart.summary.quantity -= value
      cart.summary.total = cart.summary.subTotal - cart.summary.disccount

      setProductSubTotalElement(sku, subtotalProduct.toFixed(2))
      asignateQuantityProduct(sku, quantity, cart.summary.subTotal, cart.summary.disccount, cart.summary.total)
    }

    return cart
  }
  function calculateCart(sku, quantity) {
    let cart = getCookie(PRODUCTOS_COOKIE)
    let productToUpdate = cart.products.find((product) => product?.sku === sku)

    if (productToUpdate) {
      const oldValue = productToUpdate.quantity
      const newValue = quantity
      const price = parseFloat(productToUpdate.price).toFixed(2)
      const salePrice = parseFloat(productToUpdate.sale_price).toFixed(2)

      const newQuantity = productToUpdate.quantity + (newValue - oldValue)
      const discount = (price - salePrice) * newQuantity
      const newSubtotal = price * newQuantity

      setProductSubTotalElement(sku, parseFloat(salePrice * newValue).toFixed(2))

      productToUpdate.quantity = newQuantity
      productToUpdate.observacion = ''

      cart.summary.subTotal = cart.summary.subTotal - price * oldValue + newSubtotal
      cart.summary.disccount = cart.summary.disccount - (price - salePrice) * oldValue + discount
      cart.summary.quantity = cart.summary.quantity - oldValue + newValue
      cart.summary.total = cart.summary.subTotal - cart.summary.disccount

      asignateQuantityProduct(sku, newQuantity, cart.summary.subTotal, cart.summary.disccount, cart.summary.total)
    }

    return cart
  }
  function setProductDelete(sku) {
    let cart = getCookie(PRODUCTOS_COOKIE)
    for (let i = 0; i < cart.products.length; i++) {
      if (cart.products[i] != null && cart.products[i].sku == sku) {
        const datos_variaciones_quantity = cart.products[i].quantity
        const datos_variaciones_disccount = (cart.products[i].price - cart.products[i].sale_price) * datos_variaciones_quantity
        const subtotal = cart.products[i].price * datos_variaciones_quantity

        cart.summary.subTotal -= subtotal
        cart.summary.disccount -= datos_variaciones_disccount
        cart.summary.quantity -= datos_variaciones_quantity
        cart.summary.total -= subtotal - datos_variaciones_disccount

        delete cart.products.splice(i, 1)
        asignateQuantityProduct(sku, datos_variaciones_quantity, cart.summary.subTotal, cart.summary.disccount, cart.summary.total)

        return cart
      }
    }
  }
  function setProductDeleteElement(sku) {
    $("[id='product_section'][name='" + sku + "']").remove()
  }
  function setProductSubTotalElement(sku, value) {
    $("[id='product_subtotal'][name='" + sku + "']").text(value)
  }
})
