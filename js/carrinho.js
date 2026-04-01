const btnAddCarrinho = document.querySelectorAll(".btn-carrinho");

btnAddCarrinho.forEach((btn) => {
  btn.addEventListener("click", (event) => {
    const elementoProduto = event.target.closest (".produto");
    const produtoId = elementoProduto.dataset.id;
    const produtoNome = elementoProduto.querySelector(".nome").textContent;
    const produtoImg = elementoProduto.querySelector("img").getAttribute("src");
    const produtoPreco = parseFloat(elementoProduto.querySelector(".price").textContent.replace("R$ ", "").replace(".", "").replace(",", "."));

  });
});
