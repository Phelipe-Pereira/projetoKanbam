const createForm = document.getElementById("createForm");
const formMessage = document.getElementById("formMessage");
const myRequestsTable = document.getElementById("myRequestsTable");
const trackingEmailInput = document.getElementById("trackingEmail");
const trackBtn = document.getElementById("trackBtn");
const requesterEmailInput = document.getElementById("solicitanteEmail");
const requesterNameInput = document.getElementById("solicitanteNome");

const TRACKING_EMAIL_KEY = "trackingEmail";

createForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const solicitanteNome = requesterNameInput.value.trim();
  const solicitanteEmail = requesterEmailInput.value.trim().toLowerCase();
  const titulo = document.getElementById("titulo").value.trim();
  const pessoasAfetadas = Number(
    document.getElementById("pessoasAfetadas").value,
  );
  const time = document.getElementById("time").value;
  const impacto = document.querySelector(
    'input[name="impacto"]:checked',
  )?.value;

  if (
    !solicitanteNome ||
    !solicitanteEmail ||
    !titulo ||
    Number.isNaN(pessoasAfetadas) ||
    pessoasAfetadas < 0 ||
    !time ||
    impacto === undefined
  ) {
    showMessage("Preencha todos os campos antes de criar.", "danger");
    return;
  }

  const newRequest = {
    id: Date.now(),
    solicitanteNome,
    solicitanteEmail,
    titulo,
    pessoasAfetadas,
    impacto: impacto === "true",
    time,
    status: "Recebido",
  };

  await saveLocalRequest(newRequest);

  createForm.reset();
  trackingEmailInput.value = solicitanteEmail;
  localStorage.setItem(TRACKING_EMAIL_KEY, solicitanteEmail);
  renderMyRequests(solicitanteEmail);
  showMessage("Solicitação enviada com sucesso.", "success");
});

async function loadAllRequests() {
  const response = await fetch("../assets/json/requests.json");
  const mockedRequests = await response.json();
  const savedRequests = JSON.parse(localStorage.getItem("allRequests"));
  return savedRequests || mockedRequests;
}

async function saveLocalRequest(request) {
  const existingRequests = await loadAllRequests();
  existingRequests.push(request);
  localStorage.setItem("allRequests", JSON.stringify(existingRequests));
}

function showMessage(message, type) {
  formMessage.innerHTML = `
    <div class="alert alert-${type}" role="alert">
      ${message}
    </div>
  `;
}

function renderMyRequests(email) {
  if (!email) {
    myRequestsTable.innerHTML = `
      <tr>
        <td colspan="2" class="text-muted">Informe seu email para consultar solicitações.</td>
      </tr>
    `;
    return;
  }

  const allRequests = JSON.parse(localStorage.getItem("allRequests")) || [];
  const filteredRequests = allRequests
    .filter((request) => (request.solicitanteEmail || "").toLowerCase() === email)
    .sort((a, b) => Number(b.id) - Number(a.id));

  if (!filteredRequests.length) {
    myRequestsTable.innerHTML = `
      <tr>
        <td colspan="2" class="text-muted">Nenhuma solicitação encontrada para este email.</td>
      </tr>
    `;
    return;
  }

  myRequestsTable.innerHTML = filteredRequests
    .map((request) => {
      return `
        <tr>
          <td>${request.titulo}</td>
          <td>${request.status}</td>
        </tr>
      `;
    })
    .join("");
}

if (trackBtn) {
  trackBtn.addEventListener("click", () => {
    const email = trackingEmailInput.value.trim().toLowerCase();
    localStorage.setItem(TRACKING_EMAIL_KEY, email);
    renderMyRequests(email);
  });
}

const initialTrackingEmail = localStorage.getItem(TRACKING_EMAIL_KEY) || "";
if (initialTrackingEmail) {
  trackingEmailInput.value = initialTrackingEmail;
}
renderMyRequests(initialTrackingEmail);