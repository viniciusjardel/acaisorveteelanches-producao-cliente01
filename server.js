const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Produtos padrão
const defaultProducts = [
    {
        id: 1,
        name: "X-Salada",
        price: 12,
        category: "Hambúrgueres",
        img: "img/x-salada.jpg"
    },
    {
        id: 2,
        name: "Cachorro-quente",
        price: 6,
        category: "Salgados",
        img: "img/hotdog.jpg"
    },
    // Adicione mais produtos padrão aqui
];

// Caminho do arquivo products.json
const productsFile = path.join(__dirname, 'products.json');

// Função para ler produtos
function readProducts() {
    if (fs.existsSync(productsFile)) {
        const data = fs.readFileSync(productsFile, 'utf8');
        return JSON.parse(data);
    }
    return defaultProducts;
}

// Função para salvar produtos
function saveProducts(products) {
    fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
}

// Endpoint GET /api/products
app.get('/api/products', (req, res) => {
    const products = readProducts();
    res.json(products);
});

// Endpoint POST /api/products
app.post('/api/products', (req, res) => {
    const products = req.body;
    saveProducts(products);
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});