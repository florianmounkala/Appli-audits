function Inscription(lastName, firstName, phone, email, groupe, password) {
  if (!lastName || !firstName || !phone || !email || !groupe || !password) {
    alert("Veuillez remplir tous les champs");
    return;
  } else {
    if (password.length < 12) {
      alert("Le mot de passe doit contenir au moins 12 caractères");
      return;
    }
  }
  fetch(`/api/User/UserExists/${email}`)
    .then((response) => response.json())
    .then((data) => {
      if (data) {
        alert("Email déjà utilisé");
        return;
      }
    });
  this.lastName = lastName;
  this.firstName = firstName;
  this.phone = phone;
  this.email = email;
  this.groupe = groupe;
  this.password = password;

  fetch(`/api/User/Register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      firstName: this.lastName,
      lastName: this.firstName,
      phone: this.phone,
      email: this.email,
      userGroupId: this.groupe,
      password: this.password,
    }),
  })
    .then((User) => {
      console.log(User);
      alert("Inscription réussie");
      window.location.href = "Connection.html";
    })
    .catch((error) => {
      console.log(error);
    });
}
document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("Inscription-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      var Nom = document.getElementById("nom").value;
      var Prenom = document.getElementById("prenom").value;
      var Phone = document.getElementById("phone").value;
      var Email = document.getElementById("email").value;
      var Groupe = 2;
      var Password = document.getElementById("motdepasse").value;
      console.log(Nom, Prenom, Phone, Email, Groupe, Password);
      Inscription(Nom, Prenom, Phone, Email, Groupe, Password);
    });
});
