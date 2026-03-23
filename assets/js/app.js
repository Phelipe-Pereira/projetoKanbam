const loginForm = document.getElementById("loginForm");
const logoutBtn = document.getElementById("logoutBtn");
const loginMessage = document.getElementById("loginMessage");
const internalAccessLocked = document.getElementById("internalAccessLocked");
const internalAccessLinks = document.getElementById("internalAccessLinks");

const AUTH_KEY = "isLoggedIn";

function updateInternalAccessState() {
  const isLoggedIn = sessionStorage.getItem(AUTH_KEY) === "true";

  if (isLoggedIn) {
    internalAccessLocked.classList.add("d-none");
    internalAccessLinks.classList.remove("d-none");
    if (loginMessage) {
      loginMessage.innerHTML = `
        <div class="alert alert-success" role="alert">
          Login fake realizado com sucesso.
        </div>
      `;
    }
    return;
  }

  internalAccessLocked.classList.remove("d-none");
  internalAccessLinks.classList.add("d-none");
  if (loginMessage) {
    loginMessage.innerHTML = "";
  }
}

if (loginForm) {
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    sessionStorage.setItem(AUTH_KEY, "true");
    updateInternalAccessState();
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem(AUTH_KEY);
    updateInternalAccessState();
  });
}

updateInternalAccessState();
