const ABA = "Página1";

function doGet() {
  const sh = SpreadsheetApp.getActive().getSheetByName(ABA);
  const dados = sh.getDataRange().getValues();

  const lista = [];

  for (let i = 1; i < dados.length; i++) {
    const anonimo = dados[i][4] === "SIM";

    lista.push({
      id: i,
      categoria: dados[i][0],
      presente: dados[i][1],
      status: dados[i][2] === "Reservado" ? "reservado" : "disponivel",
      nome: anonimo ? "Anônimo" : (dados[i][3] || "")
    });
  }

  return ContentService
    .createTextOutput(JSON.stringify(lista))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const sh = SpreadsheetApp.getActive().getSheetByName(ABA);
  const body = JSON.parse(e.postData.contents);

  const linha = Number(body.id) + 1;

  if (sh.getRange(linha,3).getValue() === "Reservado") {
    return ContentService
      .createTextOutput(JSON.stringify({
        ok:false,
        erro:"Este presente já foi reservado."
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  sh.getRange(linha,3).setValue("Reservado");

  if (body.anonimo) {
    sh.getRange(linha,4).setValue("Anônimo");
    sh.getRange(linha,5).setValue("SIM");
  } else {
    sh.getRange(linha,4).setValue(body.nome);
    sh.getRange(linha,5).setValue("NÃO");
  }

  return ContentService
    .createTextOutput(JSON.stringify({ok:true}))
    .setMimeType(ContentService.MimeType.JSON);
}
