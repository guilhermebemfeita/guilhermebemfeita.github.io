const api = 'https://deisishop.pw.deisi.ulusofona.pt';
const moeda = new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' });
const chaveCesto = 'devstore-lab8-cesto';
const elemento = id => document.getElementById(id);
const catalogo = elemento('lista-produtos');
const cesto = elemento('produtos-selecionados');
const categoria = elemento('categoria');
const ordem = elemento('ordem');
const pesquisa = elemento('pesquisa');
const estado = elemento('estado-produtos');
const checkout = elemento('checkout');
const comprar = elemento('comprar');
const resultado = elemento('resultado');
let produtos = [];
let ids = lerCesto();
let carregado = false;
let aComprar = false;

function lerCesto() {
    try {
        const guardado = JSON.parse(localStorage.getItem(chaveCesto));
        return Array.isArray(guardado) ? guardado.filter(Number.isInteger) : [];
    } catch {
        return [];
    }
}

function guardarCesto() {
    localStorage.setItem(chaveCesto, JSON.stringify(ids));
    mostrarCesto();
}

async function pedir(caminho, opcoes) {
    const resposta = await fetch(api + caminho, opcoes);
    const dados = await resposta.json();
    if (!resposta.ok || dados.error) {
        throw new Error(dados.error || 'O pedido falhou (' + resposta.status + ').');
    }
    return dados;
}

function texto(tag, valor) {
    const no = document.createElement(tag);
    no.textContent = valor;
    return no;
}

function cartao(produto, acao, aoClicar, noCesto = false) {
    const artigo = document.createElement('article');
    if (!noCesto && produto.image) {
        const imagem = document.createElement('img');
        imagem.src = new URL(produto.image, api).href;
        imagem.alt = produto.title;
        imagem.loading = 'lazy';
        artigo.append(imagem);
    }
    artigo.append(texto('h3', produto.title), texto('strong', moeda.format(produto.price)));
    if (!noCesto) {
        artigo.append(
            texto('p', produto.category),
            texto('p', produto.description),
            texto('p', 'Avaliação: ' + produto.rating.rate + '/5 (' + produto.rating.count + ')')
        );
    }
    const botao = texto('button', acao);
    botao.type = 'button';
    botao.disabled = aComprar;
    botao.addEventListener('click', aoClicar);
    artigo.append(botao);
    return artigo;
}

function normalizar(valor) {
    return valor.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-PT');
}

function mostrarProdutos() {
    if (!carregado) return;
    const termo = normalizar(pesquisa.value.trim());
    const visiveis = produtos.filter(produto =>
        (!categoria.value || produto.category === categoria.value) &&
        normalizar(produto.title).includes(termo)
    );
    if (ordem.value) {
        const direcao = ordem.value === 'asc' ? 1 : -1;
        visiveis.sort((a, b) => direcao * (Number(a.price) - Number(b.price)));
    }
    estado.textContent = visiveis.length ? '' : 'Nenhum produto encontrado.';
    catalogo.replaceChildren(...visiveis.map(produto => cartao(produto, 'Adicionar ao cesto', () => {
        ids.push(produto.id);
        resultado.textContent = '';
        guardarCesto();
    })));
}

function mostrarCesto() {
    const artigos = ids.map((id, indice) => ({ produto: produtos.find(item => item.id === id), indice }))
        .filter(item => item.produto);
    cesto.replaceChildren(...artigos.map(({ produto, indice }) => cartao(produto, 'Remover', () => {
        ids.splice(indice, 1);
        resultado.textContent = '';
        guardarCesto();
    }, true)));
    if (!artigos.length) cesto.append(texto('p', 'O teu cesto está vazio.'));
    const subtotal = artigos.reduce((total, { produto }) => total + Number(produto.price), 0);
    elemento('preco-total').textContent = moeda.format(subtotal);
    comprar.disabled = aComprar || !artigos.length;
}

async function carregarLoja() {
    try {
        const [lista, categorias] = await Promise.all([pedir('/products'), pedir('/categories')]);
        produtos = lista;
        ids = ids.filter(id => produtos.some(produto => produto.id === id));
        categorias.forEach(({ name }) => categoria.add(new Option(name, name)));
        carregado = true;
        mostrarProdutos();
        mostrarCesto();
    } catch {
        estado.textContent = 'Não foi possível carregar a loja. Atualiza a página para tentar novamente.';
    }
}

categoria.addEventListener('change', mostrarProdutos);
ordem.addEventListener('change', mostrarProdutos);
pesquisa.addEventListener('input', mostrarProdutos);
checkout.addEventListener('submit', async evento => {
    evento.preventDefault();
    if (aComprar || !carregado || !ids.length) return;
    const campos = new FormData(checkout);
    aComprar = true;
    mostrarProdutos();
    mostrarCesto();
    resultado.textContent = 'A processar o pedido…';
    try {
        const dados = await pedir('/buy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                products: ids,
                student: campos.has('student'),
                coupon: campos.get('coupon').trim(),
                name: campos.get('name').trim()
            })
        });
        resultado.textContent = 'Referência para pagamento: ' + dados.reference +
            ' · Total: ' + moeda.format(Number(dados.totalCost));
        ids = [];
        guardarCesto();
    } catch (erro) {
        resultado.textContent = 'Não foi possível concluir o pedido. ' + erro.message;
    } finally {
        aComprar = false;
        mostrarProdutos();
        mostrarCesto();
    }
});

mostrarCesto();
carregarLoja();