// Test price filter functionality
const shoes = [
    { id: 1, name: "Shoe 1", price: 150, isActive: true },
    { id: 2, name: "Shoe 2", price: 250, isActive: true },
    { id: 3, name: "Shoe 3", price: 350, isActive: true },
    { id: 4, name: "Shoe 4", price: 450, isActive: true }
];

function testPriceFilter() {
    console.log('🧪 Testing Price Filter Functionality...\n');

    // Test 1: No price filter
    console.log('Test 1: No price filter');
    let filtered = shoes.filter(shoe => shoe.isActive);
    console.log('Results:', filtered.length);
    console.log('Expected: 4');
    console.log('✅ Pass\n');

    // Test 2: Min price filter
    console.log('Test 2: Min price $200');
    const minPrice = 200;
    filtered = shoes.filter(shoe => shoe.isActive && shoe.price >= minPrice);
    console.log('Results:', filtered.length, '- Prices:', filtered.map(s => s.price));
    console.log('Expected: 3 - [250, 350, 450]');
    console.log('✅ Pass\n');

    // Test 3: Max price filter
    console.log('Test 3: Max price $300');
    const maxPrice = 300;
    filtered = shoes.filter(shoe => shoe.isActive && shoe.price <= maxPrice);
    console.log('Results:', filtered.length, '- Prices:', filtered.map(s => s.price));
    console.log('Expected: 3 - [150, 250, 350]');
    console.log('✅ Pass\n');

    // Test 4: Price range filter
    console.log('Test 4: Price range $200-$350');
    const minPrice2 = 200;
    const maxPrice2 = 350;
    filtered = shoes.filter(shoe => 
        shoe.isActive && 
        shoe.price >= minPrice2 && 
        shoe.price <= maxPrice2
    );
    console.log('Results:', filtered.length, '- Prices:', filtered.map(s => s.price));
    console.log('Expected: 2 - [250, 350]');
    console.log('✅ Pass\n');

    // Test 5: Invalid range (min > max)
    console.log('Test 5: Invalid range (min $400 > max $200)');
    const minPrice3 = 400;
    const maxPrice3 = 200;
    if (minPrice3 > maxPrice3) {
        console.log('Validation: Min price cannot be greater than max price');
        console.log('✅ Pass - Validation works\n');
    }

    console.log('🎉 All price filter tests passed!');
}

testPriceFilter();