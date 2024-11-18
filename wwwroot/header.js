const password = localStorage.getItem("userPassword");
const userPseudo = localStorage.getItem("userPseudo");
var btndeconnexion = document.getElementById("btn-logout");

if (password == null || userPseudo == null) {
  window.location.href = "Connection.html";
}

btndeconnexion.addEventListener("click", function () {
  localStorage.removeItem("userPassword");
  localStorage.removeItem("userPseudo");
  window.location.href = "Connection.html";
});

document.getElementById("user").textContent = userPseudo;
