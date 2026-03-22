const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    // Simulação de login - redireciona para dashboard
    window.location.href = "./pages/dashboard.html";
  });
}
