// Billing Page JavaScript

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the page
    initBillingPage();
    
    // Set up event listeners
    setupEventListeners();
});

// Initialize the billing page
function initBillingPage() {
    // Load cart data
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        const cartData = JSON.parse(savedCart);
        
        // Populate order summary
        populateOrderSummary(cartData);
        
        // Calculate and display totals
        updateOrderTotals(cartData);
    } else {
        // Handle empty cart
        handleEmptyCart();
    }
}

// Populate the order summary table with cart items
function populateOrderSummary(cartData) {
    const orderItemsTable = document.getElementById('order-items');
    orderItemsTable.innerHTML = '';
    
    if (!cartData.items || Object.keys(cartData.items).length === 0) {
        handleEmptyCart();
        return;
    }
    
    // Loop through cart items and create table rows
    for (const [productName, details] of Object.entries(cartData.items)) {
        const row = document.createElement('tr');
        
        // Create table cells
        row.innerHTML = `
            <td data-label="Product">${productName}</td>
            <td data-label="Quantity">
                <div class="quantity-controls">
                    <button class="quantity-btn minus" data-product="${productName}">-</button>
                    <span class="quantity-display">${details.quantity}</span>
                    <button class="quantity-btn plus" data-product="${productName}">+</button>
                </div>
            </td>
            <td data-label="Price">LE ${details.price.toFixed(2)}</td>
            <td data-label="Total">LE ${(details.price * details.quantity).toFixed(2)}</td>
            <td data-label="Action">
                <button class="remove-item" data-product="${productName}">Remove</button>
            </td>
        `;
        
        orderItemsTable.appendChild(row);
    }
}

// Update the order totals (subtotal, shipping, total)
function updateOrderTotals(cartData) {
    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const orderTotalElement = document.getElementById('order-total');
    
    // Default shipping cost
    const shippingCost = 50;
    
    // Calculate subtotal
    const subtotal = cartData.total || 0;
    
    // Calculate total
    const total = subtotal + shippingCost;
    
    // Update UI
    subtotalElement.textContent = `LE ${subtotal.toFixed(2)}`;
    shippingElement.textContent = `LE ${shippingCost.toFixed(2)}`;
    orderTotalElement.textContent = `LE ${total.toFixed(2)}`;
}

// Handle empty cart scenario
function handleEmptyCart() {
    const orderItemsTable = document.getElementById('order-items');
    const subtotalElement = document.getElementById('subtotal');
    const orderTotalElement = document.getElementById('order-total');
    
    // Display message for empty cart
    orderItemsTable.innerHTML = `
        <tr>
            <td colspan="5" style="text-align: center; padding: 30px;">
                <p>Your cart is empty.</p>
                <button onclick="navigateToStore()" style="margin-top: 15px; padding: 10px 15px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Continue Shopping
                </button>
            </td>
        </tr>
    `;
    
    // Update totals
    subtotalElement.textContent = 'LE 0.00';
    orderTotalElement.textContent = 'LE 50.00'; // Only shipping cost
    
    // Disable order button
    document.getElementById('place-order-btn').disabled = true;
    document.getElementById('place-order-btn').style.opacity = '0.5';
    document.getElementById('place-order-btn').style.cursor = 'not-allowed';
}

// Set up various event listeners
function setupEventListeners() {
    // Toggle credit card details when payment method changes
    setupPaymentMethodToggle();
    
    // Setup quantity control buttons
    setupQuantityControls();
    
    // Setup remove item buttons
    setupRemoveItemButtons();
    
    // Setup place order button
    setupPlaceOrderButton();
}

// Toggle credit card details when payment method changes
function setupPaymentMethodToggle() {
    const cashOnDelivery = document.getElementById('cash-on-delivery');
    const creditCard = document.getElementById('credit-card');
    const cardDetails = document.getElementById('card-details');
    
    // Show/hide card details based on selected payment method
    function toggleCardDetails() {
        if (creditCard.checked) {
            cardDetails.style.display = 'block';
        } else {
            cardDetails.style.display = 'none';
        }
    }
    
    // Initial state
    toggleCardDetails();
    
    // Add event listeners
    cashOnDelivery.addEventListener('change', toggleCardDetails);
    creditCard.addEventListener('change', toggleCardDetails);
}

// Setup quantity control buttons
function setupQuantityControls() {
    // Get all plus and minus buttons
    const plusButtons = document.querySelectorAll('.quantity-btn.plus');
    const minusButtons = document.querySelectorAll('.quantity-btn.minus');
    
    // Add event listeners to plus buttons
    plusButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.getAttribute('data-product');
            adjustQuantity(productName, 1);
        });
    });
    
    // Add event listeners to minus buttons
    minusButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.getAttribute('data-product');
            adjustQuantity(productName, -1);
        });
    });
}

// Adjust item quantity and update the page
function adjustQuantity(productName, change) {
    // Get current cart data
    const savedCart = localStorage.getItem('cart');
    if (!savedCart) return;
    
    const cartData = JSON.parse(savedCart);
    if (!cartData.items[productName]) return;
    
    const item = cartData.items[productName];
    const newQuantity = item.quantity + change;
    
    // Remove item if quantity would be zero or less
    if (newQuantity <= 0) {
        removeItem(productName);
        return;
    }
    
    // Update quantity
    item.quantity = newQuantity;
    
    // Recalculate total
    cartData.total = Object.values(cartData.items).reduce(
        (sum, item) => sum + (item.price * item.quantity), 0
    );
    
    // Save updated cart
    localStorage.setItem('cart', JSON.stringify(cartData));
    
    // Update UI
    updateQuantityDisplay(productName, newQuantity);
    updateItemTotal(productName, item.price * newQuantity);
    updateOrderTotals(cartData);
    
    // Update cart badge
    updateCartBadge(cartData);
}

// Update the quantity display for a product
function updateQuantityDisplay(productName, newQuantity) {
    const row = document.querySelector(`.quantity-btn[data-product="${productName}"]`).closest('tr');
    const quantityDisplay = row.querySelector('.quantity-display');
    quantityDisplay.textContent = newQuantity;
}

// Update the total price for an item
function updateItemTotal(productName, newTotal) {
    const row = document.querySelector(`.quantity-btn[data-product="${productName}"]`).closest('tr');
    const totalCell = row.querySelector('td[data-label="Total"]');
    totalCell.textContent = `LE ${newTotal.toFixed(2)}`;
}

// Setup remove item buttons
function setupRemoveItemButtons() {
    const removeButtons = document.querySelectorAll('.remove-item');
    
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.getAttribute('data-product');
            removeItem(productName);
        });
    });
}

// Remove an item from the cart
function removeItem(productName) {
    // Get current cart data
    const savedCart = localStorage.getItem('cart');
    if (!savedCart) return;
    
    const cartData = JSON.parse(savedCart);
    if (!cartData.items[productName]) return;
    
    // Calculate amount to subtract from total
    const itemTotal = cartData.items[productName].price * cartData.items[productName].quantity;
    cartData.total -= itemTotal;
    
    // Remove item
    delete cartData.items[productName];
    
    // Save updated cart
    localStorage.setItem('cart', JSON.stringify(cartData));
    
    // Refresh the page to reflect changes
    // Could optimize this to just remove the row, but for simplicity we'll refresh
    initBillingPage();
    
    // Update cart badge
    updateCartBadge(cartData);
}

// Update the cart badge with the total number of items
function updateCartBadge(cartData) {
    const badge = document.querySelector('.cart-icon .badge');
    if (!badge) return;
    
    // Calculate total number of items
    const totalItems = Object.values(cartData.items).reduce(
        (sum, item) => sum + item.quantity, 0
    );
    
    badge.textContent = totalItems;
}

// Setup place order button
function setupPlaceOrderButton() {
    const placeOrderBtn = document.getElementById('place-order-btn');
    
    placeOrderBtn.addEventListener('click', function() {
        // Get current cart data
        const savedCart = localStorage.getItem('cart');
        if (!savedCart || Object.keys(JSON.parse(savedCart).items).length === 0) {
            alert('Your cart is empty.');
            return;
        }
        
        // Get form data
        const form = document.getElementById('billing-form');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        // Get payment method
        const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
        
        // If credit card is selected, validate card details
        if (paymentMethod === 'card') {
            const cardNumber = document.getElementById('card-number').value;
            const expiryDate = document.getElementById('expiry-date').value;
            const cvv = document.getElementById('cvv').value;
            
            if (!cardNumber || !expiryDate || !cvv) {
                alert('Please enter all credit card details.');
                return;
            }
        }
        
        // Process the order (in a real application, this would send data to a server)
        processOrder();
    });
}

// Process the order
function processOrder() {
    // In a real application, this would send data to a server
    // For now, we'll just show an alert and clear the cart
    
    // Display success message
    alert('Your order has been placed successfully!');
    
    // Clear the cart
    localStorage.removeItem('cart');
    
    // Redirect to the store
    window.location.href = 'Store.html';
}

// Function to navigate back to store with animation
function navigateToStore() {
    const body = document.body;
    body.classList.add('animate-out-left');
    setTimeout(() => {
        window.location.href = 'Store.html';
    }, 300);
}