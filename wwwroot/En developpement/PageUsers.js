fetch("/api/User/getAllUsers/")
  .then((response) => response.json())
  .then((data) => {
    const tableau = document.querySelector("#tableau tbody");
    tableau.innerHTML = "";

    data.forEach((User) => {
      const ligne = document.createElement("tr");

      const idCell = document.createElement("td");
      idCell.textContent = User.id;
      ligne.appendChild(idCell);

      const NameCell = document.createElement("td");
      NameCell.textContent = User.firstName + " " + User.lastName;
      ligne.appendChild(NameCell);

      const EmailCell = document.createElement("td");
      EmailCell.textContent = User.email;
      ligne.appendChild(EmailCell);

      const RoleCell = document.createElement("td");
      RoleCell.textContent = User.userGroupId;
      ligne.appendChild(RoleCell);

      const PhoneCell = document.createElement("td");
      PhoneCell.textContent = User.phone;
      ligne.appendChild(PhoneCell);

      tableau.appendChild(ligne);
    });
  })
  .catch((error) => {
    console.error(error);
  });
