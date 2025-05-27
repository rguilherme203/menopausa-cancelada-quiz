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

        if (total <= 5) {
            return {
                phase: "Fase Inicial do Climatério",
                symptoms: "Você apresenta poucos sintomas ou sinais leves. É provável que esteja no início do climatério, quando as alterações hormonais começam, mas ainda não impactam fortemente o dia a dia.",
                risks: `
                    <strong>Riscos do não tratamento:</strong> Mesmo com sintomas leves, é fundamental buscar acompanhamento médico. O climatério é uma fase de transição que pode evoluir rapidamente. Sem tratamento, há risco de agravamento dos sintomas, como insônia, ansiedade, irritabilidade e alterações do ciclo menstrual. Além disso, a falta de acompanhamento pode levar ao desenvolvimento silencioso de doenças cardiovasculares, osteoporose, perda de massa muscular e aumento do risco de depressão. <br><br>
                    <span style="color:#a259c6;font-weight:bold;">Não ignore os sinais do seu corpo! O tratamento precoce é essencial para garantir qualidade de vida, prevenir complicações e promover um envelhecimento saudável.</span>
                `
            };
        } else if (total <= 12) {
            return {
                phase: "Climatério em Evolução",
                symptoms: "Você apresenta sintomas moderados, como alterações de humor, sono e ondas de calor. Isso indica que está em uma fase intermediária do climatério, com maior oscilação hormonal.",
                risks: `
                    <strong>Riscos do não tratamento:</strong> Nesta fase, os sintomas podem se intensificar rapidamente, afetando sua qualidade de vida, autoestima, relacionamentos e desempenho profissional. O não tratamento pode resultar em agravamento de insônia, ansiedade, depressão, dores articulares e fadiga crônica. Além disso, aumenta significativamente o risco de doenças cardiovasculares, osteoporose, perda de memória e alterações metabólicas, como ganho de peso e diabetes.<br><br>
                    <span style="color:#a259c6;font-weight:bold;">Procure um profissional de saúde! O acompanhamento médico é indispensável para evitar complicações graves e garantir bem-estar físico e emocional.</span>
                `
            };
        } else {
            return {
                phase: "Menopausa Instalada",
                symptoms: "Você apresenta sintomas intensos e frequentes, típicos da menopausa. Isso indica que a produção hormonal já está bastante reduzida.",
                risks: `
                    <strong>Riscos do não tratamento:</strong> A menopausa sem acompanhamento pode trazer consequências sérias e irreversíveis. O risco de doenças cardiovasculares (infarto, AVC), osteoporose com fraturas, depressão profunda, insônia crônica, perda de massa muscular e deterioração da saúde sexual é muito elevado. Além disso, sintomas como ondas de calor, suores noturnos, irritabilidade e fadiga podem se tornar incapacitantes, prejudicando sua autonomia e qualidade de vida.<br><br>
                    <span style="color:#a259c6;font-weight:bold;">O tratamento médico é urgente e indispensável nesta fase! Não adie o cuidado com sua saúde. Procure um especialista para avaliação e orientação personalizada.</span>
                `
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
        risksDiv.innerHTML = report.risks;
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
