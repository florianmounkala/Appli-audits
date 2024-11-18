//Recuperation de l'auditId dans l'url
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const auditId = urlParams.get("auditId");

// fonction
// fonction de recuperation des informations de l'audit
function getAuditInfo(auditId) {
  fetch(`/api/Audit/${auditId}`)
    .then((response) => response.text())
    .then((data) => {
      const separatedData = data.split("!,!");
      return `Tableau des questions et réponses de l'audit ${separatedData[0]} du client ${separatedData[3]} , crée le ${separatedData[1]} et soumis le ${separatedData[2]}`;
    })
    .catch((error) => console.error(error));
}
//Recuperation des reponses de l'audit
const valeurcible = "Toutes les questions";
fetch(`/api/Answer/GetAnswersAndQuestionByAuditId?idAudit=${auditId}`)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    const table = document.querySelector("#tableauVisuQuestionnaire tbody");
    table.innerHTML = "";
    data.forEach((Question) => {
      const ligne = document.createElement("tr");

      //Ajout du critere
      const critereCell = document.createElement("td");
      critereCell.textContent = Question.criteria;
      ligne.appendChild(critereCell);

      //Ajout de la question
      const questionCell = document.createElement("td");
      questionCell.textContent = Question.label;
      ligne.appendChild(questionCell);

      // Ajout de la reponse
      const reponseCell = document.createElement("td");
      reponseCell.textContent = Question.answerText;
      ligne.appendChild(reponseCell);

      //Ajout de la note
      const noteCell = document.createElement("td");
      noteCell.textContent = Question.rating;
      noteCell.className = "note";
      noteCell.setAttribute(
        "style",
        "text-align: center; vertical-align: middle;"
      );
      ligne.appendChild(noteCell);

      table.appendChild(ligne);
    });

    $("#tableauVisuQuestionnaire")
      .addClass("display cell-border compact stripe hover")
      .prepend(getAuditInfo(auditId))
      .DataTable({
        layout: dt_layout,
        buttons: [btn_excel, btn_pdf],
        language: fr_lang,
        columnDefs: [{ targets: "_all", type: "string" }],
        lengthMenu: [50, 100, 150, 200, { label: "Tout", value: -1 }],
      })
      .buttons()
      .container()
      .appendTo($(".dtButtons"));
  })
  .catch((error) => console.error(error));

//Bouton de retour
const retour = document.getElementById("btnRetour");
retour.addEventListener("click", () => {
  window.location.href = "/ListeAudit.html";
});

$(document).ready(function () {
  $(".js-example-basic-single").select2();
});
