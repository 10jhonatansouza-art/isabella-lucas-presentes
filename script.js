const API = "https://script.google.com/macros/s/AKfycbygrkJlhyTt86s1yKamXg5aL3anLXZaxxaAGh0oKkAxZqe23WV1oTjZXEC-lHSKKTRK/exec";

let presentes = [];
let presentesFiltrados = [];
let selecionado = null;

// ------------------------
// Carrega dados da planilha
// ------------------------
async function carregar() {
  const resposta = await fetch(API);
  presentes = await resposta.json();

  presentes.sort((a, b) => {
    if (a.categoria === b.categoria) {
      return a.presente.localeCompare(b.presente);
    }
    return a.categoria.localeCompare(b.categoria);
  });

  presentesFiltrados = [...presentes];
  desenhar();
}

// ------------------------
// Desenha a página
// ------------------------
function desenhar() {

  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  const livres = presentes.filter(p => p.status === "disponivel").length;

  document.getElementById("livres").textContent = livres;
  document.getElementById("reservados").textContent = presentes.length - livres;

  const categorias = [...new Set(presentesFiltrados.map(p => p.categoria))];

  categorias.forEach(cat => {

    const titulo = document.createElement("div");
    titulo.className = "categoria";
    titulo.textContent = cat;
    lista.appendChild(titulo);

    presentesFiltrados
      .filter(p => p.categoria === cat)
      .forEach(item => {

        const card = document.createElement("div");
        card.className = item.status === "reservado"
          ? "card reservado"
          : "card";

        card.innerHTML = `
          <div class="left-side">
            <div class="check"></div>

            <div>
              <div class="nome">${item.presente}</div>

              ${
                item.status === "reservado"
                ? `<div class="by">Reservado por ${item.nome}</div>`
                : ""
              }

            </div>
          </div>

          <button
            ${item.status === "reservado" ? "disabled" : ""}
            onclick="abrir(${item.id})">

            ${item.status === "reservado" ? "Reservado" : "Escolher"}

          </button>
        `;

        lista.appendChild(card);

      });

  });

}

// ------------------------
// Pesquisa
// ------------------------
function filtrar() {

  const termo = document
    .getElementById("busca")
    .value
    .toLowerCase();

  presentesFiltrados = presentes.filter(p =>
    p.presente.toLowerCase().includes(termo)
  );

  desenhar();

}

// ------------------------
// Modal
// ------------------------
function abrir(id){

  selecionado = id;

  const item = presentes.find(i => i.id == id);

  document.getElementById("presenteSelecionado").innerText = item.presente;

  document.getElementById("nome").value = "";
  document.getElementById("anonimo").checked = false;

  document.getElementById("modal").style.display = "flex";

}

function fechar() {

  document.getElementById("modal").style.display = "none";

}

// ------------------------
// Reserva
// ------------------------
async function confirmar(){

  const nome = document.getElementById("nome").value.trim();
  const anonimo = document.getElementById("anonimo").checked;

  if(!anonimo && nome === ""){
    alert("Digite seu nome ou marque 'Reservar como anônimo'.");
    return;
  }

  const resposta = await fetch(API,{
    method:"POST",
    body: JSON.stringify({
      id: selecionado,
      nome: nome,
      anonimo: anonimo
    })
  });

  const resultado = await resposta.json();

  if(!resultado.ok){
    alert(resultado.erro || "Erro ao reservar.");
    return;
  }

  fechar();
  await carregar();
  mostrarSucesso();

}
// ------------------------
// Contagem regressiva
// ------------------------
const casamento = new Date("2026-10-16T00:00:00");

function atualizarContagem() {

  const agora = new Date();

  const dias = Math.ceil((casamento - agora) / 86400000);

  document.getElementById("countdown").innerHTML =
    `Faltam <b>${dias}</b> dias para o grande dia`;

}

atualizarContagem();
setInterval(atualizarContagem, 60000);
function mostrarSucesso(){

const t=document.getElementById("toast");

t.classList.add("show");

setTimeout(()=>{

t.classList.remove("show");

},3000);

}
// Inicialização
carregar();