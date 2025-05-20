const API_KEY = '8a4f9d5219d8423b8181292043bfcf79';

async function buscarJogo() {
  const termo = document.getElementById('search').value.trim();
  if (!termo) {
    alert('Por favor, digite o nome do jogo.');
    return;
  }

  const urlBusca = `https://api.rawg.io/api/games?key=${API_KEY}&search=${encodeURIComponent(termo)}`;

  try {
    const respostaBusca = await fetch(urlBusca);
    const dadosBusca = await respostaBusca.json();

    if (!dadosBusca.results || dadosBusca.results.length === 0) {
      document.getElementById('resultado').innerHTML = '<p>Jogo não encontrado.</p>';
      return;
    }

    const jogo = dadosBusca.results[0]; 
    const id = jogo.id;

    const urlDetalhes = `https://api.rawg.io/api/games/${id}?key=${API_KEY}`;
    const respostaDetalhes = await fetch(urlDetalhes);
    const dadosDetalhes = await respostaDetalhes.json();

    let linksHTML = '';
    if (dadosDetalhes.website) {
      linksHTML += `<a href="${dadosDetalhes.website}" target="_blank" rel="noopener">Site Oficial</a>`;
    }
    if (dadosDetalhes.stores && dadosDetalhes.stores.length > 0) {
      dadosDetalhes.stores.forEach(store => {
        if (store.url && store.store && store.store.name) {
          linksHTML += `<a href="${store.url}" target="_blank" rel="noopener">${store.store.name}</a>`;
        }
      });
    }

    const resultadoHTML = `
      <h2>${dadosDetalhes.name}</h2>
      <p><strong>Nota:</strong> ${dadosDetalhes.rating}</p>
      <p><strong>Descrição:</strong> ${dadosDetalhes.description_raw}</p>
      ${dadosDetalhes.background_image ? `<img src="${dadosDetalhes.background_image}" alt="${dadosDetalhes.name}" />` : ''}
      <div>${linksHTML}</div>
    `;

    document.getElementById('resultado').innerHTML = resultadoHTML;

  } catch (erro) {
    console.error('Erro:', erro);
    document.getElementById('resultado').innerHTML = '<p>Erro ao buscar o jogo.</p>';
  }
}