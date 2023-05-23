async function editor() {
  let response = await fetch(`${DOMINIO_CLOUD}/json/config-store.json?v=${VERSION}`)
  response = await response.json()
  datos_editor = response[0]
  console.log(datos_editor)
  datos_editor.ss_url_logo_head != ''
    ? $('.logo-principal').html(`<img class="logo" src="${datos_editor.ss_url_logo_head}?v=${VERSION}" alt="logo principal" width="123" height="123">`).removeClass('sm-col-12')
    : $('.logo-principal').html(
        `<p class="logo logo-p">${datos_editor.ss_nombre_tienda
          .split(' ')
          .map((el) => el.substring(0, 1))
          .join('').substring(0,2)}</p>`
      ).removeClass('sm-col-12')
  datos_editor.ss_nombre_tienda != '' ? $('header .info h1,.carrito-logo .titulos').html(datos_editor.ss_nombre_tienda).removeClass('sm-col-36') : ''
  datos_editor.ss_slogan_tienda != '' ? $('header .info div').html(datos_editor.ss_slogan_tienda) : $('header .info div').html("")
  datos_editor.ss_url_banner_head != "" ? $(".banner").html(`<img src="${datos_editor.ss_url_banner_head}" atl="banner principal" width="430" height="150">`) : $(".banner").html(`<img src="${DOMINIO_CLOUD}/images/banner/banner-header.png" alt="banner principal" width="430" height="150">`)
}

$(".form-buscador").submit(function (e) {
  e.preventDefault()
  let busqueda = $(".buscador-input").val()
  location.href = `/?f=${busqueda}`
})
