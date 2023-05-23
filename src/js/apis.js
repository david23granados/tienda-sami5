document.addEventListener("DOMContentLoaded" , async function () {
    await window.aplicacion.init({ dominio: DOMINIO, cloud_dominio: DOMINIO_CLOUD, version: VERSION, pagina: PAGINA, moneda: MODENA_PRINCIPAL })
})
console.log("cambio subido");