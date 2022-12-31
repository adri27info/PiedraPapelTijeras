const contenedoresJuego = document.querySelectorAll("#juego div");
const reglasWin = {
  piedra: "tijeras",
  papel: "piedra",
  tijeras: "papel",
};
const tituloGanador = document.getElementById("titulo_ganador");
const btnReiniciar = document.getElementById("btn_reiniciar");
let textoVictorias = document.getElementById("texto_victorias");
let textoDerrotas = document.getElementById("texto_derrotas");
let db = window.localStorage;
let keysLocalStorage;

btnReiniciar.addEventListener("click", reiniciarJuego);

contenedoresJuego.forEach((element) => {
  element.addEventListener("click", eleccionPlayer);
});

function eleccionPlayer(e) {
  let item = document.getElementById(e.target.id);
  item.classList.add("player_seleccion");
  desactivarClickItems();
}

function desactivarClickItems() {
  contenedoresJuego.forEach((element) => {
    element.removeEventListener("click", eleccionPlayer);
  });
  comprobarContenedoresNoElegidos();
}

function comprobarContenedoresNoElegidos() {
  let arrayItemsNoSeleccionados = [];
  contenedoresJuego.forEach((element, index) => {
    if (!element.childNodes[1].classList.contains("player_seleccion")) {
      arrayItemsNoSeleccionados.push({
        indice: index,
      });
    }
  });
  generarItemAleatorio(arrayItemsNoSeleccionados);
}

function generarItemAleatorio(array) {
  let indices = [];
  array.forEach((element) => {
    indices.push(element.indice);
  });
  let max = Math.max(...indices),
    min = Math.min(...indices),
    numAleatorio = -1;
  while (numAleatorio !== max && numAleatorio !== min) {
    numAleatorio = Math.floor(Math.random() * (max - min + 1) + min);
  }
  eleccionMaquina(numAleatorio);
}

function eleccionMaquina(num) {
  contenedoresJuego.forEach((element, index) => {
    if (index === num) {
      element.childNodes[1].classList.add("maquina_seleccion");
    }
  });
  comprobarGanador();
}

function comprobarGanador() {
  let itemPlayerSeleccionado = document
    .querySelector(".player_seleccion")
    .id.replace("item_", "");
  let itemMaquinaSeleccionado = document
    .querySelector(".maquina_seleccion")
    .id.replace("item_", "");

  for (let key in reglasWin) {
    if (reglasWin[key] === reglasWin[itemPlayerSeleccionado]) {
      if (itemPlayerSeleccionado === reglasWin[itemMaquinaSeleccionado]) {
        actualizarValores("maquina");
      } else {
        actualizarValores("player");
      }
    }
  }
}

function actualizarValores(ganador) {
  keysLocalStorage = Object.keys(db);
  if (db.getItem("player") != null && "player" === ganador) {
    let obj = JSON.parse(db.getItem("player"));
    obj.victorias = obj.victorias + 1;
    console.log("Este es el objeto: ", obj);
    db.setItem(obj.nombre, JSON.stringify(obj));
    mostrarMensajeGanador(ganador);
  }
  if (db.getItem("maquina") != null && "maquina" === ganador) {
    let obj = JSON.parse(db.getItem("maquina"));
    obj.victorias = obj.victorias + 1;
    db.setItem(obj.nombre, JSON.stringify(obj));
    console.log("Este es el objeto: ", obj);
    mostrarMensajeGanador(ganador);
  }
}

function mostrarMensajeGanador(ganador) {
  imprimirValoresActuales();
  tituloGanador.textContent = "Ganador: " + ganador;
  document.querySelector("." + ganador + "_seleccion").classList.add("winner");
  btnReiniciar.classList.remove("ocultar");
}

function reiniciarJuego() {
  window.location.reload();
}

function almacenarValoresIniciales() {
  let objetoPlayer = {
    nombre: "player",
    victorias: 0,
  };
  let objetoMaquina = {
    nombre: "maquina",
    victorias: 0,
  };
  guardarValoresIniciales(objetoPlayer, objetoMaquina);
}

function guardarValoresIniciales(objetoPlayer, objetoMaquina) {
  if (
    JSON.parse(db.getItem(objetoPlayer.nombre)) === null &&
    JSON.parse(db.getItem(objetoMaquina.nombre)) === null
  ) {
    db.setItem(objetoPlayer.nombre, JSON.stringify(objetoPlayer));
    db.setItem(objetoMaquina.nombre, JSON.stringify(objetoMaquina));
  }
  imprimirValoresActuales();
}

function imprimirValoresActuales() {
  keysLocalStorage = Object.keys(db);
  if (db.getItem("player") != null) {
    let obj = JSON.parse(db.getItem("player"));
    textoVictorias.textContent = obj.victorias;
  } else {
    alert("No se encontro el obj player en localStorage");
  }
  if (db.getItem("maquina") != null) {
    let obj = JSON.parse(db.getItem("maquina"));
    textoDerrotas.textContent = obj.victorias;
  } else {
    alert("No se encontro el obj maquina en localStorage");
  }
}

almacenarValoresIniciales();
