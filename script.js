// Adicione ao final da função showResult()
function showResult() {
  // ...código do resultado...
  resultScreenStart = Date.now();

  // Botão para finalizar e enviar
  let btn = document.createElement('button');
  btn.textContent = "Finalizar e Enviar";
  btn.className = "next-btn";
  btn.onclick = () => {
    let resultScreenTime = Math.round((Date.now() - resultScreenStart) / 1000); // segundos
    // Monta os dados para envio
    let dataToSend = {
      nome: answers.nome || "",
      email: answers.email || "",
      telefone: answers.telefone || "",
      idade: answers.idade || "",
      sintomas: symptomData.map((s, i) => answers["sintoma_" + i] === "Sim" ? s.question : null).filter(Boolean).join("; "),
      data_envio: new Date().toLocaleString()
    };
    // Adiciona tempos de cada pergunta
    questionTimes.forEach((t, i) => {
      dataToSend["tempo_pergunta_" + (i+1)] = Math.round(t/1000); // segundos
    });
    dataToSend["tempo_tela_final"] = resultScreenTime;

    // Envia para o SheetDB
    fetch("https://sheetdb.io/api/v1/SEU_HASH", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: dataToSend })
    })
    .then(r => r.json())
    .then(resp => {
      btn.disabled = true;
      btn.textContent = "Enviado!";
      resultDiv.innerHTML += "<div style='color:#9333ea; margin-top:12px;'>Respostas enviadas com sucesso!</div>";
    })
    .catch(() => {
      resultDiv.innerHTML += "<div style='color:#a21caf; margin-top:12px;'>Erro ao enviar. Tente novamente.</div>";
    });
  };
  resultDiv.appendChild(btn);
}
