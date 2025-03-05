const Category = require('../models/Category');


// Get all categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({});
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Hiba a kategóriák lekérdezésekor', error });
    }
}

// Get a single category by ID
exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'A kategória nem található' });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Hiba a kategória lekérdezésekor', error });
    }
}

// Create a new category
exports.createCategory = async (req, res) => {
    const categoryData = req.body;
    const category = new Category(categoryData);
    const doesExist = await Category.findOne({ name: categoryData.name });
    
    if (doesExist) {
        return res.status(400).json({ message: 'A megadott kategória már létezik' });
    }
    try {
        await category.save();
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Hiba a kategória létrehozása során', error });
    }
}

// update a category
exports.updateCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!category) {
            return res.status(404).json({ message: 'A kategória nem található' });
        }
        res.status(200).json(category);
    }catch (error) { 
        res.status(500).json({ message: 'Hiba a kategória frissítésekor', error });
    }
}

// delete a category

exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'A kategória nem található' });
        }
        res.status(204).json();
    } catch (error) {
        res.status(500).json({ message: 'Hiba a kategória törlésekor', error });
    }
}


exports.searchCategory = async (req, res) => {
    try {
        const search = req.query.search;
        const categories = await Category.find({ name: { $regex: search, $options: 'i' } });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Hiba a kategóriák keresésekor', error });
    }
}