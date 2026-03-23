const detailContent = document.getElementById("detailContent");

async function loadDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = parseInt(urlParams.get('id'));

  if (!id) {
    detailContent.innerHTML = '<p class="text-danger">ID do chamado não encontrado.</p>';
    return;
  }

  try {
    const response = await fetch("../assets/json/requests.json");
    const mockedRequests = await response.json();

    const savedRequests = JSON.parse(localStorage.getItem("allRequests"));
    const allRequests = savedRequests || mockedRequests;

    const request = allRequests.find(r => r.id === id);

    if (!request) {
      detailContent.innerHTML = '<p class="text-danger">Chamado não encontrado.</p>';
      return;
    }

    renderDetail(request);
  } catch (error) {
    console.error("Erro ao carregar detalhes", error);
    detailContent.innerHTML = '<p class="text-danger">Erro ao carregar detalhes.</p>';
  }
}

function renderDetail(request) {
  const impactBadge = request.impacto ? '<span class="badge bg-danger">Crítico</span>' : '<span class="badge bg-success">Não crítico</span>';

  detailContent.innerHTML = `
    <h2>${request.titulo}</h2>
    <div class="mb-3">
      ${impactBadge}
    </div>
    <div class="row">
      <div class="col-md-6">
        <p><strong>ID:</strong> ${request.id}</p>
        <p><strong>Pessoas afetadas:</strong> ${request.pessoasAfetadas}</p>
        <p><strong>Time:</strong> ${request.time}</p>
      </div>
      <div class="col-md-6">
        <p><strong>Status:</strong> ${request.status}</p>
        <p><strong>Impacto:</strong> ${request.impacto ? 'Impede funcionamento' : 'Não impede funcionamento'}</p>
      </div>
    </div>
  `;
}

loadDetail();