const API = "https://script.google.com/macros/s/AKfycbx2QDRO0EJYDcvPH_0JJPM8qk-wupvmkJSaDVYhm-8/exec";

let presentes = [];
let selecionado = null;

async function carregar() {
  const resposta = await fetch(API);
  presentes = await resposta.json();
  desenhar();
}

function desenhar() {
  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  const categorias = [...new Set(presentes.map(p => p.categoria))];

  categorias.forEach(cat => {
    lista.innerHTML += `<div class="categoria">${cat}</div>`;

    presentes
      .filter(p => p.categoria === cat)
      .forEach(item => {
        lista.innerHTML += `
        <div class="card ${item.status}">
          <div>
            <div class="nome">${item.presente}</div>
            ${
              item.status === "reservado"
                ? `<small>Reservado por ${item.nome}</small>`
                : ""
            }
          </div>

          <button
            ${item.status === "reservado" ? "disabled" : ""}
            onclick="abrir(${item.id})">

            ${
              item.status === "reservado"
                ? "Reservado"
                : "Escolher"
            }

          </button>
        </div>`;
      });
  });
}

function abrir(id) {
  selecionado = id;

  const item = presentes.find(p => p.id === id);

  document.getElementById("presenteSelecionado").innerText = item.presente;
  document.getElementById("modal").style.display = "flex";
}

function fechar() {
  document.getElementById("modal").style.display = "none";
}

async function confirmar() {

  const nome = document.getElementById("nome").value;

  if (!nome) {
    alert("Digite seu nome.");
    return;
  }

  await fetch(API, {
    method: "POST",
    body: JSON.stringify({
      id: selecionado,
      nome: nome
    })
  });

  document.getElementById("nome").value = "";

  fechar();

  carregar();
}

carregar();