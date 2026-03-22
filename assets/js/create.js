const createForm = document.getElementById("createForm");
const formMessage = document.getElementById("formMessage");

createForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const titulo = document.getElementById("titulo").value.trim();
  const pessoasAfetadas = Number(
    document.getElementById("pessoasAfetadas").value,
  );
  const time = document.getElementById("time").value;
  const impacto = document.querySelector(
    'input[name="impacto"]:checked',
  )?.value;

  if (
    !titulo ||
    pessoasAfetadas === null ||
    pessoasAfetadas < 0 ||
    !time ||
    impacto === undefined
  ) {
    showMessage("Preencha todos os campos antes de criar.", "danger");
    return;
  }

  const newRequest = {
    id: Date.now(),
    titulo,
    pessoasAfetadas,
    impacto: impacto === "true",
    time,
    status: "Recebido",
  };

  saveLocalRequest(newRequest);

  createForm.reset();
  showMessage(
    "Chamado criado com sucesso. Redirecionando para o dashboard...",
    "success",
  );

  setTimeout(() => {
    window.location.href = "./dashboard.html";
  }, 2000);
});

function saveLocalRequest(request) {
  const existingRequests =
    JSON.parse(localStorage.getItem("extraRequests")) || [];
  existingRequests.push(request);
  localStorage.setItem("extraRequests", JSON.stringify(existingRequests));
}

function showMessage(message, type) {
  formMessage.innerHTML = `
    <div class="alert alert-${type}" role="alert">
      ${message}
    </div>
  `;
}