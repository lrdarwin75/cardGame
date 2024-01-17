/***** INICIO DECLARACIÓN DE VARIABLES GLOBALES *****/

// Variables simples
let barajaClick = null; //Contiene la baraja que fue dada click en primer lugar


// Array de palos
let palos = ["viu", "cua", "hex", "cir"];

// Array de colores
let colores = {
   viu: "naranja",
   cua: "naranja",
   hex: "gris",
   cir: "gris",
};

// Array de número de cartas
//let numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
// En las pruebas iniciales solo se trabajará con cuatro cartas por palo:
let numeros = [9, 10, 11, 12];

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
let mazoSobrantes = [];
let mazoReceptor1 = [];
let mazoReceptor2 = [];
let mazoReceptor3 = [];
let mazoReceptor4 = [];

// Contadores de cartas
let contInicial = document.getElementById("contador_inicial");
let contSobrantes = document.getElementById("contador_sobrantes");
let contReceptor1 = document.getElementById("contador_receptor1");
let contReceptor2 = document.getElementById("contador_receptor2");
let contReceptor3 = document.getElementById("contador_receptor3");
let contReceptor4 = document.getElementById("contador_receptor4");
let contMovimientos = document.getElementById("contador_movimientos");

// Tiempo
let contTiempo = document.getElementById("contador_tiempo"); // span cuenta tiempo
let segundos = 0; // cuenta de segundos
let temporizador = null; // manejador del temporizador

// Boton de reinicio
let btnReiniciar = document.getElementById("boton_reiniciar"); // btn reinicio juego

/***** FIN DECLARACIÓN DE VARIABLES GLOBALES *****/

// Rutina asociada a boton reset
/*** !!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! **/

btnReiniciar.onclick = () => {
   //tapeteInicial = [];
   mazoInicial = [];
   mazoBarajado = [];

   ComenzarJuego();
  
};

// El juego arranca ya al cargar la página: no se espera a reiniciar
/*** !!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! **/

// Desarrollo del comienzo de juego
function ComenzarJuego() {
  /* Crear baraja, es decir crear el mazoInicial. Este será un array cuyos 
	elementos serán elementos HTML <img>, siendo cada uno de ellos una carta.
	Sugerencia: en dos bucles for, bárranse los "palos" y los "numeros", formando
	oportunamente el nombre del fichero png que contiene a la carta (recuérdese poner
	el path correcto en la URL asociada al atributo src de <img>). Una vez creado
	el elemento img, inclúyase como elemento del array mazoInicial. 
	*/

  /*** !!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! **/
  // Creacion del mazo inicial
  k=1;
   for (let i = 1; i <= 12; i++) {
      for (let j = 0; j < palos.length; j++) {
         const baraja = {
            id: "baraja-" + k,
            numero: i,
            color: colores[palos[j]],
            palo: palos[j],
            img: `./imagenes/baraja/${i}-${palos[j]}.png`,
            cara_frontal: false,
            
         };
         k += 1;
         mazoInicial.push(baraja);
      }
   }

  // Barajar el mazo inicial
   mazoBarajado = BarajarMazo(mazoInicial);

  // Colocar el mazo barajado en el tapete inicial
   for (let i = 0; i < mazoBarajado.length; i++) {
      
      const ultimo = i === mazoBarajado.length-1;
      const baraja = mazoBarajado[i];
      if(ultimo){
         baraja.cara_frontal = true;
      }
      const barajaHTML = CrearBarajaHTML (baraja);
      barajaHTML.style.top = `${i * paso}px`;
      barajaHTML.style.left = `${i * paso}px`;
      tapeteInicial.appendChild(barajaHTML);
   }

   // Colocar el mazo barajado en el tapete inicial


   
  // Puesta a cero de contadores de mazos
  /*** !!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! **/

  // Arrancar el conteo de tiempo
  /*** !!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! **/
} // comenzarJuego


/**
	Se debe encargar de arrancar el temporizador: cada 1000 ms se
	debe ejecutar una función que a partir de la cuenta autoincrementada
	de los segundos (segundos totales) visualice el tiempo oportunamente con el 
	format hh:mm:ss en el contador adecuado.

	Para descomponer los segundos en horas, minutos y segundos pueden emplearse
	las siguientes igualdades:

	segundos = truncar (   segundos_totales % (60)                 )
	minutos  = truncar ( ( segundos_totales % (60*60) )     / 60   )
	horas    = truncar ( ( segundos_totales % (60*60*24)) ) / 3600 )

	donde % denota la operación módulo (resto de la división entre los operadores)

	Así, por ejemplo, si la cuenta de segundos totales es de 134 s, entonces será:
	   00:02:14

	Como existe la posibilidad de "resetear" el juego en cualquier momento, hay que 
	evitar que exista más de un temporizador simultáneo, por lo que debería guardarse
	el resultado de la llamada a setInterval en alguna variable para llamar oportunamente
	a clearInterval en su caso.   
*/

/*** !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! **/
/*** !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! FUNCIONES !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! **/
/*** !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! **/

// Da comienzo al temporizador
function arrancarTiempo() {
  /*** !!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! **/
   if (temporizador) clearInterval(temporizador);
   let hms = function () {
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

/**
	Si mazo es un array de elementos <img>, en esta rutina debe ser
	reordenado aleatoriamente. Al ser un array un objeto, se pasa
	por referencia, de modo que si se altera el orden de dicho array
	dentro de la rutina, esto aparecerá reflejado fuera de la misma.
*/

// Funcion para barajar aleatoriamente el mazo de barajas
function BarajarMazo(mazo) {
   const nuevoMazo = mazo
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
   return nuevoMazo;
}

// Funcion para crear la baraja en HTML
function CrearBarajaHTML(baraja) {
   const imagen = document.createElement("img");
   
   if (baraja.cara_frontal === true) {
      imagen.src = baraja.img;
   } else {
      imagen.src = "../../../cardGame/Actividad1/imagenes/baraja/lomo.png";
   }
   imagen.setAttribute('id', baraja.id); 
   imagen.dataset.numero = baraja.numero;
   imagen.dataset.color = baraja.color;
   imagen.dataset.palo = baraja.palo;
   imagen.dataset.img = baraja.img;
   imagen.dataset.cara_frontal = baraja.cara_frontal;
   imagen.classList.add("estilobaraja");
   imagen.setAttribute('draggable', false);
   //Revisar si es necesario
   imagen.onclick = () => {
      ComprobarBarajaClick(imagen)
   }
   return imagen;
}


// Revisar tal vez no se necesite Verificar que carta se dio un click
function ComprobarBarajaClick(baraja) {
   if ( baraja.dataset.cara_frontal == "true") {
      baraja.className += " estilobarajaclick";
      baraja.setAttribute('draggable', true);
      baraja.setAttribute('ondragstart', "drag(event)");
   }
}

// Funcion para mover las cartas
function allowDrop(ev) {
   ev.preventDefault();
}

function drag(ev) {
   ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
   ev.preventDefault();
   var data = ev.dataTransfer.getData("text");
   var draggedElement = document.getElementById(data);
   var targetDiv = ev.target;

   if(targetDiv.id === 'sobrantes') {
      targetDiv.appendChild(draggedElement);
      baraja.style.top = `0px`;
      //baraja.style.left = `0px`;
   }
}




/**
 	En el elemento HTML que representa el tapete inicial (variable tapeteInicial)
	se deben añadir como hijos todos los elementos <img> del array mazo.
	Antes de añadirlos, se deberían fijar propiedades como la anchura, la posición,
	coordenadas top y left, algun atributo de tipo data-...
	Al final se debe ajustar el contador de cartas a la cantidad oportuna
*/
function cargarTapeteInicial(mazo) {
  /*** !!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! **/
} // cargarTapeteInicial

/**
 	Esta función debe incrementar el número correspondiente al contenido textual
   	del elemento que actúa de contador
*/
function incContador(contador) {
  /*** !!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! **/
} // incContador

/**
	Idem que anterior, pero decrementando 
*/
function decContador(contador) {
  /*** !!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! ***/
} // decContador

/**
	Similar a las anteriores, pero ajustando la cuenta al
	valor especificado
*/
function setContador(contador, valor) {
  /*** !!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! **/
} // setContador
