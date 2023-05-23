verProductos()

document.addEventListener('DOMContentLoaded', async function () {
  await aplicacion.modulo_pago({ fecha: '' })

  document.querySelectorAll('input[name=pago]').forEach((element) => {
    element.addEventListener('change', function () {
      $('#continuarPago').addClass('activo')
      document.querySelectorAll('input[name=pago]').forEach((elemen) => {
        elemen.parentElement.parentElement.classList.remove('activo')
      })
      this.parentElement.parentElement.classList.add('activo')
    })
  })
})

$(document).on('change', '[name=doc]', function () {
  if (this.id == 'doc1') {
    $('[for=ruc]').addClass('d-none')
    $('[for=numero]').removeClass('d-none')
    $('[for=ruc] input').removeAttr('required').val('')
    $('[for=numero] input').attr('required', true).val('')
    $('[for=nombre] p').html('Nombres y Apellidos Completos<span>*</span>')
    $('[for=nombre] input').attr('placeholder', 'Ingresa tu nombre').attr('oninput', 'text(this,1)')
  } else {
    $('[for=ruc]').removeClass('d-none')
    $('[for=numero]').addClass('d-none')
    $('[for=ruc] input').attr('required', true).val('')
    $('[for=numero] input').removeAttr('required').val('')
    $('[for=nombre] input').attr('placeholder', 'Ingresa tu razón social').attr('oninput', 'text(this,2)')
    $('[for=nombre] p').html('Razón Social<span>*</span>')
  }
  $('.documento').parent().removeClass('d-none')
  window.paso = false
})

$('.documento').submit(function (e) {
  e.preventDefault()
  window.paso = true
  $('.mensaje').removeClass('d-none')
  setTimeout(() => {
    $('.mensaje').addClass('d-none')
  }, 1500)
})
