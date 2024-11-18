function Connection(username, password) {
  fetch(`/api/User/Connection/${username}/${password}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data) {
        console.log("Connexion réussie");
        localStorage.setItem("userPseudo", username);
        localStorage.setItem("userPassword", password);
        window.location.href = "index.html";
      } else {
        console.log("Connexion échouée");
        document.getElementById("error-message").style.display = "block";
      }
    })
    .catch((error) => {
      document.getElementById("error-message").style.display = "block";
      console.error("Erreur lors de bdd :", error.message);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("connexion-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      var Username = document.getElementById("username").value;
      var Password = document.getElementById("password").value;
      Connection(Username, Password);
    });
});
