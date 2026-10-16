
const nodeInputNumero = document.querySelector('input[type="number"]');
const nodeUlColecao = document.querySelector("#colecao ul");
const nodeTotal = document.querySelector("#colecao h3 span");
const nodeUlRepetidos = document.querySelector("#repetidos ul");
const nodeTotalRepetidos = document.querySelector("#repetidos h3 span");
const form = document.querySelector("form");

const colecao = JSON.parse(localStorage.getItem("colecao")) || [];
const repetidos = JSON.parse(localStorage.getItem("repetidos")) || [];

function guardaDados() {
    localStorage.setItem("colecao", JSON.stringify(colecao));
    localStorage.setItem("repetidos", JSON.stringify(repetidos));
}

function guardaCarta() {
    const numero = Number(nodeInputNumero.value);

    if (colecao.includes(numero)) {
        repetidos.push(numero);
        repetidos.sort((a, b) => a - b);
        atualizaLista(repetidos, nodeUlRepetidos);
    } else {
        colecao.push(numero);
        colecao.sort((a, b) => a - b);
        atualizaLista(colecao, nodeUlColecao);
    }

    guardaDados();
    nodeInputNumero.value = "";
    nodeInputNumero.focus();
}

function atualizaLista(lista, elemento) {
    elemento.innerHTML = "";

    lista.forEach((numero, indice) => {
        if (lista === repetidos) {
            elemento.innerHTML += `<li>${numero} <button type="button" class="eliminar" data-indice="${indice}">Eliminar</button></li>`;
        } else {
            const item = document.createElement("li");
            item.textContent = numero;
            elemento.append(item);
        }
    });

    if (lista === colecao) {
        nodeTotal.textContent = colecao.length;
    }

    if (lista === repetidos) {
        nodeTotalRepetidos.textContent = repetidos.length;

        elemento.querySelectorAll(".eliminar").forEach(botao => {
            botao.addEventListener("click", () => {
                const indice = Number(botao.dataset.indice);
                repetidos.splice(indice, 1);
                guardaDados();
                atualizaLista(repetidos, nodeUlRepetidos);
            });
        });
    }
}

form.onsubmit = (event) => {
    event.preventDefault();
    guardaCarta();
};

atualizaLista(colecao, nodeUlColecao);
atualizaLista(repetidos, nodeUlRepetidos);
