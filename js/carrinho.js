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
    atualizarContadorCarrinho();
    renderizarTabelaDoCarrinho();
  });
});

function obterProdutosDoCarrinho() {
  return JSON.parse(localStorage.getItem("carrinho")) || [];
}

function salvarProdutosNoCarrinho(carrinho) {
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function atualizarContadorCarrinho() {
  const produtos = obterProdutosDoCarrinho();
  let total = 0;

  produtos.forEach((produto) => {
    total += produto.quantidade;
  });

  document.getElementById("cart-count").textContent = total;
}

atualizarContadorCarrinho();

function renderizarTabelaDoCarrinho() {
  const produtos = obterProdutosDoCarrinho();
  const corpoTabela = document.querySelector("#modal-1-content tbody");
  corpoTabela.innerHTML = ""; //limpar a tabela antes de renderizar

  produtos.forEach((produto) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td class="td-produto">
                    <img
                      src="${produto.imagem}"
                      alt="${produto.nome}"
                    />
                  </td>
                  <td>${produto.nome}</td>
                  <td class="td-preco-unit">R$ ${produto.preco.toFixed(2).replace(".", ",")}</td>
                  <td class="quantidade">
                    <input type="number" value="${produto.quantidade}" min="1" />
                  </td>
                  <td class="td-preco-total">R$ ${produto.preco.toFixed(2).replace(".", ",")}</td>
                  <td><button class="btn-remover" data-id="${produto.id}"></button></td>`;

    corpoTabela.appendChild(tr);
  });
}

renderizarTabelaDoCarrinho();
