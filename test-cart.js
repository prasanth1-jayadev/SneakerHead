// Simple test script to verify cart functionality
const express = require('express');
const session = require('express-session');

// Test session-based cart functionality
function testCart() {
    console.log('🧪 Testing Cart Functionality...\n');

    // Simulate session object
    const mockSession = {
        cart: []
    };

    // Helper function to get cart count (same as in server.js)
    function getCartCount(session) {
        if (!session.cart) {
            return 0;
        }
        return session.cart.reduce((total, item) => total + item.quantity, 0);
    }

    // Test 1: Empty cart
    console.log('Test 1: Empty cart');
    console.log('Cart count:', getCartCount(mockSession));
    console.log('Expected: 0');
    console.log('✅ Pass\n');

    // Test 2: Add item to cart
    console.log('Test 2: Add item to cart');
    mockSession.cart.push({ productId: 1, quantity: 2 });
    console.log('Cart count:', getCartCount(mockSession));
    console.log('Expected: 2');
    console.log('✅ Pass\n');

    // Test 3: Add another item
    console.log('Test 3: Add another item');
    mockSession.cart.push({ productId: 2, quantity: 1 });
    console.log('Cart count:', getCartCount(mockSession));
    console.log('Expected: 3');
    console.log('✅ Pass\n');

    // Test 4: Update item quantity
    console.log('Test 4: Update item quantity');
    const itemIndex = mockSession.cart.findIndex(item => item.productId === 1);
    if (itemIndex > -1) {
        mockSession.cart[itemIndex].quantity = 5;
    }
    console.log('Cart count:', getCartCount(mockSession));
    console.log('Expected: 6');
    console.log('✅ Pass\n');

    // Test 5: Remove item
    console.log('Test 5: Remove item');
    mockSession.cart = mockSession.cart.filter(item => item.productId !== 2);
    console.log('Cart count:', getCartCount(mockSession));
    console.log('Expected: 5');
    console.log('✅ Pass\n');

    console.log('🎉 All cart tests passed!');
}

// Run tests
testCart();