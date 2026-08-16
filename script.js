const API = "https://script.google.com/macros/s/AKfycbygrkJlhyTt86s1yKamXg5aL3anLXZaxxaAGh0oKkAxZqe23WV1oTjZXEC-lHSKKTRK/exec";

let presentes = [];
let presentesFiltrados = [];
let selecionado = null;
let mensagens = [];

// ------------------------
// Carrega dados da planilha
// ------------------------
async function carregar() {

  const resposta = await fetch(API);
  const dados = await resposta.json();

  // Compatibilidade com as duas versões da API
  if (Array.isArray(dados)) {
    presentes = dados;
    mensagens = [];
  } else {
    presentes = dados.presentes || [];
    mensagens = dados.mensagens || [];
  }

  presentes.sort((a, b) => {
    if (a.categoria === b.categoria) {
      return a.presente.localeCompare(b.presente);
    }
    return a.categoria.localeCompare(b.categoria);
  });

  presentesFiltrados = [...presentes];

  desenhar();
  desenharMensagens();
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
function desenharMensagens(){

const mural=document.getElementById("mural");

mural.innerHTML="";

if(mensagens.length===0){

mural.innerHTML=`
<div class="msg-card">
<p>Seja a primeira pessoa a deixar uma mensagem para o casal ❤️</p>
</div>
`;

return;

}

mensagens.reverse().forEach(item=>{

mural.innerHTML += `
<div class="msg-card">

<p>"${item.mensagem}"</p>

<strong>— ${item.nome}</strong>

</div>
`;

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

  selecionado=id;

  const item=presentes.find(p=>p.id===id);

  document.getElementById("presenteSelecionado").textContent=item.presente;

  document.getElementById("nome").value="";
  document.getElementById("mensagem").value="";
  document.getElementById("anonimo").checked=false;
  document.getElementById("contador").textContent="0";

  document.getElementById("modal").style.display="flex";

}

function fechar() {

  document.getElementById("modal").style.display = "none";

}

// ------------------------
// Reserva
// ------------------------
async function confirmar() {

  const nome = document.getElementById("nome").value.trim();
  const anonimo = document.getElementById("anonimo").checked;
  const mensagem = document.getElementById("mensagem").value.trim();

  if (!anonimo && nome === "") {
    alert("Digite seu nome ou marque a opção de anonimato.");
    return;
  }

  const resposta = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      id: selecionado,
      nome: nome,
      anonimo: anonimo,
      mensagem: mensagem
    })
  });

  const resultado = await resposta.json();

  if (!resultado.ok) {
    alert(resultado.erro || "Erro ao reservar.");
    return;
  }

  fechar();
  carregar();
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

document.getElementById("mensagem")
.addEventListener("input",e=>{

document.getElementById("contador").textContent=
e.target.value.length;

});
function mostrarSucesso(){

const t=document.getElementById("toast");

t.classList.add("show");

setTimeout(()=>{

t.classList.remove("show");

},3000);

}
// Inicialização
carregar();