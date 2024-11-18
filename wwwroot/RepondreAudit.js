//Déclaration des variables
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const auditId = urlParams.get("auditId");
const listeQuestions = [];
let dateAudition = new Date();
let cibleChoisie = "Toutes les questions";
const duration = 10000;


// Fonctions
// Fonction pour démarrer la reconnaissance vocale
function startRecognition(outputField, previousValue) {
  let listeRegister = [];
  let timeoutId;
  let intervalId;
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "fr-FR"; // Langue de reconnaissance
  recognition.interimResults = false; // Pas de résultats intermédiaires
  recognition.maxAlternatives = 1; // Une seule alternative

  // Réinitialiser dateAudition à chaque démarrage
  dateAudition = new Date();
  recognition.start();
  outputField.textContent = "Dites quelque chose...";

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    var fullTranscript = "";
    let listetranscript = [];
    for (let i = 0; i < event.results.length; i++) {
      listetranscript.push(event.results[i][0].transcript);

    }
    listeRegister.push(...listetranscript);
    console.log(listeRegister);
    for (let i = 0; i < listeRegister.length; i++) {
      fullTranscript += listeRegister[i];
    }
    console.log(fullTranscript);
    fullTranscript = fullTranscript.replace(/\./g, ' ');

    outputField.value = previousValue + " " + fullTranscript;
  };

  recognition.onerror = (event) => {
    outputField.textContent = "Erreur : " + event.error;
  };

  recognition.onend = () => {
    if (Date.now() - dateAudition < duration) {
      recognition.start();
    }
  };

  // Arrêter la reconnaissance après la durée spécifiée
  timeoutId = setTimeout(() => {
    clearInterval(intervalId);
    recognition.stop();
    console.log("Fin de l'enregistrement");
  }, duration);

  // Redémarrer la reconnaissance si elle s'arrête avant la fin des 10 secondes
  intervalId = setInterval(() => {
    if (recognition.ended) {
      recognition.start();
      console.log("Redémarrage de l'enregistrement");
    }
  }, 10000);
}
// Fonction pour attacher les gestionnaires d'événements
function attachEventHandlers() {
  const buttons = document.querySelectorAll(".start-recording");
  buttons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const buttonId = event.target.id;
      const index = buttonId.split("-")[2];
      const outputField = document.getElementById(`response-field-${index}`);
      const previousValue = outputField.value;
      startRecognition(outputField, previousValue);
    });
  });
}

// Fonction de récupération des réponses précedentes (si elles existent)
function getReponsesPrecedentes(auditId) {
  return new Promise((resolve, reject) => {
    fetch(`/api/Answer/${auditId}`).then((answers) => {
      answers
        .json()
        .then((data) => {
          resolve(data);
        })
        .catch((error) => {
          if (error.status === 404) {
            //console.log("Pas de réponses");
            resolve("Pas de réponses");
          } else {
            //console.error(error.message);
            reject(error);
          }
        });
    });
  });
}

// Fonction pour récupérer les questions de l'audit
function fetchAndDisplayAuditQuestions(auditId, cibleChoisie, dateAudition, reponsesPrecedentes) {
  fetch(`/api/AuditQuestion/${auditId}?cible=${cibleChoisie}`)
    .then((response) => response.json())
    .then((data) => {
      const tableau = document.getElementById("tableauAudit");
      tableau.innerHTML = "";
      listeThemes = [];
      trhead = document.createElement("tr");
      ["N°", "Thème", "Cible", "Niveau", "Question", "Réponse", "Note", ""].forEach((text) => {
        let th = document.createElement("th");
        th.textContent = text;
        trhead.appendChild(th);
      });
      tableau.appendChild(trhead);
      var i = 1;
      data.sort((a, b) => a.theme.label.localeCompare(b.theme.label));
      // Boutton de sauvegarde des réponses
      data.forEach((element) => {
        if (!listeThemes.includes(element.theme.label)) {
          listeThemes.push(element.theme.label);
          const ligneTheme = document.createElement("tr");
          ligneTheme.className = "theme bg-secondary bg-opacity-25";
          const Label = document.createElement("td");
          Label.colSpan = 7;
          const Save = document.createElement("td");
          const theme = document.createElement("span");
          theme.innerText = element.theme.label;
          theme.className = "theme";
          const saveQuestionButton = document.createElement("button");
          saveQuestionButton.innerHTML = `${floppy_svg} Sauvegarder`;
          $(saveQuestionButton).addClass("btn btn-primary");
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
              const questionx = row.querySelector("td:nth-child(5) span");
              const reponsex = row.querySelector("td:nth-child(6) input");
              const notex = row.querySelector("td:nth-child(7) select");
              const questionIdx = row.querySelector("td:nth-child(8) span");
              let themeValue = themex ? themex.innerText : "theme is null";
              let cibleValue = ciblex ? ciblex.innerText : "cible is null";
              let questionValue = questionx ? questionx.innerText : "question is null";
              let reponseValue = reponsex ? reponsex.value : "reponse is null";
              let noteValue = notex ? notex.value : "note is null";
              let questionIdValue = questionIdx ? questionIdx.innerText : "questionId is null";
              if (reponseValue === "" || reponseValue === "reponse is null" || noteValue === "note is null" || questionIdValue === "questionId is null" || themeValue === "theme is null" || cibleValue === "cible is null" || questionValue === "question is null") {
                //ne rien faire
              } else {
                fetch(`/api/Answer/Update?idAudit=${auditId}&idQuestion=${questionIdValue}&label=${reponseValue}&rating=${noteValue}&date_audition=${dateAudition.toISOString()}&valid_Date=3`, {
                  method: "POST",
                })
                  .then((response) => response.text())
                  .then((data) => {
                    console.log(data);
                  });
              }
            });
            alert("Les réponses ont été enregistrées et validées avec succès !");
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
        index.appendChild(document.createTextNode(element.criteria));
        numero.appendChild(index);
        ligne.appendChild(numero);

        // Thème
        const theme = document.createElement("td");
        let indexTheme = document.createElement("span");
        indexTheme.className = "indexTheme";
        indexTheme.appendChild(document.createTextNode(element.theme.label));
        theme.appendChild(indexTheme);
        theme.className = "theme";

        ligne.appendChild(theme);

        // Cible
        const cible = document.createElement("td");
        let indexCible = document.createElement("span");
        indexCible.className = "indexCible";
        //console.log(element.target.label);
        indexCible.appendChild(document.createTextNode(element.target.label));
        cible.appendChild(indexCible);
        ligne.appendChild(cible);

        // Niveau de la question
        const niveau = document.createElement("td");
        let indexNiveau = document.createElement("span");
        indexNiveau.className = "indexNiveau";
        indexNiveau.appendChild(document.createTextNode(element.requiredLevel.label));
        niveau.appendChild(indexNiveau);
        ligne.appendChild(niveau);

        // Question
        const question = document.createElement("td");
        let indexQuestion = document.createElement("span");
        indexQuestion.className = "indexQuestion";
        indexQuestion.appendChild(document.createTextNode(element.label));
        question.appendChild(indexQuestion);
        question.className = "question";
        ligne.appendChild(question);

        // Champ de réponse
        const reponse = document.createElement("td");
        const champTexte = document.createElement("input");
        champTexte.type = "text";
        champTexte.style.width = "300px";
        champTexte.className = "reponselibele mb-1";
        champTexte.setAttribute("id", `response-field-${i}`);
        if (reponsesPrecedentes !== "Pas de réponses") {
          reponsesPrecedentes.forEach((reponse) => {
            if (reponse.questionId === element.id) {
              champTexte.value = reponse.answerText;
            }
          });
        }
        reponse.appendChild(champTexte);

        // Boutton de text-to-speech
        const startButton = document.createElement("button");
        startButton.innerHTML = `${mic_empty_svg} Demarrer l'enregistrement`;
        $(startButton).removeClass("btn btn-danger").addClass("btn btn-success");

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
        if (reponsesPrecedentes !== "Pas de réponses") {
          reponsesPrecedentes.forEach((reponse) => {
            if (reponse.questionId === element.id) {
              select.selectedIndex = reponse.rating;
            }
          });
        }
        select.addEventListener("change", function () {
          const selectedRating = this.value;
          console.log(`Rating: ${selectedRating}`);
        });
        note.appendChild(select);
        note.className = "note";
        note.setAttribute("style", "text-align: center; vertical-align: middle;");
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
      //console.error(error);
    });
}

// Code principal
if (password == null || userPseudo == null) {
  window.location.href = "Connection.html";
}

btndeconnexion.addEventListener("click", function () {
  localStorage.removeItem("userPassword");
  localStorage.removeItem("userPseudo");
  window.location.href = "Connection.html";
});
document.getElementById("user").textContent = userPseudo;

//Affichage des informations de l'audit
fetch(`/api/Audit/${auditId}`)
  .then((response) => response.text())
  .then((data) => {
    //console.log("#Data : " + data);
    const separatedData = data.split("!,!");
    //console.log("#SeparatedData : " + separatedData);

    $("#id-audit").text(`${separatedData[0]}`);
    $("#date-creation-audit").text(`${separatedData[1]}`);
    $("#date-soumission-audit").text(`${separatedData[2]}`);
    $("#client-audite").text(`${separatedData[3]}`);
  })
  .catch((error) => console.error(error));

// Affichage des questions de l'audit
getReponsesPrecedentes(auditId)
  .then((data) => {
    //console.log(data);
    let reponsesPrecedentes = data;
    fetchAndDisplayAuditQuestions(auditId, cibleChoisie, dateAudition, reponsesPrecedentes);
  })
  .catch((error) => console.error(error));

// Remplissage de la liste des thèmes
fetch("/api/Target")
  .then((response) => response.json())
  .then((data) => {
    //console.log(data);
    const selectTheme = document.getElementById("select-target");
    data.forEach((element) => {
      const option = document.createElement("option");
      option.value = element.label;
      option.text = element.label;
      selectTheme.appendChild(option);
    });
  })
  .catch((error) => {
    console.error(error);
  });

// Recupération de la cible choisie
document.getElementById("select-target").addEventListener("change", function () {
  cibleChoisie = this.value;
  getReponsesPrecedentes(auditId)
    .then((data) => {
      let reponsesPrecedentes = data;
      fetchAndDisplayAuditQuestions(auditId, cibleChoisie, dateAudition, reponsesPrecedentes);
    })
    .catch((error) => console.error(error));
});

//Récupération de la date d'audit voulue
document.getElementById("date-audit").addEventListener("change", function () {
  dateAudition = new Date(this.value);
  //console.log(dateAudition);
});

// Anulation de l'envoi du formulaire
var btnAnnuler = document.getElementById("btnAnnuler");
btnAnnuler.addEventListener("click", function () {
  window.location.href = "/ListeAudit.html";
});

// Envoi du formulaire
var btnEnvoyer = document.getElementById("btnConfirm");
btnEnvoyer.addEventListener("click", function () {
  const tableaux = document.getElementById("tableauAudit");
  //console.log(tableaux);
  const rows = tableaux.querySelectorAll("tr");

  rows.forEach((row) => {
    const numero = row.querySelector("td:nth-child(1) span");
    const theme = row.querySelector("td:nth-child(2) span");
    const cible = row.querySelector("td:nth-child(3) span");
    const question = row.querySelector("td:nth-child(5) span");
    const reponse = row.querySelector("td:nth-child(6) input");
    const note = row.querySelector("td:nth-child(7) select");
    const questionId = row.querySelector("td:nth-child(8) span");
    let themeValue = theme ? theme.innerText : "theme is null";
    let cibleValue = cible ? cible.innerText : "cible is null";
    let questionValue = question ? question.innerText : "question is null";
    let reponseValue = reponse ? reponse.value : "reponse is null";
    let noteValue = note ? note.value : "note is null";
    let questionIdValue = questionId ? questionId.innerText : "questionId is null";
    if (reponseValue !== "" && reponseValue !== "reponse is null" && noteValue !== "note is null" && questionIdValue !== "questionId is null" && themeValue !== "theme is null" && cibleValue !== "cible is null" && questionValue !== "question is null") {
      fetch(`/api/Answer/Update?idAudit=${auditId}&idQuestion=${questionIdValue}&label=${reponseValue}&rating=${noteValue}&date_audition=${dateAudition.toISOString()}&valid_Date=1`, {
        method: "POST",
      })
        .then((response) => response.text())
        .then((data) => {
          //console.log(data);
        });
    }
  });
  alert("Les réponses ont été enregistrées et validées avec succès !");
  window.location.href = "/ListeAudit.html";
});
// Récupération des reponses precedentes
let reponsesPrecedentes = getReponsesPrecedentes(auditId);
