//Fonctions
function fetchAudit() {
  fetch("/api/Audit/")
    .then((response) => response.json())
    .then((data) => {
      const tableau = document.querySelector("#tableauAudit tbody");
      tableau.innerHTML = "";

      data.forEach((Audit) => {
        const ligne = document.createElement("tr");

        const id = document.createElement("td");
        id.textContent = Audit.id;
        ligne.appendChild(id);

        const SubmittedDate = document.createElement("td");
        var date = new Date(Audit.submittedDate);
        var day = String(date.getDate()).padStart(2, "0");
        var month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
        var year = date.getFullYear();
        var hours = String(date.getHours()).padStart(2, "0");
        var minutes = String(date.getMinutes()).padStart(2, "0");

        var x = `${day}-${month}-${year} ${hours}:${minutes}`;
        if (x == "01-01-1970 01:00") {
          SubmittedDate.textContent = "Non soumis";
        } else {
          SubmittedDate.textContent = x;
        }
        ligne.appendChild(SubmittedDate);

        const clientName = document.createElement("td");
        var clientId = Audit.clientId;
        fetch(`/api/Client/GetClientName/${clientId}`)
          .then((response) => response.text())
          .then((data) => {
            clientName.textContent = data.toString();
          })
          .catch((error) => {
            console.error(error);
          });
        ligne.appendChild(clientName);

        const buttonCell2 = document.createElement("td");
        const button2 = document.createElement("a");
        button2.textContent = "Répondre à l'audit";
        button2.href = `Repondre_Audit.html?auditId=${Audit.id}`;
        buttonCell2.appendChild(button2);
        ligne.appendChild(buttonCell2);

        const buttonCell3 = document.createElement("td");
        const button3 = document.createElement("a");
        button3.textContent = "Voir les réponses";
        button3.href = `VisualisationReponses.html?auditId=${Audit.id}`;
        buttonCell3.appendChild(button3);
        ligne.appendChild(buttonCell3);

        tableau.appendChild(ligne);
      });
      console.log(data);

      $("#tableauAudit")
        .addClass("display cell-border compact stripe hover")
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
    .catch((error) => {
      console.error(error);
    });
}
function addAudit(clientId) {
  fetch(`/api/Audit/CreateAudit?pseudo=${userPseudo}&password=${password}&clientId=${clientId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      fetchAudit();
    })
    .catch((error) => {
      console.error(error);
    });
}

//Code principal
fetchAudit();
// Déclarations des variables
var popup = document.getElementById("popup");
var btn = document.getElementById("btn-ajout-audit");
var span = document.getElementsByClassName("close")[0];
var form = document.getElementById("form-add-audit");
// Ouverture de la popup
btn.addEventListener("click", function () {
  fetch("/api/Audit/HaveClientForAudit")
    .then((response) => response.json())
    .then((data) => {
      if (data) {
        popup.style.display = "block";
        fetch("/api/Client")
          .then((response) => response.json())
          .then((clients) => {
            const select = document.getElementById("client-ids");
            // Vider la liste déroulante
            select.innerHTML = "";
            clients.forEach((client) => {
              const option = document.createElement("option");
              option.value = client.id; // l'ID du client sera soumis
              if (client.branch === "") {
                option.textContent = client.name;
              } else {
                option.textContent = client.name + " - " + client.branch;
              }
              select.appendChild(option);
            });
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      } else {
        alert("Vous n'avez pas de client pour ajouter un audit");
        console.log(data);
      }
    })
    .catch((error) => {
      console.error(error);
    });
});

span.addEventListener("click", function () {
  popup.style.display = "none";
});

// Soumission du formulaire
form.addEventListener("submit", function (event) {
  event.preventDefault();
  var clientId = document.getElementById("client-ids").value;
  addAudit(clientId);
  alert("Audit ajouté avec succès");
  location.reload();
  popup.style.display = "none";
});

//JavaScript pour le select2
$(document).ready(function () {
  $(".js-example-basic-single").select2();
});
