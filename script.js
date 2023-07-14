const botonDeBuscar = document.getElementById("botonBuscar");
const barraDeBusqueda = document.getElementById("buscarClima");
const animacionDeBusqueda = document.getElementById("cargaDeInformacion");
const botonDeCerrar = document.getElementById("botonCerrarVentana");
const mostrarContenidoDelClima = document.querySelector(".mostrarInfo");
const contenidoDeInformacion = document.querySelector(".contenidoTexto");
const contenidoDeInformacionNombre = document.querySelector(".contenidoTextoNombre");
const contenidoDeInformacionHora = document.querySelector(".contenidoTextoHora");
const contenidoDeInformacionTemperatura = document.querySelector(".contenidoTextoTemperatura");
const contenidoDeInformacionViento = document.querySelector(".contenidoTextoViento");
const contenidoDeInformacionClima = document.querySelector(".contenidoTextoClima");
const imgClimaTemp = document.getElementById ('iconoClimaTermometro');
const imgClimaViento = document.getElementById ('iconoClimaViento');


botonDeBuscar.addEventListener('click', ()=>{
    // Se le agrega la clase CSS a mostrarContenidoDelClima.
    mostrarContenidoDelClima.classList.add("ventanaDeInformacion");
    
    // Se le agrega el atributo "block" para que se muestre la animacion al hacer click
    animacionDeBusqueda.style.display = "block";

    // Mostramos la imagen en pantalla al hacer click en el boton de busqueda
    darInformacionEnPantalla();
    // Se agregar evento al hacer clic en el botón de búsqueda
    obtenerDatosAPI(barraDeBusqueda.value);

  });

  //Se agrega un evento al "Enter" y se retorna la respuesta, contiene las mismas propiedades del boton.
barraDeBusqueda.addEventListener('keydown', function(event){
  if(event.key === "Enter"){
    mostrarContenidoDelClima.classList.add("ventanaDeInformacion");
    animacionDeBusqueda.style.display = "block";
    darInformacionEnPantalla();
    obtenerDatosAPI(barraDeBusqueda.value);
  }
})

// Creamos una funcion que se dedique a mostrar y ocultar la informacion en pantalla

function darInformacionEnPantalla(){
  /* Se utiliza un IF para hacer la validacion, ejecutar la animacion y luego de que transcurra el tiempo de la animacion y se oculte
  pasa a mostrarse el contenido de texto en este caso se muestra el pronostico con toda la informacion solicitada */
  if(mostrarContenidoDelClima.classList.contains("ventanaDeInformacion")){
    setTimeout(function(){
      animacionDeBusqueda.style.display = "none";
      setTimeout(function(){
        contenidoDeInformacion.classList.add("mostrarContenidoTexto");
      },100)
    }, 2000);
  }else{
    animacionDeBusqueda.style.display = "none";
  }
  /* Solo verifica si contiene dicha clase para luego eliminar al hacer click de nuevo en el boton de BUSCAR*/
  if(contenidoDeInformacion.classList.contains("mostrarContenidoTexto")){
    contenidoDeInformacion.classList.remove("mostrarContenidoTexto");
    // contenidoDeInformacion.innerHTML = "";
  }
}

/* Crear la img del error y mostrar en pantalla */

const imagenError = document.createElement('img');
imagenError.src = "img/404Error.jpg";
imagenError.style.marginTop = "20px";
imagenError.style.width = "100%";
imagenError.style.height = "100%";

/* Funcion encargada de hacer la peticion a la API para luego mostrarla en pantalla*/

function obtenerDatosAPI(ciudad){
    const miAPI = "f2a3a72a44a904385304954e5aef6f0d";

    const urlAPI = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${miAPI}&lang=es&units=metric`;

    fetch(urlAPI)
    .then(respuesta => respuesta.json())
    .then(datos => darClima(datos))
    .catch(error => {contenidoDeInformacion.appendChild(imagenError);
                      mensajePersonalizado();
    });

    //Mediante el error agregado aprovechamos de ocultar los iconos de Temometro y Viento
    function mensajePersonalizado(){
        imgClimaTemp.style.display = "none";
        imgClimaViento.style.display = "none";
      }
    }
  /* Funcion que se encargara de mostrar los datos en la pantalla */
  
  function darClima(datos){
    const ciudad = datos.name; // Tomamos el nombre de la ciudad
    const fechaUTC = new Date(datos.dt * 1000); // Cambiamos el horario a UTC
    const latitud = datos.coord.lat; // Obtenemos la Latitud
    const longitud = datos.coord.lon; // Obtenemos la Longitud
    const urlTimezoneDB = `https://api.timezonedb.com/v2.1/get-time-zone?key=S14TN9U1YWNY&format=json&by=position&lat=${latitud}&lng=${longitud}`; // Mediante la API de TimeZoneDB y con la latitud y longitud que obtenemos de OpenWeatherMap damos con la hora de la ciudad o pais a buscar
    
    fetch(urlTimezoneDB)
    .then(respuesta => respuesta.json())
    .then(data => {
    const gmtOffset = data.gmtOffset; //  obtenemos de timezonedb el horario
    const timeZoneOffset = gmtOffset * 1000; // lo cambiamos a UTC
    const fechaLocal = new Date(fechaUTC.getTime() + timeZoneOffset); // hacemos la suma para tener la hora
    fechaLocal.setHours(fechaLocal.getHours() + 4); // por un problema de la API se le agrega 4 horas adicionales
    fechaLocal.setMinutes(fechaLocal.getMinutes() + 10); // igualmente con las horas sumamos 10 minutos aproximadamente para tener una hora aprox de la ciudad en cuestion
    const horaLocal = fechaLocal.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit",hour12: true}); // Obtenemos la hora para mostrarla en pantalla con formato 12 Horas 
    const temperatura = Math.round(datos.main.temp);
    const vientoMS = datos.wind.speed; // Obtenemos la velocidad del viento en M/s
    const vientoKM = Math.round(vientoMS * 3.6); // Hacemos la conversion para Obtener Km/h
    const demasDatos = datos.weather[0].description; // Obtenemos los datos del clima por ejemplo "Nublado"

    // Actualizar los elementos HTML con los datos del clima y mostrarlos en pantalla

    contenidoDeInformacionNombre.innerHTML = `<h4>${ciudad}</h4>`;
    contenidoDeInformacionHora.innerHTML = `<h5>${horaLocal}</h5>`
    contenidoDeInformacionTemperatura.innerHTML = `<h5>${temperatura}°C</h5>`;
    contenidoDeInformacionViento.innerHTML = `<h5>${vientoKM} Km/h</h5>`;
    demasDatos.innerHTML = demasDatos;
    
  // Utilizar un Switch para mostrar una imagen en función del clima obtenido
  switch (demasDatos) {
    case "cielo claro":
        mostrarImagenDelClima('img/Soleado.png',"Despejado", "img/CieloSoleado.jpg");
      break;
    case "nubes dispersas":
        mostrarImagenDelClima('img/NubladoParcial.png',"Nublado Parcial", "img/CieloDespejado.jpg");
      break;
    case "nublado":
        mostrarImagenDelClima('img/Nublado.png',"Nublado", "img/CieloNublado.jpg");
      break;
    case "muy nuboso":
        mostrarImagenDelClima('img/MuyNuboso.png', "Muy Nublado", "img/CieloNublado.jpg");
      break
    case "nubes":
        mostrarImagenDelClima('img/Nubes.png', "Nubes Presentes", "img/CieloDespejado.jpg");
      break
      case "algo de nubes":
        mostrarImagenDelClima('img/AlgoNubes.png', "Pocas Nubes", "img/CieloDespejado.jpg");
      break
      case "niebla":
        mostrarImagenDelClima('img/Neblina.png',"Neblina", "img/CieloNiebla.jpg");
      break;
    case "lluvia ligera":
        mostrarImagenDelClima('img/LLuviaLigera.png',"LLuvia Ligera", "img/CieloLluvia.jpg");
      break;
    case "lluvia fuerte":7
        mostrarImagenDelClima('img/LluviaFuerte.png', "LLuvia Fuerte", "img/CieloLluvia.jpg");
      break;
    default:
        contenidoDeInformacionClima.innerHTML = "El clima de hoy es: " + demasDatos;
      break;
    }
  })
}

// Funcion encargada de obtener la imagen, texto y fondo para mostrarlo en pantalla.
function mostrarImagenDelClima(ubicacionImagen, texto, fondo){
  //Se crea una imagen para ser agregada luego al 'Switch' para mostrar la imagen
  const contenedorImagenTextoClima = document.createElement("div");

  const imagenClima = document.createElement('img');
  imagenClima.src = ubicacionImagen;
  imagenClima.classList.add("iconoDelClima");


  const textoClima = document.createElement("h5");
  textoClima.innerHTML = texto;

  //Se agrega el texto al contenedor
  contenedorImagenTextoClima.appendChild(imagenClima);
  contenedorImagenTextoClima.appendChild(textoClima);

  //Se agrega la imagen al contenedor
  contenidoDeInformacionClima.innerHTML = "";
  contenidoDeInformacionClima.appendChild(contenedorImagenTextoClima);
  //Se agrega el fondo al contenedor
  setTimeout(()=>{
    mostrarContenidoDelClima.style.backgroundImage = `url(${fondo})`;
    mostrarContenidoDelClima.style.backgroundSize = `cover`;
    mostrarContenidoDelClima.style.backgroundRepeat = `no-repeat`;
  },2000);
}