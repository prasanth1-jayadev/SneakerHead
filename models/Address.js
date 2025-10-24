class Address {
    constructor() {
        this.addresses = [
            {
                id: 1,
                userId: 1,
                name: "John Doe",
                phone: "+1234567890",
                addressLine1: "123 Main Street",
                addressLine2: "Apt 4B",
                city: "New York",
                state: "NY",
                zipCode: "10001",
                country: "USA",
                isDefault: true,
                createdAt: new Date('2024-01-10'),
                updatedAt: new Date('2024-01-10')
            }
        ];
    }

    // Get all addresses for a user
    getByUserId(userId) {
        return this.addresses.filter(address => address.userId === parseInt(userId));
    }

    // Get address by ID
    getById(id) {
        return this.addresses.find(address => address.id === parseInt(id));
    }

    // Get default address for user
    getDefaultByUserId(userId) {
        return this.addresses.find(address => 
            address.userId === parseInt(userId) && address.isDefault
        );
    }

    // Create new address
    create(addressData) {
        const newAddress = {
            id: Math.max(...this.addresses.map(a => a.id), 0) + 1,
            ...addressData,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        // If this is set as default, remove default from other addresses
        if (newAddress.isDefault) {
            this.addresses.forEach(address => {
                if (address.userId === newAddress.userId) {
                    address.isDefault = false;
                }
            });
        }
        
        this.addresses.push(newAddress);
        return newAddress;
    }

    // Update address
    update(id, updateData) {
        const addressIndex = this.addresses.findIndex(address => address.id === parseInt(id));
        if (addressIndex !== -1) {
            // If setting as default, remove default from other addresses
            if (updateData.isDefault) {
                this.addresses.forEach(address => {
                    if (address.userId === this.addresses[addressIndex].userId) {
                        address.isDefault = false;
                    }
                });
            }
            
            this.addresses[addressIndex] = {
                ...this.addresses[addressIndex],
                ...updateData,
                updatedAt: new Date()
            };
            return this.addresses[addressIndex];
        }
        return null;
    }

    // Delete address
    delete(id) {
        const addressIndex = this.addresses.findIndex(address => address.id === parseInt(id));
        if (addressIndex !== -1) {
            const deletedAddress = this.addresses.splice(addressIndex, 1)[0];
            
            // If deleted address was default, set first remaining address as default
            if (deletedAddress.isDefault) {
                const userAddresses = this.getByUserId(deletedAddress.userId);
                if (userAddresses.length > 0) {
                    userAddresses[0].isDefault = true;
                }
            }
            
            return deletedAddress;
        }
        return null;
    }

    // Set address as default
    setDefault(id, userId) {
        // Remove default from all user addresses
        this.addresses.forEach(address => {
            if (address.userId === parseInt(userId)) {
                address.isDefault = false;
            }
        });
        
        // Set new default
        const address = this.getById(id);
        if (address && address.userId === parseInt(userId)) {
            address.isDefault = true;
            address.updatedAt = new Date();
            return address;
        }
        return null;
    }
}

module.exports = new Address();