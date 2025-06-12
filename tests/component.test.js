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

function executarTodosTestes() {
  $('unitTestResult').innerHTML = '<h4>Teste Unitário:</h4>';
  $('componentTestResult').innerHTML = '<h4>Teste de Componente:</h4>';

  executarTesteUnitario();

  setTimeout(() => {
    try {
      executarTesteComponente();
    } catch (e) {
      $('componentTestResult').innerHTML += `<p class="test-error">⚠️ Erro durante o teste: ${e.message}</p>`;
    }
  }, 300);
}