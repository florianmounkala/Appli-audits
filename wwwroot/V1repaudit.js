//Déclaration des variables
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const auditId = urlParams.get("auditId");
const listeQuestions = [];
let listeReponsesPrecedentes;
let listeIdQuestions;
let dateAudition = new Date();
let cibleChoisie = "Toutes les questions";
// Fonctions
// Fonction pour récupérer les questions et réponses précédentes
function getQuestionsReponsePrecedentes(ciblex) {
  return new Promise((resolve, reject) => {
    fetch(`/api/Answer/GetInfoQuestion/${auditId}?Cible=${ciblex}`)
      .then((response) => response.text())
      .then((data) => {
        const listeReponses = JSON.parse(data);
        const listeReponsesPrecedentes = [];
        const listeIdQuestions = [];
        if (data.length === 0) {
          resolve({ listeReponsesPrecedentes, listeIdQuestions });
        }
        for (let reponse of listeReponses) {
          if (reponse.startsWith("!Question:!")) {
            continue;
          } else {
            let tableauxxxx = reponse.split("!,!");
            listeReponsesPrecedentes.push(tableauxxxx[3]);
            listeIdQuestions.push(tableauxxxx[2]);
          }
        }
        console.log(listeReponsesPrecedentes);
        console.log(listeIdQuestions);
        resolve({ listeReponsesPrecedentes, listeIdQuestions });
      })
      .catch((error) => {
        reject(error);
      });
  });
}
// Fonction pour attacher les gestionnaires d'événements
function attachEventHandlers() {
  const startButtons = document.querySelectorAll(".start-recording"); // Select only buttons with the 'start-recording' class
  startButtons.forEach((button) => {
    const outputDiv =
      button.parentNode.parentNode.querySelector("td:nth-child(2)");
    const champReponse = button.parentNode.querySelector("input"); // Get the response field in the same row
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition ||
      window.mozSpeechRecognition ||
      window.msSpeechRecognition)();
    recognition.lang = "fr-FR";

    recognition.onstart = () => {
      button.textContent = "Enregistrement en cours...";
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log(transcript);
      outputDiv.setAttribute("value", transcript);
      champReponse.value = transcript;
    };

    recognition.onend = () => {
      button.innerHTML =
        '<i class="fas fa-microphone"></i> Demarrer l\'enregistrement';
    };

    button.addEventListener("click", function () {
      recognition.start();
    });
  });
}
// Fonction pour afficher les questions d'audit
function fetchAndDisplayAuditQuestions(auditId, cibleChoisie, dateAudition) {
  getQuestionsReponsePrecedentes(cibleChoisie).then(
    ({ listeReponsesPrecedentes: lrp, listeIdQuestions: liq }) => {
      listeReponsesPrecedentes = lrp;
      listeIdQuestions = liq;
      fetch(`/api/AuditQuestion/${auditId}?cible=${cibleChoisie}`)
        .then((response) => response.json())
        .then((data) => {
          const tableau = document.getElementById("tableauAudit");
          tableau.innerHTML = "";
          listeThemes = [];
          trhead = document.createElement("tr");
          [
            "N°",
            "Thème",
            "Cible",
            "Niveau",
            "Question",
            "Votre reponse",
            "Votre note",
            "",
          ].forEach((text) => {
            let th = document.createElement("th");
            th.textContent = text;
            trhead.appendChild(th);
          });
          tableau.appendChild(trhead);
          var i = 1;
          data.sort((a, b) => a.theme.label.localeCompare(b.theme.label));
          data.forEach((element) => {
            if (!listeThemes.includes(element.theme.label)) {
              listeThemes.push(element.theme.label);
              const ligneTheme = document.createElement("tr");
              ligneTheme.className = "theme";
              const Label = document.createElement("td");
              const Save = document.createElement("td");
              const theme = document.createElement("span");
              theme.innerText = element.theme.label;
              theme.className = "theme";
              const saveQuestionButton = document.createElement("button");
              saveQuestionButton.innerHTML = '<i class="fas fa-save"></i>';
              saveQuestionButton.classList.add("save-question");
              saveQuestionButton.setAttribute("type", "button");
              saveQuestionButton.setAttribute("id", `save-question-${i}`);
              saveQuestionButton.addEventListener("click", function () {
                const tableaux = document.getElementById("tableauAudit");
                const rows = tableaux.querySelectorAll("tr");
                rows.forEach((row) => {
                  const numerox = row.querySelector("td:nth-child(1) span");
                  const themex = row.querySelector("td:nth-child(2) span");
                  const ciblex = row.querySelector("td:nth-child(3) span");
                  const questionx = row.querySelector("td:nth-child(4) span");
                  const reponsex = row.querySelector("td:nth-child(5) input");
                  const notex = row.querySelector("td:nth-child(6) select");
                  const questionIdx = row.querySelector("td:nth-child(7) span");
                  let themeValue = themex ? themex.innerText : "theme is null";
                  let cibleValue = ciblex ? ciblex.innerText : "cible is null";
                  let questionValue = questionx
                    ? questionx.innerText
                    : "question is null";
                  let reponseValue = reponsex
                    ? reponsex.value
                    : "reponse is null";
                  let noteValue = notex ? notex.value : "note is null";
                  let questionIdValue = questionIdx
                    ? questionIdx.innerText
                    : "questionId is null";
                  if (
                    reponseValue === "" ||
                    reponseValue === "reponse is null" ||
                    noteValue === "note is null" ||
                    questionIdValue === "questionId is null" ||
                    themeValue === "theme is null" ||
                    cibleValue === "cible is null" ||
                    questionValue === "question is null"
                  ) {
                    console.log(
                      "Erreur dans les données saisies ! Veuillez vérifier les champs ou champs vides !"
                    );
                  } else {
                    fetch(
                      `/api/Answer/Update?idAudit=${auditId}&idQuestion=${questionIdValue}&label=${reponseValue}&rating=${noteValue}&date_audition=${dateAudition.toISOString()}&valid_Date=3`,
                      {
                        method: "POST",
                      }
                    )
                      .then((response) => response.text())
                      .then((data) => {
                        console.log(data);
                      });
                  }
                });
                alert(
                  "Les réponses ont été enregistrées et validées avec succès !"
                );
              });
              Save.appendChild(saveQuestionButton);
              Label.appendChild(theme);
              ligneTheme.appendChild(Save);
              ligneTheme.appendChild(Label);

              tableau.appendChild(ligneTheme);
            }

            const ligne = document.createElement("tr");
            ligne.className = element.theme.label;

            // Numéro de la question
            const numero = document.createElement("td");
            let index = document.createElement("span");
            index.className = "index";
            index.appendChild(document.createTextNode(i));
            numero.appendChild(index);
            ligne.appendChild(numero);

            // Thème
            const theme = document.createElement("td");
            let indexTheme = document.createElement("span");
            indexTheme.className = "indexTheme";
            indexTheme.appendChild(
              document.createTextNode(element.theme.label)
            );
            theme.appendChild(indexTheme);
            theme.className = "theme";

            ligne.appendChild(theme);

            // Cible
            const cible = document.createElement("td");
            let indexCible = document.createElement("span");
            indexCible.className = "indexCible";
            indexCible.appendChild(
              document.createTextNode(element.target.label)
            );
            cible.appendChild(indexCible);
            cible.className = "cible";
            ligne.appendChild(cible);

            // Niveau de la question
            const niveau = document.createElement("td");
            let indexNiveau = document.createElement("span");
            indexNiveau.className = "indexNiveau";
            indexNiveau.appendChild(
              document.createTextNode(element.requiredLevel.label)
            );
            niveau.appendChild(indexNiveau);

            // Question
            const question = document.createElement("td");
            let indexQuestion = document.createElement("span");
            indexQuestion.className = "indexQuestion";
            indexQuestion.appendChild(document.createTextNode(element.id));
            question.appendChild(indexQuestion);
            question.className = "question";
            ligne.appendChild(question);

            // Champ de réponse
            const reponse = document.createElement("td");
            const champTexte = document.createElement("input");
            champTexte.type = "text";
            champTexte.style.width = "300px";
            var repPreced = "";
            if (listeIdQuestions.indexOf(" " + element.id + " ") !== -1) {
              index = listeIdQuestions.indexOf(" " + element.id + " ");
              repPreced = listeReponsesPrecedentes[index];
            }
            if (repPreced === "   Pas de reponse   ") {
              repPreced = "";
            }
            champTexte.value = repPreced;
            champTexte.className = "reponselibele";
            reponse.appendChild(champTexte);

            // Boutton de text-to-speech
            const startButton = document.createElement("button");
            startButton.innerHTML = '<i class="fas fa-microphone"></i>';
            startButton.classList.add("start-recording");
            startButton.setAttribute("id", `start-recording-${i}`);
            startButton.setAttribute("type", "button");
            reponse.appendChild(startButton);
            reponse.className = "reponse";
            ligne.appendChild(reponse);

            // Note de la question
            const note = document.createElement("td");
            const select = document.createElement("select");
            for (let j = 0; j <= 5; j++) {
              const option = document.createElement("option");
              option.value = j;
              option.text = j;
              select.appendChild(option);
            }
            select.addEventListener("change", function () {
              const selectedRating = this.value;
              console.log(`Rating: ${selectedRating}`);
            });
            note.appendChild(select);
            note.className = "note";
            ligne.appendChild(note);

            // Ajout d'une colomne caché contenant l'id de la question
            const questionId = document.createElement("td");
            let indexQuestionId = document.createElement("span");
            indexQuestionId.className = "indexQuestionId";
            indexQuestionId.appendChild(document.createTextNode(element.id));
            questionId.appendChild(indexQuestionId);
            questionId.style.display = "none";
            ligne.appendChild(questionId);

            tableau.appendChild(ligne);
            i = i + 1;
          });
          var last = document.createElement("tr");
          tableau.appendChild(last);
          // Attach event handlers for text-to-speech buttons
          attachEventHandlers();
        })
        .catch((error) => {
          console.error(error);
        });
    }
  );
}

// Code principal
fetch(`/api/Audit/${auditId}`)
  .then((response) => response.text())
  .then((data) => {
    console.log(data);
    const separatedData = data.split("!,!");
    console.log(separatedData);
    const questionsDiv = document.getElementById("informations-audit");
    const br = document.createElement("br");
    const p = document.createElement("p");
    p.textContent = `Identifiant de l'audit : ${separatedData[0]}`;
    questionsDiv.appendChild(p);
    questionsDiv.appendChild(br);
    const p2 = document.createElement("p");
    p2.textContent = `Date de création l'audit : ${separatedData[1]}`;
    questionsDiv.appendChild(p2);
    questionsDiv.appendChild(br);
    const p3 = document.createElement("p");
    p3.textContent = `Date de soumission de l'audit : ${separatedData[2]}`;
    questionsDiv.appendChild(p3);
    questionsDiv.appendChild(br);
    const p4 = document.createElement("p");
    p4.textContent = `Nom du client audité : ${separatedData[3]}`;
    questionsDiv.appendChild(p4);
    questionsDiv.appendChild(br);
  })
  .catch((error) => console.error(error));

fetchAndDisplayAuditQuestions(auditId, cibleChoisie, dateAudition);

// Remplissage de la liste des thèmes
fetch("/api/Target")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    const selectTheme = document.getElementById("select-target");
    data.forEach((element) => {
      const option = document.createElement("option");
      option.value = element.id;
      option.text = element.label;
      selectTheme.appendChild(option);
    });
  })
  .catch((error) => {
    console.error(error);
  });

// Recupération de la cible choisie
document
  .getElementById("select-target")
  .addEventListener("change", function () {
    console.log(this.value);
    fetchAndDisplayAuditQuestions(auditId, this.value);
  });

//Récupération de la date d'audit voulue
document.getElementById("date-audit").addEventListener("change", function () {
  dateAudition = new Date(this.value);
  console.log(dateAudition);
});

// Anulation de l'envoi du formulaire
var btnAnnuler = document.getElementById("btnAnnuler");
btnAnnuler.addEventListener("click", function () {
  window.location.href = "/ListeAudit.html";
});

// Envoi du formulaire
var btnEnvoyer = document.getElementById("btnConfirm");
// var btnEnvoyer = document.getElementByClassName("button-class");
btnEnvoyer.addEventListener("click", function () {
  const tableaux = document.getElementById("tableauAudit");
  console.log(tableaux);
  const rows = tableaux.querySelectorAll("tr");

  rows.forEach((row) => {
    const numero = row.querySelector("td:nth-child(1) span");
    const theme = row.querySelector("td:nth-child(2) span");
    const cible = row.querySelector("td:nth-child(3) span");
    const question = row.querySelector("td:nth-child(4) span");
    const reponse = row.querySelector("td:nth-child(5) input");
    const note = row.querySelector("td:nth-child(6) select");
    const questionId = row.querySelector("td:nth-child(7) span");
    let themeValue = theme ? theme.innerText : "theme is null";
    let cibleValue = cible ? cible.innerText : "cible is null";
    let questionValue = question ? question.innerText : "question is null";
    let reponseValue = reponse ? reponse.value : "reponse is null";
    let noteValue = note ? note.value : "note is null";
    let questionIdValue = questionId
      ? questionId.innerText
      : "questionId is null";
    if (
      reponseValue === "" ||
      reponseValue === "reponse is null" ||
      noteValue === "note is null" ||
      questionIdValue === "questionId is null" ||
      themeValue === "theme is null" ||
      cibleValue === "cible is null" ||
      questionValue === "question is null"
    ) {
      console.log(
        "Erreur dans les données saisies ! Veuillez vérifier les champs ou champs vides !"
      );
    } else {
      fetch(
        `/api/Answer/Update?idAudit=${auditId}&idQuestion=${questionIdValue}&label=${reponseValue}&rating=${noteValue}&date_audition=${dateAudition.toISOString()}&valid_Date=1`,
        {
          method: "POST",
        }
      )
        .then((response) => response.text())
        .then((data) => {
          console.log(data);
        });
    }
  });
  alert("Les réponses ont été enregistrées et validées avec succès !");
  window.location.href = "/ListeAudit.html";
});
