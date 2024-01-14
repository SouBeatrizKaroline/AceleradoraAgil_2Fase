let pacientesCadastrados = localStorage.getItem('pacientes') ? JSON.parse(localStorage.getItem('pacientes')) : [];

let agendamentos = localStorage.getItem('agendamentos') ? JSON.parse(localStorage.getItem('agendamentos')) : [];

function salvarDadosLocais() {
  localStorage.setItem('pacientes', JSON.stringify(pacientesCadastrados));
  localStorage.setItem('agendamentos', JSON.stringify(agendamentos));
}

function cadastrarPaciente() {

  const nome = document.getElementById('nome').value;
  const telefone = document.getElementById('telefone').value;

  if (pacientesCadastrados[telefone]) {
    alert('Paciente já cadastrado!');
    return;
  }


  const paciente = { nome, telefone };
  pacientesCadastrados[telefone] = paciente;


  alert('Paciente cadastrado com sucesso');
  salvarDadosLocais();
  window.location.href = 'index.html';
}

function marcarConsulta() {

  const pacienteSelect = document.getElementById('paciente');
  const pacienteIndex = pacienteSelect.selectedIndex;
  const pacienteTelefone = pacienteSelect.options[pacienteIndex].value;

  const dia = document.getElementById('dia').value;
  const hora = document.getElementById('hora').value;
  const especialidade = document.getElementById('especialidade').value;

  const consultaExistente = agendamentos[dia] && agendamentos[dia][hora];
  if (consultaExistente) {
    alert('Já existe uma consulta agendada para este dia e hora.');
    return; 
  }

  if (!agendamentos[dia]) {
    agendamentos[dia] = {};
  }

  agendamentos[dia][hora] = {
    pacienteTelefone,
    especialidade,
  };

  alert('Consulta marcada com sucesso');
  salvarDadosLocais();
  window.location.href = 'index.html';
}

function cancelarConsulta() {

  const consultasSelect = document.getElementById('consulta');
  consultasSelect.innerHTML = '';

  for (const dia in agendamentos) {
    for (const hora in agendamentos[dia]) {
      const consulta = agendamentos[dia][hora];
      const option = document.createElement('option');
      option.value = `${dia} ${hora} - ${consulta.especialidade} (${consulta.pacienteTelefone})`;
      consultasSelect.appendChild(option);
    }
  }

  if (consultasSelect.options.length === 0) {
    alert('Não há consultas agendadas para cancelar.');
    return;
  }

  const consultaIndex = consultasSelect.selectedIndex;
  const consultaSelecionada = consultasSelect.options[consultaIndex].value;

  const [, diaHora, especialidade, pacienteTelefone] = /(\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}) - (.+) \((\d+)\)/.exec(consultaSelecionada);

  delete agendamentos[diaHora.substr(0, 10)][diaHora.substr(11)];
  if (Object.keys(agendamentos[diaHora.substr(0, 10)]).length === 0) {
    delete agendamentos[diaHora.substr(0, 10)];
  }

  alert('Consulta cancelada com sucesso');
  salvarDadosLocais();
  window.location.href = 'index.html';
}

function listarConsultas() {

  const consultasListDiv = document.getElementById('consultasList');
  consultasListDiv.innerHTML = '';

  if (Object.keys(agendamentos).length === 0) {
    alert('Não há consultas agendadas.');
    return;
  }

  for (const dia in agendamentos) {
    for (const hora in agendamentos[dia]) {
      const consulta = agendamentos[dia][hora];
      const consultaItem = document.createElement('div');
      consultaItem.textContent = `${dia} ${hora} - ${consulta.especialidade} (${consulta.pacienteTelefone})`;
      consultasListDiv.appendChild(consultaItem);
    }
  }

  window.location.href = 'listar.html';
}


function sair() {

  window.location.href = 'index.html';
}
