
const API =
"https://script.google.com/macros/s/AKfycbygrkJlhyTt86s1yKamXg5aL3anLXZaxxaAGh0oKkAxZqe23WV1oTjZXEC-lHSKKTRK/exec";

let presentes = [];

let selecionado = null;

async function carregar(){

  const r = await fetch(API);

  presentes = await r.json();

  desenhar();

}

function desenhar(){

  const lista = document.getElementById("lista");

  lista.innerHTML = "";

  const categorias =
    [...new Set(presentes.map(i=>i.categoria))];

  categorias.forEach(cat=>{

    lista.innerHTML +=
      `<div class="categoria">${cat}</div>`;

    presentes
    .filter(i=>i.categoria===cat)
    .forEach(item=>{

      lista.innerHTML += `

      <div class="card ${item.status}">

        <div>

          <div class="nome">
            ${item.presente}
          </div>

          ${
            item.status=="reservado"
            ? `<small>Reservado por ${item.nome}</small>`
            : ""
          }

        </div>

        <button
          ${item.status=="reservado"?"disabled":""}
          onclick="abrir('${item.id}')">

          ${
            item.status=="reservado"
            ? "Reservado"
            : "Escolher"
          }

        </button>

      </div>
      `;

    });

  });

}

function abrir(id){

  selecionado = id;

  const item =
    presentes.find(i=>i.id==id);

  document.getElementById("presenteSelecionado")
    .innerText = item.presente;

  document.getElementById("modal")
    .style.display = "flex";

}

function fechar(){

  document.getElementById("modal")
    .style.display = "none";

}

async function confirmar(){

  const nome =
    document.getElementById("nome").value;

  if(!nome){

    alert("Digite seu nome");

    return;

  }

  await fetch(API,{
    method:"POST",
    body:JSON.stringify({
      id:selecionado,
      nome
    })
  });

  fechar();

  carregar();

}

carregar();