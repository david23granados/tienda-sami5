const ESQUELETO_DETALLE = `
  <div class="card">
    <div class="card-header">
      <a class="collapsed card-link" data-toggle="collapse" href="#detalle_[[index]]">
        [[titulo]]
      </a>
    </div>
    <div id="detalle_[[index]]" class="collapse" data-parent="#accordionDetalles">
      <div class="card-body">
        [[detalle]]
      </div>
    </div>
  </div>
`
$(document).ready(function () {
  // $('.instagram').attr('href', `https://www.instagram.com/share?url=${encodeURIComponent(location.href)}`)
  $('.facebook').attr('href', `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(location.href)}`)
  $('.tiktok').attr('href', `whatsapp://send?text=${encodeURIComponent(location.href)}`)
  console.log(resultServer) //producto
 if (descrip_catalogo == "") {
    $("#descripcion_title").css("display" , "none")
  
 }
 if (descrip_corta == "") {
  $("#descripcion_title").css("display" , "none")

}
  var img_var = resultServer['obj']['datos_variaciones'][0]
  var imgs = ''

  for (var i = 1; i <= 6; i++) {
    var img_url = img_var['url' + i + '_imagen_sku']
    if (img_url != '') {
      imgs += '<div class="item-thumb"><img src="' + img_url + '" alt="'+ resultServer.obj.datos_Catalogo[0].item_title +'"></div>'
    }
  }

  $('#product-thumbs-wrap').append(imgs)

  //DESCRIPCIÓN

  var info_cat = resultServer['obj']['datos_Catalogo'][0]

  const descripciones = [
    { titulo: info_cat.descripcion1_titulo, detalle: info_cat.descripcion1_detalle },
    { titulo: info_cat.descripcion2_titulo, detalle: info_cat.descripcion2_detalle },
    { titulo: info_cat.descripcion3_titulo, detalle: info_cat.descripcion3_detalle },
    { titulo: info_cat.descripcion4_titulo, detalle: info_cat.descripcion4_detalle },
    { titulo: info_cat.descripcion5_titulo, detalle: info_cat.descripcion5_detalle }
  ]

  for (let i = 0; i < descripciones.length; i++) {
    const { titulo, detalle } = descripciones[i]

    if (titulo && detalle ) {
      console.log(titulo,detalle);
      $('#accordionDetalles').append(
        ESQUELETO_DETALLE.replaceAll('[[index]]', i + 1)
          .replaceAll('[[titulo]]', titulo)
          .replaceAll('[[detalle]]', detalle)
      )
    }
  }

  var pr_of = resultServer.obj.datos_variaciones[0].sale_price //precio_oferta
  var pr_v = resultServer.obj.datos_variaciones[0].price //precio_venta

  if (pr_v == pr_of) {
    $('#precio_prod').html(`<var class=" h5">${MODENA_PRINCIPAL} <span id="product-price">` + parseFloat(pr_v).toFixed(2) + `</span></var>`)
  } else if (pr_v != pr_of) {
    var percent = pr_of * 100
    percent = percent / pr_v
    percent = 100 - percent
    percent = Math.round(percent)
    $('#precio_prod').html(
      `
        <div class="h5 precio_oferta">${MODENA_PRINCIPAL} <del id="product-sale-price">` +
        parseFloat(pr_v).toFixed(2) +
        `</del></div>
        <div class="h5">Ahora ${MODENA_PRINCIPAL} <span id="product-price">` +
        parseFloat(pr_of).toFixed(2) +
        `</span></div>  
        <i class="label-oferta"> -` +
        percent +
        `%</i>`
    )
  }

  EnableItemDropdown()

  $(document).on('click', '#product-add-cart', async function () {
    const sku = $(this).attr('name')
    const quantity = parseInt($('#product_quantity').val())

    const data = [
      {
        dominio: DOMINIO,
        sku: sku
      }
    ]
    const response = await fetch('https://api-inventario.samishop.pe/datosvariaciones/validate/price_stock', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    if (response.ok) {
      let result = await response.json()

      let datos = {
        datos_Catalogo_item_title: result.sRpta[0].item_title,
        datos_Catalogo_tags_promociones: result.sRpta[0].tags_promociones,
        datos_Catalogo_url_producto: result.sRpta[0].url_producto,
        datos_variaciones_sku: result.sRpta[0].sku,
        datos_variaciones_price: result.sRpta[0].price,
        datos_variaciones_sale_price: result.sRpta[0].sale_price,
        datos_variaciones_cantidad: result.sRpta[0].cantidad,
        datos_variaciones_atributo1_titulo: result.sRpta[0].atributo1_titulo,
        datos_variaciones_atributo1_valor: result.sRpta[0].atributo1_valor,
        datos_variaciones_atributo2_titulo: result.sRpta[0].atributo2_titulo,
        datos_variaciones_atributo2_valor: result.sRpta[0].atributo2_valor,
        datos_variaciones_atributo3_titulo: result.sRpta[0].atributo3_titulo,
        datos_variaciones_atributo3_valor: result.sRpta[0].atributo3_valor,
        datos_variaciones_url1_imagen_sku: result.sRpta[0].url1_imagen_sku,
        datos_variaciones_peso: result.sRpta[0].peso,
        datos_variaciones_subtotal: result.sRpta[0].sale_price * quantity,
        quantity: quantity
      }

      var productValue = {
        sku: datos.datos_variaciones_sku,
        item_title: datos.datos_Catalogo_item_title,
        //hacer un for y validar por datos_variaciones y validar por sku
        price: datos.datos_variaciones_price,
        sale_price: datos.datos_variaciones_sale_price,
        quantity: quantity, //html
        cantidad: datos.datos_variaciones_cantidad,
        atributo1_titulo: datos.datos_variaciones_atributo1_titulo,
        atributo1_valor: datos.datos_variaciones_atributo1_valor,
        atributo2_titulo: datos.datos_variaciones_atributo2_titulo,
        atributo2_valor: datos.datos_variaciones_atributo2_valor,
        atributo3_titulo: datos.datos_variaciones_atributo3_titulo,
        atributo3_valor: datos.datos_variaciones_atributo3_valor,
        observacion: '', //html
        tags_promociones: datos.datos_Catalogo_tags_promociones,
        url1_imagen_sku: datos.datos_variaciones_url1_imagen_sku,
        url_producto: datos.datos_Catalogo_url_producto,
        subtotal: datos.datos_variaciones_subtotal,
        peso: datos.datos_variaciones_peso
      }

      if (getCookie(PRODUCTOS_COOKIE) != null) {
        let cart = getCookie(PRODUCTOS_COOKIE)

        let cardResult = setProduct(cart, productValue, datos)
        if (cardResult != null) {
          $('#product-cart-message').text('')
          setCookie(PRODUCTOS_COOKIE, cardResult, 0)
          $('#staticBackdrop').modal()
        } else {
          setCleanJqueryCart()
          $('#product-cart-message').text('No existe stock suficiente')
          console.log('cantidad no aceptada')
        }
      } else {
        if (ValidateSetCartProduct(quantity, datos.datos_variaciones_cantidad) === false) {
          $('#product-cart-message').text('No existe stock suficiente')
          setCleanJqueryCart()
        } else {
          let items = {
            products: [],
            summary: {
              subTotal: 0,
              disccount: 0,
              quantity: 0,
              total: 0
            }
          }

          items.products.push(productValue)
          $('#product-cart-message').text('')
          setCookie(PRODUCTOS_COOKIE, items, 0)
          $('#staticBackdrop').modal()
        }
      }

      setJqueryCart()

      function setJqueryCart() {
        $('#nombre_producto').html(datos.datos_Catalogo_item_title)
        $('#product-title-modal').text(datos.datos_Catalogo_item_title)
        $('#product-quantity-modal').text(quantity)
        $('#product-sku-modal').text(datos.datos_variaciones_sku)
        $('#product-image-modal').attr('src', datos.datos_variaciones_url1_imagen_sku)
        $('#product-subtotal-modal').text(parseFloat(datos.datos_variaciones_subtotal).toFixed(2))

        for (var i = 1; i <= 3; i++) {
          var titulo = $("[id='product-variation-name'][name='" + i + "']").text()
          var valor = $("[id='product-variation-items'][name='" + i + "']  option:selected").val()
          if (titulo !== '' && valor !== '') {
            $(`[id='product-modal-variation-title-${i}]`).text(titulo + ' :')
            $(`[id='product-modal-variation-value-${i}]`).text(valor)
          }
        }
      }
      function setCleanJqueryCart() {
        $('#product-title-modal').text('')
        $('#product-quantity-modal').text('')
        $('#product-sku-modal').text('')
        $('#product-image-modal').attr('src', '')
        $('#product-subtotal-modal').text('')

        $("[id='product-modal-variation-title-1']").text('')
        $("[id='product-modal-variation-value-1']").text('')
        $("[id='product-modal-variation-title-2']").text('')
        $("[id='product-modal-variation-value-2']").text('')
        $("[id='product-modal-variation-title-3']").text('')
        $("[id='product-modal-variation-value-3']").text('')
      }
      carritoResumen()
    } else {
      console.log('No responde')
    }
  })

  $(document).on('change', '#product-variation-items', function () {
    let Variations = []

    EnableItemDropdown()

    $('.product-variation').each(function (index) {
      const CountVariation = $(this).attr('name')
      const title = $("[id='product-variation-name'][name='" + CountVariation + "']").text()
      const value = $("[id='product-variation-items'][name='" + CountVariation + "']").val()
      Variations.push({ title: title, value: value })
    })

    for (i = 0; i < resultServer.obj.datos_variaciones.length; i++) {
      const datos_variaciones = resultServer.obj.datos_variaciones[i]

      let VariationsTemp = []

      for (let i = 1; i <= 3; i++) {
        const datos_variaciones_atributo_titulo = datos_variaciones[`atributo${i}_titulo`]
        const datos_variaciones_atributo_valor = datos_variaciones[`atributo${i}_valor`]

        if (datos_variaciones_atributo_titulo !== '' && datos_variaciones_atributo_valor !== '') {
          VariationsTemp.push({
            title: datos_variaciones_atributo_titulo,
            value: datos_variaciones_atributo_valor
          })
        }
      }

      let Ckecked = false
      if (Variations.length === VariationsTemp.length) {
        for (a = 0; a < Variations.length; a++) {
          Ckecked = false
          for (b = 0; b < VariationsTemp.length; b++) {
            if (Variations[a].title === VariationsTemp[b].title && Variations[a].value === VariationsTemp[b].value) {
              Ckecked = true
            }
          }
          if (Ckecked === false) {
            break
          }
        }
      }

      if (Ckecked === true) {
        const { sku, url1_imagen_sku, price, sale_price } = datos_variaciones

        $("[id='product-add-cart'], [id='button-plus'], [id='button-minus'], [id='product_quantity'], [id='product_message']").attr('name', sku)

        const precio_pd = price.toFixed(2)
        const precio_oferta_pd = sale_price.toFixed(2)

        const precioHTML = `
        <div class=" h5 precio_oferta">${MODENA_PRINCIPAL} <del id="product-sale-price">${precio_pd}</del></div>
        <div class=" h5">Ahora ${MODENA_PRINCIPAL} <span id="product-price">${precio_oferta_pd}</span></div>`

        let imgsw = ''
        for (let i = 1; i <= 6; i++) {
          const imageUrl = datos_variaciones[`url${i}_imagen_sku`]
          if (imageUrl !== '') {
            imgsw += `<a class="item-thumb"><img src="${imageUrl}"></a>`
          }
        }

        $('#product-principal-image').attr('src', url1_imagen_sku)
        $('#precio_prod').html(
          precio_pd === precio_oferta_pd
            ? `<var class="price h5">${MODENA_PRINCIPAL} <span id="product-price">${parseFloat(price).toFixed(2)}</span></var>`
            : precioHTML + `<i class="label-oferta"> -${Math.round((1 - sale_price / price) * 100)}%</i>`
        )
        $('#product-thumbs-wrap').html(imgsw)

        break
      }
    }
  })

  var NumberActualQuantity = 0

  $(document).on('click', '#button-plus', function () {
    const sku = $(this).attr('name')
    const quantity = parseInt($('#product_quantity').val()) + 1

    const is_valid = calculateValidQuantityPlus(sku, quantity)
    if (is_valid === true) {
      $("[id='product_message'][name='" + sku + "']").text('')
      NumberActualQuantity = quantity
      asignateQuantityProductChange(sku, quantity)
    } else {
      $("[id='product_message'][name='" + sku + "']").text('No tenemos stock suficiente')
    }
  })
  $(document).on('click', '#button-minus', function () {
    const sku = $(this).attr('name')
    const quantity = parseInt($('#product_quantity').val()) - 1
    const is_valid = calculateValidQuantityMinus(sku, quantity)
    if (is_valid === true) {
      asignateQuantityProductChange(sku, quantity)
      NumberActualQuantity = quantity
      $("[id='product_message'][name='" + sku + "']").text('')
    } else {
      asignateQuantityProductChange(sku, 1)
    }
  })
  $(document).on('keyup', '#product_quantity', function () {
    const sku = $(this).attr('name')
    let quantity = $(this).val()
    if (quantity <= 0 || quantity === null || quantity === '') {
      quantity = 1
      $(this).val(quantity)
    } else {
      quantity = parseInt(quantity)
    }
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
    } else {
      quantity = parseInt(quantity)
    }
    const is_valid = calculateValidQuantityChange(sku, quantity)
    if (is_valid === false) {
      asignateQuantityProductChange(sku, NumberActualQuantity)
    }
  })
  function calculateValidQuantityPlus(sku, quantity) {
    let cart = resultServer.obj
    for (i = 0; i < cart.datos_variaciones.length; i++) {
      if (cart.datos_variaciones[i] != null && cart.datos_variaciones[i].sku == sku) {
        const datos_variaciones_cantidad = cart.datos_variaciones[i].cantidad

        if (datos_variaciones_cantidad >= quantity) {
          return true
        }
        return false
      }
    }
    return false
  }
  function calculateValidQuantityKeypress(sku, quantity) {
    let cart = resultServer.obj
    for (i = 0; i < cart.datos_variaciones.length; i++) {
      if (cart.datos_variaciones[i] != null && cart.datos_variaciones[i].sku == sku) {
        const datos_variaciones_cantidad = cart.datos_variaciones[i].cantidad
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
    let cart = resultServer.obj
    for (i = 0; i < cart.datos_variaciones.length; i++) {
      if (cart.datos_variaciones[i] != null && cart.datos_variaciones[i].sku == sku) {
        const datos_variaciones_cantidad = cart.datos_variaciones[i].cantidad
        if (datos_variaciones_cantidad < quantity) {
          return false
        } else {
          return true
        }
      }
    }
    return true
  }
  function EnableItemDropdown() {
    const value = $("[id='product-variation-items'][name='" + 1 + "']").val()
    let VariationsOneTemp = resultServer.obj.datos_variaciones
    let VariationsTwoTemp = VariationsOneTemp.filter((key) => key.atributo1_valor == value)

    $('.product-variation-item').each(function (index) {
      const count = $(this).attr('name')
      const textVariation = $(this).val()
      if (count == 2) {
        let VariationExist = VariationsTwoTemp.filter((key) => key.atributo2_valor == textVariation)
        if (VariationExist.length <= 0 || VariationExist[0].cantidad <= 0) {
          $(this).attr('disabled', 'disabled')
        } else {
          $(this).removeAttr('disabled')
        }
      }
    })
  }
})

const nombre_almacenamiento_local = `${DOMINIO}_ultimos_productos_vistos`
const url_producto = window.location.pathname
const producto_id = url_producto.split(',')[1]

const datos_producto = {
  producto: producto_id,
  fecha_visita: VERSION
}

let ultimos_productos_vistos = getCookie(nombre_almacenamiento_local) || []

const lista_eliminar = [producto_id]
ultimos_productos_vistos = ultimos_productos_vistos.filter((el) => !lista_eliminar.includes(el.producto))
ultimos_productos_vistos.push(datos_producto)
ultimos_productos_vistos.sort((a, b) => a.fecha_visita - b.fecha_visita)

if (ultimos_productos_vistos.length > 10) {
  ultimos_productos_vistos.splice(0, ultimos_productos_vistos.length - 10)
}

setCookie(nombre_almacenamiento_local, ultimos_productos_vistos)

$(document).on('click', '#product-thumbs-wrap .item-thumb img', function () {
  var url_img = $(this).attr('src')
  $('#product-principal-image').attr('src', url_img)
})
// 724
