document.addEventListener('DOMContentLoaded', function() {
    // Elementos da interface
    const introSection = document.getElementById('intro');
    const quizContainer = document.getElementById('quiz-container');
    const resultsSection = document.getElementById('results');
    const userForm = document.getElementById('user-form');
    const nomeInput = document.getElementById('nome');
    const emailInput = document.getElementById('email');
    const telefoneInput = document.getElementById('telefone');
    const restartBtn = document.getElementById('restart-btn');
    const questionText = document.getElementById('question-text');
    const optionsDiv = document.getElementById('options');
    const progressBar = document.getElementById('progress');
    const currentQuestionSpan = document.getElementById('current');
    const totalQuestionsSpan = document.getElementById('total');
    const phaseDiv = document.getElementById('phase');
    const symptomsDiv = document.getElementById('symptoms');
    const risksDiv = document.getElementById('risks');
    const nutriDiv = document.getElementById('nutri');

    // Dados da usuária
    let userData = {
        nome: "",
        email: "",
        telefone: ""
    };

    // Perguntas do quiz
    const questions = [
        { text: "Você percebeu mudanças no seu ciclo menstrual (irregularidade, espaçamento ou ausência)?", key: "ciclo", type: "single" },
        { text: "Sente ondas de calor ou suores noturnos com frequência?", key: "calor", type: "single" },
        { text: "Tem notado alterações de humor, ansiedade ou irritabilidade sem motivo aparente?", key: "humor", type: "single" },
        { text: "Percebeu diminuição da libido ou desconforto nas relações sexuais?", key: "libido", type: "single" },
        { text: "Tem dificuldade para dormir ou acorda várias vezes durante a noite?", key: "sono", type: "single" },
        { text: "Sente dores articulares, musculares ou fadiga frequente?", key: "dor", type: "single" },
        { text: "Notou ganho de peso, principalmente na região abdominal, mesmo sem grandes mudanças na alimentação?", key: "peso", type: "single" },
        { 
            text: "Selecione abaixo os sintomas que você sente atualmente:",
            key: "sintomas",
            type: "multi",
            options: [
                { label: "Ondas de calor", value: "calor" },
                { label: "Insônia", value: "sono" },
                { label: "Alterações de humor", value: "humor" },
                { label: "Dores articulares/musculares", value: "dor" },
                { label: "Ganho de peso", value: "peso" },
                { label: "Diminuição da libido", value: "libido" },
                { label: "Secura vaginal", value: "secura" },
                { label: "Cansaço/fadiga", value: "fadiga" }
            ]
        }
    ];

    // Riscos por sintoma
    const symptomRisks = {
        calor: "Ondas de calor frequentes podem indicar maior risco de doenças cardiovasculares e prejudicam o sono, levando a fadiga e irritabilidade.",
        sono: "A insônia crônica aumenta o risco de depressão, ansiedade, queda da imunidade e doenças metabólicas.",
        humor: "Alterações de humor não tratadas podem evoluir para quadros de depressão e isolamento social.",
        dor: "Dores articulares e musculares podem indicar início de osteoporose e perda de massa muscular, aumentando o risco de quedas e fraturas.",
        peso: "Ganho de peso abdominal eleva o risco de diabetes, hipertensão e doenças do coração.",
        libido: "Diminuição da libido e desconforto sexual podem afetar autoestima, relacionamentos e saúde emocional.",
        secura: "Secura vaginal pode causar dor, infecções urinárias recorrentes e impacto negativo na vida sexual.",
        fadiga: "Cansaço constante pode ser sinal de desequilíbrio hormonal, anemia ou problemas metabólicos, prejudicando a qualidade de vida."
    };

    // Respostas do usuário
    let currentQuestion = 0;
    let answers = [];
    let selectedSymptoms = [];

    // Fases e relatórios
    function getPhaseAndReport(answers) {
        // Pontuação total: quanto maior, mais sintomas e mais avançada a fase
        const total = answers.reduce((a, b) => a + b, 0);

        if (total <= 5) {
            return {
                phase: "Fase Inicial do Climatério",
                symptoms: `Olá, ${userData.nome}! Você apresenta poucos sintomas ou sinais leves. É provável que esteja no início do climatério, quando as alterações hormonais começam, mas ainda não impactam fortemente o dia a dia.`,
                risks: `
                    <strong>Riscos do não tratamento:</strong> Mesmo com sintomas leves, é fundamental buscar acompanhamento. O climatério pode evoluir rapidamente. Sem tratamento, há risco de agravamento dos sintomas, insônia, ansiedade, alterações do ciclo menstrual e desenvolvimento silencioso de doenças cardiovasculares, osteoporose e depressão. <br><br>
                    <span style="color:#a259c6;font-weight:bold;">O acompanhamento nutricional especializado é essencial para prevenir complicações e promover um envelhecimento saudável, sem necessidade de remédios ou hormônios que podem trazer efeitos colaterais graves.</span>
                `
            };
        } else if (total <= 12) {
            return {
                phase: "Climatério em Evolução",
                symptoms: `Olá, ${userData.nome}! Você apresenta sintomas moderados, como alterações de humor, sono e ondas de calor. Isso indica que está em uma fase intermediária do climatério, com maior oscilação hormonal.`,
                risks: `
                    <strong>Riscos do não tratamento:</strong> Os sintomas podem se intensificar rapidamente, afetando sua qualidade de vida, autoestima, relacionamentos e desempenho profissional. O não tratamento pode resultar em agravamento de insônia, ansiedade, depressão, dores articulares e fadiga crônica. Além disso, aumenta significativamente o risco de doenças cardiovasculares, osteoporose, perda de memória e alterações metabólicas, como ganho de peso e diabetes.<br><br>
                    <span style="color:#a259c6;font-weight:bold;">Procure acompanhamento nutricional especializado para equilibrar hormônios e sintomas de forma natural, evitando medicamentos e hormônios sintéticos.</span>
                `
            };
        } else {
            return {
                phase: "Menopausa Instalada",
                symptoms: `Olá, ${userData.nome}! Você apresenta sintomas intensos e frequentes, típicos da menopausa. Isso indica que a produção hormonal já está bastante reduzida.`,
                risks: `
                    <strong>Riscos do não tratamento:</strong> A menopausa sem acompanhamento pode trazer consequências sérias e irreversíveis. O risco de doenças cardiovasculares (infarto, AVC), osteoporose com fraturas, depressão profunda, insônia crônica, perda de massa muscular e deterioração da saúde sexual é muito elevado. Além disso, sintomas como ondas de calor, suores noturnos, irritabilidade e fadiga podem se tornar incapacitantes, prejudicando sua autonomia e qualidade de vida.<br><br>
                    <span style="color:#a259c6;font-weight:bold;">O acompanhamento nutricional é urgente e indispensável nesta fase! Uma alimentação adequada pode aliviar sintomas, prevenir doenças e evitar os efeitos colaterais de remédios e hormônios sintéticos.</span>
                `
            };
        }
    }

    // Inicializar o quiz
    function initQuiz() {
        totalQuestionsSpan.textContent = questions.length;
        userForm.addEventListener('submit', handleFormSubmit);
        restartBtn.addEventListener('click', restartQuiz);
    }

    // Validação e início do quiz
    function handleFormSubmit(e) {
        e.preventDefault();
        // Validação simples
        if (!nomeInput.value.trim() || !emailInput.value.trim() || !telefoneInput.value.trim()) {
            alert("Por favor, preencha todos os campos.");
            return;
        }
        userData.nome = nomeInput.value.trim();
        userData.email = emailInput.value.trim();
        userData.telefone = telefoneInput.value.trim();
        startQuiz();
    }

    // Iniciar o quiz
    function startQuiz() {
        introSection.classList.remove('active');
        quizContainer.classList.add('active');
        currentQuestion = 0;
        answers = [];
        selectedSymptoms = [];
        loadQuestion();
    }

    // Carregar uma pergunta
    function loadQuestion() {
        optionsDiv.innerHTML = "";

        if (currentQuestion < questions.length) {
            questionText.textContent = questions[currentQuestion].text;
            currentQuestionSpan.textContent = currentQuestion + 1;

            if (questions[currentQuestion].type === "single") {
                // Opções padrão
                optionsDiv.innerHTML = `
                    <button class="option-btn" data-value="3">Sempre</button>
                    <button class="option-btn" data-value="2">Frequentemente</button>
                    <button class="option-btn" data-value="1">Às vezes</button>
                    <button class="option-btn" data-value="0">Nunca</button>
                `;
                document.querySelectorAll('.option-btn').forEach(button => {
                    button.addEventListener('click', () => {
                        selectOption(button);
                    });
                });
            } else if (questions[currentQuestion].type === "multi") {
                // Pergunta de múltipla escolha
                const group = document.createElement('div');
                group.className = "checkbox-group";
                questions[currentQuestion].options.forEach(opt => {
                    const label = document.createElement('label');
                    label.innerHTML = `<input type="checkbox" value="${opt.value}"> ${opt.label}`;
                    group.appendChild(label);
                });
                optionsDiv.appendChild(group);

                // Botão para continuar
                const nextBtn = document.createElement('button');
                nextBtn.textContent = "Ver Resultado";
                nextBtn.className = "btn";
                nextBtn.style.marginTop = "20px";
                nextBtn.addEventListener('click', () => {
                    // Coletar sintomas selecionados
                    selectedSymptoms = Array.from(group.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
                    loadQuestion(++currentQuestion); // Avança para mostrar resultado
                });
                optionsDiv.appendChild(nextBtn);
            }

            updateProgressBar();
        } else {
            showResults();
        }
    }

    // Selecionar uma opção
    function selectOption(button) {
        // Registrar a resposta
        const value = parseInt(button.getAttribute('data-value'));
        answers.push(value);

        // Avançar para a próxima pergunta após um breve delay
        setTimeout(() => {
            currentQuestion++;
            loadQuestion();
        }, 300);
    }

    // Atualizar a barra de progresso
    function updateProgressBar() {
        const progress = ((currentQuestion) / questions.length) * 100;
        progressBar.style.width = `${progress}%`;
    }

    // Mostrar os resultados
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
    }

    // Reiniciar o quiz
    function restartQuiz() {
        currentQuestion = 0;
        answers = [];
        selectedSymptoms = [];
        resultsSection.classList.remove('active');
        introSection.classList.add('active');
        // Limpa os campos do formulário
        userForm.reset();
    }

    // Inicializar o quiz quando a página carregar
    initQuiz();
});
