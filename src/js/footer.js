document.addEventListener('DOMContentLoaded', async () => {
  await editor()
  let esqueleto = ESQUELETO_FOOTER
  let redes = ''
  if (datos_editor.ss_nombre_tienda != '') {
    esqueleto = esqueleto.replaceAll('[[NOMBRE]]', `<h2>${datos_editor.ss_nombre_tienda}</h2>`)
  } else {
    esqueleto = esqueleto.replaceAll('[[NOMBRE]]', ``)
  }
  if (datos_editor.ss_telefono_footer) {
    esqueleto = esqueleto
      .replaceAll('[[TELEFONO]]', `<li><a href="tel:+${datos_editor.ss_telefono_footer}">${datos_editor.ss_telefono_footer}</a></li>`)
      .replaceAll(
        '[[whatsapp]]',
        `<a href="https://api.whatsapp.com/send?phone=${datos_editor.ss_telefono_footer}&text=${encodeURIComponent(
          `Hola, vengo de la tienda ${DOMINIO} y tengo una consulta!`
        )}" target="_blank" rel="noopener noreferrer" class="link_what"><img src="${DOMINIO_CLOUD}/images/iconos/whatsapp_1.png"></a>`
      )
  } else {
    esqueleto = esqueleto.replaceAll('[[TELEFONO]]', ``).replaceAll('[[whatsapp]]', '')
  }
  if (datos_editor.ss_correo_footer) {
    esqueleto = esqueleto.replaceAll('[[EMAIL]]', `<li><a href="mailto:${datos_editor.ss_correo_footer}">${datos_editor.ss_correo_footer}</a></li>`)
  } else {
    esqueleto = esqueleto.replaceAll('[[EMAIL]]', ``)
  }
  if (datos_editor.ss_direccion_footer) {
    esqueleto = esqueleto.replaceAll('[[DIRECCION]]', `<li>${datos_editor.ss_direccion_footer}</li>`)
  } else {
    esqueleto = esqueleto.replaceAll('[[DIRECCION]]', ``)
  }
  if (datos_editor.ss_url_facebook) {
    redes += `<li><a href="${datos_editor.ss_url_facebook}" target="_blank" rel="noopener noreferrer"><img src="${DOMINIO_CLOUD}/images/iconos/facebook.svg" alt="facebook" width="31" height="31"></a></li>`
  }
  if (datos_editor.ss_url_youtube) {
    redes += `<li><a href="${datos_editor.ss_url_youtube}" target="_blank" rel="noopener noreferrer"><img src="${DOMINIO_CLOUD}/images/iconos/youtube.svg" alt="youtube" width="31" height="31"></a></li>`
  }
  if (datos_editor.ss_url_twitter) {
    redes += `<li><a href="${datos_editor.ss_url_twitter}" target="_blank" rel="noopener noreferrer"><img src="${DOMINIO_CLOUD}/images/iconos/twitter.svg" alt="twitter" width="31" height="31"></a></li>`
  }
  if (datos_editor.ss_url_instagram) {
    redes += `<li><a href="${datos_editor.ss_url_instagram}" target="_blank" rel="noopener noreferrer"><img src="${DOMINIO_CLOUD}/images/iconos/instagram.svg" alt="instagram" width="31" height="31"></a></li>`
  }
  if (datos_editor.ss_url_tiktok) {
    redes += `<li><a href="${datos_editor.ss_url_tiktok}" target="_blank" rel="noopener noreferrer"><img src="${DOMINIO_CLOUD}/images/iconos/tiktok.svg" alt="tiktok" width="31" height="31"></a></li>`
  }

  esqueleto = esqueleto.replaceAll('[[REDES]]', redes)
  $('footer .info').append(esqueleto)

  if ($('.siguenos ul li').length == 0) {
    $('.siguenos').remove()
  }

  if ($('.logo h2').length == 0) {
    $('.logo').remove()
  }

  if ($('.contacto ul li').length == 0) {
    $('.contacto').remove()
  }

  if (datos_editor.ss_titulo_tienda && datos_editor.ss_descripcion_tienda) {
    $('.nosotros h2').text(datos_editor.ss_titulo_tienda)
    $('.nosotros p').text(datos_editor.ss_descripcion_tienda)
  } else {
    $('.nosotros').remove()
  }
})
