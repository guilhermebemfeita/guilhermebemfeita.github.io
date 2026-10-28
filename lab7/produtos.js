
const listaProdutos = document.getElementById("lista-produtos");

// A. Estado e variáveis com referência de elementos do DOM

// B. Funções utilitárias
function criarProduto(produto) {
    const article = document.createElement("article");

    const imagem = document.createElement("img");
    imagem.src = produto.image;
    imagem.alt = produto.title;

    const titulo = document.createElement("h2");
    titulo.textContent = produto.title;

    const descricao = document.createElement("p");
    descricao.textContent = produto.description;

    const preco = document.createElement("p");
    preco.textContent = `${produto.price.toFixed(2)} €`;

    const avaliacao = document.createElement("p");
    avaliacao.textContent = `Avaliação: ${produto.rating.rate}/5 (${produto.rating.count} avaliações)`;

    article.append(imagem, titulo, descricao, preco, avaliacao);

    return article;
}

// C. Event handlers
function renderizarProdutos(produtos) {
    produtos.forEach(produto => {
        const artigo = criarProduto(produto);
        listaProdutos.append(artigo);
    });
}

// D. Event Listeners

// E. Inicialização
renderizarProdutos(produtos);
