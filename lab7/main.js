
const listaProdutos = document.getElementById("lista-produtos");
const listaCesto = document.getElementById("produtos-selecionados");
const elementoTotal = document.getElementById("preco-total");
const chaveCarrinho = "produtos-selecionados";

if (localStorage.getItem(chaveCarrinho) === null) {
    localStorage.setItem(chaveCarrinho, JSON.stringify([]));
}

function obterCarrinho() {
    return JSON.parse(localStorage.getItem(chaveCarrinho)) || [];
}

function guardarCarrinho(carrinho) {
    localStorage.setItem(chaveCarrinho, JSON.stringify(carrinho));
}

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
    preco.textContent = `${Number(produto.price).toFixed(2)} €`;

    const avaliacao = document.createElement("p");
    avaliacao.textContent = `Avaliação: ${produto.rating.rate}/5 (${produto.rating.count} avaliações)`;

    const botao = document.createElement("button");
    botao.textContent = "+ Adicionar ao cesto";

    botao.addEventListener("click", () => {
        const carrinho = obterCarrinho();
        carrinho.push(produto);
        guardarCarrinho(carrinho);
        atualizarCesto();
    });

    article.append(imagem, titulo, descricao, preco, avaliacao, botao);

    return article;
}

function renderizarProdutos(lista) {
    listaProdutos.innerHTML = "";

    lista.forEach(produto => {
        listaProdutos.append(criarProduto(produto));
    });
}

function criaProdutoCesto(produto, indice) {
    const article = document.createElement("article");

    const titulo = document.createElement("h2");
    titulo.textContent = produto.title;

    const preco = document.createElement("p");
    preco.textContent = `${Number(produto.price).toFixed(2)} €`;

    const botaoRemover = document.createElement("button");
    botaoRemover.textContent = "Remover do cesto";

    botaoRemover.addEventListener("click", () => {
        const carrinho = obterCarrinho();
        carrinho.splice(indice, 1);
        guardarCarrinho(carrinho);
        atualizarCesto();
    });

    article.append(titulo, preco, botaoRemover);

    return article;
}

function atualizarCesto() {
    const carrinho = obterCarrinho();

    listaCesto.innerHTML = "";

    carrinho.forEach((produto, indice) => {
        listaCesto.append(criaProdutoCesto(produto, indice));
    });

    const total = carrinho.reduce((soma, produto) => {
        return soma + Number(produto.price);
    }, 0);

    elementoTotal.textContent = `Total: ${total.toFixed(2)} €`;
}

if (typeof produtos !== "undefined" && Array.isArray(produtos)) {
    renderizarProdutos(produtos);
    atualizarCesto();
} else {
    listaProdutos.textContent = "Erro ao carregar os produtos. Verifica o ficheiro produtos.js.";
}
