let allRequests = [];

if (sessionStorage.getItem("isLoggedIn") !== "true") {
  window.location.href = "../index.html";
}

async function loadRequests() {
  try {
    const response = await fetch("../assets/json/requests.json");
    const mockedRequests = await response.json();

    const savedRequests = JSON.parse(localStorage.getItem("allRequests"));
    allRequests = savedRequests || mockedRequests;

    renderMetrics();
    renderCharts();
    renderTable();
  } catch (error) {
    console.error("Erro ao carregar requests.json", error);
  }
}

function renderMetrics() {
  document.getElementById("metricTotal").textContent = allRequests.length;

  document.getElementById("metricCriticas").textContent = allRequests.filter(
    (item) => item.impacto,
  ).length;

  document.getElementById("metricBloqueantes").textContent = allRequests.filter(
    (item) => item.impacto,
  ).length;

  document.getElementById("metricConcluidas").textContent = allRequests.filter(
    (item) => item.status === "Concluído",
  ).length;
}

function renderCharts() {
  // Gráfico de status
  const statusCounts = {
    Recebido: allRequests.filter(r => r.status === "Recebido").length,
    "Em análise": allRequests.filter(r => r.status === "Em análise").length,
    "Em revisão": allRequests.filter(r => r.status === "Em revisão").length,
    Concluído: allRequests.filter(r => r.status === "Concluído").length,
  };

  const statusCtx = document.getElementById('statusChart').getContext('2d');
  new Chart(statusCtx, {
    type: 'pie',
    data: {
      labels: Object.keys(statusCounts),
      datasets: [{
        data: Object.values(statusCounts),
        backgroundColor: ['#ffc107', '#0dcaf0', '#6f42c1', '#198754'],
      }]
    }
  });

  // Gráfico de time
  const timeCounts = {};
  allRequests.forEach(r => {
    timeCounts[r.time] = (timeCounts[r.time] || 0) + 1;
  });

  const timeCtx = document.getElementById('timeChart').getContext('2d');
  new Chart(timeCtx, {
    type: 'bar',
    data: {
      labels: Object.keys(timeCounts),
      datasets: [{
        label: 'Chamados por Time',
        data: Object.values(timeCounts),
        backgroundColor: '#007bff',
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          afterBuildTicks: (scale) => {
            scale.ticks = scale.ticks.filter((tick) => Number.isInteger(tick.value));
          },
          ticks: {
            stepSize: 1,
            callback: (value) => (Number.isInteger(value) ? value : ""),
          },
        }
      }
    }
  });
}

function renderTable() {
  const tbody = document.getElementById('requestsTable');
  tbody.innerHTML = allRequests.map(request => `
    <tr>
      <td>${request.titulo}</td>
      <td>${request.status}</td>
      <td>${request.time}</td>
      <td>${request.pessoasAfetadas}</td>
      <td>${request.impacto ? 'Sim' : 'Não'}</td>
    </tr>
  `).join('');
}

loadRequests();