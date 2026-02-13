const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('.')); // Serve static files from current directory

// Mock data for menu items
const menuItems = [
    { name: 'Bakso Malang', price: 20000, description: 'Kuah kaldu gurih, komplit dengan siomay & tahu.', categories: ['savory', 'filling', 'cheap'] },
    { name: 'Sate Taichan', price: 25000, description: 'Sate ayam tanpa bumbu kacang, pedas sambal gurih.', categories: ['spicy', 'fast'] },
    { name: 'Mie Ayam Jamur', price: 18000, description: 'Mie kenyal dengan topping ayam jamur lezat.', categories: ['cheap', 'savory'] },
    { name: 'Es Campur', price: 15000, description: 'Manis segar aneka buah dan agar-agar.', categories: ['sweet', 'refreshing'] }
];

let cartTotal = 0;

// Endpoint to add item to cart
app.post('/add-to-cart', (req, res) => {
    const { itemName } = req.body;
    const item = menuItems.find(i => i.name === itemName);
    if (item) {
        cartTotal += item.price;
        res.json({ total: cartTotal });
    } else {
        res.status(400).json({ error: 'Item not found' });
    }
});

// Endpoint to get total
app.get('/total', (req, res) => {
    res.json({ total: cartTotal });
});

// AI-style response function
function generateAIResponse(message) {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('cheap') || lowerMessage.includes('cheapest')) {
        const cheapestItem = menuItems.reduce((min, item) => item.price < min.price ? item : min);
        return `Hello Your Majesty! The cheapest offer is ${cheapestItem.name} - ${cheapestItem.price / 1000}k`;
    } else if (lowerMessage.includes('spicy')) {
        const spicyItems = menuItems.filter(item => item.categories.includes('spicy'));
        if (spicyItems.length > 0) {
            return `Hello Your Majesty! The best spicy offer is ${spicyItems[0].name} - ${spicyItems[0].price / 1000}k`;
        }
    } else if (lowerMessage.includes('sweet')) {
        const sweetItems = menuItems.filter(item => item.categories.includes('sweet'));
        if (sweetItems.length > 0) {
            return `Hello Your Majesty! The best sweet offer is ${sweetItems[0].name} - ${sweetItems[0].price / 1000}k`;
        }
    } else if (lowerMessage.includes('budget')) {
        const budgetItems = menuItems.filter(item => item.price <= 20000);
        if (budgetItems.length > 0) {
            return `Hello Your Majesty! Based on your budget, I recommend: ${budgetItems.map(i => `${i.name} - ${i.price / 1000}k`).join(', ')}`;
        }
    } else {
        return 'Hello Your Majesty! How can I assist you with your order today?';
    }
}

// Endpoint for chat
app.post('/chat', (req, res) => {
    const { message } = req.body;
    const response = generateAIResponse(message);
    res.json({ response });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
