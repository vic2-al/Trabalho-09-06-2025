// ===============================
// Funções utilitárias
// ===============================
function $(id) {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Elemento com ID ${id} não encontrado`);
  return element;
}

function parseInputValue(id, min = 0) {
  const value = parseFloat($(id).value);
  if (isNaN(value)) throw new Error(`Valor inválido para ${id}`);
  if (value < min) throw new Error(`Valor deve ser maior ou igual a ${min}`);
  return value;
}

function formatNumber(value, decimals = 2) {
  return value.toFixed(decimals);
}

function calculatePercentageDifference(value1, value2) {
  return ((value1 - value2) / value2) * 100;
}

// ===============================
// Funções de cálculo
// ===============================
function calcularCO2(agua, energia, lixo) {
  return (energia * CONFIG.FATORES.KWH) +
    (agua * CONFIG.FATORES.LITRO_AGUA) +
    (lixo * CONFIG.FATORES.KG_LIXO);
}

function calcularMediaBrasil(pessoas) {
  return CONFIG.MEDIA_BRASIL_POR_PESSOA * pessoas;
}

// ===============================
// Funções principais
// ===============================
function calcularImpacto() {
  try {
    const agua = parseInputValue('agua');
    const energia = parseInputValue('energia');
    const lixo = parseInputValue('lixo');
    const pessoas = parseInputValue('pessoas', 1);

    const impactoTotal = calcularCO2(agua, energia, lixo);
    const mediaBrasil = calcularMediaBrasil(pessoas);
    const diferencaPercentual = calculatePercentageDifference(impactoTotal, mediaBrasil);

    exibirResultados(impactoTotal, mediaBrasil, diferencaPercentual, agua, energia, lixo);
    $('btnSalvar').disabled = false;

  } catch (error) {
    alert(error.message);
  }
}

function exibirResultados(impactoTotal, mediaBrasil, diferencaPercentual, agua, energia, lixo) {
  $('resultado').style.display = 'block';
  atualizarGrafico(impactoTotal, mediaBrasil);
  $('dicas').innerHTML = gerarDicas(impactoTotal, mediaBrasil, diferencaPercentual, agua, energia, lixo);
}

function atualizarGrafico(seuImpacto, mediaBrasil) {
  const ctx = $('grafico').getContext('2d');
  if (grafico) grafico.destroy();

  grafico = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Seu Impacto', 'Média Brasileira'],
      datasets: [{
        label: 'Emissões de CO₂ (kg)',
        data: [seuImpacto, mediaBrasil],
        backgroundColor: ['rgba(46,139,87,0.7)', 'rgba(220,20,60,0.7)'],
        borderColor: ['rgba(46,139,87,1)', 'rgba(220,20,60,1)'],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'kg de CO₂ equivalente'
          }
        }
      }
    }
  });
}

function gerarDicas(impactoTotal, mediaBrasil, diferencaPercentual, agua, energia, lixo) {
  const mensagem = diferencaPercentual < 0
    ? `✅ Você está ${Math.abs(diferencaPercentual).toFixed(1)}% ABAIXO da média!`
    : `⚠️ Você está ${diferencaPercentual.toFixed(1)}% ACIMA da média!`;

  const classe = diferencaPercentual < 0 ? 'test-pass' : 'test-fail';

  return `
                <h3>📈 Análise de Impacto</h3>
                <p>Seu impacto mensal: <strong>${formatNumber(impactoTotal)} kg CO₂</strong></p>
                <p>Média brasileira para sua família: <strong>${formatNumber(mediaBrasil)} kg CO₂</strong></p>
                <p class="${classe}">${mensagem}</p>

                <h3>💡 Dicas para Melhorar</h3>
                ${gerarDicasCategoria('Água 💧', agua, CONFIG.LIMITES.AGUA, [
    "Feche a torneira ao escovar os dentes (economiza ~12L/min)",
    "Reduza o tempo no banho (5min = ~45L)",
    "Conserte vazamentos (1 gota/seg = ~1000L/mês)"
  ])}

                ${gerarDicasCategoria('Energia ⚡', energia, CONFIG.LIMITES.ENERGIA, [
    "Use lâmpadas LED (economiza ~80% de energia)",
    "Desligue aparelhos em standby (economiza ~12% da conta)",
    "Ajuste o ar-condicionado para 23-24°C (cada grau a menos gasta +8%)"
  ])}

                ${gerarDicasCategoria('Resíduos 🗑️', lixo, CONFIG.LIMITES.LIXO, [
    "Separe orgânicos para compostagem (reduz ~50% do lixo)",
    "Recicle plástico, papel e metal (1kg reciclado = 5kg CO₂ economizados)",
    "Prefira produtos com menos embalagem"
  ])}
            `;
}

function gerarDicasCategoria(titulo, valor, limite, dicas) {
  if (valor > limite) {
    return `
                    <div class="dica-categoria">
                        <h4>${titulo}</h4>
                        ${dicas.map(d => `<div class="dica-item">${d}</div>`).join('')}
                    </div>
                `;
  }
  return `
                <div class="dica-categoria">
                    <h4>${titulo} - Bom trabalho!</h4>
                    <div class="dica-item">Seu consumo está dentro da média recomendada.</div>
                </div>
            `;
}

function salvarDados() {
  const dados = {
    agua: $('agua').value,
    energia: $('energia').value,
    lixo: $('lixo').value,
    pessoas: $('pessoas').value,
    data: new Date().toLocaleString('pt-BR')
  };

  const historico = JSON.parse(localStorage.getItem('historicoEco')) || [];
  historico.push(dados);
  localStorage.setItem('historicoEco', JSON.stringify(historico));
  alert("✅ Dados salvos com sucesso!");
}

function limparDados() {
  if (confirm("Tem certeza que deseja limpar todos os dados?")) {
    $('agua').value = '';
    $('energia').value = '';
    $('lixo').value = '';
    $('pessoas').value = 1;
    $('resultado').style.display = 'none';
    $('btnSalvar').disabled = true;
    $('dicas').innerHTML = '';

    if (grafico) {
      grafico.destroy();
      grafico = null;
    }
  }
}