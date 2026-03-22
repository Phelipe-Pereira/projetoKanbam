const columns = {
  Recebido: document.getElementById("recebido"),
  "Em análise": document.getElementById("em-analise"),
  "Em revisão": document.getElementById("em-revisao"),
  Concluído: document.getElementById("concluido"),
};

let allRequests = [];

async function loadRequests() {
  try {
    const response = await fetch("../assets/json/requests.json");
    const mockedRequests = await response.json();

    const savedRequests = JSON.parse(localStorage.getItem("allRequests"));
    allRequests = savedRequests || mockedRequests;

    renderBoard();
  } catch (error) {
    console.error("Erro ao carregar requests.json", error);
  }
}

function renderBoard() {
  clearColumns();

  allRequests.forEach((request, index) => {
    const card = createCard(request, index);

    if (columns[request.status]) {
      columns[request.status].appendChild(card);
    }
  });

  updateCounters();
}

function clearColumns() {
  Object.values(columns).forEach((column) => {
    column.innerHTML = "";
  });
}

function createCard(request, index) {
  const card = document.createElement("div");
  card.className = "request-card";
  card.dataset.requestId = request.id;

  const impactClass = request.impacto ? "impact-critical" : "";
  const peopleClass = request.pessoasAfetadas > 10 ? "high-impact" : "";

  card.innerHTML = `
    <h3>${request.titulo}</h3>

    <div>
      ${request.impacto ? '<span class="badge bg-danger">Crítico</span>' : ''}
    </div>

    <p class="request-meta"><strong>Pessoas afetadas:</strong> ${request.pessoasAfetadas}</p>
    <p class="request-meta"><strong>Time:</strong> ${request.time}</p>
    <p class="request-meta"><strong>Status:</strong> ${request.status}</p>
  `;

  const classesToAdd = [];
  if (impactClass) classesToAdd.push(impactClass);
  if (peopleClass) classesToAdd.push(peopleClass);
  if (classesToAdd.length) card.classList.add(...classesToAdd);

  // Clique no card abre modal com informações, status e ação de exclusão.
  card.addEventListener("click", () => {
    openEditModal(request);
  });

  return card;
}

function buildActionButtons(requestId, status) {
  return "";
}

// Drag and drop removido conforme pedido
let isDragging = false;

// Função para abrir modal de criação
function openCreateModal() {
  const modalEl = document.getElementById('createModal');
  if (!modalEl) {
    alert('Modal not found');
    return;
  }
  const modal = new bootstrap.Modal(modalEl);
  modal.show();
}

function openEditModal(request) {
  const editModalEl = document.getElementById('editModal');
  if (!editModalEl) return;

  document.getElementById('editId').value = request.id;
  document.getElementById('editTitulo').value = request.titulo || '';
  document.getElementById('editPessoasAfetadas').value = request.pessoasAfetadas || 0;
  document.getElementById('editTime').value = request.time || '';
  document.querySelector(`input[name="editImpacto"][value="${request.impacto}"]`).checked = true;
  document.getElementById('editStatus').value = request.status || 'Recebido';

  const modal = new bootstrap.Modal(editModalEl);
  modal.show();
}

function moveRequest(requestId, newStatus) {
  const requestIndex = allRequests.findIndex((item) => item.id === requestId);
  if (requestIndex >= 0) {
    allRequests[requestIndex].status = newStatus;
    persistLocalRequests();
    renderBoard();
  }
}

function deleteRequest(requestId) {
  allRequests = allRequests.filter((item) => item.id !== requestId);
  persistLocalRequests();
  renderBoard();
}

function persistLocalRequests() {
  // Salvar todos os requests, incluindo modificações nos mocked
  localStorage.setItem("allRequests", JSON.stringify(allRequests));
}

function updateCounters() {
  document.getElementById("countRecebido").textContent = allRequests.filter(
    (item) => item.status === "Recebido",
  ).length;

  document.getElementById("countAnalise").textContent = allRequests.filter(
    (item) => item.status === "Em análise",
  ).length;

  document.getElementById("countRevisao").textContent = allRequests.filter(
    (item) => item.status === "Em revisão",
  ).length;

  document.getElementById("countConcluido").textContent = allRequests.filter(
    (item) => item.status === "Concluído",
  ).length;
}

loadRequests();

// Lógica do formulário de criação
const createForm = document.getElementById("createForm");
const formMessage = document.getElementById("formMessage");

function showMessage(message, type) {
  if (!formMessage) return;
  formMessage.innerHTML = `
    <div class="alert alert-${type}" role="alert">
      ${message}
    </div>
  `;
}

if (createForm) {
  console.log('Create form found');
  createForm.addEventListener("submit", function (event) {
    console.log('Create form submitted');
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
      "Chamado criado com sucesso.",
      "success",
    );

    // Fechar modal e recarregar
    const modalEl = document.getElementById('createModal');
    if (modalEl) {
      // Remover foco do botão de submit antes de esconder o modal para evitar conflito de aria-hidden
      if (document.activeElement && typeof document.activeElement.blur === 'function') {
        document.activeElement.blur();
      }
      const createModalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
      createModalInstance.hide();
    }

    renderBoard();
  });
}

function saveLocalRequest(request) {
  allRequests.push(request);
  persistLocalRequests();
}

// Lógica do formulário de edição
const editForm = document.getElementById("editForm");
const editMessage = document.getElementById("editMessage");

if (editForm) {
  editForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const id = parseInt(document.getElementById('editId').value);
    const titulo = document.getElementById("editTitulo").value.trim();
    const pessoasAfetadas = Number(document.getElementById("editPessoasAfetadas").value);
    const time = document.getElementById("editTime").value;
    const impacto = document.querySelector('input[name="editImpacto"]:checked')?.value;
    const status = document.getElementById("editStatus").value;

    if (!titulo || pessoasAfetadas < 0 || !time || impacto === undefined || !status) {
      showEditMessage("Preencha todos os campos.", "danger");
      return;
    }

    // Encontrar e atualizar o request
    const requestIndex = allRequests.findIndex(r => r.id === id);
    if (requestIndex !== -1) {
      allRequests[requestIndex] = {
        ...allRequests[requestIndex],
        titulo,
        pessoasAfetadas,
        impacto: impacto === "true",
        time,
        status
      };
      persistLocalRequests();
      renderBoard();
    }

    // Fechar modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
    modal.hide();

    showEditMessage("Chamado atualizado com sucesso.", "success");
  });
}

const editDeleteBtn = document.getElementById("editDeleteBtn");
if (editDeleteBtn) {
  editDeleteBtn.addEventListener("click", () => {
    const id = parseInt(document.getElementById("editId").value, 10);
    if (Number.isNaN(id)) return;

    deleteRequest(id);

    const editModalEl = document.getElementById("editModal");
    const modal = bootstrap.Modal.getOrCreateInstance(editModalEl);
    modal.hide();
  });
}

function showEditMessage(message, type) {
  editMessage.innerHTML = `
    <div class="alert alert-${type}" role="alert">
      ${message}
    </div>
  `;
}
