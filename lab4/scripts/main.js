let contador = 0;

const mensagem = document.querySelector("#mensagem");
const imagem = document.querySelector("#imagem");
const botaoClick = document.querySelector("#botaoClick");
const botaoDuplo = document.querySelector("#botaoDuplo");
const areaMouse = document.querySelector("#areaMouse");
const contadorElemento = document.querySelector("#contador");

function contarClique() {
  contador++;
  contadorElemento.textContent = "Cliques: " + contador;
  mensagem.textContent = "Clicaste no botão!";
  botaoClick.style.backgroundColor = "green";
}

botaoClick.addEventListener("click", contarClique);

botaoDuplo.addEventListener("dblclick", function () {
  mensagem.textContent = "Fizeste um duplo clique!";
  botaoDuplo.style.backgroundColor = "purple";
});

areaMouse.addEventListener("mouseover", function () {
  mensagem.textContent = "O rato está dentro da área!";
  areaMouse.style.backgroundColor = "#ddd";
  areaMouse.style.transform = "scale(1.02)";
});

areaMouse.addEventListener("mouseout", function () {
  mensagem.textContent = "O rato saiu da área!";
  areaMouse.style.backgroundColor = "white";
  areaMouse.style.transform = "scale(1)";
});

areaMouse.addEventListener("mousemove", function () {
  mensagem.textContent = "Estás a mexer o rato dentro da área!";
  areaMouse.style.borderColor = "blue";
});

imagem.addEventListener("mouseover", function () {
  imagem.style.transform = "scale(1.1)";
});

imagem.addEventListener("mouseout", function () {
  imagem.style.transform = "scale(1)";
});
