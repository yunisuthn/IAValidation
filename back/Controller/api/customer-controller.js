const Customer = require('../../Models/Customer'); // Adjust path as needed

/**
 * Create a new customer
 */
exports.createCustomer = async (req, res) => {
    try {
        const { name, email, address, dynamicKey } = req.body;
        const customer = new Customer({ name, email, address, dynamicKey });
        await customer.save();
        res.status(201).json(customer);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Customer with this name already exists.' });
        }
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get all customers
 */
exports.getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find();
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get a single customer by ID
 */
exports.getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found.' });
        }
        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Update a customer by ID
 */
exports.updateCustomer = async (req, res) => {
    try {
        const { name, email, address, dynamicKey } = req.body;
        const customer = await Customer.findByIdAndUpdate(
            req.params.id,
            { name, email, address, dynamicKey },
            { new: true, runValidators: true }
        );
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found.' });
        }
        res.status(200).json(customer);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Customer with this name already exists.' });
        }
        res.status(500).json({ error: error.message });
    }
};

/**
 * Delete a customer by ID
 */
exports.deleteCustomer = async (req, res) => {
    try {
        const customer = await Customer.findByIdAndDelete(req.params.id);
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found.' });
        }
        res.status(200).json({ message: 'Customer deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
