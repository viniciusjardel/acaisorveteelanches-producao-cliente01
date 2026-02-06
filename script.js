const whatsappNumber = "558198771166";
let cart = [];

let selectedItem = null;
let pendingAddAction = null; // função a executar ao confirmar
let pendingItemPreview = null; // dados para exibir no modal de confirmação
let pendingSucoOption = null; // opção escolhida no modal de suco (Com leite / Sem leite)

const SUCO_NAMES = ["caja","cajá","graviola","acerola","abacaxi","goiaba","maracuja","maracujá"];

function isSucoName(name) {
  if (!name) return false;
  const n = normalizeText(name);
  return SUCO_NAMES.includes(n);
}

// Para pastel: preço e limite de sabores selecionados
let selectedPastelPrice = 5;
let selectedPastelLimit = 5;

const placeholderImg = "img/logooficial-acai.png";

// Normaliza texto removendo acentos e convertendo para lowercase
function normalizeText(str) {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
}

// BUSCA
let searchQuery = "";

// Categoria ativa para filtro por abas (valor normalizado)
let activeCategory = 'todos';

function setupSearch() {
  const input = document.getElementById('searchInput');
  if (!input) return;
  input.addEventListener('input', (e) => {
    searchQuery = e.target.value.trim().toLowerCase();
    renderMenu();
  });
}

// Monta abas de categoria (inclui 'Todos')
function setupCategoryTabs() {
  const container = document.getElementById('categoryTabs');
  if (!container) return;
  container.innerHTML = '';

  // botão 'Todos'
  const allBtn = document.createElement('button');
  allBtn.textContent = 'Todos';
  allBtn.className = 'active';
  allBtn.onclick = () => {
    activeCategory = 'todos';
    Array.from(container.querySelectorAll('button')).forEach(b => b.classList.remove('active'));
    allBtn.classList.add('active');
    renderMenu();
  };
  container.appendChild(allBtn);

  // cria abas a partir das categorias do menuData
  menuData.forEach(cat => {
    const btn = document.createElement('button');
    btn.textContent = cat.category;
    btn.onclick = () => {
      activeCategory = normalizeText(cat.category);
      Array.from(container.querySelectorAll('button')).forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderMenu();
    };
    container.appendChild(btn);
  });
}

// FUNÇÃO PARA MOSTRAR TOAST
function showToast(message, icon = "✓") {
  // Remove toast anterior se existir
  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    existingToast.remove();
  }

  // Cria novo toast
  const toast = document.createElement('div');
  toast.className = 'toast show';
  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span>${message}</span>
  `;
  
  document.body.appendChild(toast);

  // Remove após 2 segundos
  setTimeout(() => {
    toast.remove();
  }, 2000);
}

// Toast inferior verde — para confirmação de adição ao carrinho
function showBottomToast(message, icon = "✓") {
  // remove toast inferior anterior
  const existing = document.querySelector('.bottom-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'bottom-toast show';
  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span>${message}</span>
  `;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2000);
}

const menuData = [
  {
    category: "🍔 Hambúrgueres",
    items: [
      { 
        name: "X-Salada", 
        price: 12, 
        img: "img/x-salada.jpg",
        description: "Pão Bola, Carne artesanal, Alface, Tomate, Cebola"
      },
      { 
        name: "X-Calabresa", 
        price: 15, 
        img: "img/x-calabresa.jpg",
        description: "Pão Bola, Carne Artesanal, Alface, Tomate, Cebola, Calabresa"
      },
      { 
        name: "X-Queijo Coalho", 
        price: 16, 
        img: "img/x-queijocoalho.jpg",
        description: "Pão bola, Carne Artesanal, Alface, Tomate, Cebola, Queijo Coalho"
      }
    ]
  },

  {
    category: "🌭 Salgados",
    items: [
      { name: "Cachorro-quente", price: 6, img: "img/hotdog.jpg" },
      { name: "Coxinha", price: 4, img: "img/coxinha.jpg" },
      { name: "Empada", price: 4.5, img: "img/empada.jpg" },
      { name: "Pastel", price: 5, img: "img/pastel.jpg" },
      { name: "Batata P", price: 15, img: "img/batatap.jpg" },
      { name: "Batata G", price: 20, img: "img/batatag.jpg" },
      { name: "Batata com calabresa", price: 25, img: "img/batatacalabresa.jpg" }
    ]
  },

  {
    category: "🥤 Bebidas",
    items: [
      { name: "Milkshake 300ml", price: 10, img: "img/milkshake300ml.jpg" },
      { name: "Milkshake 500ml", price: 15, img: "img/milkshake500ml.jpg" },
      { name: "Guaraçaí 400ml", price: 8, img: "img/guaracai.jpg" },
      { name: "Guaraná do Amazonas 400ml", price: 7, img: "img/guaranaamazonas.jpg" },
      { name: "Refrigerante lata 350ml", price: 6, img: "img/coca lata 350ML.jpeg" },
      { name: "Refri 250ml", price: 2.5, img: "img/Refri 250ML.jpeg" },
      { name: "Água sem gás", price: 2, img: "img/agua sem gas.jpeg" },
      { name: "Água com gás", price: 3.5, img: "img/agua com gas.jpeg" },
      { name: "Água tônica", price: 6, img: "img/agua tonica.jpeg" },
      { name: "Schweppes", price: 7, img: "img/schweppes.jpeg" },
      { name: "Coca-Cola 1L", price: 8, img: "img/coca cola 1L.jpeg" },
      { name: "Coca-Cola Zero 1L", price: 9, img: "img/coca-cola zero 1L.jpeg" },
      { name: "Fanta 1L", price: 9, img: "img/fanta 1L.jpeg" },
      { name: "Antarctica 1L", price: 9, img: "img/antarctica 1L.jpeg" },
      { name: "Antarctica 1,5L", price: 10, img: "img/guarana antarctica 1,5L.jpeg" },
      { name: "Coca-Cola Retornável 2L", price: 10, img: "img/coca 2L.jpeg" }
    ]
  },

  {
    category: "🍹 Sucos",
    items: [
      { name: "Cajá", price: 7, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQverJodlJWj1Xfh21dTCe9cHI6zcsNGiV_xg&s" },
      { name: "Graviola", price: 7, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKp5MSs6m9V0Tbj5JSEAlN5Jncg0In-TVH8w&s" },
      { name: "Acerola", price: 7, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiaxyMd_ua2iNJnlpKCEZ9b_mMUBCCS5-0jQ&s" },
      { name: "Abacaxi", price: 7, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCgCginA1Zlpwo_lF_zWdXdtBSJk4vAG38ZQ&s" },
      { name: "Goiaba", price: 7, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiAx9wGgsshvVxFpKF67ZB6IzqVzL6QlVV-Q&s" },
      { name: "Maracujá", price: 7, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdpMewBBqUCS0y12xoY2OF3rs8LVD_f67QiA&s" }
    ]
  },

  {
    category: "🍧 Açaí",
    items: [
      { name: "Açaí 300ml", price: 8, img: "img/acai 300ml.jpg" },
      { name: "Açaí 350ml", price: 10, img: "img/acai 350ml.jpg" },
      { name: "Açaí 400ml", price: 12, img: "img/acai 400ml.jpg" },
      { name: "Açaí 500ml", price: 15, img: "img/acai 500ml.jpg" },
      { name: "Açaí Família", price: 22, img: "img/acai familia.jpg" }
    ]
  },

  {
    category: "🍧 Cupuaçu",
    items: [
      { name: "Cupuaçu 300ml", price: 10, img: "img/cupuacu 300ml.jpg" },
      { name: "Cupuaçu 350ml", price: 12, img: "img/cupuacu 350ml.jpg" },
      { name: "Cupuaçu 400ml", price: 15, img: "img/cupuacu 400ml.jpg" },
      { name: "Cupuaçu Família", price: 25, img: "img/cupuacu familia.jpg" }
    ]
  },

  {
    category: "🍨 Sorvete",
    items: [
      { name: "Bola no cascão ou copo", price: 5, img: "img/bola cascao.jpg" }
    ]
  }
];

function renderMenu() {
  const menu = document.getElementById("menu");
  menu.innerHTML = "";

  const query = normalizeText(searchQuery || '');

  menuData.forEach(cat => {
    // se uma aba está ativa (diferente de 'todos'), só renderiza essa categoria
    const catNorm = normalizeText(cat.category || '');
    if (activeCategory && activeCategory !== 'todos' && catNorm !== activeCategory) return;

    // filtra itens da categoria pelo termo de busca (usando normalização)
    const itemsFiltered = cat.items.filter(item => {
      if (!query) return true;
      const normName = normalizeText(item.name || '');
      const normDesc = normalizeText(item.description || '');
      return normName.includes(query) || normDesc.includes(query) || catNorm.includes(query);
    });

    if (itemsFiltered.length === 0) return; // não renderiza categoria vazia

    const div = document.createElement("div");
    div.className = "category";
    div.innerHTML = `<h2>${cat.category}</h2>`;

    itemsFiltered.forEach(item => {
      const el = document.createElement("div");
      el.className = "item";

      // Adiciona descrição se existir
      const descriptionHTML = item.description 
        ? `<p class="item-description">${item.description}</p>` 
        : '';

      el.innerHTML = `
        <div class="item-content">
          <img src="${item.img}" onerror="this.src='${placeholderImg}'">
          <div class="item-info">
            <h3>${item.name}</h3>
            ${descriptionHTML}
            <span class="item-price">R$ ${item.price.toFixed(2)}</span>
          </div>
        </div>
      `;

      // Criar botão separadamente para evitar problemas com escaping em onclick
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = '+';
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        console.log('item + clicked ->', item.name, item.price);
        try {
          openConfirmBeforeAdd(item);
        } catch (err) {
          console.error('openConfirmBeforeAdd error', err);
        }
      });
      const contentEl = el.querySelector('.item-content');
      if (contentEl) contentEl.appendChild(btn);
      else el.appendChild(btn);
      div.appendChild(el);
    });

    menu.appendChild(div);
  });

  // se não encontrou nada e há uma busca ativa, mostrar mensagem
  if (query && menu.children.length === 0) {
    const no = document.createElement('div');
    no.className = 'no-results';
    no.style.padding = '20px';
    no.textContent = 'Nenhum produto encontrado.';
    menu.appendChild(no);
  }
}

function addToCart(item, price) {
  console.log('addToCart called with:', item, price);
  // Se item for string, é o nome antigo
  if (typeof item === 'string') {
    const name = item;
    const lowerName = name.toLowerCase();
    const lowerNorm = normalizeText(name);

    // Verifica se é açaí ou cupuaçu (mas não Guaraçaí)
    if ((lowerName.includes("açaí") || lowerName.includes("acai")) && !lowerName.includes("guaraçaí") && !lowerName.includes("guaracai")) {
      selectedItem = { name, price };
      openAcaiModal(name);
      return;
    }

    // Verifica se é cupuaçu
    if (lowerName.includes("cupuaçu") || lowerName.includes("cupuacu")) {
      selectedItem = { name, price };
      openAcaiModal(name);
      return;
    }

    // Verifica se é sorvete
    if (lowerName.includes("sorvete") || lowerName.includes("bola") || lowerName.includes("cascão")) {
      selectedItem = { name, price };
      openSorveteModal(name);
      return;
    }

    // Verifica se é suco (nomes específicos)
    const sucoNames = ["caja","cajá","graviola","acerola","abacaxi","goiaba","maracuja","maracujá"];
    if (sucoNames.includes(lowerNorm)) {
      selectedItem = { name, price };
      console.log('Detected suco, selectedItem set to', selectedItem);
      openSucoModal(name);
      return;
    }

    // Verifica se é pastel
    if (lowerName.includes("pastel")) {
      selectedItem = { name, price };
      openPastelModal(name);
      return;
    }

    const cartItem = cart.find(i => i.name === name);
    if (cartItem) cartItem.qty++;
    else cart.push({ name, price, qty: 1 });

    updateCart();
    showBottomToast(`${name} adicionado!`, "✓");
  } else {
    // Item é um objeto
    const cartItem = cart.find(i => i.name === item.name && JSON.stringify(i.customizations) === JSON.stringify(item.customizations));
    if (cartItem) {
      cartItem.qty += item.quantity;
    } else {
      cart.push({
        name: item.name,
        price: item.price,
        qty: item.quantity,
        customizations: item.customizations
      });
    }
    updateCart();
    showBottomToast(`${item.name} adicionado!`, "✓");
  }
}

function increaseQty(index) {
  cart[index].qty++;
  updateCart();
}

function decreaseQty(index) {
  cart[index].qty--;
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }
  updateCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  updateCart();
}

function updateCart() {
  const list = document.getElementById("cartItems");
  const totalEl = document.getElementById("total");
  list.innerHTML = "";

  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.qty;

    const li = document.createElement("li");
    // mostra nome, customizações (se houver), preço unitário e subtotal
    const customText = item.customizations ? `<div class="cart-custom">${JSON.stringify(item.customizations)}</div>` : "";
    const unitPrice = (item.price || 0).toFixed(2);
    const subTotal = (item.price * item.qty).toFixed(2);
    li.innerHTML = `
      <div class="cart-item">
        <div style="display:flex;flex-direction:column;gap:4px;">
          <span style="font-weight:600">${item.name}</span>
          ${customText}
          <small style="color:#666">R$ ${unitPrice} cada • Subtotal: R$ ${subTotal}</small>
        </div>
        <div class="cart-controls">
          <button onclick="decreaseQty(${index})">−</button>
          <span>${item.qty}</span>
          <button onclick="increaseQty(${index})">+</button>
          <button class="remove-btn" onclick="removeItem(${index})">🗑️</button>
        </div>
      </div>
    `;
    list.appendChild(li);
  });

  totalEl.textContent = total.toFixed(2);
  updateCartBadge();
}

function openAcaiModal(itemName) {
  const modal = document.getElementById("acaiModal");
  const title = modal.querySelector("h3");

  title.textContent = `🍧 Escolha os acompanhamentos do ${itemName}`;
  modal.style.display = "flex";

  modal.onclick = (e) => {
    if (e.target === modal) closeAcaiModal();
  };
}


function closeAcaiModal() {
  document.getElementById("acaiModal").style.display = "none";
  document.querySelectorAll(".toppings input").forEach(i => i.checked = false);
}

function confirmAcai() {
  const selected = [...document.querySelectorAll(".toppings input:checked")]
    .map(i => i.value)
    .join(", ");

  const nameFinal = selected
    ? `${selectedItem.name} (${selected})`
    : selectedItem.name;

  cart.push({
    name: nameFinal,
    price: selectedItem.price,
    qty: 1
  });

  closeAcaiModal();
  updateCart();
  showBottomToast(`${selectedItem.name} adicionado!`, "🍧");
}

// FUNÇÕES PARA O MODAL DE PREÇO PASTEL
function openPastelPriceModal() {
  const modal = document.getElementById("pastelPriceModal");
  modal.style.display = "flex";

  modal.onclick = (e) => {
    if (e.target === modal) closePastelPriceModal();
  };
}

function closePastelPriceModal() {
  document.getElementById("pastelPriceModal").style.display = "none";
  // Reseta a seleção
  document.querySelectorAll('.price-option').forEach(btn => btn.classList.remove('active'));
  selectedPastelOption = null;
}

// Variável para rastrear a opção selecionada no modal de preço
let selectedPastelOption = null;

function selectPastelOption(button) {
  // Remove classe active de todos os botões
  document.querySelectorAll('.price-option').forEach(btn => btn.classList.remove('active'));
  // Adiciona classe active ao botão clicado
  button.classList.add('active');
  // Armazena a opção selecionada
  selectedPastelOption = {
    price: parseFloat(button.dataset.price),
    limit: parseInt(button.dataset.limit)
  };
}

function confirmPastelSize() {
  if (!selectedPastelOption) {
    alert('Por favor, selecione um tamanho de pastel.');
    return;
  }
  selectedPastelPrice = selectedPastelOption.price;
  selectedPastelLimit = selectedPastelOption.limit;
  closePastelPriceModal();
  openPastelCustomizationModal();
}

// Abre o modal de personalização do pastel
function openPastelCustomizationModal() {
  const modal = document.getElementById("pastelModal");
  modal.style.display = "flex";
  
  // Atualiza o contador de sabores e preço em tempo real
  const saborCheckboxes = document.querySelectorAll(".sabor-checkbox");

  // usa onchange para evitar múltiplos handlers acumulados
  saborCheckboxes.forEach(checkbox => {
    checkbox.onchange = updatePastelPrice;
  });

  // Atualiza o limite no contador e o preço inicial
  document.getElementById("saborCount").textContent = `(0/${selectedPastelLimit})`;
  const priceEl = document.getElementById("pastelPrice");
  if (priceEl) priceEl.textContent = (selectedPastelPrice || selectedItem.price || 5).toFixed(2);

  modal.onclick = (e) => {
    if (e.target === modal) closePastelModal();
  };
}
function openSorveteModal(itemName) {
  const modal = document.getElementById("sorveteModal");
  modal.style.display = "flex";

  modal.onclick = (e) => {
    if (e.target === modal) closeSorveteModal();
  };
}

function closeSorveteModal() {
  document.getElementById("sorveteModal").style.display = "none";
  document.querySelectorAll(".flavors input").forEach(i => i.checked = false);
}

function confirmSorvete() {
  const selectedFlavor = document.querySelector(".flavors input:checked");

  if (!selectedFlavor) {
    alert("Por favor, escolha um sabor!");
    return;
  }

  const nameFinal = `${selectedItem.name} - ${selectedFlavor.value}`;

  cart.push({
    name: nameFinal,
    price: selectedItem.price,
    qty: 1
  });

  closeSorveteModal();
  updateCart();
  showBottomToast(`Sorvete adicionado!`, "🍨");
}

// MODAL SUCOS (Com leite / Sem leite)
function openSucoModal(itemName) {
  const modal = document.getElementById("sucoModal");
  const title = modal.querySelector("h3");
  const priceSpan = modal.querySelector('.suco-price');

  console.log('openSucoModal called for', itemName, 'selectedItem=', selectedItem);

  title.textContent = `🍹 Escolha opção para ${itemName}`;
  priceSpan.textContent = selectedItem && selectedItem.price ? selectedItem.price.toFixed(2) : '0.00';
  modal.style.display = "flex";
  // garante que fique acima do modal de confirmação
  try { modal.style.zIndex = 2100; } catch(e) {}

  // vincula botões do modal de suco (confirmar / cancelar) via JS para evitar problemas com onclick inline
  try {
    const confirmBtn = modal.querySelector('.modal-actions button:first-child');
    const cancelBtn = modal.querySelector('.modal-actions .cancel') || modal.querySelector('.modal-actions button:last-child');
    if (confirmBtn) {
      // remove handlers and attach listener reliably
      try { confirmBtn.replaceWith(confirmBtn.cloneNode(true)); } catch(e) {}
      const newConfirm = modal.querySelector('.modal-actions button:first-child');
      if (newConfirm) {
        newConfirm.type = 'button';
        newConfirm.addEventListener('click', () => { console.log('suco modal confirm clicked'); confirmSuco(); });
      }
    }
    if (cancelBtn) {
      try { cancelBtn.replaceWith(cancelBtn.cloneNode(true)); } catch(e) {}
      const newCancel = modal.querySelector('.modal-actions .cancel') || modal.querySelector('.modal-actions button:last-child');
      if (newCancel) newCancel.addEventListener('click', () => { closeSucoModal(); });
    }

    // foco na primeira opção disponível
    const firstOpt = modal.querySelector('.suco-options input[name="sucoOption"]');
    if (firstOpt) {
      firstOpt.focus();
    }
    
  } catch (e) { console.warn('erro ao bindar buttons do modal de suco', e); }

  modal.onclick = (e) => {
    if (e.target === modal) closeSucoModal();
  };
}

// Abre modal de confirmação antes de adicionar qualquer item
function openConfirmBeforeAdd(item) {
  // item é objeto {name, price, img}
  let modal = document.getElementById('confirmModal');

  // se modal não existir (cache/versão diferente), cria um minimal e anexa ao body
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'confirmModal';
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <h3 id="confirmTitle">Confirmar</h3>
        <div class="confirm-body" style="display:flex;gap:12px;align-items:center;margin:12px 0;">
          <img id="confirmImg" src="${placeholderImg}" alt="" style="width:72px;height:72px;object-fit:cover;border-radius:8px;">
          <div>
            <p id="confirmText" style="margin-bottom:6px;"></p>
            <p style="color:#666;font-size:0.9rem">Deseja confirmar a adição ao carrinho?</p>
          </div>
        </div>
        <div class="modal-actions">
          <button id="confirmYes">Confirmar</button>
          <button class="cancel" id="confirmNo">Cancelar</button>
        </div>
      </div>`;
    document.body.appendChild(modal);
  }

  const title = document.getElementById('confirmTitle');
  const text = document.getElementById('confirmText');
  const img = document.getElementById('confirmImg');

  // garante que o modal esteja anexado ao body (evita ficar preso dentro de outro modal)
  if (modal.parentElement !== document.body) document.body.appendChild(modal);

  // torna visível e com z-index elevado
  modal.style.zIndex = 2000;

  // se for suco, primeiro mostrar a escolha (Com leite / Sem leite)
  if (isSucoName(item.name)) {
    return openSucoChoice(item);
  }

  title.textContent = `Adicionar ao pedido`;
  text.textContent = `${item.name} — R$ ${item.price.toFixed(2)}`;
  img.src = item.img || placeholderImg;

  // define ação a executar ao confirmar
  pendingAddAction = () => {
    // chama addToCart exatamente como antes
    addToCart(item.name, item.price);
  };
  pendingItemPreview = item;

  // mostra modal
  modal.style.display = 'flex';

  // conecta botões (evita múltiplos handlers acumulados)
  const yes = modal.querySelector('#confirmYes') || document.getElementById('confirmYes');
  const no = modal.querySelector('#confirmNo') || document.getElementById('confirmNo');
  if (yes) yes.onclick = () => { console.log('confirmYes clicked'); confirmAdd(); };
  if (no) no.onclick = () => { console.log('confirmNo clicked'); closeConfirmModal(); };

  // fechar ao clicar fora
  modal.onclick = (e) => { if (e.target === modal) closeConfirmModal(); };
}

// Abre um modal simples para escolher Com leite / Sem leite para sucos
function openSucoChoice(item) {
  let choice = document.getElementById('sucoChoiceModal');
  if (!choice) {
    choice = document.createElement('div');
    choice.id = 'sucoChoiceModal';
    choice.className = 'modal';
    choice.innerHTML = `
      <div class="modal-content">
        <h3>🍹 Você quer o suco de ${item.name}?</h3>
        <div style="display:flex;gap:10px;margin-top:12px;">
          <button id="sucoChoiceWith" style="flex:1" data-option="Com leite">Com leite</button>
          <button id="sucoChoiceWithout" style="flex:1" data-option="Sem leite">Sem leite</button>
        </div>
        <div style="display:flex;gap:8px;margin-top:12px;align-items:center;">
          <button id="sucoChoiceConfirm" disabled style="flex:1">Confirmar</button>
          <button class="cancel" id="sucoChoiceCancel" style="flex:1">Cancelar</button>
        </div>
      </div>`;
    document.body.appendChild(choice);
  } else {
    // atualiza o título se já existir
    const h = choice.querySelector('h3'); if (h) h.textContent = `🍹 Você quer o suco de ${item.name}?`;
  }

  const withBtn = choice.querySelector('#sucoChoiceWith');
  const withoutBtn = choice.querySelector('#sucoChoiceWithout');
  const confirmBtn = choice.querySelector('#sucoChoiceConfirm');
  const cancelBtn = choice.querySelector('#sucoChoiceCancel');

  // ocultar botões inicialmente; só mostrar após seleção
  if (confirmBtn) {
    confirmBtn.disabled = true;
    confirmBtn.style.display = 'none';
  }
  if (cancelBtn) {
    cancelBtn.style.display = 'none';
  }

  const cleanup = () => {
    choice.style.display = 'none';
    pendingSucoOption = null;
    [withBtn, withoutBtn].forEach(b => { if (b) b.classList.remove('active'); });
    if (confirmBtn) { confirmBtn.disabled = true; confirmBtn.style.display = 'none'; }
    if (cancelBtn) { cancelBtn.style.display = 'none'; }
  };

  const markSelected = (btn, label) => {
    pendingSucoOption = label;
    // estilo visual simples
    [withBtn, withoutBtn].forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    if (confirmBtn) {
      confirmBtn.disabled = false;
      confirmBtn.style.display = '';
    }
    if (cancelBtn) {
      cancelBtn.style.display = '';
    }
  };

  withBtn.onclick = () => { markSelected(withBtn, 'Com leite'); };
  withoutBtn.onclick = () => { markSelected(withoutBtn, 'Sem leite'); };
  confirmBtn.onclick = () => {
    if (!pendingSucoOption) return;
    const sel = pendingSucoOption;
    cleanup();
    // passa a opção selecionada e só depois limpa o estado
    openConfirmForItem(item, sel);
    pendingSucoOption = null;
  };
  cancelBtn.onclick = () => { cleanup(); };

  choice.style.display = 'flex';
  choice.style.zIndex = 2050;
}

function openConfirmForItem(item, optionLabel) {
  let modal = document.getElementById('confirmModal');
  if (!modal) {
    // fallback: call openConfirmBeforeAdd which will create it
    return openConfirmBeforeAdd(item);
  }
  const title = document.getElementById('confirmTitle');
  const text = document.getElementById('confirmText');
  const img = document.getElementById('confirmImg');

  title.textContent = `Confirmar ${item.name}`;
  text.textContent = `${item.name} - ${optionLabel} — R$ ${item.price.toFixed(2)}`;
  img.src = item.img || placeholderImg;

  pendingAddAction = () => {
    // adiciona com o rótulo escolhido
    addToCart(`${item.name} - ${optionLabel}`, item.price);
  };
  pendingItemPreview = item;

  modal.style.display = 'flex';
  modal.style.zIndex = 2000;

  const yes = modal.querySelector('#confirmYes') || document.getElementById('confirmYes');
  const no = modal.querySelector('#confirmNo') || document.getElementById('confirmNo');
  if (yes) yes.onclick = () => { confirmAdd(); };
  if (no) no.onclick = () => { closeConfirmModal(); };
}

function closeConfirmModal() {
  const modal = document.getElementById('confirmModal');
  if (!modal) return;
  modal.style.display = 'none';
  pendingAddAction = null;
  pendingItemPreview = null;
  console.log('confirm modal closed');
}

function confirmAdd() {
  console.log('confirmAdd called, pendingAddAction=', !!pendingAddAction);
  if (typeof pendingAddAction === 'function') {
    // sinaliza que a confirmação veio do modal global — se o item abrir o suco modal, podemos auto-confirmar
    autoConfirmSuco = true;
    pendingAddAction();
  }
  closeConfirmModal();
}

function closeSucoModal() {
  document.getElementById("sucoModal").style.display = "none";
  document.querySelectorAll(".suco-options input").forEach(i => i.checked = false);
}

function confirmSuco() {
  console.log('confirmSuco called, selectedItem=', selectedItem);
  const opt = document.querySelector('.suco-options input[name="sucoOption"]:checked');
  const optionLabel = opt ? opt.value : 'Sem leite';

  if (!selectedItem) {
    console.error('confirmSuco: selectedItem is null, aborting');
    alert('Erro interno: item não selecionado. Tente novamente.');
    return;
  }

  const nameFinal = `${selectedItem.name} - ${optionLabel}`;

  cart.push({ name: nameFinal, price: selectedItem.price, qty: 1 });
  closeSucoModal();
  updateCart();
  showBottomToast(`${selectedItem.name} adicionado!`, "🍹");
}

// FUNÇÕES PARA O MODAL DE PASTEL
function openPastelModal(itemName) {
  // Primeiro abre o modal de seleção de preço
  openPastelPriceModal();
}

function closePastelModal() {
  document.getElementById("pastelModal").style.display = "none";
  document.querySelectorAll(".sabor-checkbox").forEach(i => i.checked = false);
  document.querySelectorAll(".acomp-checkbox").forEach(i => i.checked = false);
  document.getElementById("saborCount").textContent = `(0/${selectedPastelLimit})`;
  document.getElementById("pastelPrice").textContent = selectedPastelPrice.toFixed(2);
  // Reset para padrão
  selectedPastelPrice = 5;
  selectedPastelLimit = 5;
}

function updatePastelPrice() {
  const selectedSabores = document.querySelectorAll(".sabor-checkbox:checked").length;
  const basePrice = (typeof selectedPastelPrice === 'number' && selectedPastelPrice) ? selectedPastelPrice : (selectedItem && selectedItem.price) || 5;
  const limit = selectedPastelLimit || 5;
  const extraSabores = Math.max(0, selectedSabores - limit);
  const totalPrice = basePrice + (extraSabores * 1.5);

  const saborCountEl = document.getElementById("saborCount");
  if (saborCountEl) saborCountEl.textContent = `(${selectedSabores}/${limit})`;
  const priceEl = document.getElementById("pastelPrice");
  if (priceEl) priceEl.textContent = totalPrice.toFixed(2);

  // Muda a cor do contador se passar do limite
  if (saborCountEl) {
    if (selectedSabores > limit) {
      saborCountEl.style.color = "#d9534f";
      saborCountEl.style.fontWeight = "bold";
    } else {
      saborCountEl.style.color = "#666";
      saborCountEl.style.fontWeight = "normal";
    }
  }
}

function confirmPastel() {
  const selectedSabores = Array.from(document.querySelectorAll(".sabor-checkbox:checked")).map(i => i.value);
  const selectedAcomps = Array.from(document.querySelectorAll(".acomp-checkbox:checked")).map(i => i.value);
  if (selectedSabores.length !== selectedPastelLimit) {
    alert(`Selecione exatamente ${selectedPastelLimit} sabores.`);
    return;
  }
  const item = {
    name: `Pastel (${selectedSabores.join(", ")})`,
    price: selectedPastelPrice,
    quantity: 1,
    customizations: {
      sabores: selectedSabores,
      acompanhamentos: selectedAcomps
    }
  };
  addToCart(item);
  closePastelModal();
  showBottomToast("Pastel adicionado ao carrinho!");
}

// NOVA FUNÇÃO: MOSTRAR/OCULTAR FORMULÁRIO DE DELIVERY
function toggleDeliveryForm() {
  const deliveryType = document.getElementById("deliveryType").value;
  const deliveryForm = document.getElementById("deliveryForm");
  const cartSection = document.querySelector(".cart");

  if (deliveryType === "Delivery") {
    deliveryForm.style.display = "flex";
    cartSection.classList.add("with-form");
  } else {
    deliveryForm.style.display = "none";
    cartSection.classList.remove("with-form");
  }
}

function sendWhatsApp() {
  if (cart.length === 0) {
    alert("Adicione itens ao pedido.");
    return;
  }

  const delivery = document.getElementById("deliveryType").value;

  // VALIDAÇÃO PARA DELIVERY
  if (delivery === "Delivery") {
    const name = document.getElementById("customerName").value.trim();
    const address = document.getElementById("customerAddress").value.trim();
    const phone = document.getElementById("customerPhone").value.trim();

    if (!name || !address || !phone) {
      alert("Por favor, preencha seus dados para delivery (nome, endereço e telefone).");
      return;
    }
  }

  let message = "Olá! Gostaria de fazer um pedido:%0A%0A";

  // ITENS DO PEDIDO
  cart.forEach(item => {
    message += `• ${item.name} x${item.qty} — R$ ${(item.price * item.qty).toFixed(2)}%0A`;
  });

  message += `%0A*Total: R$ ${document.getElementById("total").textContent}*%0A%0A`;

  // INFORMAÇÕES DE ENTREGA
  message += `📦 *Forma de entrega:* ${delivery}%0A`;

  if (delivery === "Delivery") {
    const name = document.getElementById("customerName").value.trim();
    const address = document.getElementById("customerAddress").value.trim();
    const phone = document.getElementById("customerPhone").value.trim();
    const notes = document.getElementById("orderNotes").value.trim();

    message += `%0A👤 *Nome:* ${name}%0A`;
    message += `📍 *Endereço:* ${address}%0A`;
    message += `📞 *Telefone:* ${phone}%0A`;

    if (notes) {
      message += `%0A📝 *Observações:* ${notes}`;
    }
  }

  window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
}

// INICIALIZA O BOTÃO DO CARRINHO
// Função para contar itens do carrinho
function getCartCount() {
  return cart.reduce((sum, it) => sum + (it.qty || 0), 0);
}

// Atualiza o badge do botão do carrinho
function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  if (badge) badge.textContent = getCartCount();
  const badgeTop = document.getElementById('cartBadgeTop');
  if (badgeTop) badgeTop.textContent = getCartCount();
}

// Cria o botão flutuante que alterna a visibilidade do carrinho
function createCartButton() {
  if (document.getElementById('cartToggleBtn')) return;

  const btn = document.createElement('button');
  btn.id = 'cartToggleBtn';
  btn.className = 'cart-toggle-btn';
  btn.innerHTML = `🛒 <span id="cartBadge">${getCartCount()}</span>`;
  btn.onclick = toggleCart;
  document.body.appendChild(btn);
}

// Cria botão de carrinho no canto superior direito (estilo branco + número roxo)
function createTopCartButton() {
  if (document.getElementById('cartToggleTop')) return;
  const btn = document.createElement('button');
  btn.id = 'cartToggleTop';
  btn.className = 'cart-top-btn';
  btn.innerHTML = `🛒 <span id="cartBadgeTop">${getCartCount()}</span>`;
  btn.onclick = toggleCart;
  document.body.appendChild(btn);
}

// Mostra/oculta o elemento .cart
function toggleCart() {
  const cartEl = document.querySelector('.cart');
  if (!cartEl) return;
  // alterna estado open/hidden para controlar drawer
  cartEl.classList.toggle('open');
  cartEl.classList.toggle('hidden');

  // Atualiza texto do botão inferior conforme estado
  const btn = document.getElementById('cartToggleBtn');
  if (btn) {
    if (cartEl.classList.contains('hidden')) {
      btn.innerHTML = `🛒 <span id="cartBadge">${getCartCount()}</span>`;
    } else {
      btn.innerHTML = '✖️ Fechar';
    }
  }

  // Atualiza botão superior conforme estado
  const topBtn = document.getElementById('cartToggleTop');
  if (topBtn) {
    if (cartEl.classList.contains('hidden')) {
      topBtn.innerHTML = `🛒 <span id="cartBadgeTop">${getCartCount()}</span>`;
    } else {
      topBtn.innerHTML = '✖';
    }
  }
}

// Inicializa UI
setupCategoryTabs();
setupSearch();
renderMenu();
createCartButton();
createTopCartButton();
updateCartBadge();
// Parallax: move o background da search-area levemente com o scroll
function setupParallax() {
  const bg = document.querySelector('.search-area .search-bg');
  if (!bg) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY || window.pageYOffset;
    // movimento suave e leve
    const offset = Math.round(y * 0.15);
    bg.style.transform = `translateY(${offset}px)`;
  }, { passive: true });
}

setupParallax();

// Atualiza contraste do botão superior verificando o elemento sob ele
function updateTopCartContrast() {
  const topBtn = document.getElementById('cartToggleTop');
  if (!topBtn) return;

  // calcula centro do botão
  const rect = topBtn.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;

  // temporariamente permitir hit-test passando por cima
  const prevPointer = topBtn.style.pointerEvents;
  topBtn.style.pointerEvents = 'none';
  const el = document.elementFromPoint(x, y);
  topBtn.style.pointerEvents = prevPointer || '';

  let cur = el;
  let bgColor = null;
  while (cur && cur !== document.documentElement) {
    const cs = window.getComputedStyle(cur);
    const c = cs.backgroundColor;
    if (c && c !== 'transparent' && c !== 'rgba(0, 0, 0, 0)') { bgColor = c; break; }
    cur = cur.parentElement;
  }

  // fallback para body
  if (!bgColor) bgColor = window.getComputedStyle(document.body).backgroundColor;

  // analisa brilho para decidir contraste (RGB ou RGBA)
  const m = bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  let makePurple = false;
  if (m) {
    const r = parseInt(m[1], 10), g = parseInt(m[2], 10), b = parseInt(m[3], 10);
    const lum = 0.2126*r + 0.7152*g + 0.0722*b;
    // se fundo é claro -> botão roxo; se fundo escuro -> botão branco
    makePurple = lum > 180;
  }

  if (makePurple) topBtn.classList.add('purple');
  else topBtn.classList.remove('purple');
}

// atualiza no scroll e resize com rAF
let pendingTopBtnUpdate = false;
function scheduleTopBtnUpdate() {
  if (pendingTopBtnUpdate) return;
  pendingTopBtnUpdate = true;
  requestAnimationFrame(() => { updateTopCartContrast(); pendingTopBtnUpdate = false; });
}

window.addEventListener('scroll', scheduleTopBtnUpdate, { passive: true });
window.addEventListener('resize', scheduleTopBtnUpdate);

// roda inicialmente
scheduleTopBtnUpdate();