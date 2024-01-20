/***** INICIO DECLARACIÓN DE VARIABLES GLOBALES *****/

// Variables simples
let tapeteInicio = null;
let contadorMovimientos = 0;
let indicadorMovimiento = document.getElementById("indicador_movimientos");
let indicadorTiempo = document.getElementById("indicador_tiempo");

let baraja1 = document.getElementById("idbaraja1");
let baraja2 = document.getElementById("idbaraja2");
let barajaSeleccionado = parseInt(baraja1.value);

let barajaInicio = 1;
let barajaFin = 12;

// Array de palos
let palos = ["viu", "cua", "hex", "cir"];

// Array de colores
let colores = {
  viu: "naranja",
  cua: "naranja",
  hex: "gris",
  cir: "gris",
};

// paso (top y left) en pixeles de una carta a la siguiente en un mazo
let paso = 5;

// Tapetes
let tapeteInicial = document.getElementById("inicial");
let tapeteSobrantes = document.getElementById("sobrantes");
let tapeteReceptor1 = document.getElementById("receptor1");
let tapeteReceptor2 = document.getElementById("receptor2");
let tapeteReceptor3 = document.getElementById("receptor3");
let tapeteReceptor4 = document.getElementById("receptor4");

// Mazos
let mazoInicial = [];
let mazoBarajado = [];

// Contadores de cartas
let contMovimientos = document.getElementById("contador_movimientos");

// Tiempo
let contTiempo = document.getElementById("contador_tiempo"); // span cuenta tiempo
let segundos = 0; // cuenta de segundos
let temporizador = null; // manejador del temporizador

/***** FIN DECLARACIÓN DE VARIABLES GLOBALES *****/

// El juego arranca ya al cargar la página: no se espera a reiniciar
ComenzarJuego();

// Desarrollo del comienzo de juego
function ComenzarJuego() {
  // llamado a la funcion de limpieza de variables
  limpiezaVariables();
  
  // llamado a la funcion de creacion del mazo inicial
  CrearMazoInicial();

  // llamado a la funcion para barajar el mazo inicial
  mazoBarajado = BarajarMazo(mazoInicial);

  // Llamado a la funcion para colocar el mazo en el tapete inicial
  ColocarTapeteInicial(mazoBarajado);

  // Llamado a la funcion que arranca el conteo de tiempo
  ArrancarTiempo();
} 

/*** !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! **/
/*** !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! FUNCIONES !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! **/
/*** !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! **/

//Funcion de limpieza de variables
function limpiezaVariables()
{
   mazoInicial = [];
   mazoBarajado = [];
   tapeteInicial.innerHTML = "";
   tapeteSobrantes.innerHTML = "";
   tapeteReceptor1.innerHTML = "";
   tapeteReceptor2.innerHTML = "";
   tapeteReceptor3.innerHTML = "";
   tapeteReceptor4.innerHTML = "";
   contMovimientos.innerHTML = 0;
   barajaInicio = parseInt(baraja1.value);
   barajaFin = parseInt(baraja2.value);  
}

// Funcion para crear el mazo inicial
function CrearMazoInicial() 
{
   k = 1;
   for (let i = barajaInicio; i <= barajaFin; i++) {
      for (let j = 0; j < palos.length; j++) {
         const baraja = 
         {
            id: "baraja-" + k,
            numero: i,
            color: colores[palos[j]],
            palo: palos[j],
            img: `./imagenes/baraja/${i}-${palos[j]}.png`,
            cara_frontal: false,
            tapete: "inicial",
         };
         k += 1;
         mazoInicial.push(baraja);
      }
   }
 }

 // Funcion para barajar aleatoriamente el mazo inicial
function BarajarMazo(mazo) 
{
   const nuevoMazo = mazo
     .map((value) => ({ value, sort: Math.random() }))
     .sort((a, b) => a.sort - b.sort)
     .map(({ value }) => value);
   return nuevoMazo;
 }

// Funcion para colocar el mazo en el tapete inicial
function ColocarTapeteInicial(mazo) 
{
   for (let i = 0; i < mazoBarajado.length; i++) 
   {
      const ultimo = i === mazoBarajado.length - 1;
      const baraja = mazoBarajado[i];
      if (ultimo) 
      {
         baraja.cara_frontal = true;
      }
      const barajaHTML = CrearBarajaHTML(baraja);
      tapeteInicial.appendChild(barajaHTML);
   }
   MoverBarajas();
   const contInic = document.createElement("span");
   tapeteInicial.appendChild(contInic);
   contInic.setAttribute("id", "contador_inicial");
   let contInicial = document.getElementById("contador_inicial");
   contInicial.innerHTML = tapeteInicial.children.length - 1;
   contInicial.classList.add("contador");

   ContadorCrear(tapeteSobrantes, "contador_sobrantes");
   ContadorCrear(tapeteReceptor1, "contador_receptor1");
   ContadorCrear(tapeteReceptor2, "contador_receptor2");
   ContadorCrear(tapeteReceptor3, "contador_receptor3");
   ContadorCrear(tapeteReceptor4, "contador_receptor4");
}

// Funcion para crear la baraja en HTML
function CrearBarajaHTML(baraja) 
{
   const imagen = document.createElement("img");
   if (baraja.cara_frontal === true) 
   {
      imagen.src = baraja.img;
   } else 
   {
    imagen.src = "../../../cardGame/Actividad1/imagenes/baraja/lomo.png";
   }
   imagen.setAttribute("id", baraja.id);
   imagen.dataset.numero = baraja.numero;
   imagen.dataset.color = baraja.color;
   imagen.dataset.palo = baraja.palo;
   imagen.dataset.img = baraja.img;
   imagen.dataset.cara_frontal = baraja.cara_frontal;
   imagen.dataset.tapete = baraja.tapete;
   imagen.classList.add("estilobaraja");
   imagen.setAttribute("draggable", false);
   imagen.onclick = () => 
   {
      ComprobarBarajaClick(imagen);
   };
   return imagen;
}

// Funcion que verificar a que carta se dio un click
function ComprobarBarajaClick(baraja) 
{
   if (baraja.dataset.cara_frontal == "true") {
      const selecionado = document.querySelectorAll("img.estilobarajaclick");
      if (selecionado.length > 0) 
      {
         selecionado[0].className = " estilobaraja";
      }
      
      HabilitarMovimiento(baraja);
   }
}

// Funcion que arranca el conteo de tiempo
function ArrancarTiempo() {
   if (temporizador) clearInterval(temporizador);
   let hms = function () 
   {
      let seg = Math.trunc(segundos % 60);
      let min = Math.trunc((segundos % 3600) / 60);
      let hor = Math.trunc((segundos % 86400) / 3600);
      let tiempo =
         (hor < 10 ? "0" + hor : "" + hor) +
         ":" +
         (min < 10 ? "0" + min : "" + min) +
         ":" +
         (seg < 10 ? "0" + seg : "" + seg);
      setContador(contTiempo, tiempo);
      segundos++;
   };
   segundos = 0;
   hms(); // Primera visualización 00:00:00
   temporizador = setInterval(hms, 1000);
}

/*** !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! **/
/*** !!!!!!!!!!!!!!!!!!!!!!!!! FUNCIONES PARA EL MOVIMIENTO !!!!!!!!!!!!!!!!!!!!!!!!! **/
/*** !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! **/

// Funcion cuando se comienza a mover 
function ComienzoMovimiento(event) 
{
  event.dataTransfer.setData("text", event.target.id);
}

//Funcion que permite el movimeinto
function PermitirMovimiento(event) 
{
  event.preventDefault();
}

// Funcion cuando se termina de mover
function SoltarMovimiento(event) 
{
   event.preventDefault();
   var idBaraja = event.dataTransfer.getData("text");
   var barajaMovida = document.getElementById(idBaraja);
   tapeteInicio = barajaMovida.offsetParent.id;
   var tapeteFinal = event.target;

   switch (tapeteFinal.id) {
      case "sobrantes":
         barajaMovida = document.getElementById(idBaraja);
         AceptaBaraja(tapeteFinal, barajaMovida);
         MostrarContadores(tapeteSobrantes, "contador_sobrantes");
         MostrarContadores(tapeteInicial, "contador_inicial");
         break;
      case "receptor1":
         Reglas (tapeteReceptor1,tapeteFinal,barajaMovida,"contador_receptor1")
         break;
      case "receptor2":
         Reglas (tapeteReceptor2,tapeteFinal,barajaMovida,"contador_receptor2")
         break;
      case "receptor3":
         Reglas (tapeteReceptor3,tapeteFinal,barajaMovida,"contador_receptor3")
         break;
      case "receptor4":
         Reglas (tapeteReceptor4,tapeteFinal,barajaMovida,"contador_receptor4")
         break;
      default:
   }

   let continicial = document.getElementById("contador_inicial");
   let contsobrantes = document.getElementById("contador_sobrantes");
   if(continicial.innerHTML === "0" && contsobrantes.innerHTML === "0")
   {
      $("#staticBackdrop").modal("show");
      
      indicadorMovimiento.innerHTML = contMovimientos.innerHTML;
      indicadorTiempo.innerHTML = contTiempo.innerHTML;
   }
}

// Funcion de las reglas que rigen el movimiento
function Reglas (tapete,tapeteFinal,baraja,nombrecontador)
{
   const imagenes = tapete.querySelectorAll("img.estilobaraja").length;
   if (imagenes == 0 && baraja.dataset.numero == barajaFin) 
   {
      AceptaBaraja(tapeteFinal, baraja);      
   } else 
   {
      const ultimo = tapete.lastElementChild;
      const ultimonumero = ultimo.dataset.numero;
      const ultimocolor = ultimo.dataset.color;
      if (baraja.dataset.numero == ultimonumero - 1 && baraja.dataset.color != ultimocolor) 
      {
         AceptaBaraja(tapeteFinal, baraja);
      }
   }
   MostrarContadores(tapete, nombrecontador);
   MostrarContadores(tapeteInicial, "contador_inicial");
   MostrarContadores(tapeteSobrantes, "contador_sobrantes");
}

// Funcion que acepta el movimiento de la baraja
function AceptaBaraja(tapeteFinal, barajaMovida) 
{
   tapeteFinal.appendChild(barajaMovida);
   barajaMovida.style.top = `35px`;
   barajaMovida.style.left = `40px`;
   barajaMovida.className = " estilobaraja";

   if (tapeteInicio == "inicial") {
      const ultima = tapeteInicial.lastElementChild.previousElementSibling;
      if(ultima != null)
      {
         ultima.src = ultima.dataset.img;
         ultima.dataset.cara_frontal = true;
      }
   }
   IngresarMovimiento();
   HabilitarMovimiento(barajaMovida);
}


// Funcion que crea los indicadores de los contadores
function ContadorCrear(Tapete, nombre) 
{   
   const vcontador = document.createElement("span");
   Tapete.appendChild(vcontador);
   vcontador.setAttribute("id", nombre);
   let contadorhtml = document.getElementById(nombre);
   contadorhtml.innerHTML = Tapete.children.length - 1;
   contadorhtml.classList.add("contador");
}

// Funcion que incrementa y muestra los movimientos
function IngresarMovimiento() 
{
   contadorMovimientos = contadorMovimientos +1;
   contMovimientos.innerHTML = contadorMovimientos;
}

// Funcion que solo permite el movimiento entre el Inicial o Sobrantes a los receptores
function HabilitarMovimiento(barajaMovida) 
{
   const variable = document.getElementById(barajaMovida.id)
   const padre = variable.parentElement.id;
   if (padre === "inicial"  || padre === "sobrantes")
   {
      barajaMovida.className += " estilobarajaclick";
      barajaMovida.setAttribute("draggable", true);
      barajaMovida.setAttribute("ondragstart", "ComienzoMovimiento(event)");
   }else
   {
      barajaMovida.className = " estilobaraja";
      barajaMovida.setAttribute("draggable", false);
      barajaMovida.removeAttribute("ondragstart");
   }   
}

// Funcion que muestra los valores de los contadores
function MostrarContadores(Tapete, nombre) 
{
   let contSobrantes = document.getElementById(nombre);
   imagenes = Tapete.querySelectorAll("img.estilobaraja").length;
   contSobrantes.innerHTML = imagenes;
   
   if (nombre === "contador_inicial" && imagenes === 0 ) 
   {
      VolverBarajas();
      contSobrantes.innerHTML = Tapete.querySelectorAll("img.estilobaraja").length;
   }
}

// Funcion que mueve las cartas de sobrantes a inicio 
function VolverBarajas() 
{
   var hijos = tapeteSobrantes.querySelectorAll(".estilobaraja");
   hijos.forEach(function (img) 
   {
    tapeteInicial.appendChild(img);
   });
   MoverBarajas()
}

// Funcion que mueve las cartas de 5px a la derecha y para abajo 
function MoverBarajas() 
{
   const imagenes = tapeteInicial.getElementsByTagName("img");
   for (let i = 0; i < imagenes.length; i++) 
   {
      const barajaHTML = imagenes[i];
      barajaHTML.style.top = `${i * paso}px`;
      barajaHTML.style.left = `${i * paso}px`;
   }
}


// Funcion que muestra el tiempo
function setContador(contador, valor) {
   contador.innerHTML = valor;
} 

// Funcion que muestra el tiempo
function habilitarBaraja2() 
{   
   // Limpiar opciones anteriores
   baraja2.innerHTML = '';

   // Generar opciones desde el valor seleccionado hasta 12
   for (let i = barajaSeleccionado + 1; i <= 12; i++) {
     const option = document.createElement("option");
     option.value = i;
     option.text = i;
     baraja2.add(option);
   }

   // Habilitar el segundo select
   baraja2.disabled = false;
}