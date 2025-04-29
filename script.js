const params = new URLSearchParams(window.location.search);
const questionText = params.get('question') || 'Qual a tua escolha?';
const optA = params.get('optA') || 'Opção A';
const optB = params.get('optB') || 'Opção B';
const optC = params.get('optC') || 'Opção C';
const domain = params.get('domain') || 'http://localhost:3900';

document.getElementById('question').innerText = questionText;

function setupOptions() {
  ['A', 'B', 'C'].forEach(letter => {
    const div = document.getElementById('option' + letter);
    div.innerHTML = `<div class="option-bar" id="bar${letter}"></div><div class="option-text" id="text${letter}"></div>`;
  });
}

setupOptions();

let counts = { A: 0, B: 0, C: 0 };

function updateDisplay() {
  const total = counts.A + counts.B + counts.C || 1;

  document.getElementById('textA').innerText = `${optA}: ${counts.A}`;
  document.getElementById('barA').style.width = `${(counts.A / total) * 100}%`;

  document.getElementById('textB').innerText = `${optB}: ${counts.B}`;
  document.getElementById('barB').style.width = `${(counts.B / total) * 100}%`;

  document.getElementById('textC').innerText = `${optC}: ${counts.C}`;
  document.getElementById('barC').style.width = `${(counts.C / total) * 100}%`;
}

function fetchData() {
  fetch(`${domain}/wordcloud`)
    .then(response => response.json())
    .then(data => {
      let chatHistory = (data.wordcloud || "").toLowerCase().split(',');

      counts.A = chatHistory.filter(word =>
        word.trim() === optA.toLowerCase() || word.trim() === 'a'
      ).length;

      counts.B = chatHistory.filter(word =>
        word.trim() === optB.toLowerCase() || word.trim() === 'b'
      ).length;

      counts.C = chatHistory.filter(word =>
        word.trim() === optC.toLowerCase() || word.trim() === 'c'
      ).length;

      updateDisplay();
    })
    .catch(error => console.error('Erro ao buscar votos:', error));
}

setInterval(fetchData, 1000);

fetch(`${domain}/clear-chat?words=${optA},${optB},${optC},a,b,c`)
  .then(() => setTimeout(fetchData, 500));
