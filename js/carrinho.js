const STORAGE_KEY = "carrinho";
const cartCountElement = document.getElementById("cart-count");
const totalCarrinhoElement = document.getElementById("total-carrinho");
const carrinhoTabelaCorpo = document.querySelector(
  "#modal-1-content table tbody",
);
const botaoAddCarrinho = document.querySelectorAll(".btn-carrinho");

const formatCurrency = (value) => `R$ ${value.toFixed(2).replace(".", ",")}`;
const parseCurrency = (text) =>
  parseFloat(text.replace("R$ ", "").replace(".", "").replace(",", ".")) || 0;

const obterProdutosDoCarrinho = () =>
  JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
const salvarProdutosNoCarrinho = (produtos) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(produtos));

const obterProdutoDoElemento = (elemento) => {
  const produtoId = elemento.dataset.id;
  const produtoNome = elemento.querySelector(".nome").textContent;
  const produtoImg = elemento.querySelector("img").getAttribute("src");
  const produtoPreco = parseCurrency(
    elemento.querySelector(".price").textContent,
  );

  return {
    id: produtoId,
    nome: produtoNome,
    imagem: produtoImg,
    preco: produtoPreco,
    quantidade: 1,
  };
};

const atualizarContadorCarrinho = () => {
  const total = obterProdutosDoCarrinho().reduce(
    (soma, produto) => soma + produto.quantidade,
    0,
  );

  if (cartCountElement) {
    cartCountElement.textContent = total;
  }
};

const atualizarValorTotalCarrinho = () => {
  const total = obterProdutosDoCarrinho().reduce(
    (soma, produto) => soma + produto.preco * produto.quantidade,
    0,
  );

  if (totalCarrinhoElement) {
    totalCarrinhoElement.textContent = `Total: ${formatCurrency(total)}`;
  }
};

const criarLinhaProduto = (produto) => {
  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td class="td-produto">
      <img src="${produto.imagem}" alt="${produto.nome}" />
    </td>
    <td>${produto.nome}</td>
    <td class="td-preco-unit">${formatCurrency(produto.preco)}</td>
    <td class="quantidade">
      <input
        type="number"
        class="input-quantidade"
        data-id="${produto.id}"
        value="${produto.quantidade}"
        min="1"
      />
    </td>
    <td class="td-preco-total">${formatCurrency(
      produto.preco * produto.quantidade,
    )}</td>
    <td>
      <button class="btn-remover" data-id="${produto.id}"></button>
    </td>
  `;

  return tr;
};

const renderizarTabelaDoCarrinho = () => {
  if (!carrinhoTabelaCorpo) return;

  const produtos = obterProdutosDoCarrinho();
  carrinhoTabelaCorpo.innerHTML = "";

  produtos.forEach((produto) => {
    carrinhoTabelaCorpo.appendChild(criarLinhaProduto(produto));
  });
};

const atualizarTudo = () => {
  atualizarContadorCarrinho();
  renderizarTabelaDoCarrinho();
  atualizarValorTotalCarrinho();
};

const adicionarOuAtualizarProduto = (produto) => {
  const produtos = obterProdutosDoCarrinho();
  const produtoExistente = produtos.find((item) => item.id === produto.id);

  if (produtoExistente) {
    produtoExistente.quantidade += 1;
  } else {
    produtos.push(produto);
  }

  salvarProdutosNoCarrinho(produtos);
  atualizarTudo();
};

const removerDoCarrinho = (id) => {
  const produtos = obterProdutosDoCarrinho().filter(
    (produto) => produto.id !== id,
  );

  salvarProdutosNoCarrinho(produtos);
  atualizarTudo();
};

const alterarQuantidadeDoProduto = (id, quantidade) => {
  const produtos = obterProdutosDoCarrinho();
  const produto = produtos.find((item) => item.id === id);

  if (!produto) return;

  produto.quantidade = Math.max(1, quantidade);
  salvarProdutosNoCarrinho(produtos);
  atualizarTudo();
};

const handleAddToCart = (event) => {
  const elementoProduto = event.target.closest(".produto");
  if (!elementoProduto) return;

  adicionarOuAtualizarProduto(obterProdutoDoElemento(elementoProduto));
};

const handleCartTableClick = (event) => {
  if (!event.target.classList.contains("btn-remover")) return;

  removerDoCarrinho(event.target.dataset.id);
};

const handleCartTableChange = (event) => {
  if (!event.target.classList.contains("input-quantidade")) return;

  const novaQuantidade = parseInt(event.target.value, 10) || 1;
  alterarQuantidadeDoProduto(event.target.dataset.id, novaQuantidade);
};

botaoAddCarrinho.forEach((botao) => {
  botao.addEventListener("click", handleAddToCart);
});

if (carrinhoTabelaCorpo) {
  carrinhoTabelaCorpo.addEventListener("click", handleCartTableClick);
  carrinhoTabelaCorpo.addEventListener("change", handleCartTableChange);
}

atualizarTudo();
