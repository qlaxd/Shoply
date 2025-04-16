const User = require('../models/User');
const List = require('../models/List'); // Import the List model

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json(users);
  } catch (error) {
    console.error('Hiba a felhasználók lekérdezésekor:', error);
    return res.status(500).json({ message: 'Szerverhiba történt.' });
  }
};

exports.promoteToAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'Felhasználó nem található' });
    }
    user.role = 'admin';
    await user.save();
    res.status(200).json({ message: 'Felhasználó adminná téve' });
  } catch (error) {
    res.status(500).json({ message: 'Hiba adminná tételkor', error });
  }
};

exports.demoteToUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'Felhasználó nem található' });
    }
    user.role = 'user';
    await user.save();
    res.status(200).json({ message: 'Felhasználó jogosultsága visszavonva' });
  } catch (error) {
    res.status(500).json({ message: 'Hiba a jogosultság visszavonásakor', error });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'Felhasználó nem található' });
    }
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json({ message: 'Felhasználó sikeresen törölve' });
  } catch (error) {
    res.status(500).json({ message: 'Hiba a felhasználó törlésekor', error });
  }
};

// Controller function for admins to get all lists
exports.adminGetAllLists = async (req, res) => {
  try {
    // Fetch all lists, potentially populate owner/product details if needed later
    const lists = await List.find({}).populate('owner', 'username email').populate('products.product', 'name'); // Example population
    return res.status(200).json(lists);
  } catch (error) {
    console.error('Admin Error: Hiba az összes lista lekérdezésekor:', error);
    return res.status(500).json({ message: 'Szerverhiba történt a listák lekérdezésekor.' });
  }
};

// Controller function for admins to get a specific list by ID
exports.adminGetListById = async (req, res) => {
  try {
    const listId = req.params.id;
    // Fetch the specific list by ID, potentially populate details
    const list = await List.findById(listId).populate('owner', 'username email').populate('products.product', 'name').populate('sharedWith', 'username email'); // Example population
    
    if (!list) {
      return res.status(404).json({ message: 'Lista nem található ezzel az ID-val.' });
    }
    
    return res.status(200).json(list);
  } catch (error) {
    console.error(`Admin Error: Hiba a(z) ${req.params.id} ID-jű lista lekérdezésekor:`, error);
    // Check for CastError (invalid ObjectId format)
    if (error.name === 'CastError') {
        return res.status(400).json({ message: 'Érvénytelen lista ID formátum.' });
    }
    return res.status(500).json({ message: 'Szerverhiba történt a lista lekérdezésekor.' });
  }
};
// Controller function for admins to update a specific list by ID
exports.adminUpdateList = async (req, res) => {
  try {
    const listId = req.params.id;
    const updateData = req.body; // Contains fields to update, e.g., { name: "New Name" }

    // Find the list and update it
    // { new: true } option returns the modified document rather than the original
    // runValidators: true ensures schema validation rules are applied during update
    const updatedList = await List.findByIdAndUpdate(listId, updateData, { new: true, runValidators: true });

    if (!updatedList) {
      return res.status(404).json({ message: 'Lista nem található ezzel az ID-val a frissítéshez.' });
    }

    return res.status(200).json(updatedList);
  } catch (error) {
    console.error(`Admin Error: Hiba a(z) ${req.params.id} ID-jű lista frissítésekor:`, error);
    if (error.name === 'CastError') {
        return res.status(400).json({ message: 'Érvénytelen lista ID formátum.' });
    }
    if (error.name === 'ValidationError') {
        return res.status(400).json({ message: 'Érvénytelen adatok a lista frissítéséhez.', errors: error.errors });
    }
    return res.status(500).json({ message: 'Szerverhiba történt a lista frissítésekor.' });
  }
};

// Controller function for admins to delete a specific list by ID
exports.adminDeleteList = async (req, res) => {
  try {
    const listId = req.params.id;

    // Find the list and delete it
    const deletedList = await List.findByIdAndDelete(listId);

    if (!deletedList) {
      return res.status(404).json({ message: 'Lista nem található ezzel az ID-val a törléshez.' });
    }

    // Optionally, perform cleanup related to the list if necessary (e.g., remove references)

    return res.status(200).json({ message: 'Lista sikeresen törölve.', listId: deletedList._id });
  } catch (error) {
    console.error(`Admin Error: Hiba a(z) ${req.params.id} ID-jű lista törlésekor:`, error);
    if (error.name === 'CastError') {
        return res.status(400).json({ message: 'Érvénytelen lista ID formátum.' });
    }
    return res.status(500).json({ message: 'Szerverhiba történt a lista törlésekor.' });
  }
};
// Controller function for admins to add a product to a specific list
exports.adminAddProductToList = async (req, res) => {
  const { listId } = req.params;
  const { product, quantity, unit, isPurchased } = req.body; // Assuming these fields are sent

  // Basic validation
  if (!product || !quantity) {
    return res.status(400).json({ message: 'Hiányzó termékadatok (termék ID és mennyiség kötelező).' });
  }

  try {
    const list = await List.findById(listId);
    if (!list) {
      return res.status(404).json({ message: 'Lista nem található ezzel az ID-val.' });
    }

    // Check if product already exists in the list (optional: decide whether to update or reject)
    const existingProductIndex = list.products.findIndex(p => p.product.toString() === product);
    if (existingProductIndex > -1) {
      // Option 1: Update existing product (example)
      // list.products[existingProductIndex].quantity += quantity;
      // Option 2: Reject duplicate
       return res.status(409).json({ message: 'A termék már szerepel a listán.' });
    }

    // Add the new product
    list.products.push({
        product,
        quantity,
        unit: unit || '', // Default unit if not provided
        isPurchased: isPurchased || false // Default purchase status
    });

    await list.save();
    
    // Populate added product details before sending response
    const updatedList = await List.findById(listId).populate('products.product', 'name');

    return res.status(201).json(updatedList); // Return the updated list

  } catch (error) {
    console.error(`Admin Error: Hiba termék hozzáadásakor a(z) ${listId} ID-jű listához:`, error);
    if (error.name === 'CastError') {
        return res.status(400).json({ message: 'Érvénytelen lista vagy termék ID formátum.' });
    }
     if (error.name === 'ValidationError') {
        return res.status(400).json({ message: 'Érvénytelen adatok a termék hozzáadásához.', errors: error.errors });
    }
    return res.status(500).json({ message: 'Szerverhiba történt a termék hozzáadásakor.' });
  }
};

// Controller function for admins to update a product in a specific list
exports.adminUpdateProductInList = async (req, res) => {
  const { listId, productId } = req.params;
  const updateData = req.body; // e.g., { quantity: 5, unit: 'kg', isPurchased: true }

  try {
    const list = await List.findById(listId);
    if (!list) {
      return res.status(404).json({ message: 'Lista nem található ezzel az ID-val.' });
    }

    // Find the product within the list's products array
    // Note: Product ID within the subdocument array is `_id`, not `product` (which is the reference)
    const productSubDoc = list.products.id(productId);

    if (!productSubDoc) {
      return res.status(404).json({ message: 'Termék nem található ezen a listán ezzel az ID-val.' });
    }

    // Update the fields provided in updateData
    Object.keys(updateData).forEach(key => {
      if (key in productSubDoc && key !== '_id' && key !== 'product') { // Don't allow changing _id or product ref here
        productSubDoc[key] = updateData[key];
      }
    });

    await list.save();
    
    // Populate product details before sending response
    const updatedList = await List.findById(listId).populate('products.product', 'name');

    return res.status(200).json(updatedList); // Return the updated list

  } catch (error) {
    console.error(`Admin Error: Hiba a(z) ${productId} ID-jű termék frissítésekor a(z) ${listId} listán:`, error);
     if (error.name === 'CastError') {
        return res.status(400).json({ message: 'Érvénytelen lista vagy termék ID formátum.' });
    }
     if (error.name === 'ValidationError') {
        return res.status(400).json({ message: 'Érvénytelen adatok a termék frissítéséhez.', errors: error.errors });
    }
    return res.status(500).json({ message: 'Szerverhiba történt a termék frissítésekor.' });
  }
};

// Controller function for admins to remove a product from a specific list
exports.adminRemoveProductFromList = async (req, res) => {
  const { listId, productId } = req.params;

  try {
    const list = await List.findById(listId);
    if (!list) {
      return res.status(404).json({ message: 'Lista nem található ezzel az ID-val.' });
    }

    // Find the product within the list's products array by its subdocument _id
    const productSubDoc = list.products.id(productId);

    if (!productSubDoc) {
      return res.status(404).json({ message: 'Termék nem található ezen a listán ezzel az ID-val.' });
    }

    // Remove the product subdocument
    productSubDoc.remove(); // Mongoose subdocument removal

    await list.save();
    
    // Populate product details before sending response
    const updatedList = await List.findById(listId).populate('products.product', 'name');

    return res.status(200).json({ message: 'Termék sikeresen eltávolítva a listáról.', list: updatedList });

  } catch (error) {
    console.error(`Admin Error: Hiba a(z) ${productId} ID-jű termék eltávolításakor a(z) ${listId} listáról:`, error);
     if (error.name === 'CastError') {
        return res.status(400).json({ message: 'Érvénytelen lista vagy termék ID formátum.' });
    }
    return res.status(500).json({ message: 'Szerverhiba történt a termék eltávolításakor.' });
  }
};
// Controller function for admins to update a user's status (ban/unban)
exports.adminUpdateUserStatus = async (req, res) => {
  const { userId } = req.params;
  const { status } = req.body; // Expecting { status: 'active' | 'banned' }

  // Validate the incoming status
  if (!status || !['active', 'banned'].includes(status)) {
    return res.status(400).json({ message: "Érvénytelen státusz érték. Csak 'active' vagy 'banned' engedélyezett." });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Felhasználó nem található ezzel az ID-val.' });
    }

    // Prevent admin from banning themselves (optional but recommended)
    if (user._id.equals(req.user.id) && status === 'banned') {
      return res.status(403).json({ message: 'Adminisztrátor nem tilthatja le saját magát.' });
    }

    user.status = status;
    await user.save();

    // Exclude password from the returned user object
    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(200).json({ message: `Felhasználó státusza sikeresen frissítve: ${status}`, user: userResponse });

  } catch (error) {
    console.error(`Admin Error: Hiba a(z) ${userId} ID-jű felhasználó státuszának frissítésekor:`, error);
    if (error.name === 'CastError') {
        return res.status(400).json({ message: 'Érvénytelen felhasználó ID formátum.' });
    }
     if (error.name === 'ValidationError') {
        return res.status(400).json({ message: 'Érvénytelen adatok a státusz frissítéséhez.', errors: error.errors });
    }
    return res.status(500).json({ message: 'Szerverhiba történt a felhasználó státuszának frissítésekor.' });
  }
};
// Controller function for admins to update a user's profile details
exports.adminUpdateUserProfile = async (req, res) => {
  const { userId } = req.params;
  const updateData = req.body; // e.g., { username: "new_username", email: "new@example.com" }

  // Define fields that admins are allowed to update via this endpoint
  const allowedUpdates = ['username', 'email'];
  const updates = {};

  // Filter updateData to only include allowed fields
  Object.keys(updateData).forEach((key) => {
    if (allowedUpdates.includes(key)) {
      updates[key] = updateData[key];
    }
  });

  // Check if there are any valid fields to update
  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ message: 'Nincsenek frissíthető mezők megadva, vagy a megadott mezők nem módosíthatók ezen a végponton.' });
  }

  try {
    // Find the user and update only the allowed fields
    // Using findById and then save() to ensure middleware/hooks run if any exist
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Felhasználó nem található ezzel az ID-val.' });
    }

    // Apply the allowed updates
    Object.assign(user, updates);

    // Save the updated user
    await user.save();

    // Exclude password from the returned user object
    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(200).json({ message: 'Felhasználói profil sikeresen frissítve.', user: userResponse });

  } catch (error) {
    console.error(`Admin Error: Hiba a(z) ${userId} ID-jű felhasználó profiljának frissítésekor:`, error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Érvénytelen felhasználó ID formátum.' });
    }
    // Handle potential unique constraint errors (e.g., email or username already exists)
    if (error.code === 11000) {
      return res.status(409).json({ message: 'A felhasználónév vagy email cím már foglalt.', field: Object.keys(error.keyValue)[0] });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Érvénytelen adatok a profil frissítéséhez.', errors: error.errors });
    }
    return res.status(500).json({ message: 'Szerverhiba történt a felhasználói profil frissítésekor.' });
  }
};

