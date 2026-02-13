// Function to update total badge from server
async function updateTotalBadge() {
    try {
        const response = await fetch('/total');
        const data = await response.json();
        const badge = document.getElementById('total-badge');
        badge.textContent = `Total: Rp ${data.total}`;
    } catch (error) {
        console.error('Error updating total:', error);
    }
}

// Function to add message to chat history
function addMessage(message, type) {
    const chatHistory = document.getElementById('chat-history');
    const bubble = document.createElement('div');
    bubble.classList.add('chat-bubble', type);
    bubble.textContent = message;
    chatHistory.appendChild(bubble);
    chatHistory.scrollTop = chatHistory.scrollHeight; // Auto scroll to bottom
}

// Function to handle chat input
async function handleInput() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (message) {
        addMessage(message, 'user');
        input.value = '';

        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            });
            const data = await response.json();
            addMessage(data.response, 'system');
        } catch (error) {
            console.error('Error sending chat message:', error);
            addMessage('Sorry, I am unable to respond right now.', 'system');
        }
    }
}

// Function to handle add to cart
async function addToCart(itemName) {
    try {
        const response = await fetch('/add-to-cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ itemName })
        });
        const data = await response.json();
        updateTotalBadge();
        addMessage(`Added ${itemName} to cart. Total: Rp ${data.total}`, 'system');
    } catch (error) {
        console.error('Error adding to cart:', error);
        addMessage('Error adding item to cart.', 'system');
    }
}

// Event listeners
document.getElementById('chat-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        handleInput();
    }
});

document.getElementById('order-btn').addEventListener('click', function() {
    addMessage('Thank you for your order!', 'system');
});

// Add event listeners to add-to-cart buttons
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.add-to-cart-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const itemName = this.getAttribute('data-item');
            addToCart(itemName);
        });
    });
    // Initial total update
    updateTotalBadge();
});
