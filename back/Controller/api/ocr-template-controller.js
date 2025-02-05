const express = require('express');
const Template = require('../../Models/Template');

// Create a new template
const createTemplate = async (req, res) => {
    try {
        const template = new Template(req.body);
        await template.save();
        res.status(201).json(template);
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: error.message });
    }
};

// Get all templates
const getAllTemplates = async (req, res) => {
    try {
        const templates = await Template.find();
        res.status(200).json(templates);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single template by ID
const getOneTemplate = async (req, res) => {
    try {
        const template = await Template.findById(req.params.id);
        if (!template) return res.status(404).json({ error: 'Template not found' });
        res.status(200).json(template);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a template
const updateTemplate = async (req, res) => {
    try {
        const template = await Template.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!template) return res.status(404).json({ error: 'Template not found' });
        res.status(200).json(template);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a template
const deleteTemplate = async (req, res) => {
    try {
        const template = await Template.findByIdAndDelete(req.params.id);
        if (!template) return res.status(404).json({ error: 'Template not found' });
        res.status(200).json({ message: 'Template deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createTemplate,
    getAllTemplates,
    getOneTemplate,
    deleteTemplate,
    updateTemplate
};
