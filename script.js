function showResults() {
    quizContainer.classList.remove('active');
    resultsSection.classList.add('active');

    const report = getPhaseAndReport(answers);

    phaseDiv.textContent = report.phase;
    symptomsDiv.innerHTML = `<strong>Sintomas:</strong> ${report.symptoms}`;

    // Riscos gerais + riscos por sintoma
    let risksHTML = report.risks;
    if (selectedSymptoms.length > 0) {
        risksHTML += `<br><br><strong>Riscos específicos dos sintomas selecionados:</strong><ul>`;
        selectedSymptoms.forEach(symp => {
            if (symptomRisks[symp]) {
                risksHTML += `<li>${symptomRisks[symp]}</li>`;
            }
        });
        risksHTML += `</ul>`;
    }
    risksDiv.innerHTML = risksHTML;

    nutriDiv.innerHTML = `
        <div style="margin-top:20px; color:#7c2fa0; font-weight:bold;">
            Recomendação: Procure um acompanhamento nutricional especializado.<br>
            Uma alimentação adequada pode aliviar sintomas, prevenir doenças e melhorar sua qualidade de vida de forma natural, sem necessidade de remédios ou hormônios que podem trazer efeitos colaterais graves.
        </div>
    `;

    // Enviar dados para o Google Sheets via SheetDB
    const payload = {
        data: [{
            Nome: userData.nome,
            Email: userData.email,
            Telefone: userData.telefone,
            Respostas: report.phase, // Agora salva a fase!
            Sintomas: selectedSymptoms.join(', '),
            Data: new Date().toLocaleDateString('pt-BR') // Só a data
        }]
    };

    if (userData.nome && userData.email && userData.telefone) {
        fetch('https://sheetdb.io/api/v1/x6jebjfxepf9n', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Dados enviados para o banco:', data);
        })
        .catch(error => {
            console.error('Erro ao enviar dados:', error);
        });
    }
}
