  // Function to handle navigation with animation
  function navigateToProductmissha() {
    const body = document.body;
    body.classList.add('animate-out-right');
    setTimeout(() => {
        window.location.href = 'Missha-damaged-hair-therapy-treatment.html';
    }, 300);
}

// Function to handle navigation with animation
function navigateToProductRivance() {
    const body = document.body;
    body.classList.add('animate-out-right');
    setTimeout(() => {
        window.location.href = 'Rivance-Rosemary-Oil.html';
    }, 300);
}
function navigateToProductPrewash() {
    const body = document.body;
    body.classList.add('animate-out-right');
    setTimeout(() => {
        window.location.href = 'Pre-wash-Hair-Mask.html';
    }, 300);
}

// Function to navigate to a product page based on product name
function navigateToProduct(productName) {
    // Add animation class
    const body = document.body;
    body.classList.add('animate-out-right');
    
    // Convert product name to filename format with proper casing
    // This is a simple conversion - you may need to adjust it based on your actual filenames
    const nameParts = productName.split(' ');
    const formattedName = nameParts.map(part => {
        // Check if it's a special case
        if (part.toLowerCase() === 'missha') return 'Missha';
        if (part.toLowerCase() === 'rivance') return 'Rivance';
        return part;
    }).join('-');
    
    // Create the filename
    const filename = formattedName + '.html';
    
    // Wait for animation to complete before navigating
    setTimeout(() => {
        window.location.href = filename;
    }, 300);
}

// JavaScript to Update Cart
const cart = {
    items: {}, // Use an object to store products by name as keys
    total: 0,
    addItem: function (name, price, quantity = 1) {
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

            // Reset the product's "Add to Cart" button
            const cartActionDiv = document.getElementById(`cart-action-${name.replace(/ /g, '-')}`);
            if (cartActionDiv) {
                // Get the price from the existing product data (or default to 800 if not found)
                const price = this.items[name]?.price || 800;

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

// Add this variable at the top of your script file to track the timeout
let cartDropdownTimeout = null;

// Function to add to cart
function addToCart(name, price) {
    cart.addItem(name, price, 1);
}

// Function to Adjust Quantity
function adjustQuantity(name, change) {
    // Get the product price (in this case it's hardcoded, but you could make it more dynamic)
    const price = 800;

    // Get the current quantity element
    const quantityElement = document.getElementById(`quantity-${name.replace(/ /g, '-')}`);
    let currentQuantity = parseInt(quantityElement.textContent);

    // Calculate new quantity
    let newQuantity = currentQuantity + change;

    // Get the cart action div
    const cartActionDiv = document.getElementById(`cart-action-${name.replace(/ /g, '-')}`);

    // If new quantity would be zero or less, remove from cart and switch back to "Add to Cart"
    if (newQuantity <= 0) {
        cart.removeItem(name);

        // Switch back to Add to Cart button
        if (cartActionDiv) {
            cartActionDiv.innerHTML = `
                <button class="add-to-cart" onclick="addToCart('${name}', ${price})">
                    Add to Cart
                </button>
            `;
        }
    } else {
        // Otherwise, update the quantity in the cart
        cart.addItem(name, price, change);

        // Update the quantity display
        if (quantityElement) {
            quantityElement.textContent = newQuantity;
        }
    }
}

// JavaScript to handle hamburger menu
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
    
    // Event listeners
    hamburger.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleMenu();
    });
    
    // Close menu when clicking on overlay
    overlay.addEventListener('click', toggleMenu);
    
    // Close menu when clicking on a link
    const mobileLinks = document.querySelectorAll('.mobile-nav a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });
    
    // Close menu when resizing to desktop view
    window.addEventListener('resize', function() {
        if (window.innerWidth > 1024 && mobileNav.classList.contains('open')) {
            toggleMenu();
        }
    });

    // Load cart data when the page loads
    cart.loadFromLocalStorage();

    // Set up event listeners for cart dropdown
    const cartIcon = document.querySelector('.cart-icon');
    const cartDropdown = document.querySelector('.cart-dropdown');

    // Show dropdown immediately on hover
    cartIcon.addEventListener('mouseenter', () => {
        // Clear any existing timeout
        if (cartDropdownTimeout) {
            clearTimeout(cartDropdownTimeout);
            cartDropdownTimeout = null;
        }
        cartDropdown.style.display = 'block';
    });

    // Add delay before hiding dropdown
    cartIcon.addEventListener('mouseleave', () => {
        // Set a timeout to hide the dropdown after 2 seconds
        cartDropdownTimeout = setTimeout(() => {
            // Only hide if the mouse is not over the dropdown
            if (!cartDropdown.matches(':hover')) {
                cartDropdown.style.display = 'none';
            }
        }, 2000); // 2 second delay
    });

    // Handle the dropdown itself
    cartDropdown.addEventListener('mouseenter', () => {
        // Clear any existing timeout when entering the dropdown
        if (cartDropdownTimeout) {
            clearTimeout(cartDropdownTimeout);
            cartDropdownTimeout = null;
        }
    });

    cartDropdown.addEventListener('mouseleave', () => {
        // Set a timeout to hide after leaving the dropdown
        cartDropdownTimeout = setTimeout(() => {
            cartDropdown.style.display = 'none';
        }, 2000); // 2 second delay
    });
});
