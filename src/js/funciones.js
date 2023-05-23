
//PAGINACION PLUGIN JQUERY (INCIO)
;(function ($) {
  var methods = {
    init: function (options) {
      var o = $.extend(
        {
          items: 1,
          itemsOnPage: 1,
          pages: 0,
          displayedPages: 5,
          edges: 2,
          currentPage: 0,
          useAnchors: true,
          hrefTextPrefix: '#page-',
          hrefTextSuffix: '',
          prevText: 'Prev',
          nextText: 'Next',
          ellipseText: '&hellip;',
          ellipsePageSet: true,
          cssStyle: 'light-theme',
          listStyle: '',
          labelMap: [],
          selectOnClick: true,
          nextAtFront: false,
          invertPageOrder: false,
          useStartEdge: true,
          useEndEdge: true,
          onPageClick: function (pageNumber, event) {
            // Callback triggered when a page is clicked
            // Page number is given as an optional parameter
          },
          onInit: function () {
            // Callback triggered immediately after initialization
          }
        },
        options || {}
      )

      var self = this

      o.pages = o.pages ? o.pages : Math.ceil(o.items / o.itemsOnPage) ? Math.ceil(o.items / o.itemsOnPage) : 1
      if (o.currentPage) o.currentPage = o.currentPage - 1
      else o.currentPage = !o.invertPageOrder ? 0 : o.pages - 1
      o.halfDisplayed = o.displayedPages / 2

      this.each(function () {
        self.addClass(o.cssStyle + ' simple-pagination').data('pagination', o)
        methods._draw.call(self)
      })

      o.onInit()

      return this
    },

    selectPage: function (page) {
      methods._selectPage.call(this, page - 1)
      return this
    },

    prevPage: function () {
      var o = this.data('pagination')
      if (!o.invertPageOrder) {
        if (o.currentPage > 0) {
          methods._selectPage.call(this, o.currentPage - 1)
        }
      } else {
        if (o.currentPage < o.pages - 1) {
          methods._selectPage.call(this, o.currentPage + 1)
        }
      }
      return this
    },

    nextPage: function () {
      var o = this.data('pagination')
      if (!o.invertPageOrder) {
        if (o.currentPage < o.pages - 1) {
          methods._selectPage.call(this, o.currentPage + 1)
        }
      } else {
        if (o.currentPage > 0) {
          methods._selectPage.call(this, o.currentPage - 1)
        }
      }
      return this
    },

    getPagesCount: function () {
      return this.data('pagination').pages
    },

    setPagesCount: function (count) {
      this.data('pagination').pages = count
    },

    getCurrentPage: function () {
      return this.data('pagination').currentPage + 1
    },

    destroy: function () {
      this.empty()
      return this
    },

    drawPage: function (page) {
      var o = this.data('pagination')
      o.currentPage = page - 1
      this.data('pagination', o)
      methods._draw.call(this)
      return this
    },

    redraw: function () {
      methods._draw.call(this)
      return this
    },

    disable: function () {
      var o = this.data('pagination')
      o.disabled = true
      this.data('pagination', o)
      methods._draw.call(this)
      return this
    },

    enable: function () {
      var o = this.data('pagination')
      o.disabled = false
      this.data('pagination', o)
      methods._draw.call(this)
      return this
    },

    updateItems: function (newItems) {
      var o = this.data('pagination')
      o.items = newItems
      o.pages = methods._getPages(o)
      this.data('pagination', o)
      methods._draw.call(this)
    },

    updateItemsOnPage: function (itemsOnPage) {
      var o = this.data('pagination')
      o.itemsOnPage = itemsOnPage
      o.pages = methods._getPages(o)
      this.data('pagination', o)
      methods._selectPage.call(this, 0)
      return this
    },

    getItemsOnPage: function () {
      return this.data('pagination').itemsOnPage
    },

    _draw: function () {
      var o = this.data('pagination'),
        interval = methods._getInterval(o),
        i,
        tagName

      methods.destroy.call(this)

      tagName = typeof this.prop === 'function' ? this.prop('tagName') : this.attr('tagName')

      var $panel = tagName === 'UL' ? this : $('<ul' + (o.listStyle ? ' class="' + o.listStyle + '"' : '') + '></ul>').appendTo(this)

      // Generate Prev link
      if (o.prevText) {
        methods._appendItem.call(this, !o.invertPageOrder ? o.currentPage - 1 : o.currentPage + 1, {
          text: o.prevText,
          classes: 'prev'
        })
      }

      // Generate Next link (if option set for at front)
      if (o.nextText && o.nextAtFront) {
        methods._appendItem.call(this, !o.invertPageOrder ? o.currentPage + 1 : o.currentPage - 1, {
          text: o.nextText,
          classes: 'next'
        })
      }

      // Generate start edges
      if (!o.invertPageOrder) {
        if (interval.start > 0 && o.edges > 0) {
          if (o.useStartEdge) {
            var end = Math.min(o.edges, interval.start)
            for (i = 0; i < end; i++) {
              methods._appendItem.call(this, i)
            }
          }
          if (o.edges < interval.start && interval.start - o.edges != 1) {
            $panel.append('<li class="disabled"><span class="ellipse">' + o.ellipseText + '</span></li>')
          } else if (interval.start - o.edges == 1) {
            methods._appendItem.call(this, o.edges)
          }
        }
      } else {
        if (interval.end < o.pages && o.edges > 0) {
          if (o.useStartEdge) {
            var begin = Math.max(o.pages - o.edges, interval.end)
            for (i = o.pages - 1; i >= begin; i--) {
              methods._appendItem.call(this, i)
            }
          }

          if (o.pages - o.edges > interval.end && o.pages - o.edges - interval.end != 1) {
            $panel.append('<li class="disabled"><span class="ellipse">' + o.ellipseText + '</span></li>')
          } else if (o.pages - o.edges - interval.end == 1) {
            methods._appendItem.call(this, interval.end)
          }
        }
      }

      // Generate interval links
      if (!o.invertPageOrder) {
        for (i = interval.start; i < interval.end; i++) {
          methods._appendItem.call(this, i)
        }
      } else {
        for (i = interval.end - 1; i >= interval.start; i--) {
          methods._appendItem.call(this, i)
        }
      }

      // Generate end edges
      if (!o.invertPageOrder) {
        if (interval.end < o.pages && o.edges > 0) {
          if (o.pages - o.edges > interval.end && o.pages - o.edges - interval.end != 1) {
            $panel.append('<li class="disabled"><span class="ellipse">' + o.ellipseText + '</span></li>')
          } else if (o.pages - o.edges - interval.end == 1) {
            methods._appendItem.call(this, interval.end)
          }
          if (o.useEndEdge) {
            var begin = Math.max(o.pages - o.edges, interval.end)
            for (i = begin; i < o.pages; i++) {
              methods._appendItem.call(this, i)
            }
          }
        }
      } else {
        if (interval.start > 0 && o.edges > 0) {
          if (o.edges < interval.start && interval.start - o.edges != 1) {
            $panel.append('<li class="disabled"><span class="ellipse">' + o.ellipseText + '</span></li>')
          } else if (interval.start - o.edges == 1) {
            methods._appendItem.call(this, o.edges)
          }

          if (o.useEndEdge) {
            var end = Math.min(o.edges, interval.start)
            for (i = end - 1; i >= 0; i--) {
              methods._appendItem.call(this, i)
            }
          }
        }
      }

      // Generate Next link (unless option is set for at front)
      if (o.nextText && !o.nextAtFront) {
        methods._appendItem.call(this, !o.invertPageOrder ? o.currentPage + 1 : o.currentPage - 1, {
          text: o.nextText,
          classes: 'next'
        })
      }

      if (o.ellipsePageSet && !o.disabled) {
        methods._ellipseClick.call(this, $panel)
      }
    },

    _getPages: function (o) {
      var pages = Math.ceil(o.items / o.itemsOnPage)
      return pages || 1
    },

    _getInterval: function (o) {
      return {
        start: Math.ceil(o.currentPage > o.halfDisplayed ? Math.max(Math.min(o.currentPage - o.halfDisplayed, o.pages - o.displayedPages), 0) : 0),
        end: Math.ceil(o.currentPage > o.halfDisplayed ? Math.min(o.currentPage + o.halfDisplayed, o.pages) : Math.min(o.displayedPages, o.pages))
      }
    },

    _appendItem: function (pageIndex, opts) {
      var self = this,
        options,
        $link,
        o = self.data('pagination'),
        $linkWrapper = $('<li></li>'),
        $ul = self.find('ul')

      pageIndex = pageIndex < 0 ? 0 : pageIndex < o.pages ? pageIndex : o.pages - 1

      options = {
        text: pageIndex + 1,
        classes: ''
      }

      if (o.labelMap.length && o.labelMap[pageIndex]) {
        options.text = o.labelMap[pageIndex]
      }

      options = $.extend(options, opts || {})

      if (pageIndex == o.currentPage || o.disabled) {
        if (o.disabled || options.classes === 'prev' || options.classes === 'next') {
          $linkWrapper.addClass('disabled')
        } else {
          $linkWrapper.addClass('active')
        }
        $link = $('<span class="current">' + options.text + '</span>')
      } else {
        if (o.useAnchors) {
          $link = $('<a href="' + o.hrefTextPrefix + (pageIndex + 1) + o.hrefTextSuffix + '" class="page-link">' + options.text + '</a>')
        } else {
          $link = $('<span >' + options.text + '</span>')
        }
        $link.click(function (event) {
          return methods._selectPage.call(self, pageIndex, event)
        })
      }

      if (options.classes) {
        $link.addClass(options.classes)
      }

      $linkWrapper.append($link)

      if ($ul.length) {
        $ul.append($linkWrapper)
      } else {
        self.append($linkWrapper)
      }
    },

    _selectPage: function (pageIndex, event) {
      var o = this.data('pagination')
      o.currentPage = pageIndex
      if (o.selectOnClick) {
        methods._draw.call(this)
      }
      return o.onPageClick(pageIndex + 1, event)
    },

    _ellipseClick: function ($panel) {
      var self = this,
        o = this.data('pagination'),
        $ellip = $panel.find('.ellipse')
      $ellip.addClass('clickable').parent().removeClass('disabled')
      $ellip.click(function (event) {
        if (!o.disable) {
          var $this = $(this),
            val = (parseInt($this.parent().prev().text(), 10) || 0) + 1
          $this
            .html('<input type="number" min="1" max="' + o.pages + '" step="1" value="' + val + '">')
            .find('input')
            .focus()
            .click(function (event) {
              // prevent input number arrows from bubbling a click event on $ellip
              event.stopPropagation()
            })
            .keyup(function (event) {
              var val = $(this).val()
              if (event.which === 13 && val !== '') {
                // enter to accept
                if (val > 0 && val <= o.pages) methods._selectPage.call(self, val - 1)
              } else if (event.which === 27) {
                // escape to cancel
                $ellip.empty().html(o.ellipseText)
              }
            })
            .bind('blur', function (event) {
              var val = $(this).val()
              if (val !== '') {
                methods._selectPage.call(self, val - 1)
              }
              $ellip.empty().html(o.ellipseText)
              return false
            })
        }
        return false
      })
    }
  }

  $.fn.pagination = function (method) {
    // Method calling logic
    if (methods[method] && method.charAt(0) != '_') {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1))
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments)
    } else {
      $.error('Method ' + method + ' does not exist on jQuery.pagination')
    }
  }
})(jQuery)

function setCookie(c_name, value, exdays) {
  window.localStorage.setItem(c_name, JSON.stringify(value))
}

function getCookie(c_name) {
  return JSON.parse(window.localStorage.getItem(c_name))
}

function carritoResumen() {
  let carrito = getCookie(PRODUCTOS_COOKIE)
  $('.box-cart-scroll-pro').html('')
  if (carrito != null) {
    let cantidad = 0
    let total_productos = 0
    let productos = carrito['products']

    if (productos.length) {
      productos.forEach((producto) => {
        cantidad = cantidad + producto.quantity
        let precios = ''
        if (producto.price == producto.sale_price) {
          precios = `<span class="pr_v">${MODENA_PRINCIPAL} ${parseFloat(producto.price).toFixed(2)}</span>`
          total_productos = total_productos + producto.price * producto.quantity
        } else {
          let oferta = producto.sale_price * 100
          oferta = oferta / producto.price
          oferta = 100 - oferta
          oferta = Math.round(oferta)
          total_productos = total_productos + producto.price * producto.quantity
          precios = `<span class="pr_v">${MODENA_PRINCIPAL} ${parseFloat(producto.sale_price).toFixed(
            2
          )}</span> <span class="precio_oferta1">${MODENA_PRINCIPAL} ${parseFloat(producto.price).toFixed(
            2
          )}</span> <i class="label-oferta1">-${oferta}%</i>`
        }
        $('.box-cart-scroll-pro').append(
          ESQUELETO_CARRITO.replaceAll('[[url_imagen]]', producto.url1_imagen_sku)
            .replaceAll('[[titulo]]', producto.item_title)
            .replaceAll('[[precios]]', precios)
            .replaceAll('[[sku]]', producto.sku)
            .replaceAll('[[cantidad]]', producto.quantity)
        )
      })

      $('.ic_carrito #spnCartQty').html(cantidad)
      $('.img_crt #spnCartQty').html(cantidad)
      $('.cart-price-price p b').html('S/ ' + parseFloat(total_productos).toFixed(2))
      $('#bolsalenth').html('(' + cantidad + ' PRODUCTOS)')
    } else {
      $('#tmpblosa .box-cart-scroll-pro').html(`
              <div class="message_empty">
                       <img src="${DOMINIO_CLOUD}/images/iconos/carritovacio1.png">
                      <h5>No tienes productos</h5>
                       <span>en tu Carrito de compras</span>
                    </div>`)

      $('#tmpblosa .box-cart-price').remove()
      $('.ic_carrito #spnCartQty').html('0')
      $('.img_crt #spnCartQty').html('0')
      $('#bolsalenth').html('(VAC&Iacute;O)')
      localStorage.removeItem(PRODUCTOS_COOKIE)
    }
  }
}

function calculateValidQuantityMinus(sku, quantity) {
  if (quantity > 0) {
    return true
  }
  return false
}

function calculateValidQuantityKeypress(sku, quantity, idprd) {
  var stes = {
    url: API_SELFROM_MODAL + DOMINIO + '/idproducto/' + idprd,
    method: 'GET',
    timeout: 0
  }

  jQuery.ajax(stes).done(function (response) {
    let cart = response.obj
    for (i = 0; i < cart.datos_variaciones.length; i++) {
      if (cart.datos_variaciones[i] != null && cart.datos_variaciones[i].sku == sku) {
        const datos_variaciones_cantidad = cart.datos_variaciones[i].cantidad
        if (datos_variaciones_cantidad >= quantity) {
          $("[id='product-cart-message'][name='" + sku + "']").text('')
        } else {
          $("[id='product-cart-message'][name='" + sku + "']").text('No tenemos stock suficiente')
        }
      }
    }
  })
}

function calculateValidQuantityPlus(sku, quantity, idprd) {
  var stes = {
    url: API_SELFROM_MODAL + DOMINIO + '/idproducto/' + idprd,
    method: 'GET',
    timeout: 0
  }

  jQuery.ajax(stes).done(function (response) {
    let cart = response.obj
    for (i = 0; i < cart.datos_variaciones.length; i++) {
      if (cart.datos_variaciones[i] != null && cart.datos_variaciones[i].sku == sku) {
        const datos_variaciones_cantidad = cart.datos_variaciones[i].cantidad
        if (datos_variaciones_cantidad >= quantity) {
          $("[id='product-cart-message'][name='" + sku + "']").text('')
          asignateQuantityProductChange(sku, quantity)
        } else {
          $("[id='product-cart-message'][name='" + sku + "']").text('No tenemos stock suficiente')
        }
      }
    }
  })
}

function asignateQuantityProductChange(sku, quantity) {
  $("[id='product_quantity'][name='" + sku + "']").val(quantity)
}

function ValidateSetCartProduct(quantity, quantitySistem) {
  if (quantitySistem >= quantity) {
    return true
  } else {
    return false
  }
}

function setProduct(cart, product, datos) {
  let cantidad_validad_inexistente = false
  for (i = 0; i < cart.products.length; i++) {
    if (cart.products[i] != null && cart.products[i].sku == product.sku) {
      if (ValidateSetCartProduct(cart.products[i].quantity + datos.quantity, datos.datos_variaciones_cantidad) === false) {
        return null
      }
      cantidad_validad_inexistente = true

      cart.products[i].sku = datos.datos_variaciones_sku
      cart.products[i].item_title = datos.datos_Catalogo_item_title
      cart.products[i].price = datos.datos_variaciones_price
      cart.products[i].sale_price = datos.datos_variaciones_sale_price
      cart.products[i].quantity = cart.products[i].quantity + datos.quantity //html
      cart.products[i].cantidad = datos.datos_variaciones_cantidad
      cart.products[i].atributo1_titulo = datos.datos_variaciones_atributo1_titulo
      cart.products[i].atributo1_valor = datos.datos_variaciones_atributo1_valor
      cart.products[i].atributo2_titulo = datos.datos_variaciones_atributo2_titulo
      cart.products[i].atributo2_valor = datos.datos_variaciones_atributo2_valor
      cart.products[i].atributo3_titulo = datos.datos_variaciones_atributo3_titulo
      cart.products[i].atributo3_valor = datos.datos_variaciones_atributo3_valor
      cart.products[i].observacion = ''
      cart.products[i].tags_promociones = datos.atos_Catalogo_tags_promociones
      cart.products[i].url1_imagen_sku = datos.datos_variaciones_url1_imagen_sku
      cart.products[i].url_producto = datos.datos_Catalogo_url_producto

      datos.datos_variaciones_subtotal = datos.datos_variaciones_sale_price * datos.quantity
      cart.products[i].subTotal = datos.datos_variaciones_subtotal

      cart.summary.subTotal = 0
      cart.summary.disccount = 0
      cart.summary.quantity = 0
      cart.summary.total = 0
      return cart
    }
  }
  if (!cantidad_validad_inexistente) {
    if (ValidateSetCartProduct(datos.quantity, datos.datos_variaciones_cantidad) === false) {
      return null
    }
  }
  cart.products.push(product)

  cart.summary.subTotal = 0
  cart.summary.disccount = 0
  cart.summary.quantity = 0
  cart.summary.total = 0

  return cart
}

function cookieStore(name) {
  var cookies = document.cookie.split(';')
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i].trim()
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length + 1, cookie.length)
    }
  }
  return null
}

$.fn.modal = function () {
  $('body').addClass('modal-open')
  $('body').append('<div class="modal-backdrop fade show"></div>')
  $(this).show()
}

$(document).on('click', '.close, [data-dismiss=modal]', function () {
  $('body').removeClass('modal-open')
  $('.modal-backdrop').remove()
  $(this).parents(':first-of-type').find('.modal.fade').hide()
})

$(window).resize(function () {
  anchoPantalla = $(this).width()
  console.log('El ancho de la pantalla es: ' + anchoPantalla)
})

;(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(['jquery'], factory)
  } else if (typeof exports === 'object') {
    // CommonJS
    factory(require('jquery'))
  } else {
    // Browser globals
    factory(jQuery)
  }
})(function ($) {
  var pluses = /\+/g

  function encode(s) {
    return config.raw ? s : encodeURIComponent(s)
  }

  function decode(s) {
    return config.raw ? s : decodeURIComponent(s)
  }

  function stringifyCookieValue(value) {
    return encode(config.json ? JSON.stringify(value) : String(value))
  }

  function parseCookieValue(s) {
    if (s.indexOf('"') === 0) {
      // This is a quoted cookie as according to RFC2068, unescape...
      s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\')
    }

    try {
      // Replace server-side written pluses with spaces.
      // If we can't decode the cookie, ignore it, it's unusable.
      // If we can't parse the cookie, ignore it, it's unusable.
      s = decodeURIComponent(s.replace(pluses, ' '))
      return config.json ? JSON.parse(s) : s
    } catch (e) {}
  }

  function read(s, converter) {
    var value = config.raw ? s : parseCookieValue(s)
    return $.isFunction(converter) ? converter(value) : value
  }

  var config = ($.cookie = function (key, value, options) {
    // Write

    if (value !== undefined && !$.isFunction(value)) {
      options = $.extend({}, config.defaults, options)

      if (typeof options.expires === 'number') {
        var days = options.expires,
          t = (options.expires = new Date())
        t.setTime(+t + days * 864e5)
      }

      return (document.cookie = [
        encode(key),
        '=',
        stringifyCookieValue(value),
        options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
        options.path ? '; path=' + options.path : '',
        options.domain ? '; domain=' + options.domain : '',
        options.secure ? '; secure' : ''
      ].join(''))
    }

    // Read

    var result = key ? undefined : {}

    // To prevent the for loop in the first place assign an empty array
    // in case there are no cookies at all. Also prevents odd result when
    // calling $.cookie().
    var cookies = document.cookie ? document.cookie.split('; ') : []

    for (var i = 0, l = cookies.length; i < l; i++) {
      var parts = cookies[i].split('=')
      var name = decode(parts.shift())
      var cookie = parts.join('=')

      if (key && key === name) {
        // If second argument (value) is a function it's a converter...
        result = read(cookie, value)
        break
      }

      // Prevent storing a cookie that we couldn't decode.
      if (!key && (cookie = read(cookie)) !== undefined) {
        result[name] = cookie
      }
    }

    return result
  })

  config.defaults = {}

  $.removeCookie = function (key, options) {
    if ($.cookie(key) === undefined) {
      return false
    }

    // Must not alter options, thus extending a fresh object...
    $.cookie(key, '', $.extend({}, options, { expires: -1 }))
    return !$.cookie(key)
  }
})

function verProductos() {
  let carrito = getCookie(PRODUCTOS_COOKIE)
  if (!carrito || carrito.products.length === 0) {
    location.href = '/'
  }
}

function numer(e) {
  e.value = e.value.replace(/[a-zA-z\^\*\-\+\@!\|°!´¨\*\{\},\.;:_#\$%\&/\(\)=\?¡!\¿'""\[\]]/g, '')
}

function text(e, num) {
  if (num == 1) {
    e.value = e.value.replace(/[0-9\^\*\-\+\@!\|°!´¨\*\{\},\.;:_#\$%\&/\(\)=\?¡!\¿'""\[\]]/g, '')
  } else if (num == 2) {
    e.value = e.value.replace(/[0-9\^\*\-\+\@!\|°!´¨\*\{\},;:_#\$%\&/\(\)=\?¡!\¿'""\[\]]/g, '')
  }else{
    e.value = e.value.replace(/[\^\*\-\+\@!\|!´¨\*\{\},;:_#\$%\&/\(\)=\?¡!\¿'""\[\]]/g, '')
  }
}

function email(e) {
  e.value = e.value
}