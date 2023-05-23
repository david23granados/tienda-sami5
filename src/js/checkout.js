verProductos()

$(document).on('change', '#tipo_doc_quien_recoje', function () {
  var tipodoc = $(this).val()

  if (tipodoc == 'DNI') {
    $('#documento_quien_recoje').attr('maxlength', 8)
  } else if (tipodoc == 'CE') {
    $('#documento_quien_recoje').attr('maxlength', 12)
  }
})

$(document).on('change', '#list_tipo_doc', function () {
  var tipodoc = $(this).val()

  if (tipodoc == 'DNI') {
    $('#tipo_doc').attr('maxlength', 8)
  } else if (tipodoc == 'CE') {
    $('#tipo_doc').attr('maxlength', 12)
  }
})

function onlyNumber() {
  $('input[type="number"]').bind('keyup paste', function () {
    this.value = this.value.replace(/[^0-9]/g, '')
  })
}

var step_checkout = $.cookie('step_checkout')
var num_orden = $.cookie('num_orden')
var tokenPago = $.cookie('tokenPago')

//1 RESET COSTO ENVIO
$.cookie('CostoEnvio', '0', { expires: 7, path: '/' })

if (step_checkout == 2) {
  getOrderSession(num_orden)
}

function getOrderSession(num_orden) {
  var settings = {
    url: 'https://api-ordenes.samishop.pe/orders/' + DOMINIO + '/' + num_orden,
    method: 'GET',
    timeout: 0
  }

  $.ajax(settings).done(function (response) {
    $('.metodosPago').attr('style', 'display:block !important;')
    $('.zonasEnvio2').addClass('hidden')
    queryOrdenDetalle(response)
  })
}

var productosCarritos = getCookie(PRODUCTOS_COOKIE)

console.log(productosCarritos)

var Subtotal = productosCarritos['summary']['subTotal']
var disccount = productosCarritos['summary']['disccount']
var quantity = productosCarritos['summary']['quantity']
var total = productosCarritos['summary']['total']

if (quantity == 1) {
  $('h6 #cant_prd').html('(' + quantity + ' producto)')
} else if (quantity > 1) {
  $('h6 #cant_prd').html('(' + quantity + ' productos)')
}

//2 EDITAR RESUMEN
_htmlListPagos = `
<dl class="dlist-align">
          <dt>Subtotal: </dt>
          <dd>S/ <span id="total_price">${parseFloat(Subtotal).toFixed(2)}</span></dd>
        </dl>
<dl class="dlist-align dsct">
          <dt>Descuento: </dt>
          <dd>- S/ <span id="total_discount">${disccount.toFixed(2)}</span></dd>
        </dl>

<dl class="dlist-align">
          <dt >Costo de envío: </dt>
          <dd class="valorEnvio">S/ ${parseFloat(0.0).toFixed(2)}</dd>
        </dl>


<dl class="dlist-align">
          <dt >PRECIO TOTAL: </dt>
          <dd class="totalCarrito">S/ <span id="total_total">${parseFloat(total).toFixed(2)}</span></dd>
        </dl>
        `

$('.listaPagos').append(_htmlListPagos)

$.each(productosCarritos['products'], function (x, valores) {
  _htmlList = `


<figure class="itemside mb-2">
        <div class="aside sm-col-20"><img src="${valores.url1_imagen_sku}" class="border img-xs"></div>
        <figcaption class="info sm-col-40">
          <p><strong>Producto:</strong> ${valores.item_title}</p>
          <p style="display: none">[[variaciones]]</p>
          <p><strong>Cantidad de ítems:</strong> ${valores.quantity}</p>
          <p><strong>Precio total:</strong>${MODENA_PRINCIPAL} ${parseFloat(
    parseFloat(valores.sale_price).toFixed(2) * parseFloat(valores.quantity).toFixed(2)
  ).toFixed(2)}</p>
        </figcaption>
      </figure>
 `

  $('.listaCarrito').append(_htmlList)
})

$.ajax({
  type: 'GET',
  url: DOMINIO_CLOUD + '/json/formulario.json?v=' + VERSION,
  dataType: 'json',
  success: function (data) {
    GetDepartamentos()

    const dE = data.direccion_envios
    const formulario = $('#formulario')
    const tipoDoc = `
      <option value="">Seleccionar</option>
      <option value="DNI">DNI</option>
      <option value="CE">Carnet de Extranjeria</option>
      `

    $.each(dE, function (key, value) {
      var maxCaracteres = value.max || 1000
      var obligatorio = value.requerido ? 'true' : 'false'
      var obligatorioTXT = value.requerido ? '*' : ''

      let input
      if (value.type == 'select' && value.name !== 'pais') {
        input = `
        <div class="form-group ${value.name} field">
          <label class="label-${value.name}">
            <span>${value.nombre_field} ${obligatorioTXT}</span>
            <select class="form-control" name="${value.name}" id="${value.id}" type="${value.type}" 
              data-msg="Campo <b>${value.name}</b> obligatorio *"
              data-rule-required="${obligatorio}">
            </select>
          </label>
        </div>
        `
      } else if (value.type == 'email') {
        input = `
          <div class="${value.name} form-group field">
            <label class="label-${value.name}">
              <span>${value.nombre_field} ${obligatorioTXT}</span>
              <input class="form-control" name="${value.name}" id="${value.id}" type="${value.type}"
                   data-rule-required="${obligatorio}"
                   data-validation="email"
                   data-msg="Campo <b>${value.name}</b> obligatorio *"
                   data-msg-email="${value.msg_reglas}"
                 />
            </label> 
          </div>`
      } else {
        input = `
        <div class="form-group ${value.name} field">
          <label class="label-${value.name}">
            <span>${value.nombre_field} ${obligatorioTXT}</span>
            <input class="form-control" name="${value.name}" id="${value.id}" type="${value.type}"
              maxlength="${maxCaracteres}"
              oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength); ${
                value.name == 'referencia'
                  ? 'text(this, 3)'
                  : value.name == 'direccion'
                  ? 'text(this, 3)'
                  : value.name == 'nombre'
                  ? 'text(this, 1)'
                  : value.name == 'apellido'
                  ? 'text(this, 1)'
                  : ''
              }"
              data-rule-minlength="${value.min}"
              data-rule-maxlength="${value.max}"
              data-msg="Campo <b>${value.name}</b> obligatorio *"
              data-msg-minlength="${value.msg_reglas}"
              data-msg-maxlength="${value.msg_reglas}"
              data-rule-required="${obligatorio}">
          </label>
        </div>
        `
      }

      formulario.append(input)
      onlyNumber()
    })

    $('#list_tipo_doc, #tipo_doc_quien_recoje').append(tipoDoc)
    $('#departamento, #provincia, #distrito').select2({ width: '100%' })
  }
})

function GetDepartamentos() {
  $.ajax({
    type: 'GET',
    url: 'https://api-shipping.samishop.pe/zonasenvio/' + DOMINIO + '/',
    dataType: 'json',
    success: function (infoData) {
      const departamentoSelect = $('#departamento')
      departamentoSelect.append(`<option value="">Seleccionar departamento...</option>`)

      $.each(infoData.resultado[0].departamentos, function (index, departamento) {
        departamentoSelect.append(`<option value="${departamento.departamento}">${departamento.departamento}</option>`)
      })
    }
  })
}

function provincias(idDepartamentos) {
  $.ajax({
    type: 'GET',
    url: 'https://api-shipping.samishop.pe/zonasenvio/' + DOMINIO + '/' + idDepartamentos,
    dataType: 'json',
    success: function (Data_provincias) {
      // Clear existing options and add default option
      $('#provincia').html('<option value="">Seleccionar provincia...</option>')

      // Find the selected department in the provinces data and add the corresponding provinces
      var selectedDep = Data_provincias.resultado[0].departamentos.find((dep) => dep.departamento === idDepartamentos)
      if (selectedDep) {
        selectedDep.provincias.forEach((prov) => {
          var _htmlLI = `<option value="${prov.provincia}" data-depa="${idDepartamentos}">${prov.provincia}</option>`
          $('#provincia').append(_htmlLI)
        })
      }
    }
  })
}

function distritos(idProvincias, idDepa) {
  $.ajax({
    type: 'GET',
    url: 'https://api-shipping.samishop.pe/zonasenvio/' + DOMINIO + '/' + idDepa,
    dataType: 'json',
    success: function (infoData) {
      const departamentos = infoData.resultado[0].departamentos
      const departamento = departamentos.find((obj) => obj.departamento === idDepa)

      if (departamento) {
        const provincias = departamento.provincias
        const provincia = provincias.find((obj) => obj.provincia === idProvincias)

        if (provincia) {
          const distritos = provincia.distritos
          $('#distrito').html(`<option value="">Seleccionar distrito...</option>`)
          for (const obj of distritos) {
            const { distrito: nombre_distrito, ubigeo: num_ubigeo } = obj
            const option = `<option value="${nombre_distrito}" data-depa="${idDepa}" data-prov="${idProvincias}" data-ubigeo="${num_ubigeo}">${nombre_distrito}</option>`
            $('#distrito').append(option)
          }
        }
      }
    }
  })
}

function zonasEvios(idZonas, idDepa, idProv) {
  $('.zonasEnvio').html()
  $.ajax({
    type: 'GET',
    url: 'https://api-shipping.samishop.pe/zonasenvio/' + DOMINIO + '/' + idDepa,
    dataType: 'json',
    success: function (infoData) {
      const departamentos = infoData.resultado[0].departamentos
      const departamento = departamentos.find((d) => d.departamento === idDepa)

      if (departamento) {
        const provinciasLista = departamento.provincias
        const provincia = provinciasLista.find((p) => p.provincia === idProv)

        if (provincia) {
          const distritos = provincia.distritos
          const distrito = distritos.find((d) => d.distrito === idZonas)

          if (distrito) {
            const zonasEnvio = distrito.zonas_envio
            const htmlZonas2 = zonasEnvio
              .map(
                (z) => `
                  <div class="form-group col-sm-4">
                    <label class="js-check box">
                      <input type="radio" name="zonasenvio" value="${z.zona}">
                      <h6 class="title">${z.titulo}</h6>
                      <p class="text-muted">${z.msg_txt}</p>
                    </label>
                  </div>
                `
              )
              .join('')

            $('.zonasEnvio2').html(htmlZonas2)
            $('.zonasEnvio2 input').click()
          }
        }
      }
    }
  })
}

//3 CAMBIAR LINEA
function getZonasEnvioApi(zonaID, total, quantity) {
  var _urlSolicitaCenvioApi = 'https://api-shipping.samishop.pe/costoenvio/costoenvio'
  var productosCarritos = getCookie(PRODUCTOS_COOKIE)
  var peso = productosCarritos['products']

  var ps = 0

  for (var i = 0; i < peso.length; i++) {
    var obj = peso[i]
    var psm = obj['peso']
    var cntt = parseInt(obj['quantity'])
    var pst = psm * cntt
    ps += pst
  }

  console.log(ps)

  var settings = {
    url: _urlSolicitaCenvioApi,
    method: 'POST',
    timeout: 0,
    headers: {
      'Content-Type': 'application/json'
    },
    data: JSON.stringify([
      {
        dominio: DOMINIO,
        peso_total: ps,
        cantidad: quantity,
        valor_venta: total,
        zona: zonaID
      }
    ])
  }

  $.ajax(settings).done(function (response) {
    console.log(response)
    var CostoEnvio
    if (window.envio) {
      CostoEnvio = '0.00'
    } else {
      CostoEnvio = response['obj'][0]['costo_final_envio']
    }
    var total = $('#total_total').text()

    var TotalFinal1 = parseFloat(total) + parseFloat(CostoEnvio)

    $.cookie('CostoEnvio', CostoEnvio, { expires: 7, path: '/' })
    $.cookie('ZonaEnvio', zonaID, { expires: 7, path: '/' })
    //
    $('.totalCarrito').html('S/ <span id="total_total">' + parseFloat(TotalFinal1).toFixed(2) + '</span>')
    $('.listaPagos .valorEnvio').html('S/. ' + parseFloat(CostoEnvio).toFixed(2))
  })
}

//4 AGREGAR VALOR DE CUPÓN Y VALORES EN ORDENES
function guardarOrden(num) {
  $('.loadin').attr('style', 'display:flex !important')
  var productosCarritos = getCookie(PRODUCTOS_COOKIE)
  var ListaProductos = productosCarritos.products
  var quantity = productosCarritos['summary']['quantity']
  var items = []
  $.each(ListaProductos, function (x, items_vals) {
    var item = {}
    item.sku = items_vals.sku
    item.quantity_sku = items_vals.quantity
    items.push(item)
  })
  if (num == 1) {
    let tienda = tiendas.find((el) => el.id_tienda == $("input[name='recogo']:checked").attr('id').split('_')[1])

    localStorage.setItem(
      'orden',
      JSON.stringify({
        ...tienda,
        dominio: DOMINIO,
        quantity: quantity,
        subtotal: $('#total_price').text(),
        disccount: $('#total_discount').text(),
        total: $('#total_total').text(),
        impuesto: 0,
        gran_total: $('#total_total').text(),
        detalle_pedido: items,
        cupon: $('#inpidkcuppon').val(),
        observaciones: $('#observaciones').val()
      })
    )
  } else {
    var departamento = $('#select2-departamento-container').text()
    var provincia = $('#select2-provincia-container').text()
    var distrito = $('#select2-distrito-container').text()

    var telefono = $('#telefono').val()
    var correo = $('#correo').val()
    var zonadEnvio = $.cookie('ZonaEnvio')

    //4.1
    var tot_pr = parseFloat($('#total_price').text())
    var tot_disc = parseFloat($('#total_discount').text())
    var total_dsc = tot_pr - tot_disc

    localStorage.setItem(
      'orden',
      JSON.stringify({
        dominio: DOMINIO,
        email_pedido: `${correo}`,
        id_cliente: $('#documento').val(),
        nombres_facturacion: `${$('#nombre').val()} ${$('#apellido').val()}`,
        telefono_facturacion: `${telefono}`,
        email_facturacion: `${correo}`,
        costo_envio: zonadEnvio,
        detalle_pedido: items,
        quantity: quantity,
        subtotal: $('#total_price').text(),
        disccount: $('#total_discount').text(),
        total: total_dsc,
        impuesto: 0,
        gran_total: $('#total_total').text(),
        nombres_envio: $('#nombre').val(),
        apellidos_envio: $('#apellido').val(),
        direccion_envio: $('#direccion').val(),
        referencia_envio: $('#referencia').val(),
        telefono_envio: `${telefono}`,
        departamento: `${departamento}`,
        provincia: `${provincia}`,
        distrito: `${distrito}`,
        ubigeo: $('#distrito option:selected').attr('data-ubigeo'),
        dni_envio: $('#documento').val(),
        cupon: $('#inpidkcuppon').val(),
        observaciones: $('#observaciones').val(),
        tipo_envio: ''
      })
    )
  }

  productosCarritos.summary.total = Number($('#total_total').text())
  setCookie(PRODUCTOS_COOKIE, productosCarritos)
  $('.loadin').attr('style', 'display:none !important')
  location.href = '/process/pago'
}

function getOrdenPedido(num_orden, correo) {
  $('#num_orden').val(num_orden)

  var settings = {
    url: 'https://api-ordenes.samishop.pe/orders/' + DOMINIO + '/' + num_orden + '/' + correo,
    method: 'GET',
    timeout: 0
  }

  $.ajax(settings).done(function (response) {
    var datosemal = response['obj'][0]['datos_pedido']['datos_pedido'][0]['datos_facturacion'][0].email_facturacion

    var hst = document.getElementById('urlDomainDefault').getAttribute('content')
    sessionStorage.setItem('email_' + hst, datosemal)
    sessionStorage.setItem('order_' + hst, num_orden)

    queryOrdenDetalle(response)
  })
}

function queryOrdenDetalle(response) {
  var datos_envio = response['obj'][0]['datos_pedido']['datos_pedido'][0]['datos_envio']
  var datos_factura = response['obj'][0]['datos_pedido']['datos_pedido'][0]['datos_facturacion']

  let valores = [
    { id: 12, text: 'Carnet de Extrangeria' },
    { id: 8, text: 'DNI' },
    { id: 11, text: 'RUC' }
  ]

  $('.direccion-envio .valtext').text(datos_envio[0].direccion_envio).attr('disabled', 'disabled')
  $('.referencia-envio .valtext').text(datos_envio[0].referencia_envio).attr('disabled', 'disabled')
  $('.departamento-envio .valtext').text(datos_envio[0].departamento).attr('disabled', 'disabled')
  $('.provincia-envio .valtext').text(datos_envio[0].provincia).attr('disabled', 'disabled')
  $('.distrito-envio .valtext').text(datos_envio[0].distrito).attr('disabled', 'disabled')
  $('.nombres-recoge-envio .valtext').text(datos_envio[0].nombres_envio).attr('disabled', 'disabled')
  $('.documento-recoge-envio .valtext')
    .text(valores.find((el) => el.id === datos_envio[0].dni_envio.length).text)
    .attr('disabled', 'disabled')
  $('.numdocumento-recoge-envio .valtext').text(datos_envio[0].dni_envio).attr('disabled', 'disabled')

  $('.nombres_completos-fact strong')
    .text(datos_factura[0].tipo_de_doc === 'boleta' ? 'Nombres y Apellidos: ' : 'Razón Social: ')
    .attr('disabled', 'disabled')
  $('.nombres_completos-fact .valtext').text(datos_factura[0].nombres_facturacion).attr('disabled', 'disabled')
  $('.tipo_comp-fact').remove()
  $('.nombres_completos-fact').after(`<div class="tipo_comp-fact"><strong> Tipo Comprobante: </strong> <span
class="valtext">${datos_factura[0].tipo_de_doc}</span></div>`)
  $('.apellidos_completos .valtext').text(datos_factura[0].referencia_envio).attr('disabled', 'disabled')
  $('.tipo_doc-fact .valtext')
    .text(valores.find((el) => el.id === datos_factura[0].id_cliente.length).text)
    .attr('disabled', 'disabled')
  $('.num_documento-fact .valtext').text(datos_factura[0].id_cliente).attr('disabled', 'disabled')
  $('.telefono-fact .valtext').text(datos_factura[0].telefono_facturacion).attr('disabled', 'disabled')
  $('.correo-fact .valtext').text(datos_factura[0].email_facturacion).attr('disabled', 'disabled')

  $('.contAceptTerminos').hide()
}

function editarPedido() {
  var num_orden = $.cookie('num_orden')

  var settings = {
    url: 'https://api-ordenes.samishop.pe/orders/' + DOMINIO + '/' + num_orden,
    method: 'GET',
    timeout: 0
  }

  $.ajax(settings).done(function (response) {
    var datos_envio = response['obj'][0]['datos_pedido']['datos_pedido'][0]['datos_envio']
    var datos_factura = response['obj'][0]['datos_pedido']['datos_pedido'][0]['datos_facturacion']

    if (datos_factura[0].tipo_de_doc == 'boleta') {
      $('#doc_boleta').attr('checked', 'checked')
    }
    $('#direccion').val(datos_envio[0].direccion_envio)
    $('#referencia').val(datos_envio[0].referencia_envio)
    $("#tipo_doc_quien_recoje option[value='DNI']").prop('selected', true)
    $('#nom_ape_quien_recoje').val(datos_envio[0].nombres_envio)
    $('#documento_quien_recoje').val(datos_envio[0].dni_envio)

    $('#nombres_completos_fact').val(datos_factura[0].nombres_facturacion)
    $('#apellidos_completos_fact').val(datos_envio[0].id_cliente)
    $("#list_tipo_doc option[value='DNI']").prop('selected', true)
    $('#tipo_doc').val(datos_factura[0].dni_envio)
    $('#telefono').val(datos_factura[0].telefono_facturacion)
    $('#correo').val(datos_factura[0].email_facturacion)
  })
}

//5 AGREGAR CODIGO
$(document).on('change', '#departamento', function () {
  $('#provincia').html('')
  var idDepartamentos = $(this).val()
  provincias(idDepartamentos)
  $('.zonasEnvio2').html('')
})

$(document).on('change', '#provincia', function () {
  $('#distrito').html('')
  var idProvincias = $(this).val()
  var idDepa = $('#provincia option:selected').attr('data-depa')

  distritos(idProvincias, idDepa)

  $('.zonasEnvio2').html('')
})

$(document).on('change', '#distrito', function () {
  $('.zonasEnvio2').html('')
  if (document.querySelector('.zonasEnvio')) {
  } else {
    $('#distrito').parent().append(`<div class="zonasEnvio"> </div> <div class="mensajeZona"> </div> `)
  }

  let costo = parseFloat($('.valorEnvio').text().split(' ')[1])
  $.cookie('CostoEnvio', '0', { expires: 7, path: '/' })
  $.removeCookie('ZonaEnvio', { path: '/' })

  let precio = $('#total_total').text()
  var TotalFinal1 = parseFloat(precio) - parseFloat(costo)
  $('.totalCarrito').html("S/. <span id='total_total'>" + parseFloat(TotalFinal1).toFixed(2) + '</span>')
  $('.listaPagos .valorEnvio').html('S/. 0.00')

  var idDepa = $('#distrito option:selected').attr('data-depa')
  var idProv = $('#distrito option:selected').attr('data-prov')

  var idZonas = $(this).val()
  zonasEvios(idZonas, idDepa, idProv)
})

$(document).on('click', '.zonasEnvio input', function () {
  var nameZona = $(this).attr('data-msg')
  $('#costoEnvioData .costomensaje').html(nameZona)
  $('.mensajeZona').html(nameZona)
})

$(document).on('click', '.zonasEnvio2 input', function () {
  $('.zonasEnvio2 label').removeClass('active')
  $(this).parent().addClass('active')
  var zonaID = $(this).val()
  var productosCarritos = getCookie(PRODUCTOS_COOKIE)

  var total = productosCarritos['summary']['total']
  var quantity = productosCarritos['summary']['quantity']

  getZonasEnvioApi(zonaID, total, quantity)
})

document.addEventListener('DOMContentLoaded', async () => {
  await aplicacion.modulo_checkout({ hola: '' })
  document.querySelectorAll('input[name=opciones]').forEach((element) => {
    element.addEventListener('change', function () {
      document.querySelectorAll('input[name=opciones]').forEach((elemen) => {
        elemen.parentElement.parentElement.classList.remove('activo')
      })
      this.parentElement.parentElement.classList.add('activo')
    })
  })
  $('#smart-form').validate({
    errorClass: 'state-error',
    validClass: 'state-success',
    errorElement: 'em',
    highlight: function (element, errorClass, validClass) {
      $(element).closest('.field').addClass(errorClass).removeClass(validClass)
    },
    unhighlight: function (element, errorClass, validClass) {
      $(element).closest('.field').removeClass(errorClass).addClass(validClass)
    },
    errorPlacement: function (error, element) {
      if (element.is(':radio') || element.is(':checkbox')) {
        element.closest('.option-group').after(error)
      } else {
        error.insertAfter(element.parent())
      }
    }
  })

  function sendForm() {
    jQuery.validator.setDefaults({
      debug: false,
      success: 'valid'
    })

    var validandoForm = $('#smart-form')

    if (validandoForm.valid() == true) {
      $('.metodosPago').attr('style', 'display:block !important;')
      $('.zonasEnvio2').addClass('hidden')
      $('.cupon_group').hide()
      $('.terms_condc').hide()
      $('.fecha_prog').hide()
      $('.recojo_tienda').hide()
      $('#recojo_en_tienda_data').hide()

      //guardar direccion nueva
      var dir_exs = $('#direcc_existente').val()
      var nom_dir = $('#nombre_dir').val()
      if (dir_exs == 'nuevo_dir') {
        sessionStorage.setItem('nuevo_dir', nom_dir)
      }
      guardarOrden(2)
    }
  }

  $('body').on('click', '#continuarPago', function (e) {
    e.preventDefault()
    let continuar = $('#opciones-recogo article.activo').attr('class')?.replace('activo', '').trim()
    if (continuar) {
      if (continuar == 'envio-domicilio') {
        sendForm()
      } else if (continuar == 'recoger-tienda') {
        guardarOrden(1)
      }
    } else {
      alert('Debe de seleccionar una opcion para recibir el producto')
    }
  })

  onlyNumber()
  var tkn = $.cookie('account_login')
  if (tkn != null) {
    tkn = tkn.replace(/\"/g, '')

    var opciones = {
      url: 'https://api-clients.samishop.pe/myaccount/informacion_personal',
      method: 'GET',
      timeout: 0,
      headers: { Authorization: 'Bearer ' + tkn }
    }

    $.ajax(opciones).done(function (response) {
      var obj = response['resultado'][0]

      //COLOCAR INFO EN FORM DE PERFIL
      $('#nom_ape_quien_recoje').val(obj.nombres + ' ' + obj.apellidos)
      $('#tipo_doc_quien_recoje, #list_tipo_doc').val(obj.tipo_documento)
      $('#documento_quien_recoje, #tipo_doc').val(obj.num_documento)

      $('#nombres_completos_fact').val(obj.nombres + ' ' + obj.apellidos)
      $('#telefono').val(obj.celular_contacto)
      $('#correo').val(obj.correo_electronico)
    })

    var setb = {
      url: 'https://api-clients.samishop.pe/myaccount/direcciones',
      method: 'GET',
      timeout: 0,
      headers: {
        Authorization: 'Bearer ' + tkn
      }
    }

    $.ajax(setb).done(function (response) {
      console.log(response)
      var direcciones = response['resultado']['direcciones']

      var sel =
        '<div class="form-group sel_dir"><label>Seleccione una dirección: *</label><select class="form-control" id="direcc_existente"><option value="">Seleccione una dirección</option>'
      for (var n = 0; n < direcciones.length; n++) {
        var obj = direcciones[n][0]
        sel +=
          `<option value="` +
          obj['direccion'] +
          `" data-ref="` +
          obj['referencia'] +
          `" data-iddir="` +
          obj['id'] +
          `">` +
          obj['direccion'] +
          `</option>`
      }
      sel += '<option value="nuevo_dir">Agregar una nueva dirección</option>'

      sel += '</select></div>'

      sel += `<div class="form-group nombre_dir field">
      <label>Guardar esta dirección como:</label>
      <input type="text" class="form-control" id="nombre_dir">
      <span class="text-muted"><i>Ejemplo: Mi casa, Mi oficina...</i></span>
      </div>`

      $('#formulario').append(sel)

      $('#direcc_existente').select2({
        placeholder: 'Seleccione una dirección'
      })

      $('#direcc_existente').on('select2:select', function (e) {
        var data = e.params.data
        if (data.id != 'nuevo_dir') {
          $('#direccion').val(data.text)
          $('.direccion.field').hide()
          $('.nombre_dir.field').hide()
        } else if (data.id == 'nuevo_dir') {
          $('#direccion').val('')
          $('#referencia').val('')
          $('.direccion.field').show()
          $('.nombre_dir.field').show()
        }
      })

      $('.direccion.field').hide()
    })
  }

  function getDataDireccion(id) {
    var setb = {
      url: 'https://api-clients.samishop.pe/myaccount/direcciones',
      method: 'GET',
      timeout: 0,
      headers: {
        Authorization: 'Bearer ' + tkn
      }
    }

    //console.log(id);

    $.ajax(setb).done(function (response) {
      var direcciones = response['resultado']['direcciones']

      for (var n = 0; n < direcciones.length; n++) {
        var obj = direcciones[n][0]
        var id_dir = obj['id']

        if (id == id_dir) {
          var dept_d = obj['departamento']
          var prov_d = obj['provincia']
          var distr_d = obj['distrito']
          var ref_d = obj['referencia']
          $('#departamento').val(dept_d).trigger('change')
          $('#referencia').val(ref_d)
          getDataProvincia(prov_d, dept_d, distr_d, id)
        }
      }
    })
  }

  function getDataProvincia(prov_d, dept_d, distr_d, id) {
    setTimeout(function () {
      $('#provincia').val(prov_d).trigger('change')
      getDataDistrito(prov_d, dept_d, distr_d, id)
    }, 1000)
  }

  function getDataDistrito(prov_d, dept_d, distr_d, id) {
    setTimeout(function () {
      $('#distrito').val(distr_d).trigger('change')
    }, 1500)
  }

  //dirección existente
  $(document).on('change', '#direcc_existente', function () {
    var option = $(this).val()

    if (option != 'nuevo_dir') {
      var id = $(this).find('option:selected').attr('data-iddir')
      $('.direccion.field').hide()
      getDataDireccion(id)
    } else if (option == 'nuevo_dir') {
      $('.direccion.field').show()
      $('#direccion').val('')
      $('#departamento').val('').trigger('change')
      $('#distrito').empty().trigger('change')
      $('.zonasEnvio2').html('')
      $('#referencia').val('')
    }
  })

  ///6 CODIGO CUPÓN

  $('#btnidkcuppon').click(function () {
    var cupon = $('#inpidkcuppon').val()
    var prds = []
    var productosCarritos = getCookie(PRODUCTOS_COOKIE)
    var ListaProductos = productosCarritos.products

    $.each(ListaProductos, function (x, items_vals) {
      var item = {}
      item.dominio = DOMINIO
      item.sku = items_vals.sku
      item.coupon = cupon
      item.cantidad = items_vals.quantity
      prds.push(item)
    })

    if (cupon != '') {
      var settings = {
        url: 'https://api-inventario.samishop.pe/datosvariaciones/validate/checkout',
        method: 'POST',
        timeout: 0,
        headers: {
          'Content-Type': 'application/json'
        },
        data: JSON.stringify(prds)
      }

      $.ajax(settings).done(function (response) {
        if (response['sRpta'].cupon != undefined) {
          $('#msg_cupon').html("<span style='color: green;'>La promocion existe</span>")
        } else {
          $('#msg_cupon').html("<span style='color: red;'>La promocion no existe</span>")
          $('#inpidkcuppon').val('')
        }
        //Detecta Envio Gratis C1.1
        var CostoEnvio = ''
        if (response['sRpta'].free_shipping === true) {
          CostoEnvio = '0.00'
          window.envio = true
          $('.valorEnvio').html('S/. 0.00')
        } else {
          window.envio = false
          CostoEnvio = parseFloat($('.valorEnvio').text().split(' ')[1])
          $('.valorEnvio').html(`S/. ${parseFloat(CostoEnvio).toFixed(2)}`)
        }
        //Fin Detecta Envio Gratis
        var descnt = response['sRpta'].disccount
        var subtotal = response['sRpta'].subTotal
        var total = response['sRpta'].total
        total = parseFloat(total) + parseFloat(CostoEnvio)

        $('#total_discount').html(parseFloat(descnt).toFixed(2))
        $('#total_price').html(parseFloat(subtotal).toFixed(2))
        $('.totalCarrito').html("S/ <span id='total_total'>" + parseFloat(total).toFixed(2) + '</span>')
      })
    } else if (cupon == '') {
      window.envio = false
      var total = productosCarritos['summary']['total']
      var disccount = productosCarritos['summary']['disccount']
      var CostoEnvio = parseFloat($('.valorEnvio').text().split(' ')[1])
      total = parseFloat(total) + parseFloat(CostoEnvio)

      $('#total_discount').html(parseFloat(disccount).toFixed(2))
      $('.totalCarrito').html('S/ <span id="total_total">' + parseFloat(total).toFixed(2) + '</span>')
      $('#msg_cupon').html(``)
    }
  })

  $('#inpidkcuppon').keyup(function () {
    var cupon = $(this).val()
    var productosCarritos = getCookie(PRODUCTOS_COOKIE)

    if (cupon == '') {
      window.envio = false
      var total = productosCarritos['summary']['total']
      var disccount = productosCarritos['summary']['disccount']
      var CostoEnvio = $('#distrito').val() == null ? parseFloat($('.valorEnvio').text().split(' ')[1]) : $.cookie('CostoEnvio')
      total = parseFloat(total) + parseFloat(CostoEnvio)

      $('#total_discount').html(parseFloat(disccount).toFixed(2))
      $('.totalCarrito').html('S/ <span id="total_total">' + parseFloat(total).toFixed(2) + '</span>')
      $('.listaPagos .valorEnvio').html('S/. ' + parseFloat(CostoEnvio).toFixed(2))
      $('#msg_cupon').html(``)
    }
  })
  ;(function () {
    var cupon = $('#inpidkcuppon').val()
    var prds = []
    var productosCarritos = getCookie(PRODUCTOS_COOKIE)
    var ListaProductos = productosCarritos.products

    $.each(ListaProductos, function (x, items_vals) {
      var item = {}
      item.dominio = DOMINIO
      item.sku = items_vals.sku
      item.coupon = cupon
      item.cantidad = items_vals.quantity
      prds.push(item)
    })
    var settings = {
      url: 'https://api-inventario.samishop.pe/datosvariaciones/validate/checkout',
      method: 'POST',
      timeout: 0,
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(prds)
    }

    $.ajax(settings).done(function (response) {
      productosCarritos.summary = response['sRpta']
      window.localStorage.setItem(PRODUCTOS_COOKIE, JSON.stringify(productosCarritos))
      //Detecta Envio Gratis C1.1
      var CostoEnvio = ''
      if (response['sRpta'].free_shipping === true) {
        window.envio = true
        CostoEnvio = '0.00'
        $('.valorEnvio').html('S/. 0.00')
      } else {
        window.envio = false
        CostoEnvio = parseFloat($('.valorEnvio').text().split(' ')[1])
        $('.valorEnvio').html(`S/. ${parseFloat(CostoEnvio).toFixed(2)}`)
      }
      //Fin Detecta Envio Gratis
      var descnt = response['sRpta'].disccount
      var subtotal = response['sRpta'].subTotal
      var total = response['sRpta'].total
      total = parseFloat(total) + parseFloat(CostoEnvio)

      $('#total_discount').html(parseFloat(descnt).toFixed(2))
      $('#total_price').html(parseFloat(subtotal).toFixed(2))
      $('.totalCarrito').html("S/ <span id='total_total'>" + parseFloat(total).toFixed(2) + '</span>')
    })
  })()
})
