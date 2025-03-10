/**
 * This script generates product HTML files based on the template and products.json
 * To use this script:
 * 1. Install Node.js if you haven't already
 * 2. Save this file as generate-product-pages.js
 * 3. Run it using: node generate-product-pages.js
 */

const fs = require('fs');
const path = require('path');

// Function to generate product pages
async function generateProductPages() {
    try {
        // Read the product template
        const templatePath = path.join(__dirname, 'product-template.html');
        const template = fs.readFileSync(templatePath, 'utf8');
        
        // Read the products data
        const productsPath = path.join(__dirname, 'products.json');
        const productsData = fs.readFileSync(productsPath, 'utf8');
        const products = JSON.parse(productsData).products;
        
        console.log(`Found ${products.length} products. Generating pages...`);
        
        // Generate a page for each product
        for (const product of products) {
            console.log(`Generating page for ${product.name}...`);
            
            // Save the product page
            const outputPath = path.join(__dirname, product.filename);
            fs.writeFileSync(outputPath, template, 'utf8');
            
            console.log(`Created ${product.filename}`);
        }
        
        console.log('All product pages generated successfully!');
        
    } catch (error) {
        console.error('Error generating product pages:', error);
    }
}

// Run the function
generateProductPages();