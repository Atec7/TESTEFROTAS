// Função para aprovar a solicitação
function aprovarSolicitacao(matricula) {
    // Lógica para aprovar a solicitação
    const solicitacoes = JSON.parse(localStorage.getItem('solicitacoes') || '[]');
    const solicitacao = solicitacoes.find(s => s.matricula === matricula);
    if (solicitacao) {
        solicitacao.status = 'aprovada';
        localStorage.setItem('solicitacoes', JSON.stringify(solicitacoes));

        // Atualiza o status no painel do solicitante
        localStorage.setItem(`status_${matricula}`, 'aprovada');

        // Notifica o solicitante e recarrega a página do solicitante
        alert(`Solicitação de matrícula ${matricula} foi aprovada!`);
        window.location.reload(); // Recarrega a página para refletir o novo status
        carregarSolicitacoes(); // Atualiza o painel do administrador
    }
}

// Função para reprovar a solicitação com justificativa
function reprovarSolicitacao(matricula) {
    const justificativa = prompt('Digite a justificativa para a reprovação');
    if (justificativa) {
        const solicitacoes = JSON.parse(localStorage.getItem('solicitacoes') || '[]');
        const solicitacao = solicitacoes.find(s => s.matricula === matricula);
        if (solicitacao) {
            solicitacao.status = 'reprovada';
            solicitacao.justificativa = justificativa;
            localStorage.setItem('solicitacoes', JSON.stringify(solicitacoes));

            // Atualiza o status no painel do solicitante
            localStorage.setItem(`status_${matricula}`, 'reprovada');
            window.location.reload(); // Recarrega a página para refletir o novo status
            carregarSolicitacoes(); // Atualiza o painel do administrador
            alert(`Solicitação de matrícula ${matricula} foi reprovada! Justificativa: ${justificativa}`);
        }
    }
}

// Função para carregar as solicitações no painel do administrador
function carregarSolicitacoes() {
    const solicitacoes = JSON.parse(localStorage.getItem('solicitacoes') || '[]');
    const solicitacoesContainer = document.getElementById('solicitacoes');
    solicitacoesContainer.innerHTML = '';

    solicitacoes.forEach(solicitacao => {
        const solicitacaoDiv = document.createElement('div');
        solicitacaoDiv.classList.add('solicitacao');
        solicitacaoDiv.innerHTML = `
            <p><strong>Matrícula:</strong> ${solicitacao.matricula}</p>
            <p><strong>Solicitante:</strong> ${solicitacao.solicitante}</p>
            <p><strong>Status:</strong> <span id="status-${solicitacao.matricula}">${solicitacao.status}</span></p>
            <button onclick="aprovarSolicitacao('${solicitacao.matricula}')">Aprovar</button>
            <button class="reprovar" onclick="reprovarSolicitacao('${solicitacao.matricula}')">Reprovar</button>
        `;
        solicitacoesContainer.appendChild(solicitacaoDiv);

        // Exibe a notificação para o administrador
        if (solicitacao.status === 'pendente') {
            const notificacao = document.getElementById('notificacao');
            notificacao.style.display = 'block';
            notificacao.textContent = `Nova solicitação de matrícula ${solicitacao.matricula}. Clique para aprovar ou reprovar.`;
        }
    });
}

// Função para enviar a solicitação do solicitante
function enviarSolicitacao() {
    const form = document.getElementById('solicitacaoForm');
    const formData = new FormData(form);
    const solicitacao = {};
    formData.forEach((value, key) => solicitacao[key] = value);

    // Simula o envio da solicitação
    let solicitacoes = JSON.parse(localStorage.getItem('solicitacoes') || '[]');
    solicitacao.status = 'pendente';

    // Verifica se o carro já está agendado
    const carroOcupado = solicitacoes.some(s => s.carro === solicitacao.carro &&
        s.dataRetirada === solicitacao.dataRetirada && s.horaRetirada === solicitacao.horaRetirada);
    if (carroOcupado) {
        alert('Este carro já está agendado para o horário solicitado!');
        return;
    }

    solicitacoes.push(solicitacao);
    localStorage.setItem('solicitacoes', JSON.stringify(solicitacoes));

    exibirDetalhesSolicitacao(solicitacao);

    // Esconde o formulário
    form.classList.add('solicitacaoEnviada');
    localStorage.setItem('matriculaSolicitacao', solicitacao.matricula);
    localStorage.setItem(`status_${solicitacao.matricula}`, 'pendente');
    document.getElementById('novaSolicitacaoButton').style.display = 'none'; // Esconde o botão de nova solicitação

    // Exibe o botão de nova solicitação
    setTimeout(function() {
        document.getElementById('novaSolicitacaoButton').style.display = 'block';
    }, 5000); // Mostra o botão após 5 segundos
}

// Exibe os detalhes da solicitação
function exibirDetalhesSolicitacao(solicitacao) {
    document.getElementById('detalhesMatricula').textContent = solicitacao.matricula;
    document.getElementById('detalhesSolicitante').textContent = solicitacao.solicitante;
    document.getElementById('detalhesStatus').textContent = solicitacao.status;
    document.getElementById('detalhesSolicitacao').style.display = 'block';
}

function mostrarFormulario() {
    document.getElementById('solicitacaoForm').classList.remove('solicitacaoEnviada');
    document.getElementById('novaSolicitacaoButton').style.display = 'none';
}

// Carregar status da solicitação ao recarregar a página do solicitante
window.onload = function() {
    const matricula = localStorage.getItem('matriculaSolicitacao');
    const status = localStorage.getItem(`status_${matricula}`);

    if (status) {
        const solicitacao = {
            matricula: matricula,
            status: status
        };
        exibirDetalhesSolicitacao(solicitacao);
    }

    carregarSolicitacoes();
};
