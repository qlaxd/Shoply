const List = require('../models/List');
const User = require('../models/User');
const Product = require('../models/Product');
const mongoose = require('mongoose');

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
    const list = await List.findById(req.params.id);
    if (!list) {
      return res.status(404).json({ message: 'Lista nem található' });
    }

    // Ellenőrizzük a jogosultságot
    if (list.owner.toString() !== req.user.id && 
        !list.sharedUsers.some(share => 
          share.user.toString() === req.user.id && 
          ['edit', 'admin'].includes(share.permissionLevel)
        )) {
      return res.status(403).json({ message: 'Nincs jogosultságod a művelethez' });
    }

    // Az addedBy mező kezelése
    let addedById = req.user.id; // Alapértelmezetten a kérést küldő felhasználó

    // Ha van addedBy a kérésben, ellenőrizzük és feldolgozzuk
    if (req.body.addedBy) {
      // Ha az addedBy nem ObjectId, akkor megpróbáljuk felhasználónév alapján megtalálni
      if (!mongoose.Types.ObjectId.isValid(req.body.addedBy)) {
        const user = await User.findOne({ username: req.body.addedBy });
        if (user) {
          addedById = user._id;
        }
      } else {
        // Ha már eleve ObjectId, akkor használjuk
        addedById = req.body.addedBy;
      }
    }

    const productData = {
      catalogItem: req.body.catalogItem,
      name: req.body.name,
      unit: req.body.unit,
      addedBy: addedById,
      quantity: req.body.quantity || 1,
      isPurchased: req.body.isPurchased || false,
      notes: req.body.notes || ""
    };
    
    // Új termék létrehozása
    const product = new Product(productData);
    await product.save();
    
    // Termék hozzáadása a listához
    list.products.push(product._id);
    await list.save();
    
    // Populált lista visszaadása, ahol az addedBy mező tartalmazza a felhasználói adatokat
    const updatedList = await List.findById(list._id)
      .populate({
        path: 'products',
        populate: [
          {
            path: 'catalogItem',
            model: 'ProductCatalog'
          },
          {
            path: 'addedBy',
            model: 'User',
            select: '-password -_id'
          }
        ]
      });
    
    res.status(200).json(updatedList);
  } catch (error) {
    res.status(500).json({ message: 'Hiba a termék hozzáadása során', error });
  }
};

// Termék eltávolítása a listából
exports.removeProductFromList = async (req, res) => {
  try {
    const list = await List.findById(req.params.listId);
    if (!list) {
      return res.status(404).json({ message: 'Lista nem található' });
    }

    // Ellenőrizzük a jogosultságot
    if (list.owner.toString() !== req.user.id && 
        !list.sharedUsers.some(share => 
          share.user.toString() === req.user.id && 
          ['edit', 'admin'].includes(share.permissionLevel)
        )) {
      return res.status(403).json({ message: 'Nincs jogosultságod a művelethez' });
    }
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
    const { listId, productId } = req.params;
    const { quantity, isPurchased, notes } = req.body;
    
    const list = await List.findById(listId);
    if (!list) {
      return res.status(404).json({ message: 'Lista nem található' });
    }

    // Ellenőrizzük a jogosultságot
    if (list.owner.toString() !== req.user.id && 
        !list.sharedUsers.some(share => 
          share.user.toString() === req.user.id && 
          ['edit', 'admin'].includes(share.permissionLevel)
        )) {
      return res.status(403).json({ message: 'Nincs jogosultságod a művelethez' });
    }

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
    const updatedList = await List.findById(listId)
      .populate({
        path: 'products.catalogItem',
        model: 'ProductCatalog'
      });
    
    res.status(200).json(updatedList);
  } catch (error) {
    res.status(500).json({ message: 'Hiba a termék módosítása során', error });
  }
};