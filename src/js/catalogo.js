const ESQUELETO_PRODUCTO = `
<div class="sm-col-30">
  <figure class="card card-product-grid">
    <div class="img-wrap">
      [[porcentaje]]
      [[tag_nuevo]]
      <a href="/[[url_producto]]" aria-label="Ver detalle del producto">
        <img src="[[imagen_principal]]" class="sm-responsive-img" alt="[[titulo_producto]]" width="166" height="176">
      </a>
      <a class="btn btn-block btn-primary btn_subt" name="[[sku]]" data-idprd="[[id_producto]]">VISTA PREVIA</a>
    </div>
    <figcaption class="info-wrap">
      <div class="fix-height">
        <a href="/[[url_producto]]" class="titles">[[titulo_producto]]</a>
        <div class="price-wrap mt-2 text-center">
          [[precios]]
        </div>
      </div>
    </figcaption>
  </figure>
</div>`
const Pages = window.location.pathname
const PageSplit = Pages.replace(' ', '-').toLowerCase().split('/')

const ordm = sessionStorage.getItem('ORD')
const defaultOrdnn = '&rlv=true'
const ordnn = ordm ? `&${ordm}` : defaultOrdnn
if (!ordm) {
  sessionStorage.setItem('ORD', defaultOrdnn.substring(1))
}

const store_dominio = PageSplit[1] //categoria /cuidado-personal o /f
const cat_categoria = PageSplit[2] //subcategoria /cuidado-personal/piel
const ulwd = window.location.search.substring(1) //busqueda   ? atrib=1&

//1.1 BUSCADOR
const LIMIT = 'limit=12'
const CATEGORY_PREFIX = 'categoria'
const SEARCH_PREFIX = 'busqueda'

const url = location.href

// Crear un objeto URL
const urlObj = new URL(url)

// Acceder a los parámetros de búsqueda
const searchParams = urlObj.searchParams

// Obtener los valores de los parámetros
const param1 = searchParams.get('f')

let params
if (param1) {
  params = `${SEARCH_PREFIX}/${param1}/?=${ulwd ? '&' + ulwd : ''}${LIMIT}${ordnn}`
} else {
  const categoryParams = `${ulwd ? ulwd + '&' : ''}${LIMIT}${ordnn}`
  params = cat_categoria
    ? `${CATEGORY_PREFIX}/${store_dominio}/${cat_categoria}?${categoryParams}`
    : `${CATEGORY_PREFIX}/${store_dominio}?${categoryParams}`
}

var settings = {
  url: `${API_CATALOGO}${params}`,
  method: 'GET',
  timeout: 0
}

// FILTROS
$(document).ready(function () {
  $.ajax(settings)
    .done(function (response) {
      let numero_items = response['obj'][0]['total_de_registros']
      let Productos = response['obj'][0]['datos_catalogos']

      Productos.forEach((producto) => {
        let tag_nuevo = producto.tag != undefined ? `<div class"tag_nuevo">${producto.tag}</div>` : ''
        let precios = ''
        let porcentaje = ''
        if (producto.precio_oferta_maxima == producto.precio_venta_maxima) {
          precios = `<span class="price">${MODENA_PRINCIPAL} ${producto.precio_venta_maxima}</span>`
        } else {
          let oferta = producto.precio_oferta_maxima * 100
          oferta = oferta / producto.precio_venta_maxima
          oferta = 100 - oferta
          precios = `<del class="price-old">${MODENA_PRINCIPAL} ${producto.precio_venta_maxima}</del><span class="price_offer">${MODENA_PRINCIPAL} ${producto.precio_oferta_maxima}</span>`
          porcentaje = `<span class="badge badge-danger">-${parseInt(oferta)}%</span>`
        }
        $('.conten-card').append(
          ESQUELETO_PRODUCTO.replaceAll('[[porcentaje]]', porcentaje)
            .replaceAll('[[tag_nuevo]]', tag_nuevo)
            .replaceAll('[[url_producto]]', producto.url_producto)
            .replaceAll('[[imagen_principal]]', producto.item_url)
            .replaceAll('[[sku]]', producto.sku_padre)
            .replaceAll('[[id_producto]]', producto.idProducto)
            .replaceAll('[[titulo_producto]]', producto.item_title)
            .replaceAll('[[precios]]', precios)
        )
      })
      $('.placeholder').remove()
      $('.conten-card').removeClass('d-none')
      //PAGINACIÓN DE PRODUCTOS
      const total_registros = Math.max(Math.ceil(numero_items / 12), 1)
      sessionStorage.setItem('registros_totales', numero_items)

      //MOSTRAR CANTIDAD TOTAL DE PRODUCTOS
      const reg_tot = sessionStorage.getItem('registros_totales')
      let num_pg = sessionStorage.getItem('numero_pagina')

      if (!num_pg || !ulwd) {
        num_pg = 1
        sessionStorage.setItem('enlace2', 'page=1')
        sessionStorage.setItem('numero_pagina', '1')
        const lgnt = $('#contenedor_catalogo > div').length
        $('#vista_productos').html(`<b>Mostrando 1 - ${lgnt} de ${numero_items} Productos</b>`)
      } else {
        const mb = 12 * num_pg - 11
        const cntx = 12 * num_pg
        $('#vista_productos').html(`<b>Mostrando ${mb} - ${cntx} de ${reg_tot} Productos</b>`)
      }

      $('#paginacion-cat').pagination({
        items: reg_tot,
        itemsOnPage: 12,
        displayedPages: 3,
        cssStyle: 'light-theme',
        currentPage: num_pg,
        hrefTextPrefix: '',
        ellipsePageSet: false,
        prevText: '«',
        nextText: '»',
        onPageClick: function (pageNumber, event) {
          event.preventDefault()

          var arraym = []
          var valueq = pageNumber
          arraym = $.grep(arraym, function (item) {
            return item.indexOf('page=') !== 0
          })

          //ORDEN
          var orden = sessionStorage.getItem('ORD')
          if (orden != null) {
            arraym.push(orden)
          }

          //PAGINA
          sessionStorage.setItem('enlace2', 'page=' + valueq)
          var parte2 = sessionStorage.getItem('enlace2')
          sessionStorage.setItem('numero_pagina', valueq)
          arraym.push(parte2)

          //agrega al array y lo separa con &
          var attrb = arraym.join('&')
          window.location.href = Pages + '?' + attrb
        }
      })
    })
    .fail(function (response) {
      let prueba = `<h4>No encontramos coincidencias <span>con tu búsqueda</span></h4>
      <div class="text-muted">0 resultados para "<b>${param1}</b>"
        <br>
              <div class="btn_opciones">
                <a href="/"> 
                  <button type="button" class=" btn btn-dark">
                    Volver a Inicio
                  </button>
                </a>
              </div>
      </div>`
      if (response.responseJSON.sRpta == 'no se encontro categoria') {
        prueba = `<div class="box-notfound"><p>El administrador de esta tienda no ha
        agregado ningún producto a su catálogo.</p></div>
        <br>
        `
      }

      $('.contenido_catalogo').remove()
      $('.section-pagetop').html(`
        <div class="container error_section">
          <div class="row">
            <div class="col-md-12 text-center bg-icon-emoji">
              ${prueba}
            </div>
          </div>
        </div>`)
      $('.section-pagetop').show()
      sessionStorage.setItem('enlace2', 'page=1')
      sessionStorage.setItem('numero_pagina', '1')
    })

  var ordm = sessionStorage.getItem('ORD')
  if (ordm != null) {
    if (ordm == 'new=true') {
      $('.list_ordenar').val('NEW')
    } else if (ordm == 'rlv=true') {
      $('.list_ordenar').val('REL')
    } else if (ordm == 'ofert_max=true') {
      $('.list_ordenar').val('MAX')
    } else if (ordm == 'ofert_min=true') {
      $('.list_ordenar').val('MIN')
    }
  }

  //ORDENAR
  $('.list_ordenar').change(function () {
    var val_ord = $(this).val()
    var arraym = []

    if (val_ord == 'NEW') {
      sessionStorage.setItem('ORD', 'new=true')
    } else if (val_ord == 'REL') {
      sessionStorage.setItem('ORD', 'rlv=true')
    } else if (val_ord == 'MAX') {
      sessionStorage.setItem('ORD', 'ofert_max=true')
    } else if (val_ord == 'MIN') {
      sessionStorage.setItem('ORD', 'ofert_min=true')
    }

    //ORDEN
    var orden = sessionStorage.getItem('ORD')
    if (orden != null) {
      arraym.push(orden)
    }

    //PAGINA
    sessionStorage.setItem('enlace2', 'page=1')
    var parte2 = sessionStorage.getItem('enlace2')
    sessionStorage.setItem('numero_pagina', '1')
    arraym.push(parte2)

    var attrb = arraym.join('&')
    window.location.href = Pages + '?' + attrb
  })

  //AGREGAR AL CARRITO
  $(document).on('click', '.btn_subt', function () {
    var idprd = $(this).attr('data-idprd')

    var stes = {
      url: `${API_SELFROM_MODAL}${DOMINIO}/idproducto/${idprd}`,
      method: 'GET',
      timeout: 0
    }

    jQuery.ajax(stes).done(function (response) {
      var cant_prd = response['obj']['datos_variaciones'][0].cantidad
      var title_prd = response['obj']['datos_Catalogo'][0].item_title
      var url_img = response['obj']['datos_Catalogo'][0].item_url
      var prc_prd = response['obj']['datos_variaciones'][0].price
      var ofr_prd = response['obj']['datos_variaciones'][0].sale_price
      var skr_pdr = response['obj']['datos_variaciones'][0].sku_padre

      //imagenes

      const urls = [
        response['obj']['datos_variaciones'][0].url1_imagen_sku,
        response['obj']['datos_variaciones'][0].url2_imagen_sku,
        response['obj']['datos_variaciones'][0].url3_imagen_sku,
        response['obj']['datos_variaciones'][0].url4_imagen_sku,
        response['obj']['datos_variaciones'][0].url5_imagen_sku,
        response['obj']['datos_variaciones'][0].url6_imagen_sku
      ]

      //Array de Variaciones
      const data_variaciones = response.obj.datos_variaciones
      const data_var = data_variaciones[0]

      const img_prdc = urls
        .map((url) => {
          if (url !== '') {
            ;`<img src="${url}" class="img_full">`
          }
        })
        .join('')

      $('.img_prdh_pe').html(img_prdc)

      let pricehd, priceText
      if (prc_prd == ofr_prd) {
        priceText = parseFloat(prc_prd).toFixed(2)
      } else {
        var prm = (100 - (ofr_prd / prc_prd) * 100).toFixed(0)
        priceText = `<span>${parseFloat(ofr_prd).toFixed(2)}</span><del>${MODENA_PRINCIPAL} ${parseFloat(prc_prd).toFixed(
          2
        )}</del><span class="badge badge-danger">-${prm}%</span>`
      }
      pricehd = `
        <div class="price-wrap mt-2 section_precio6">
          <span class="price">${MODENA_PRINCIPAL} ${priceText}</span> 
        </div>`

      let skr_hijo = data_var.sku
      skr_pdr = skr_hijo
      let sbm = ''
      if (data_variaciones.length === 1) {
        sbm = ''
      } else if (data_variaciones.length > 1) {
        const clickId = new Set()
        data_variaciones.forEach((value) => {
          clickId.add(value.atributo1_valor)
        })
        sbm = `
            <label>${data_var.atributo1_titulo}</label>
            <select class="form-control" id="prd_variacion6" data-id="${idprd}" name="1">
              ${Array.from(clickId).map((value) => `<option value="${value}">${value}</option>`)}
            </select>
          `
        if (data_var.atributo2_titulo) {
          const clickId2 = new Set()
          data_variaciones.forEach((value) => {
            if (value.atributo1_valor === data_var.atributo1_valor) {
              clickId2.add(value.atributo2_valor)
            }
          })
          sbm += `
              <label>${data_var.atributo2_titulo}</label>
              <select class="form-control" id="prd_variacion2" data-id="${idprd}" name="2">
                ${Array.from(clickId2).map((value) => `<option value="${value}">${value}</option>`)}
              </select>
            `
        }
        if (data_var.atributo3_titulo) {
          const clickId3 = new Set()
          data_variaciones.forEach((value) => {
            if (value.atributo1_valor === data_var.atributo1_valor && value.atributo2_valor === data_var.atributo2_valor) {
              clickId3.add(value.atributo3_valor)
            }
          })
          sbm += `
              <label>${data_var.atributo3_titulo}</label>
              <select class="form-control" id="prd_variacion3" data-id="${idprd}" name="3">
                ${Array.from(clickId3).map((value) => `<option value="${value}">${value}</option>`)}
              </select>
            `
        }
      }

      $('#detalleProducto1 .modal-header h5').html(title_prd)
      $('.contenido_prd .img_prdh').html(`<img src="${url_img}" class="img_full">`)
      $('.contenido_prd .data_prdh').html(
        `${pricehd}${sbm}
                <div class="price-wrap mt-2">
                  <label class="form-label d-block">Cantidad</label>
                  <div class="input-group input_style input-spinner mb-2">
                    <button class="btn btn-icon btn-light" type="button" id="button-minus6" name="${skr_pdr}" data-id="${idprd}">
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#999" viewBox="0 0 24 24">
                        <path d="M19 13H5v-2h14v2z"></path>
                      </svg>
                    </button>
                    <input class="form-control text-center" placeholder="" value="1" id="product_quantity" name="${skr_pdr}" data-id="${idprd}">
                    <button class="btn btn-icon btn-light" type="button" id="button-plus6" name="${skr_pdr}" data-id="${idprd}"> 
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#999" viewBox="0 0 24 24">
                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
                      </svg>
                    </button>
                  </div> <!-- input-group.// -->
                  <button type="button" class="btn_subtt6" id="product-add-cart6" name="${skr_pdr}" data-id="${idprd}">
                     Agregar al carrito 
                  </button>
                  <p id="product-cart-message" data-id="${idprd}" name="${skr_pdr}"></p>
                </div>
           `
      )

      $('#detalleProducto1').modal()
    })
  })

  function variaciones(valr1, valr2, valr3, idprd) {
    var stes = {
      url: `${API_SELFROM_MODAL}${DOMINIO}/idproducto/${idprd}`,
      method: 'GET',
      timeout: 0
    }

    jQuery.ajax(stes).done(function (response) {
      const data_var = response.obj.datos_variaciones
      let imgs = ''

      data_var.forEach((obm) => {
        const atrb_v1 = obm.atributo1_valor
        const atrb_v2 = obm.atributo2_valor
        const atrb_v3 = obm.atributo3_valor

        if (atrb_v1 === valr1 && atrb_v2 === valr2 && atrb_v3 === valr3) {
          const idprdSelector = `[data-id="${idprd}"]`
          const sku = obm.sku

          $('#product_quantity' + idprdSelector).attr('name', sku)
          $('#button-plus6' + idprdSelector).attr('name', sku)
          $('#button-minus6' + idprdSelector).attr('name', sku)
          $('#product-add-cart6' + idprdSelector).attr('name', sku)
          $('#product-cart-message' + idprdSelector).attr('name', sku)

          let pricehd
          if (obm.price === obm.sale_price) {
            pricehd = `<div><span class="price">${MODENA_PRINCIPAL} ${parseFloat(obm.price).toFixed(2)}</span></div>`
          } else {
            const prm = (obm.sale_price / obm.price) * 100 - 100
            pricehd = `<div><del class="price-old">${MODENA_PRINCIPAL} ${parseFloat(obm.price).toFixed(2)}</del></div>
          <div><span class="price">${MODENA_PRINCIPAL} ${parseFloat(obm.sale_price).toFixed(2)}</span></div>
          <span class="badge badge-danger">-${parseInt(prm)}%</span>`
          }

          const img_urls = [
            obm.url1_imagen_sku,
            obm.url2_imagen_sku,
            obm.url3_imagen_sku,
            obm.url4_imagen_sku,
            obm.url5_imagen_sku,
            obm.url6_imagen_sku
          ]

          img_urls.forEach((url) => {
            if (url !== '') {
              imgs += `<img src="${url}" class="img_full">`
            }
          })

          $('.section_precio6').html(pricehd)
          $('.img_prdh_pe').html(imgs)
          $('#detalleProducto1 .img_prdh img').attr('src', obm.url1_imagen_sku)

          return
        }
      })
    })
  }

  function varm(valr1, valr2, idprd) {
    var stes = {
      url: `${API_SELFROM_MODAL}${DOMINIO}/idproducto/${idprd}`,
      method: 'GET',
      timeout: 0
    }

    jQuery.ajax(stes).done(function (response) {
      const data_var = response.obj.datos_variaciones
      const clickId = []
      let sbm = ''

      data_var.forEach((value) => {
        if (clickId.indexOf(value.atributo2_valor) === -1 && value.atributo1_valor == valr1) {
          clickId.push(value.atributo2_valor)
        }
      })

      clickId.forEach((obm) => {
        sbm += `<option value="${obm}"${obm === valr2 ? ' selected' : ''}>${obm}</option>`
      })

      $(`#detalleProducto1 #prd_variacion2[data-id="${idprd}"]`).html(sbm)

      const valr21 = $(`#detalleProducto1 #prd_variacion2[data-id="${idprd}"]`).val() || ''
      const valr31 = $(`#detalleProducto1 #prd_variacion3[data-id="${idprd}"]`).val() || ''

      variaciones(valr1, valr21, valr31, idprd)
    })
  }

  function varm02(valr1, valr2, idprd) {
    var stes = {
      url: API_SELFROM_MODAL + DOMINIO + '/idproducto/' + idprd,
      method: 'GET',
      timeout: 0
    }

    jQuery.ajax(stes).done(function (response) {
      const data_var = response.obj.datos_variaciones
      const clickId = []
      const sbm = ''

      data_var.forEach((value) => {
        if (!clickId.includes(value.atributo3_valor) && value.atributo1_valor === valr1 && value.atributo2_valor === valr2) {
          clickId.push(value.atributo3_valor)
        }
      })

      const optionsHtml = clickId.map((obm) => `<option value="${obm}">${obm}</option>`).join('')

      $(`#prd_variacion3[data-id="${idprd}"]`).html(optionsHtml)

      let valr1 = $('#detalleProducto1 #prd_variacion6').val()
      let valr3 = $('#detalleProducto1 #prd_variacion3').val()

      if (!valr1) {
        valr1 = ''
      }

      if (!valr3) {
        valr3 = ''
      }

      variaciones(valr1, valr2, valr3, idprd)
    })
  }

  $(document).on('change', '#prd_variacion6', function () {
    var idprd = $(this).attr('data-id')
    var valr1 = $(this).val()
    var valr2 = $("#detalleProducto1 #prd_variacion2[data-id='" + idprd + "']").val()
    varm(valr1, valr2, idprd)
  })

  $(document).on('change', '#prd_variacion2', function () {
    var idprd = $(this).attr('data-id')
    var valr2 = $(this).val()
    var valr1 = $('#detalleProducto1 #prd_variacion6').val()
    varm02(valr1, valr2, idprd)
  })

  $(document).on('change', '#prd_variacion3', function () {
    const idprd = this.dataset.id
    const valr3 = this.value
    const valr1 = $(`#prd_variacion6[data-id='${idprd}']`).val() || ''
    const valr2 = $(`#prd_variacion2[data-id='${idprd}']`).val() || ''

    variaciones(valr1, valr2, valr3, idprd)
  })

  $(document).on('click', '#button-minus6', function () {
    const sku = $(this).attr('name')
    const quantity = parseInt($('#product_quantity').val()) - 1
    const is_valid = calculateValidQuantityMinus(sku, quantity)
    if (is_valid === true) {
      asignateQuantityProductChange(sku, quantity)
      $("[id='product-cart-message'][name='" + sku + "']").text('')
    } else {
      asignateQuantityProductChange(sku, 1)
    }
  })

  $(document).on('keyup', '#product_quantity', function () {
    const sku = $(this).attr('name')
    let quantity = $(this).val()
    var idprd = $(this).attr('data-id')

    if (quantity <= 0 || quantity === null || quantity === '') {
      quantity = 1
    } else {
      quantity = parseInt(quantity)
    }
    calculateValidQuantityKeypress(sku, quantity, idprd)
  })

  $(document).on('click', '#button-plus6', function () {
    const sku = $(this).attr('name')
    const quantity = parseInt($('#product_quantity').val()) + 1
    var idprd = $(this).attr('data-id')
    calculateValidQuantityPlus(sku, quantity, idprd)
  })

  $(document).on('click', '.btn_subtt6', async function () {
    const sku1 = $(this).attr('name')
    const quantity = parseInt($('#product_quantity').val())

    const data = [
      {
        dominio: DOMINIO,
        sku: sku1
      }
    ]

    const response = await fetch('https://api-inventario.samishop.pe/datosvariaciones/validate/price_stock', {
      method: 'POST',
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
        } else {
          $('#product-cart-message').text('No existe stock suficiente')
        }
      } else {
        if (ValidateSetCartProduct(quantity, datos.datos_variaciones_cantidad) === false) {
          $('#product-cart-message').text('No existe stock suficiente')
          $('#detalleProducto').modal()
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
          $('#detalleProducto').modal()
          setCookie(PRODUCTOS_COOKIE, items, 0)
        }
      }

      setJqueryCart()

      function setJqueryCart() {
        $('#detalleProducto #nombre_producto').text(datos.datos_Catalogo_item_title)
        $('#detalleProducto #product-title-modal').text(datos.datos_Catalogo_item_title)
        $('#detalleProducto #product-quantity-modal').text(quantity)

        for (var i = 1; i <= 3; i++) {
          var titulo = datos['datos_variaciones_atributo' + i + '_titulo']
          var valor = datos['datos_variaciones_atributo' + i + '_valor']
          if (titulo !== '' && valor !== '') {
            $('#detalleProducto #product-modal-variation-title-' + i).html('<b>' + titulo + '</b>:')
            $('#detalleProducto #product-modal-variation-value-' + i).html(' ' + valor)
          }
        }

        $('#detalleProducto #product-sku-modal').text(datos.datos_variaciones_sku)
        $('#detalleProducto #product-image-modal').attr('src', datos.datos_variaciones_url1_imagen_sku)
        $('#detalleProducto #product-subtotal-modal').text(parseFloat(datos.datos_variaciones_subtotal).toFixed(2))
      }

      carritoResumen()

      $('.close, [data-dismiss=modal]').click()
      $('#detalleProducto').modal()
    } else {
    }
  })

  $(document).on('click', '.img_prdh_pe img', function () {
    $('.img_prdh img').attr('src', $(this).attr('src'))
  })

  $('.img_prdh_pe img').hover(function () {
    $('.img_prdh img').attr('src', $(this).attr('src'))
  })
})
