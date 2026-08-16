const API = "https://script.google.com/macros/s/AKfycbx2QDRO0EJYDcvPH_0JJPM8qk-wupvmkJSaDVYhm-8/exec";
const livres = presentes.filter(p => p.status === "disponivel").length;
const reservados = presentes.length - livres;
const casamento = new Date("2026-10-16T00:00:00");

function atualizarContagem() {

    const agora = new Date();

    const diff = casamento - agora;

    const dias = Math.ceil(diff / (1000 * 60 * 60 * 24));

    document.getElementById("countdown").innerHTML =
        `Faltam <b>${dias}</b> dias para o grande dia`;
}

setInterval(atualizarContagem, 1000);

atualizarContagem();

document.getElementById("livres").textContent = livres;
document.getElementById("reservados").textContent = reservados;

let presentes = [];
let selecionado = null;

async function carregar() {
    const resposta = await fetch(API);
    presentes = await resposta.json();
    desenhar();
}

function desenhar() {
    const livres = presentes.filter(p => p.status === "disponivel").length;

    document.getElementById("livres").textContent = livres;
    document.getElementById("reservados").textContent = presentes.length - livres;
    const lista = document.getElementById("lista");
    lista.innerHTML = "";

    const categorias = [...new Set(presentes.map(p => p.categoria))];

    categorias.forEach(cat => {
        lista.innerHTML += `<div class="categoria">${cat}</div>`;
        presentes.sort((a, b) => {
            if (a.categoria === b.categoria) {
                return a.presente.localeCompare(b.presente);
            }
            return a.categoria.localeCompare(b.categoria);
        });
        presentes
            .filter(p => p.categoria === cat)
            .forEach(item => {
                lista.innerHTML += `
        <div class="card ${item.status}">
          <div>
            <div class="nome">${item.presente}</div>
            ${item.status === "reservado"
                        ? `<small>Reservado por ${item.nome}</small>`
                        : ""
                    }
          </div>

          <button
            ${item.status === "reservado" ? "disabled" : ""}
            onclick="abrir(${item.id})">

            ${item.status === "reservado"
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