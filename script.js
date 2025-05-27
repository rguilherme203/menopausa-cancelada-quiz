document.addEventListener('DOMContentLoaded', function() {
    // Elementos da interface
    const introSection = document.getElementById('intro');
    const quizContainer = document.getElementById('quiz-container');
    const resultsSection = document.getElementById('results');
    const startBtn = document.getElementById('start-btn');
    const restartBtn = document.getElementById('restart-btn');
    const questionText = document.getElementById('question-text');
    const optionBtns = document.querySelectorAll('.option-btn');
    const progressBar = document.getElementById('progress');
    const currentQuestionSpan = document.getElementById('current');
    const totalQuestionsSpan = document.getElementById('total');
    const phaseDiv = document.getElementById('phase');
    const symptomsDiv = document.getElementById('symptoms');
    const risksDiv = document.getElementById('risks');
    const tipsDiv = document.getElementById('tips');

    // Perguntas do quiz
    const questions = [
        { text: "Você percebeu mudanças no seu ciclo menstrual (irregularidade, espaçamento ou ausência)?", key: "ciclo" },
        { text: "Sente ondas de calor ou suores noturnos com frequência?", key: "calor" },
        { text: "Tem notado alterações de humor, ansiedade ou irritabilidade sem motivo aparente?", key: "humor" },
        { text: "Percebeu diminuição da libido ou desconforto nas relações sexuais?", key: "libido" },
        { text: "Tem dificuldade para dormir ou acorda várias vezes durante a noite?", key: "sono" },
        { text: "Sente dores articulares, musculares ou fadiga frequente?", key: "dor" },
        { text: "Notou ganho de peso, principalmente na região abdominal, mesmo sem grandes mudanças na alimentação?", key: "peso" }
    ];

    // Respostas do usuário
    let currentQuestion = 0;
    let answers = [];

    // Fases e relatórios
    function getPhaseAndReport(answers) {
        // Pontuação total: quanto maior, mais sintomas e mais avançada a fase
        const total = answers.reduce((a, b) => a + b, 0);

        // Fase e relatório
        if (total <= 5) {
            return {
                phase: "Fase Inicial do Climatério",
                symptoms: "Você apresenta poucos sintomas ou sinais leves. É provável que esteja no início do climatério, quando as alterações hormonais começam, mas ainda não impactam fortemente o dia a dia.",
                risks: "Mesmo com sintomas leves, é importante observar mudanças e manter acompanhamento médico. O não tratamento pode levar a piora dos sintomas e aumento do risco de doenças cardiovasculares e ósseas no futuro.",
                tips: [
                    "Mantenha hábitos saudáveis: alimentação equilibrada, exercícios e sono regular.",
                    "Faça exames periódicos e converse com seu ginecologista sobre prevenção.",
                    "Busque informações confiáveis sobre o climatério e menopausa."
                ]
            };
        } else if (total <= 12) {
            return {
                phase: "Climatério em Evolução",
                symptoms: "Você apresenta sintomas moderados, como alterações de humor, sono e ondas de calor. Isso indica que está em uma fase intermediária do climatério, com maior oscilação hormonal.",
                risks: "Sem tratamento, os sintomas podem se intensificar, afetando qualidade de vida, autoestima e relacionamentos. O risco de osteoporose, doenças cardíacas e depressão aumenta.",
                tips: [
                    "Procure orientação médica para avaliar necessidade de reposição hormonal ou outras terapias.",
                    "Pratique atividades relaxantes, como meditação ou yoga.",
                    "Converse com outras mulheres que passam pelo mesmo momento para trocar experiências."
                ]
            };
        } else {
            return {
                phase: "Menopausa Instalada",
                symptoms: "Você apresenta sintomas intensos e frequentes, típicos da menopausa. Isso indica que a produção hormonal já está bastante reduzida.",
                risks: "Sem tratamento, há maior risco de doenças cardiovasculares, osteoporose, depressão, insônia crônica e piora dos sintomas físicos e emocionais.",
                tips: [
                    "Busque acompanhamento médico especializado para tratamento individualizado.",
                    "Adote uma rotina de autocuidado: alimentação rica em cálcio, exercícios de força e lazer.",
                    "Não negligencie sintomas emocionais: procure apoio psicológico se necessário."
                ]
            };
        }
    }

    // Inicializar o quiz
    function initQuiz() {
        totalQuestionsSpan.textContent = questions.length;
        startBtn.addEventListener('click', startQuiz);
        restartBtn.addEventListener('click', restartQuiz);

        optionBtns.forEach(button => {
            button.addEventListener('click', () => {
                selectOption(button);
            });
        });
    }

    // Iniciar o quiz
    function startQuiz() {
        introSection.classList.remove('active');
        quizContainer.classList.add('active');
        currentQuestion = 0;
        answers = [];
        loadQuestion();
    }

    // Carregar uma pergunta
    function loadQuestion() {
        resetOptionButtons();

        if (currentQuestion < questions.length) {
            questionText.textContent = questions[currentQuestion].text;
            currentQuestionSpan.textContent = currentQuestion + 1;
            updateProgressBar();
        } else {
            showResults();
        }
    }

    // Resetar os botões de opção
    function resetOptionButtons() {
        optionBtns.forEach(button => {
            button.classList.remove('selected');
        });
    }

    // Selecionar uma opção
    function selectOption(button) {
        resetOptionButtons();
        button.classList.add('selected');

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
        risksDiv.innerHTML = `<strong>Riscos do não tratamento:</strong> ${report.risks}`;
        tipsDiv.innerHTML = `<strong>Dicas:</strong><ul>${report.tips.map(tip => `<li>${tip}</li>`).join('')}</ul>`;
    }

    // Reiniciar o quiz
    function restartQuiz() {
        currentQuestion = 0;
        answers = [];
        resultsSection.classList.remove('active');
        introSection.classList.add('active');
    }

    // Inicializar o quiz quando a página carregar
    initQuiz();
});
