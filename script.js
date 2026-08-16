const API="https://script.google.com/macros/s/AKfycbygrkJlhyTt86s1yKamXg5aL3anLXZaxxaAGh0oKkAxZqe23WV1oTjZXEC-lHSKKTRK/exec";

let presentes=[];
let presentesFiltrados=[];
let selecionado=null;

async function carregar(){

const r=await fetch(API);

presentes=await r.json();

presentes.sort((a,b)=>{

if(a.categoria===b.categoria)
return a.presente.localeCompare(b.presente);

return a.categoria.localeCompare(b.categoria);

});

presentesFiltrados=[...presentes];

desenhar();

}

function desenhar(){

const lista=document.getElementById("lista");

lista.innerHTML="";

const livres=presentes.filter(i=>i.status==="disponivel").length;

document.getElementById("livres").textContent=livres;

document.getElementById("reservados").textContent=presentes.length-livres;

const categorias=[...new Set(presentesFiltrados.map(i=>i.categoria))];

categorias.forEach(cat=>{

const t=document.createElement("div");

t.className="categoria";

t.textContent=cat;

lista.appendChild(t);

presentesFiltrados
.filter(i=>i.categoria===cat)
.forEach(item=>{

const card=document.createElement("div");

card.className=item.status==="reservado"
?"card reservado":"card";

card.innerHTML=`
<div>

<div class="nome">${item.presente}</div>

${item.status==="reservado"
?`<div class="by">Reservado por ${item.nome}</div>`
:""}

</div>

<button
${item.status==="reservado"?"disabled":""}
onclick="abrir(${item.id})">

${item.status==="reservado"?"Reservado":"Escolher"}

</button>
`;

lista.appendChild(card);

});

});

}

function filtrar(){

const t=document.getElementById("busca").value.toLowerCase();

presentesFiltrados=presentes.filter(i=>
i.presente.toLowerCase().includes(t)
);

desenhar();

}

function abrir(id){

selecionado=id;

const item=presentes.find(i=>i.id===id);

document.getElementById("presenteSelecionado").textContent=item.presente;

document.getElementById("nome").value="";

document.getElementById("anonimo").checked=false;

document.getElementById("modal").style.display="flex";

}

function fechar(){

document.getElementById("modal").style.display="none";

}

async function confirmar(){

const nome=document.getElementById("nome").value.trim();

const anonimo=document.getElementById("anonimo").checked;

if(!anonimo && nome===""){
alert("Digite seu nome ou marque anonimato.");
return;
}

const resposta=await fetch(API,{
method:"POST",
body:JSON.stringify({
id:selecionado,
nome,
anonimo
})
});

const resultado=await resposta.json();

if(!resultado.ok){
alert(resultado.erro);
return;
}

fechar();

await carregar();

mostrarSucesso();

}

function mostrarSucesso(){

const t=document.getElementById("toast");

t.classList.add("show");

setTimeout(()=>{

t.classList.remove("show");

},2500);

}

const casamento=new Date("2026-10-16");

function atualizarContagem(){

const dias=Math.ceil((casamento-new Date())/86400000);

document.getElementById("countdown").innerHTML=
`Faltam <b>${dias}</b> dias para o grande dia`;

}

atualizarContagem();

setInterval(atualizarContagem,60000);

carregar();