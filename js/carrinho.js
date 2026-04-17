// Seleciona todos os botões que possuem a classe ".btn-carrinho" (os botões de "Adicionar ao Carrinho")
const btnAddCarrinho = document.querySelectorAll(".btn-carrinho");

// Adiciona um evento de clique para cada botão encontrado
btnAddCarrinho.forEach((btn) => {
  btn.addEventListener("click", (event) => {
    // Encontra o elemento pai mais próximo que tenha a classe ".produto" para capturar os dados dele
    const elementoProduto = event.target.closest(".produto");

    // Captura as informações do produto a partir do HTML usando atributos data e seletores de classe
    const produtoId = elementoProduto.dataset.id;
    const produtoNome = elementoProduto.querySelector(".nome").textContent;
    const produtoImg = elementoProduto.querySelector("img").getAttribute("src");

    // Converte o preço de texto (ex: "R$ 50,00") para um número decimal (float) tratável pelo JS
    const produtoPreco = parseFloat(
      elementoProduto
        .querySelector(".price")
        .textContent.replace("R$ ", "") // Remove o símbolo da moeda
        .replace(".", "") // Remove o ponto de milhar, se houver
        .replace(",", "."), // Troca a vírgula decimal por ponto
    );

    // Busca a lista atual de produtos salvos no LocalStorage
    const carrinho = obterProdutosDoCarrinho();

    // Verifica se o produto que está sendo adicionado já existe no carrinho
    const existeProduto = carrinho.find((item) => item.id === produtoId);

    if (existeProduto) {
      // Se já existir, apenas incrementa a quantidade
      existeProduto.quantidade += 1;
    } else {
      // Se for um produto novo, cria um objeto com as propriedades dele
      const produto = {
        id: produtoId,
        nome: produtoNome,
        imagem: produtoImg,
        preco: produtoPreco,
        quantidade: 1,
      };
      // Adiciona o novo produto ao array do carrinho
      carrinho.push(produto);
    }

    // Salva a lista atualizada no LocalStorage e atualiza a interface (contador e tabela)
    salvarProdutosNoCarrinho(carrinho);
    atualizarTudo();
  });
});

// Função para buscar os produtos do LocalStorage. Se não houver nada, retorna um array vazio [].
function obterProdutosDoCarrinho() {
  return JSON.parse(localStorage.getItem("carrinho")) || [];
}

// Função para transformar o array de objetos em String e salvar no LocalStorage
function salvarProdutosNoCarrinho(carrinho) {
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

// Função que percorre o carrinho e soma as quantidades para exibir no ícone do carrinho
function atualizarContadorCarrinho() {
  const produtos = obterProdutosDoCarrinho();
  let total = 0;

  produtos.forEach((produto) => {
    total += produto.quantidade;
  });

  // Atualiza o texto do elemento HTML que mostra a contagem
  const contadorElemento = document.getElementById("cart-count");
  if (contadorElemento) {
    contadorElemento.textContent = total;
  }
}

// Função responsável por desenhar as linhas (tr) da tabela do carrinho dentro do modal
function renderizarTabelaDoCarrinho() {
  const produtos = obterProdutosDoCarrinho();
  const corpoTabela = document.querySelector("#modal-1-content tbody");

  if (!corpoTabela) return; // Segurança caso o elemento não exista na página atual

  corpoTabela.innerHTML = ""; // Limpa a tabela antes de renderizar para não duplicar itens

  produtos.forEach((produto) => {
    const tr = document.createElement("tr");
    // Cria a estrutura da linha da tabela com os dados do produto
    tr.innerHTML = `<td class="td-produto">
                    <img
                      src="${produto.imagem}"
                      alt="${produto.nome}"
                    />
                  </td>
                  <td>${produto.nome}</td>
                  <td class="td-preco-unit">R$ ${produto.preco.toFixed(2).replace(".", ",")}</td>
                  <td class="quantidade">
                    <input type="number" class="input-quantidade" data-id="${produto.id}" value="${produto.quantidade}" min="1" />
                  </td>
                  <td class="td-preco-total">R$ ${(produto.preco * produto.quantidade).toFixed(2).replace(".", ",")}</td>
                  <td><button class="btn-remover" data-id="${produto.id}"></button></td>`;

    corpoTabela.appendChild(tr);
  });
}

// Renderiza a tabela ao carregar a página
renderizarTabelaDoCarrinho();

// Configura a remoção de itens usando "delegação de eventos"
const corpoTabela = document.querySelector("#modal-1-content table tbody");
if (corpoTabela) {
  corpoTabela.addEventListener("click", (evento) => {
    // Verifica se o clique foi especificamente no botão de remover
    if (evento.target.classList.contains("btn-remover")) {
      const id = evento.target.dataset.id;
      removerDoCarrinho(id);
    }
  });
}

// Adicionar listener no input do tbody
corpoTabela.addEventListener("change", (evento) => {
  // Atualizar o valor total
  if (evento.target.classList.contains("input-quantidade")) {
    const produtos = obterProdutosDoCarrinho();
    const produto = produtos.find(
      (produto) => produto.id === evento.target.dataset.id,
    );
    let novaQuantidade = parseInt(evento.target.value);
    if (produto) {
      produto.quantidade = novaQuantidade;
    }
    salvarProdutosNoCarrinho(produtos);
    atualizarTudo();
  }
});

// Função para remover um produto do carrinho
function removerDoCarrinho(id) {
  const produtos = obterProdutosDoCarrinho();
  // Filtra o array para manter apenas os produtos que NÃO têm o ID informado
  const carrinhoAtualizado = produtos.filter((produto) => produto.id !== id);

  // Atualiza o storage e a interface
  salvarProdutosNoCarrinho(carrinhoAtualizado);
  atualizarTudo();
}

function atualizarValorTotalCarrinho() {
  const produtos = obterProdutosDoCarrinho();
  let total = 0;

  produtos.forEach((produto) => {
    total += produto.preco * produto.quantidade;
  });

  const totalElemento = document.getElementById("total-carrinho");
  if (totalElemento) {
    totalElemento.textContent = `Total: R$ ${total.toFixed(2).replace(".", ",")}`;
  }
}

function atualizarTudo() {
  atualizarContadorCarrinho();
  renderizarTabelaDoCarrinho();
  atualizarValorTotalCarrinho();
}

// Atualizar valor total do carrinho
atualizarTudo();
