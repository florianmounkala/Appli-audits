//Fonctions
function AddQuestion(Criteria, Label, theme, Target, level) {
  fetch(
    `/api/Question/AddQuestion?criteriaLabel=${Criteria}&questionLabel=${Label}&ThemeLabel=${theme}&cible=${Target}&requiredLevel=${level}`,
    {
      method: "POST",
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json();
      } else {
        return response.text();
      }
    })
    .then((data) => {
      console.log(data);
      alert("Question ajoutée");
      location.reload();
    })
    .catch((error) => {
      console.error(error);
    });
}

// Variables
popupEdit = document.getElementById("popup-edit");
popupEditLabelOnly = document.getElementById("popup-edit-label-only");
fetch("/api/Question")
  .then((response) => response.json())
  .then((data) => {
    const tableau = document.querySelector("#tableauQuestion tbody");
    tableau.innerHTML = "";
    var listeDesThemes = ["Ajouter un Thème"];
    var listeDesTargets = ["Ajouter une cible"];
    var listeDesNiveau = ["Ajouter un niveau"];
    var listedesThemesModfiy = ["Ajouter un Thème"];
    var listedesTargetsModfiy = ["Ajouter une cible"];
    var listedesNiveauModfiy = ["Ajouter un niveau"];
    const listeDesThemesSelect = document.getElementById("theme");
    const listeDesTargetsSelect = document.getElementById("cible");
    const listeDesNiveauSelect = document.getElementById("niveau");
    const listeDesNiveauSelectModify =
      document.getElementById("id-niveau-edit");
    const listeDesTargetsSelectModify =
      document.getElementById("id-cible-edit");
    const listeDesThemesSelectModify = document.getElementById("id-theme-edit");
    // Tri des questions par ThemeId
    data.sort((a, b) => a.themeId - b.themeId);

    let currentTheme = [];

    data.forEach((question) => {
      const ligne = document.createElement("tr");

      const criteriaCell = document.createElement("td");
      criteriaCell.textContent = question.criteria;
      ligne.appendChild(criteriaCell);

      const libeleCell = document.createElement("td");
      libeleCell.textContent = question.label;
      ligne.appendChild(libeleCell);

      const ThemeCell = document.createElement("td");
      ThemeCell.textContent = question.theme.label;
      if (!listeDesThemes.includes(question.theme.label)) {
        listeDesThemes.push(question.theme.label);
        listedesThemesModfiy.push(question.theme.label);
      }
      ligne.appendChild(ThemeCell);

      const TargetCell = document.createElement("td");
      TargetCell.textContent = question.target.label;
      if (!listeDesTargets.includes(question.target.label)) {
        listeDesTargets.push(question.target.label);
        listedesTargetsModfiy.push(question.target.label);
      }
      ligne.appendChild(TargetCell);

      const levelCell = document.createElement("td");
      levelCell.textContent = question.requiredLevel.label;
      if (!listeDesNiveau.includes(question.requiredLevel.label)) {
        listeDesNiveau.push(question.requiredLevel.label);
        listedesNiveauModfiy.push(question.requiredLevel.label);
      }
      ligne.appendChild(levelCell);

      const visibilityButton = document.createElement("button");

      const visibleCell = document.createElement("td");
      if (question.visible) {
        visibleCell.innerHTML =
          '<span class="badge text-bg-success mx-1">Visible</span>';
        visibilityButton.textContent = "Masquer";
      } else {
        visibleCell.innerHTML =
          '<span class="badge text-bg-danger">Masqué</span>';
        visibilityButton.textContent = "Afficher";
      }
      const bouttonStocker = document.createElement("td");

      visibilityButton.className = "btn btn-warning me-1";
      visibilityButton.addEventListener("click", function () {
        // Code to toggle visibility here
        if (question.visible) {
          question.visible = false;
          visibleCell.innerHTML =
            '<span class="badge text-bg-danger">Masqué</span>';
          visibilityButton.textContent = "Afficher";
          fetch;
        } else {
          question.visible = true;
          visibleCell.innerHTML =
            '<span class="badge text-bg-success">Visible</span>';
          visibilityButton.textContent = "Masquer";
        }
        fetch(`/api/Question/ModifierVisibilité/${question.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(question),
        }).catch((error) => {
          console.error(error);
        });
      });
      ModifierQuestionButton = document.createElement("button");
      ModifierQuestionButton.className = "btn btn-primary";
      ModifierQuestionButton.textContent = "Modifier";
      ModifierQuestionButton.addEventListener("click", function () {
        fetch(`/api/Question/QuestionDansUnAudit/${question.id}`)
          .then((response) => response.json())
          .then((data) => {
            if (data) {
              // alert("La question est utilisée dans un audit");
              // Si la question est dans un audit
              document.getElementById("label-edit-label-only").value =
                question.label;
              popupEdit.style.display = "none";

              popupEditLabelOnly.style.display = "block";
              var form_modify_label_only = document.getElementById(
                "form-edit-label-only"
              );
              form_modify_label_only.addEventListener(
                "submit",
                function (event) {
                  event.preventDefault();
                  var Label = document.getElementById(
                    "label-edit-label-only"
                  ).value;
                  fetch(
                    `/api/Question/ModifierQuestion/${question.id}?criteriaLabel=${question.criteria}&questionLabel=${Label}&ThemeLabel=${question.theme.label}&cible=${question.target.label}&requiredLevel=${question.requiredLevel.label}`,
                    {
                      method: "PUT",
                    }
                  ).catch((error) => {
                    console.error(error);
                  });
                  console.log("Question modifiée");
                  alert("Question modifiée");
                  popupEditLabelOnly.style.display = "none";
                  location.reload();
                }
              );
            } else {
              // Si la question n'est pas dans un audit
              popupEditLabelOnly.style.display = "none";
              document.getElementById("critere-edit").value = question.criteria;
              document.getElementById("label-edit").value = question.label;
              document.getElementById("id-theme-edit").value =
                question.theme.label;
              document.getElementById("id-cible-edit").value =
                question.target.label;
              document.getElementById("id-niveau-edit").value =
                question.requiredLevel.label;
              popupEdit.style.display = "block";
              var form_modify = document.getElementById("form-edit-question");

              fetch(`/api/Question/IsQuestionInUse/${question.id}`)
                .then((response) => response.json())
                .then((data) => {
                  const btnDelete = document.getElementById(
                    "btn-delete-question"
                  );
                  console.log(data);
                  if (!data) {
                    btnDelete.disabled = false;
                    btnDelete.addEventListener("click", function (event) {
                      event.preventDefault();
                      fetch(`/api/Question/DeleteQuestion/${question.id}`, {
                        method: "DELETE",
                      });
                      alert("Question supprimée");
                      location.reload();
                    });
                  } else {
                    btnDelete.disabled = true;
                  }
                })
                .catch((error) => console.error(error));

              form_modify.addEventListener("submit", function (event) {
                event.preventDefault();
                var criteria = document.getElementById("critere-edit").value;
                var Label = document.getElementById("label-edit").value;
                var newTheme = document.getElementById("id-theme-edit").value;
                var newTarget = document.getElementById("id-cible-edit").value;
                var newLevel = document.getElementById("id-niveau-edit").value;
                fetch(`/api/Question/CriterePresent/${criteria}/${question.id}`)
                  .then((response) => response.json())
                  .then((data) => {
                    if (data) {
                      alert("Le critère existe déjà");
                    } else {
                      fetch(
                        `/api/Question/ModifierQuestion/${question.id}?criteriaLabel=${criteria}&questionLabel=${Label}&ThemeLabel=${newTheme}&cible=${newTarget}&requiredLevel=${newLevel}`,
                        {
                          method: "PUT",
                        }
                      );
                      console.log("Question modifiée");
                      alert("Question modifiée");
                      popupEdit.style.display = "none";
                      location.reload();
                    }
                  })
                  .catch((error) => {
                    console.error(error);
                  });
              });
            }
          })
          .catch((error) => {
            console.error(error);
          });
      });
      ligne.appendChild(visibleCell);
      bouttonStocker.appendChild(visibilityButton);
      bouttonStocker.appendChild(ModifierQuestionButton);
      ligne.appendChild(bouttonStocker);

      tableau.appendChild(ligne);

      listeDesThemesSelect.innerHTML = "";
      listeDesTargetsSelect.innerHTML = "";
      listeDesNiveauSelect.innerHTML = "";
      listeDesThemesSelectModify.innerHTML = "";
      listeDesTargetsSelectModify.innerHTML = "";
      listeDesNiveauSelectModify.innerHTML = "";
      listeDesThemes.forEach((theme) => {
        const option = document.createElement("option");
        option.value = theme;
        option.textContent = theme;
        listeDesThemesSelect.appendChild(option);
      });
      listeDesTargets.forEach((Target) => {
        const option = document.createElement("option");
        option.value = Target;
        option.textContent = Target;
        listeDesTargetsSelect.appendChild(option);
      });
      listeDesNiveau.forEach((level) => {
        const option = document.createElement("option");
        option.value = level;
        option.textContent = level;
        listeDesNiveauSelect.appendChild(option);
      });
      listedesThemesModfiy.forEach((theme) => {
        const option = document.createElement("option");
        option.value = theme;
        option.textContent = theme;
        listeDesThemesSelectModify.appendChild(option);
      });
      listedesTargetsModfiy.forEach((Target) => {
        const option = document.createElement("option");
        option.value = Target;
        option.textContent = Target;
        listeDesTargetsSelectModify.appendChild(option);
      });
      listedesNiveauModfiy.forEach((level) => {
        const option = document.createElement("option");
        option.value = level;
        option.textContent = level;
        listeDesNiveauSelectModify.appendChild(option);
      });
    });

    $("#tableauQuestion")
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

var popup = document.getElementById("popup");
var btn = document.getElementById("btn-ajout-question");
var span = document.getElementsByClassName("close")[0];
var spanEdit = document.getElementsByClassName("close")[1];
var spanEditLabelOnly = document.getElementsByClassName("close")[2];

var btndeconnexion = document.getElementById("btn-logout");
// Code Principal

btn.addEventListener("click", function () {
  popup.style.display = "block";
});

span.addEventListener("click", function () {
  popup.style.display = "none";
});

spanEdit.addEventListener("click", function () {
  popupEdit.style.display = "none";
});

spanEditLabelOnly.addEventListener("click", function () {
  popupEditLabelOnly.style.display = "none";
});

var form = document.getElementById("form-add-question");

form.addEventListener("submit", function (event) {
  event.preventDefault();
  var criteria = document.getElementById("critere").value;
  var Label = document.getElementById("label").value;
  var newTheme = document.getElementById("id-theme").value;
  var newTarget = document.getElementById("id-cible").value;
  var newLevel = document.getElementById("id-niveau").value;
  var listeDesThemesSelect = document.getElementById("theme").value;
  var listeDesTargetsSelect = document.getElementById("cible").value;
  var listeDesNiveauSelect = document.getElementById("niveau").value;
  var theme = "";
  var Target = "";
  var level = "";
  if (listeDesThemesSelect == "Ajouter un Thème" && newTheme == "") {
    alert("Veuillez choisir un thème ou en ajouter un nouveau");
  } else if (listeDesThemesSelect == "Ajouter un Thème" && newTheme != "") {
    theme = newTheme;
  } else {
    theme = listeDesThemesSelect;
  }

  if (listeDesTargetsSelect == "Ajouter une Target" && newTarget == "") {
    alert("Veuillez choisir une Target ou en ajouter une nouvelle");
  } else if (listeDesTargetsSelect == "Ajouter une Target" && newTarget != "") {
    Target = newTarget;
  } else {
    Target = listeDesTargetsSelect;
  }

  if (listeDesNiveauSelect == "Ajouter un niveau" && newLevel == "") {
    alert("Veuillez choisir un niveau ou en ajouter un nouveau");
  } else if (listeDesNiveauSelect == "Ajouter un niveau" && newLevel != "") {
    level = newLevel;
  } else {
    level = listeDesNiveauSelect;
  }

  console.log(level);
  fetch(`/api/Question/CriterePresent/${criteria}/0`)
    .then((response) => response.json())
    .then((data) => {
      if (data) {
        alert("Le critère existe déjà");
      } else {
        AddQuestion(criteria, Label, theme, Target, level);
        popup.style.display = "none";
      }
    })
    .catch((error) => {
      console.error(error);
    });

  //alert("Question ajoutée");
});

// Gestion de nouvelle Target et nouveau thème
$(document).ready(function () {
  $(".js-example-basic-single").select2();
});
