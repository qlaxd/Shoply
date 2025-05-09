const List = require('../models/List');
const User = require('../models/User');
const Product = require('../models/ProductCatalog');
const mongoose = require('mongoose');
const ProductCatalog = require('../models/ProductCatalog');

// Get all lists
exports.getAllLists = async (req, res) => {
  try {
    const lists = await List.find({
      $or: [
        { owner: req.user.id },
        { 'sharedUsers.user': req.user.id }
      ]
    })
    .populate({
      path: 'owner',
      select: '-password -__v'
    })
    .populate('products.catalogItem')
    .populate({
      path: 'products.addedBy',
      select: '-password -__v'
    })
    .populate({
      path: 'sharedUsers.user',
      model: 'User',
      select: '-password -__v'
    });
    
    res.status(200).json(lists);
  } catch (error) {
    res.status(500).json({ message: 'Hiba a listák lekérdezésekor', error });
  }
};
// Get a single list by ID
exports.getListById = async (req, res) => {
  try {
    // Use the pre-loaded list from middleware if available
    if (req.list) {
      const list = await List.findById(req.list._id)
      .populate({
        path: 'owner',
        select: '-password -__v'
      })
      .populate('products.catalogItem')
      .populate({
        path: 'products.addedBy',
        select: '-password -__v'
      })
      .populate({
        path: 'sharedUsers.user',
        model: 'User',
        select: '-password -__v'
      });

      // Add user's permission to the response
      const responseList = list.toObject();
      responseList.userPermission = req.userPermission || 'owner';
      
      return res.status(200).json(responseList);
    }
    
    // Original implementation as fallback
    const list = await List.findById(req.params.id)
    .populate({
      path: 'owner',
      select: '-password -__v'
    })
    .populate('products.catalogItem')
    .populate({
      path: 'products.addedBy',
      select: '-password -__v'
    })
    .populate({
      path: 'sharedUsers.user',
      model: 'User',
      select: '-password -__v'
    });
    
    if (!list) {
      return res.status(404).json({ message: 'Lista nem található' });
    }
    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({ message: 'Hiba a lista lekérdezésekor', error });
  }
};

// Create a new list
exports.createList = async (req, res) => {
  try {
    // Klónozzuk a request body-t, hogy ne módosítsuk közvetlenül
    const listData = { ...req.body };
    
    // Ha vannak termékek, ellenőrizzük és javítsuk az addedBy mezőt
    if (Array.isArray(listData.products)) {
      const productsPromises = listData.products.map(async product => {
        // Ha nincs addedBy, használjuk a bejelentkezett felhasználó ID-ját
        if (!product.addedBy) {
          return { ...product, addedBy: req.user.id };
        }
        
        // Ha az addedBy már ObjectId formátumú, használjuk azt
        if (mongoose.Types.ObjectId.isValid(product.addedBy)) {
          return product;
        }
        
        // Ha az addedBy felhasználónév (string), keressük meg a felhasználót
        try {
          const user = await User.findOne({ username: product.addedBy });
          if (user) {
            return { ...product, addedBy: user._id };
          } else {
            // Ha nem található a felhasználó, használjuk a bejelentkezett felhasználót
            return { ...product, addedBy: req.user.id };
          }
        } catch (err) {
          console.error('Hiba a felhasználó keresése során:', err);
          return { ...product, addedBy: req.user.id };
        }
      });
      
      // Megvárjuk az összes promise befejezését
      listData.products = await Promise.all(productsPromises);
    }
    
    // Beállítjuk a tulajdonost, ha nincs megadva
    if (!listData.owner) {
      listData.owner = req.user.id;
    }
    
    const list = new List(listData);
    await list.save();
    
    // Populáljuk az adatokat a válaszban
    const populatedList = await List.findById(list._id)
      .populate({
        path: 'owner',
        select: 'username name -_id'
      })
      .populate({
        path: 'products.addedBy',
        select: '-password -__v'
      });
    
    res.status(201).json(populatedList);
  } catch (error) {
    res.status(500).json({ message: 'Error creating list', error });
  }
};

// Update a list by ID
exports.updateList = async (req, res) => {
  try {
    // Use the pre-loaded list from middleware
    // The permission check is already done by middleware
    
    // Klónozzuk a request body-t, hogy ne módosítsuk közvetlenül
    const updateData = { ...req.body };
    
    // Ha vannak termékek, ellenőrizzük és javítsuk az addedBy mezőt
    if (Array.isArray(updateData.products)) {
      const productsPromises = updateData.products.map(async product => {
        // Ha nincs addedBy, használjuk a bejelentkezett felhasználó ID-ját
        if (!product.addedBy) {
          return { ...product, addedBy: req.user.id };
        }
        
        // Ha az addedBy már ObjectId formátumú, használjuk azt
        if (mongoose.Types.ObjectId.isValid(product.addedBy)) {
          return product;
        }
        
        // Ha az addedBy felhasználónév (string), keressük meg a felhasználót
        try {
          const user = await User.findOne({ username: product.addedBy });
          if (user) {
            return { ...product, addedBy: user._id };
          } else {
            // Ha nem található a felhasználó, használjuk a bejelentkezett felhasználót
            return { ...product, addedBy: req.user.id };
          }
        } catch (err) {
          console.error('Hiba a felhasználó keresése során:', err);
          return { ...product, addedBy: req.user.id };
        }
      });
      
      // Megvárjuk az összes promise befejezését
      updateData.products = await Promise.all(productsPromises);
    }
    
    const list = await List.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true, runValidators: true }
    );
    
    if (!list) {
      return res.status(404).json({ message: 'Lista nem található' });
    }
    
    // Populáljuk az adatokat a válaszban
    const populatedList = await List.findById(list._id)
      .populate({
        path: 'owner',
        select: 'username name -_id'
      })
      .populate({
        path: 'products.addedBy',
        select: '-password -__v'
      });
    
    res.status(200).json(populatedList);
  } catch (error) {
    res.status(500).json({ message: 'Error updating list', error });
  }
};

// Delete a list by ID
exports.deleteList = async (req, res) => {
  try {
    // Use the pre-loaded list from middleware
    // Permission check is already done by middleware
    
    await List.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Lista sikeresen törölve' });
  } catch (error) {
    res.status(500).json({ message: 'Hiba a lista törlése során', error });
  }
};

// Lista megosztása
exports.shareList = async (req, res) => {
  try {
    const list = await List.findById(req.params.id);
    const userToShare = await User.findOne({ username: req.body.username });

    if (!list || !userToShare) {
      return res.status(404).json({ message: 'Lista vagy felhasználó nem található' });
    }

    // Ellenőrizzük, hogy a kérés küldője a lista tulajdonosa-e
    if (list.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Nincs jogosultságod a művelethez' });
    }

    // Ellenőrizzük, hogy már meg van-e osztva a felhasználóval
    const alreadyShared = list.sharedUsers.some(share => 
      share.user.toString() === userToShare._id.toString()
    );
    
    if(alreadyShared) {
      return res.status(400).json({ message: 'A lista már meg van osztva ezzel a felhasználóval' });
    }

    list.sharedUsers.push({ 
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
    if (list.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Nincs jogosultságod a művelethez' });
    }
    list.sharedUsers = list.sharedUsers.filter(share => 
      share.user.toString() !== req.body.userId
    );
    await list.save();
    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({ message: 'Hiba a megosztás visszavonása során', error });
  }
};

// Termék hozzáadása a listához
exports.addProductToList = async (req, res) => {
  try {
    // Use the pre-loaded list from middleware
    // Permission check is already done by middleware
    const list = req.list;
    
    const addedById = req.user.id;
    
    // Ha katalógusra hivatkozunk, ellenőrizzük a létezését
    if (req.body.catalogItem) {
      const catalogItem = await ProductCatalog.findById(req.body.catalogItem);
      if (!catalogItem) {
        return res.status(400).json({ message: 'A megadott katalóguselem nem létezik' });
      }
      
      // Növeljük a katalóguselem használati számát
      catalogItem.usageCount += 1;
      catalogItem.lastUsed = new Date();
      await catalogItem.save();
    } else if (!req.body.name) {
      return res.status(400).json({ message: 'A termék neve kötelező katalógus nélküli termékeknél' });
    }
    
    // Új termék létrehozása közvetlenül a listában
    list.products.push({
      catalogItem: req.body.catalogItem,
      name: req.body.name,
      unit: req.body.unit,
      addedBy: addedById,
      quantity: req.body.quantity || 1,
      isPurchased: req.body.isPurchased || false,
      notes: req.body.notes || ""
    });
    
    await list.save();
    
    // Populált lista visszaadása
    const updatedList = await List.findById(list._id)
      .populate({
        path: 'products.catalogItem',
        model: 'ProductCatalog'
      })
      .populate({
        path: 'products.addedBy',
        model: 'User',
        select: '-password -_id'
      });
    
    res.status(200).json(updatedList);
  } catch (error) {
    res.status(500).json({ message: 'Hiba a termék hozzáadása során', error });
  }
};

// Termék eltávolítása a listából
exports.removeProductFromList = async (req, res) => {
  try {
    // Use the pre-loaded list from middleware
    // Permission check is already done by middleware
    const list = req.list;
    
    // Termék eltávolítása a listából
    list.products = list.products.filter(
      product => product._id.toString() !== req.params.productId
    );
    
    await list.save();
    
    // Populált lista visszaadása
    const updatedList = await List.findById(list._id)
      .populate({
        path: 'products',
        populate: {
          path: 'catalogItem',
          model: 'ProductCatalog'
        }
      });
    
    res.status(200).json(updatedList);
  } catch (error) {
    res.status(500).json({ message: 'Hiba a termék eltávolítása során', error });
  }
};

// Termék mennyiségének vagy megvásárlási státuszának módosítása
exports.updateProductInList = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity, isPurchased, notes } = req.body;
    
    // Use the pre-loaded list from middleware
    // Permission check is already done by middleware
    const list = req.list;

    // Ellenőrizzük, hogy a termék a listához tartozik-e
    if (!list.products.some(product => product._id.toString() === productId)) {
      return res.status(404).json({ message: 'A termék nem található a listában' });
    }
    
    // Termék módosítása
    const updateData = {};
    if (quantity !== undefined) updateData.quantity = quantity;
    if (isPurchased !== undefined) updateData.isPurchased = isPurchased;
    if (notes !== undefined) updateData.notes = notes;
    
    // A termék frissítése közvetlenül a listában
    const productIndex = list.products.findIndex(product => product._id.toString() === productId);
    if (productIndex !== -1) {
      Object.assign(list.products[productIndex], updateData);
      await list.save();
    }
    
    // Populált lista visszaadása
    const updatedList = await List.findById(list._id)
      .populate({
        path: 'products.catalogItem',
        model: 'ProductCatalog'
      });
    
    res.status(200).json(updatedList);
  } catch (error) {
    res.status(500).json({ message: 'Hiba a termék módosítása során', error });
  }
};