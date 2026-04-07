const btnAddCarrinho = document.querySelectorAll(".btn-carrinho");

btnAddCarrinho.forEach((btn) => {
  btn.addEventListener("click", (event) => {
    const elementoProduto = event.target.closest(".produto");
    const produtoId = elementoProduto.dataset.id;
    const produtoNome = elementoProduto.querySelector(".nome").textContent;
    const produtoImg = elementoProduto.querySelector("img").getAttribute("src");
    const produtoPreco = parseFloat(
      elementoProduto
        .querySelector(".price")
        .textContent.replace("R$ ", "")
        .replace(".", "")
        .replace(",", "."),
    );

    // buscar a lista de produtos no local storage
    const carrinho = obterProdutosDoCarrinho();

    const existeProduto = carrinho.find((item) => item.id === produtoId);

    if (existeProduto) {
      existeProduto.quantidade += 1;
    } else {
      const produto = {
        id: produtoId,
        nome: produtoNome,
        imagem: produtoImg,
        preco: produtoPreco,
        quantidade: 1,
      };
      carrinho.push(produto);
    }

    salvarProdutosNoCarrinho(carrinho);
  });
});

function obterProdutosDoCarrinho() {
  return JSON.parse(localStorage.getItem("carrinho")) || [];
}

function salvarProdutosNoCarrinho(carrinho) {
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
}
