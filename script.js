const API = "https://script.google.com/macros/s/AKfycbygrkJlhyTt86s1yKamXg5aL3anLXZaxxaAGh0oKkAxZqe23WV1oTjZXEC-lHSKKTRK/exec";

let presentes = [];
let presentesFiltrados = [];
let selecionado = null;

async function carregar(){

    const resposta = await fetch(API);

    presentes = await resposta.json();

    presentes.sort((a,b)=>{

        if(a.categoria===b.categoria){

            return a.presente.localeCompare(b.presente);

        }

        return a.categoria.localeCompare(b.categoria);

    });

    presentesFiltrados=[...presentes];

    desenhar();

}

function desenhar(){

    const lista=document.getElementById("lista");

    lista.innerHTML="";

    const livres =
        presentes.filter(p=>p.status==="disponivel").length;

    document.getElementById("livres").textContent=livres;
    document.getElementById("reservados").textContent=
        presentes.length-livres;

    const categorias=[
        ...new Set(
            presentesFiltrados.map(p=>p.categoria)
        )
    ];

    categorias.forEach(cat=>{

        const titulo=document.createElement("div");
        titulo.className="categoria";
        titulo.textContent=cat;

        lista.appendChild(titulo);

        presentesFiltrados
        .filter(p=>p.categoria===cat)
        .forEach(item=>{

            const card=document.createElement("div");

            card.className=
                "card "+(item.status==="reservado"
                ? "reservado"
                : "");

            card.innerHTML=`

                <div class="left-side">

                    <div class="check"></div>

                    <div>

                        <div class="nome">
                            ${item.presente}
                        </div>

                        ${
                            item.status==="reservado"
                            ? `<div class="by">
                                Reservado por ${item.nome}
                               </div>`
                            : ""
                        }

                    </div>

                </div>

                <button
                    ${item.status==="reservado"
                    ? "disabled"
                    : ""}
                    onclick="abrir(${item.id})">

                    ${
                        item.status==="reservado"
                        ? "Reservado"
                        : "Escolher"
                    }

                </button>
            `;

            lista.appendChild(card);

        });

    });

}

function filtrar(){

    const termo=
        document
        .getElementById("busca")
        .value
        .toLowerCase();

    presentesFiltrados=
        presentes.filter(p=>

            p.presente
            .toLowerCase()
            .includes(termo)

        );

    desenhar();

}

function abrir(id){

    selecionado=id;

    const item=
        presentes.find(p=>p.id===id);

    document.getElementById(
        "presenteSelecionado"
    ).textContent=item.presente;

    document.getElementById("modal")
        .style.display="flex";

}

function fechar(){

    document.getElementById("modal")
        .style.display="none";

}

async function confirmar(){

    const nome=
        document.getElementById("nome")
        .value
        .trim();

    if(nome===""){

        alert("Digite seu nome.");

        return;

    }

    await fetch(API,{
        method:"POST",
        body:JSON.stringify({
            id:selecionado,
            nome:nome
        })
    });

    document.getElementById("nome").value="";

    fechar();

    carregar();

}

const casamento=
    new Date("2026-10-16T00:00:00");

function atualizarContagem(){

    const agora=new Date();

    const diff=casamento-agora;

    const dias=
        Math.ceil(diff/86400000);

    document.getElementById(
        "countdown"
    ).innerHTML=
    `Faltam <b>${dias}</b> dias para o grande dia`;

}

atualizarContagem();

setInterval(atualizarContagem,60000);

carregar();