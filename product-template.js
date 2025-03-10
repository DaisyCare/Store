// Global variable to store the current product data
let currentProduct = null;

// Function to navigate back to store
function navigateToStore() {
    const body = document.body;
    body.classList.add('animate-out-left'); // Changed to left animation
    setTimeout(() => {
        window.location.href = 'store.html';
    }, 300);
}

// Function to navigate to billing page
function navigateToBilling() {
    const body = document.body;
    body.classList.add('animate-out-right');
    setTimeout(() => {
        window.location.href = 'billing.html';
    }, 300);
}

// Function to navigate to a product page based on product name
function navigateToProduct(productName) {
    // Add animation class
    const body = document.body;
    body.classList.add('animate-out-right');
    
    // Convert product name to filename format
    const filename = productName.replace(/ /g, '-') + '.html';
    
    // Wait for animation to complete before navigating
    setTimeout(() => {
        window.location.href = filename;
    }, 300);
}

// Variable to track the timeout
let cartDropdownTimeout = null;

// JavaScript to Update Cart
const cart = {
    items: {}, // Use an object to store products by name as keys
    total: 0,
    addItem: function (name, price, quantity) {
        if (this.items[name]) {
            // If the product already exists, update its quantity
            this.items[name].quantity += quantity;
        } else {
            // Otherwise, add the product to the cart
            this.items[name] = { price, quantity };
        }
        this.total += price * quantity; // Update the total price
        this.saveToLocalStorage(); // Save cart data to localStorage
        this.updateUI();
    },
    removeItem: function (name) {
        if (this.items[name]) {
            // Subtract the total price of the removed item
            this.total -= this.items[name].price * this.items[name].quantity;
            delete this.items[name]; // Remove the item from the cart
            this.saveToLocalStorage(); // Save updated cart data

            // Update the UI elements
            this.updateUI();

            // Reset the product's "Add to Cart" button if we're on its page
            const formattedName = name.replace(/ /g, '-');
            const cartActionDiv = document.getElementById(`cart-action-${formattedName}`);
            if (cartActionDiv) {
                // Get the price from the existing product data
                const price = name === "Missha Damaged Hair Therapy Treatment" ? 800 : 450;

                // Change back to "Add to Cart" button
                cartActionDiv.innerHTML = `
                    <button class="add-to-cart" onclick="addToCart('${name}', ${price})">
                        Add to Cart
                    </button>
                `;
            }
        }
    },
    updateUI: function () {
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        const badge = document.querySelector('.cart-icon .badge');

        // Clear Existing Items
        cartItems.innerHTML = '';

        // Add New Items
        for (const [name, details] of Object.entries(this.items)) {
            const li = document.createElement('li');

            // Create a container for the item text with enhanced clickability
            const itemText = document.createElement('div');
            itemText.textContent = `${details.quantity} × ${name} (${details.price} LE)`;
            itemText.style.cursor = 'pointer'; // Change cursor to indicate clickable
            
            // Add a click event to navigate to the product page
            itemText.addEventListener('click', () => {
                navigateToProduct(name);
            });
            
            // Add a hover effect to show it's clickable
            itemText.addEventListener('mouseenter', () => {
                itemText.style.textDecoration = 'underline';
            });
            
            itemText.addEventListener('mouseleave', () => {
                itemText.style.textDecoration = 'none';
            });
            
            li.appendChild(itemText);

            // Add a Remove Button with proper styling
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.className = 'remove-btn';
            removeButton.onclick = (e) => {
                e.stopPropagation(); // Prevent triggering navigation when clicking Remove
                this.removeItem(name);
            };
            li.appendChild(removeButton);

            cartItems.appendChild(li);
        }

        // Update Total
        cartTotal.textContent = this.total.toFixed(2);

        // Update Badge
        badge.textContent = Object.values(this.items).reduce((sum, item) => sum + item.quantity, 0);

        // Update cart action buttons on product pages
        this.updateCartButtons();
    },
    updateCartButtons: function() {
        // Get the current product name
        const path = window.location.pathname;
        const filename = path.split('/').pop();
        
        if (filename === "Missha-damaged-hair-therapy-treatment.html") {
            this.updateProductButton("Missha Damaged Hair Therapy Treatment", 800);
        } else if (filename === "Rivance-Rosemary-Oil.html") {
            this.updateProductButton("Rivance Rosemary Oil", 450);
        }
    },
    updateProductButton: function(productName, productPrice) {
        const formattedName = productName.replace(/ /g, '-');
        const cartActionDiv = document.getElementById(`cart-action-${formattedName}`);
        
        if (cartActionDiv && this.items[productName]) {
            // If product is in cart, show quantity controls
            cartActionDiv.innerHTML = `
                <div class="cart-quantity">
                    <button onclick="adjustQuantity('${productName}', -1)">-</button>
                    <span>${this.items[productName].quantity}</span>
                    <button onclick="adjustQuantity('${productName}', 1)">+</button>
                </div>
            `;
        }
    },
    saveToLocalStorage: function () {
        // Save cart data to localStorage
        localStorage.setItem('cart', JSON.stringify({ items: this.items, total: this.total }));
    },
    loadFromLocalStorage: function () {
        // Load cart data from localStorage
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            const parsedCart = JSON.parse(savedCart);
            this.items = parsedCart.items;
            this.total = parsedCart.total;
            this.updateUI();
        }
    }
};

// Function to add to cart
function addToCart(name, price) {
    cart.addItem(name, price, 1);
    
    // Update the button to quantity controls
    const formattedName = name.replace(/ /g, '-');
    const cartActionDiv = document.getElementById(`cart-action-${formattedName}`);
    if (cartActionDiv) {
        cartActionDiv.innerHTML = `
            <div class="cart-quantity">
                <button onclick="adjustQuantity('${name}', -1)">-</button>
                <span>1</span>
                <button onclick="adjustQuantity('${name}', 1)">+</button>
            </div>
        `;
    }
}

// Function to adjust quantity
function adjustQuantity(name, change) {
    const price = name === "Missha Damaged Hair Therapy Treatment" ? 800 : 450;
    const formattedName = name.replace(/ /g, '-');
    
    // Get the cart item
    const cartItem = cart.items[name];
    if (!cartItem) return;
    
    // Calculate new quantity
    const newQuantity = cartItem.quantity + change;
    
    // Get the cartActionDiv
    const cartActionDiv = document.getElementById(`cart-action-${formattedName}`);
    
    // If new quantity would be zero or less, remove from cart
    if (newQuantity <= 0) {
        cart.removeItem(name);
        
        // Reset to Add to Cart button
        if (cartActionDiv) {
            cartActionDiv.innerHTML = `
                <button class="add-to-cart" onclick="addToCart('${name}', ${price})">
                    Add to Cart
                </button>
            `;
        }
    } else {
        // Otherwise, update the quantity
        cart.addItem(name, price, change);
        
        // Update the display
        if (cartActionDiv) {
            const quantitySpan = cartActionDiv.querySelector('.cart-quantity span');
            if (quantitySpan) {
                quantitySpan.textContent = newQuantity;
            }
        }
    }
}

// Initialize cart and event listeners when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger-icon');
    const mobileNav = document.querySelector('.mobile-nav');
    const overlay = document.querySelector('.menu-overlay');
    
    // Toggle menu function
    function toggleMenu() {
        hamburger.classList.toggle('open');
        mobileNav.classList.toggle('open');
        overlay.style.display = mobileNav.classList.contains('open') ? 'block' : 'none';
        document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    }
    
    // Event listeners for hamburger menu
    hamburger?.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleMenu();
    });
    
    overlay?.addEventListener('click', toggleMenu);
    
    const mobileLinks = document.querySelectorAll('.mobile-nav a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });
    
    window.addEventListener('resize', function() {
        if (window.innerWidth > 1024 && mobileNav.classList.contains('open')) {
            toggleMenu();
        }
    });

    // Load cart data
    cart.loadFromLocalStorage();

    // Set up event listeners for cart dropdown
    const cartIcon = document.querySelector('.cart-icon');
    const cartDropdown = document.querySelector('.cart-dropdown');

    // Show dropdown immediately on hover
    cartIcon?.addEventListener('mouseenter', () => {
        if (cartDropdownTimeout) {
            clearTimeout(cartDropdownTimeout);
            cartDropdownTimeout = null;
        }
        cartDropdown.style.display = 'block';
    });

    // Add delay before hiding dropdown
    cartIcon?.addEventListener('mouseleave', () => {
        cartDropdownTimeout = setTimeout(() => {
            if (!cartDropdown.matches(':hover')) {
                cartDropdown.style.display = 'none';
            }
        }, 2000);
    });

    // Handle the dropdown itself
    cartDropdown?.addEventListener('mouseenter', () => {
        if (cartDropdownTimeout) {
            clearTimeout(cartDropdownTimeout);
            cartDropdownTimeout = null;
        }
    });

    cartDropdown?.addEventListener('mouseleave', () => {
        cartDropdownTimeout = setTimeout(() => {
            cartDropdown.style.display = 'none';
        }, 2000);
    });
    
    // Setup navigation to billing page from cart icon and total
    const cartIconImg = document.querySelector('.cart-icon img');
    const cartTotal = document.querySelector('.cart-dropdown .total');
    
    if (cartIconImg) {
        cartIconImg.addEventListener('click', function(e) {
            // Only navigate if there are items in the cart
            const badge = document.querySelector('.cart-icon .badge');
            if (badge && parseInt(badge.textContent) > 0) {
                e.stopPropagation(); // Prevent the dropdown from showing
                navigateToBilling();
            }
        });
        // Make it look clickable
        cartIconImg.style.cursor = 'pointer';
    }
    
    if (cartTotal) {
        cartTotal.addEventListener('click', function() {
            // Only navigate if there are items in the cart
            const total = document.getElementById('cart-total');
            if (total && parseFloat(total.textContent) > 0) {
                navigateToBilling();
            }
        });
        // Make it look clickable
        cartTotal.style.cursor = 'pointer';
    }
});
