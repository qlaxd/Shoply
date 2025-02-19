const List = require('../models/List');
const User = require('../models/User');

// Get all lists
exports.getAllLists = async (req, res) => {
  try {
    const lists = await List.find({
      $or: [
        { owner: req.user.id },
        { 'sharedWith.user': req.user.id }
      ]
    })
    .populate('owner')
    .populate({
      path: 'products',
      model: 'Product',
      populate: {
        path: 'catalogItem',
        model: 'ProductCatalog'
      }
    })
    .populate({
      path: 'sharedWith.user',
      model: 'User',
      select: '-password -__v'
    });
    
    res.status(200).json(lists);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lists', error });
  }
};

// Get a single list by ID
exports.getListById = async (req, res) => {
  try {
    const list = await List.findById(req.params.id).populate({
      path: 'owner',
      select: '-password -__v'
    });
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

// Lista megosztása
exports.shareList = async (req, res) => {
  try {
    const list = await List.findById(req.params.id);
    const userToShare = await User.findById(req.body.userId);

    if (!list || !userToShare) {
      return res.status(404).json({ message: 'Lista vagy felhasználó nem található' });
    }

    // Ellenőrizzük, hogy a kérés küldője a lista tulajdonosa-e
    if (list.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Nincs jogosultságod a művelethez' });
    }

    // Megosztás hozzáadása
    list.sharedWith.push({ 
      user: userToShare._id,
      permissionLevel: req.body.permissionLevel || 'view'
    });
    
    await list.save();
    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({ message: 'Hiba a megosztás során', error });
  }
};

// Megosztás visszavonása
exports.unshareList = async (req, res) => {
  try {
    const list = await List.findById(req.params.id);
    list.sharedWith = list.sharedWith.filter(share => 
      share.user.toString() !== req.body.userId
    );
    await list.save();
    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({ message: 'Hiba a megosztás visszavonása során', error });
  }
};