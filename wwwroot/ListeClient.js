// Fonctions
function AddClient(entrepriseName, phone, email, adress, city, contactName, country, branch) {
  fetch("/api/Client/AddClient", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: entrepriseName,
      contactName: contactName,
      email: email,
      phone: phone,
      adress: adress,
      city: city,
      country: country,
      branch: branch,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error(error);
    });
  alert("Client ajouté avec succès");
  location.reload();
}

popup_modify = document.getElementById("popup-modify");

function ModifyClient(id, entrepriseName, phone, email, adress, city, contactName, country, branch) {
  fetch(`/api/Client/ModifierClient/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id,
      name: entrepriseName,
      contactName: contactName,
      email: email,
      phone: phone,
      adress: adress,
      city: city,
      country: country,
      branch: branch,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error(error);
    });
  alert("Client modifié avec succès");
  location.reload();
}

function FetchList() {
  fetch("/api/Client/")
    .then((response) => response.json())
    .then((data) => {
      const tableau = document.querySelector("#tableauclient tbody");
      tableau.innerHTML = "";

      data.forEach((Client) => {
        const ligne = document.createElement("tr");

        const nom = document.createElement("td");
        nom.textContent = Client.name;
        ligne.appendChild(nom);

        const branch = document.createElement("td");
        branch.textContent = Client.branch;
        ligne.appendChild(branch);

        const contact = document.createElement("td");
        contact.textContent = Client.contactName;
        ligne.appendChild(contact);

        const DateDernierAudit = document.createElement("td");
        fetch(`/api/Audit/GetLastAudit/${Client.id}`)
          .then((response) => response.text())
          .then((data) => {
            if (data == "") {
              DateDernierAudit.textContent = "Client non audité";
            } else {
              DateDernierAudit.textContent = data;
            }
          })
          .catch((error) => {
            console.error("Error:", error);
          });
        ligne.appendChild(DateDernierAudit);

        const phone = document.createElement("td");
        phone.textContent = Client.phone;
        ligne.appendChild(phone);

        const email = document.createElement("td");
        email.textContent = Client.email;
        ligne.appendChild(email);

        const adresse = document.createElement("td");
        adresse.textContent = Client.adress;
        ligne.appendChild(adresse);

        const ville = document.createElement("td");
        ville.textContent = Client.city;
        ligne.appendChild(ville);

        const pays = document.createElement("td");
        pays.textContent = Client.country;
        ligne.appendChild(pays);

        const actions = document.createElement("td");
        const btnEdit = document.createElement("button");
        btnEdit.textContent = "Modifier";
        btnEdit.className = "btn btn-primary";
        btnEdit.addEventListener("click", function () {
          // Pré-remplir les champs de la popup avec les informations de la ligne
          document.getElementById("ModifierentrepriseName").value = Client.name;
          document.getElementById("ModifiercontactName").value = Client.contactName;
          document.getElementById("ModifierentreprisePhone").value = Client.phone;
          document.getElementById("ModifierentrepriseEmail").value = Client.email;
          document.getElementById("ModifierentrepriseAddress").value = Client.adress;
          document.getElementById("ModifierentrepriseCity").value = Client.city;
          document.getElementById("ModifierentrepriseCountry").value = Client.country;
          document.getElementById("ModifierentrepriseBranch").value = Client.branch;

          // Afficher la popup
          popup_modify.style.display = "block";

          var form_modify = document.getElementById("form-modify-client");
          form_modify.addEventListener("submit", function (event) {
            event.preventDefault();
            var entrepriseName = document.getElementById("ModifierentrepriseName").value;
            var contactName = document.getElementById("ModifiercontactName").value;
            var phone = document.getElementById("ModifierentreprisePhone").value;
            var email = document.getElementById("ModifierentrepriseEmail").value;
            var adress = document.getElementById("ModifierentrepriseAddress").value;
            var city = document.getElementById("ModifierentrepriseCity").value;
            var country = document.getElementById("ModifierentrepriseCountry").value;
            var branch = document.getElementById("ModifierentrepriseBranch").value;
            ModifyClient(Client.id, entrepriseName, phone, email, adress, city, contactName, country, branch);
            popup_modify.style.display = "none";
            // setTimeout(function () {
            //   alert("Client modifié avec succès");
            //   location.reload();
            // }, 30000);
          });
        });
        actions.appendChild(btnEdit);
        ligne.appendChild(actions);

        tableau.appendChild(ligne);
      });

      // if ($.fn.dataTable.isDataTable("#tableauclient")) {
      //   $("#tableauclient").destroy();
      //   $("#tableauclient").DataTable();
      // }

      $("#tableauclient")
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

var popup = document.getElementById("popup");
var btn = document.getElementById("btnAjouterClient");
var span = document.getElementsByClassName("close")[0];
var span_modify = document.getElementsByClassName("close")[1];

btn.addEventListener("click", function () {
  popup.style.display = "block";
});

span.addEventListener("click", function () {
  popup.style.display = "none";
});

span_modify.addEventListener("click", function () {
  popup_modify.style.display = "none";
});

var form = document.getElementById("form-add-client");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  var entrepriseName = document.getElementById("entrepriseName").value;
  var branch = document.getElementById("entrepriseBranch").value;
  var contactName = document.getElementById("contactName").value;
  var phone = document.getElementById("entreprisePhone").value;
  var email = document.getElementById("entrepriseEmail").value;
  var adress = document.getElementById("entrepriseAddress").value;
  var city = document.getElementById("entrepriseCity").value;
  var country = document.getElementById("entrepriseCountry").value;

  // Call the two functions here
  AddClient(entrepriseName, phone, email, adress, city, contactName, country, branch);
  popup.style.display = "none";
  //alert("Client ajouté avec succès");
  //location.reload();
});

FetchList();

//JavaScript pour le select2
$(document).ready(function () {
  $(".js-example-basic-single").select2();
});
