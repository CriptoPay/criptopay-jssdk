/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//document.getElementsByClassName("cp-donacion").forEach(CrearBoton);

var botones = document.getElementsByClassName("criptopay-boton");
for (i = 0; i < botones.length; i++) {
    var tipo = botones[i].getAttribute("data-action")
    switch (tipo){
        case 'Donacion':
            CrearBotonDonacion(botones[i]);
            break;
    }
}
if (document.layers) {
  document.captureEvents(Event.KEYDOWN);
}

document.onkeydown = function (evt) {
  var keyCode = evt ? (evt.which ? evt.which : evt.keyCode) : event.keyCode;
  if (keyCode == 27) {
        OcultarRoot();
  }
};

/**
 * BOTONES PARA LAS DONACIONES
 */

/**
 * 
 * @param {type} elemento
 * @returns {undefined}
 */
function CrearBotonDonacion(elemento){
    if(elemento.getAttribute("data-text") == null){
        texto = "!!Donar Ahora!!!";
    }else{
        texto = elemento.getAttribute("data-text");
    }
    var xhr = createCORSRequest('generar');
    xhr.onload = function() {
      obj = JSON.parse(xhr.responseText);
      EventosDonaciones(elemento,obj.titulo,obj.urlqr);
    };
    xhr.onerror = function() {
      alert('Woops, there was an error making the request.');
    };
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send("idcliente="+elemento.getAttribute("data-idcliente")+"&"+
            "idrelaccionado="+elemento.getAttribute("data-idrelaccionado"));
    switch(elemento.getAttribute("data-layer")){
        case 'simple':
            AgregarThumb(elemento,"donacion");
            
        break;
    case 'completa':
            AgregarThumb(elemento,"donacion");
            Texto(elemento,texto);
            AgregarContador(elemento,"donacion");
        break;
        default:
            AgregarThumb(elemento,"donacion");            
            Texto(elemento,texto);
            break;
    }
}

/**
 * 
 * @param {type} elemento
 * @returns {undefined}
 */
function EventosDonaciones(elemento,titulo,codigoqr){
    elemento.addEventListener("click",function(e){
        MostrarRoot(e);
        ActualizarRoot(titulo,codigoqr);
    },false);
}
/**
 * FIN BOTONES PARA LAS DONACIONES
 */




/**
 * GLOBALES
 */

function ContruirRoot(){
    if(document.getElementById("criptopay-root").getElementsByTagName("header")[0])return false;
    header = document.createElement('header');
    header.innerHTML = "";
    divclose = document.createElement('div');
    divclose.className = "close";
    divclose.innerHTML = "X";
    divclose.addEventListener("click",OcultarRoot);
    header.appendChild(divclose);
    divtitle = document.createElement('div');
    divtitle.className = "titulo";
    header.appendChild(divtitle);
    document.getElementById("criptopay-root").appendChild(header);
    
    div = document.createElement('div');
    div.innerHTML = "Puesdes dejar tu donación aquí";
    div.innerHTML += "<div class='bitcoinaddress'><img src='http://webid.ingenierosweb.co/qr_generator.php?q=bitcoin:1PrtVpAXW73cfzyrzufPKkG2fAJdCE4tBf' /></div>";
    document.getElementById("criptopay-root").appendChild(div);
    
    footer = document.createElement('footer');
    footer.innerHTML = "Gracias por colaborar!";
    document.getElementById("criptopay-root").appendChild(footer);
}

function ActualizarRoot(titulo,btcaddress){
    document.getElementById("criptopay-root").getElementsByClassName("titulo")[0].innerHTML = titulo;
    document.getElementById("criptopay-root").getElementsByTagName("img")[0].src = btcaddress;
}

function MostrarRoot(e){
   ContruirRoot();
   document.getElementById("criptopay-root").style.top = e.clientY+"px";
   document.getElementById("criptopay-root").style.left = e.clientX+"px";
   document.getElementById("criptopay-root").style.display = "block";
}

function OcultarRoot(){
   document.getElementById("criptopay-root").style.display = "none"; 
}

function Texto(elemento,texto){
    div = document.createElement('p');
    div.innerHTML = texto;
    elemento.appendChild(div,elemento);
}
/*======================AQUÍ SE CAMBIAN LOS ESTILOS===================================*/
function AgregarThumb(elemento,tipo){
    AddStyle("criptopaysdk-css","../src/css/button_icon.css");
    div = document.createElement('div');
    div.className = "criptopay-thumb";
    div.className += " "+tipo;
    elemento.appendChild(div,elemento);
}
/*function AgregarThumb(elemento,tipo){
    AddStyle("criptopaysdk-css","../src/css/button_sizes.css");
    div = document.createElement('div');
    div.className = "criptopay-thumb";
    div.className += " "+tipo;
    elemento.appendChild(div,elemento);
}*/
/*function AgregarThumb(elemento,tipo){
    AddStyle("criptopaysdk-css","../src/css/criptopay.css");
    div = document.createElement('div');
    div.className = "criptopay-thumb";
    div.className += " "+tipo;
    elemento.appendChild(div,elemento);
}*/
/*function AgregarThumb(elemento,tipo){
    AddStyle("criptopaysdk-css","../src/css/criptopay-botones.css");
    div = document.createElement('div');
    div.className = "criptopay-thumb";
    div.className += " "+tipo;
    elemento.appendChild(div,elemento);
}*/


function AgregarContador(elemento,tipo){
    div = document.createElement('div');
    div.className = "criptopay-contador";
    div.className += " "+tipo;
    elemento.appendChild(div,elemento);
}

function AddStyle(id,href){
    if (document.getElementById(id)) return;
    links = document.getElementsByTagName('head')[0];
    style = document.createElement('link');
    style.id = id;
    style.rel = "stylesheet";
    style.href = href;
    links.appendChild(style, links);
}

function createCORSRequest(funcion) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    xhr.open('POST', 'https://api.cripto-pay.com/donacion.php?funcion='+funcion, false);
  } else if (typeof XDomainRequest != "undefined") {
    xhr = new XDomainRequest();
    xhr.open('POST', 'https://api.cripto-pay.com/donacion.php?funcion='+funcion, false);
  } else {
    xhr = null;
  }
  if (!xhr) {
    alert('CORS not supported');
    return;
  }  
  return xhr;
}