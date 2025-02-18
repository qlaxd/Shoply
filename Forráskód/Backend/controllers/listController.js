const List = require('../models/List');

// Get all lists
exports.getAllLists = async (req, res) => {
  try {
    const lists = await List.find({}).populate('owner');
    res.status(200).json(lists);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lists', error });
  }
};

// Get a single list by ID
exports.getListById = async (req, res) => {
  try {
    const list = await List.findById(req.params.id).populate('owner');
    if (!list) {
      return res.status(404).json({ message: 'List not found' });
    }
    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching list', error });
  }
};

// Create a new list
exports.createList = async (req, res) => {
  try {
    const list = new List(req.body);
    await list.save();
    res.status(201).json(list);
  } catch (error) {
    res.status(500).json({ message: 'Error creating list', error });
  }
};

// Update a list by ID
exports.updateList = async (req, res) => {
  try {
    const list = await List.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!list) {
      return res.status(404).json({ message: 'List not found' });
    }
    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({ message: 'Error updating list', error });
  }
};

// Delete a list by ID
exports.deleteList = async (req, res) => {
  try {
    const list = await List.findByIdAndDelete(req.params.id);
    if (!list) {
      return res.status(404).json({ message: 'List not found' });
    }
    res.status(200).json({ message: 'List deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting list', error });
  }
};