
// ===============================
// Funções de Teste
// ===============================
function executarTesteUnitario() {
  const testResult = $('unitTestResult');
  testResult.innerHTML = '<h4>Teste Unitário:</h4>';

  function logResultado(condicao, mensagem) {
    testResult.innerHTML += `<p class="${condicao ? 'test-pass' : 'test-fail'}">
                    ${condicao ? '✅' : '❌'} ${mensagem}
                </p>`;
  }

  try {
    // Teste 1: Cálculo de CO2
    const test1 = calcularCO2(10000, 300, 30);
    logResultado(Math.abs(test1 - 258.5) < 0.1, "Cálculo de CO2 correto");

    // Teste 2: Média Brasil
    const test2 = calcularMediaBrasil(4);
    logResultado(test2 === 920, "Cálculo da média brasileira correto");

    // Teste 3: Formatação de números
    const test3 = formatNumber(123.4567, 3);
    logResultado(test3 === "123.457", "Formatação de números correta");

  } catch (e) {
    testResult.innerHTML += `<p class="test-error">⚠️ Erro durante o teste: ${e.message}</p>`;
  }
}

function executarTesteComponente() {
  const testResult = $('componentTestResult');
  testResult.innerHTML = '<h4>Teste de Componente:</h4>';

  try {
    // 1. Preparação do ambiente de teste
    const testValues = {
      agua: '12000',
      energia: '350',
      lixo: '25',
      pessoas: '3'
    };

    // Preencher campos com valores de teste
    Object.entries(testValues).forEach(([id, value]) => {
      $(id).value = value;
    });

    // 2. Execução do teste
    calcularImpacto();

    // 3. Verificação assíncrona dos resultados
    setTimeout(() => {
      try {
        const resultadoDiv = $('resultado');
        const grafico = $('grafico');
        const dicas = $('dicas');

        // Verificações do teste
        const tests = [
          {
            condition: resultadoDiv.style.display !== 'none',
            message: "Componente de resultado exibido corretamente"
          },
          {
            condition: grafico.clientHeight > 0,
            message: "Gráfico renderizado corretamente"
          },
          {
            condition: dicas.innerHTML.includes('Dicas para Melhorar'),
            message: "Dicas personalizadas exibidas"
          },
          {
            condition: $('btnSalvar').disabled === false,
            message: "Botão de salvar habilitado após cálculo"
          }
        ];

        // Exibir resultados dos testes
        tests.forEach(test => {
          testResult.innerHTML += `<p class="${test.condition ? 'test-pass' : 'test-fail'}">
                                ${test.condition ? '✅' : '❌'} ${test.message}
                            </p>`;
        });

      } catch (e) {
        testResult.innerHTML += `<p class="test-error">⚠️ Erro durante o teste: ${e.message}</p>`;
      } finally {
        // Limpeza após teste
        limparDados();
      }
    }, 700);

  } catch (e) {
    testResult.innerHTML += `<p class="test-error">⚠️ Erro durante o teste: ${e.message}</p>`;
  }
}
