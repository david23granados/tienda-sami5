const DOMINIO = $("#urlDomainDefault").attr("content");
const DOMINIO_CLOUD = $("#urlCdnStorageDefault").attr("content");
const VERSION = Date.now();
const PRODUCTOS_COOKIE = `${DOMINIO}_cookie_checkout1`;
const PAGINA = location.pathname
const API_CATALOGO = `https://api-inventario.samishop.pe/datoscatalogo/${DOMINIO}/`;
let MODENA_PRINCIPAL = "S/."
const API_SELFROM_MODAL = "https://api-inventario.samishop.pe/datoscatalogo/saleform/"
const ESQUELETO_CARRITO = `
<figure class="itemside align-items-center">
    <span class="vista-prev"> VISTA PREVIA </span>
    <div class="aside">
        <img src="[[url_imagen]]" class="img-sm">
    </div>
    <figcaption class="info">
        <a class="title text-dark">[[titulo]]</a>
        <p class="small dsc_cat"></p>
        <div class="prices_prd">
            [[precios]]
        </div>
        <div id="obj_sku_car">[[sku]]</div>
        <p class="cant_prd">[[cantidad]]</p>
    </figcaption>
</figure>
`
const ESQUELETO_FOOTER = `
        <article class="logo">
            [[NOMBRE]]
        </article>
        <article class="contacto">
            <h3>CONTACTO</h3>
            <ul>
                [[TELEFONO]]
                [[EMAIL]]
                [[DIRECCION]]
            </ul>
        </article>
        <article class="siguenos">
            
            <ul>
                [[REDES]]
            </ul>
        </article>
`
let anchoPantalla = $(window).width();
let datos_editor
let prueba