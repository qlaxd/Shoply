const List = require('../models/List');

/**
 * Middleware to check if user has required permission level for a list
 * @param {Array} allowedPermissions - Array of permissions that are allowed (e.g. ['owner', 'admin', 'edit'])
 */
const checkListPermission = (allowedPermissions) => {
  return async (req, res, next) => {
    console.log(`[PermCheck] Starting permission check for user ${req.user?.id} on path ${req.path} with allowed: ${allowedPermissions.join(', ')}`);
    try {
      // Get list ID from params - could be id, listId depending on the route
      const listId = req.params.id || req.params.listId;
      console.log(`[PermCheck] Attempting to check listId: ${listId}`);
      
      if (!listId) {
        console.error('[PermCheck] Error: Missing list ID');
        return res.status(400).json({ 
          message: 'Lista azonosító hiányzik',
          error: { type: 'BadRequest', detail: 'Missing list ID in request parameters' }
        });
      }

      // Find the list
      const list = await List.findById(listId);
      
      if (!list) {
        console.error(`[PermCheck] Error: List not found for ID: ${listId}`);
        return res.status(404).json({ 
          message: 'Lista nem található',
          error: { type: 'NotFound', detail: 'List with the specified ID was not found' }
        });
      }
      console.log(`[PermCheck] Found list owned by: ${list.owner}`);

      // Check if user is the owner
      const isOwner = list.owner.toString() === req.user.id;
      console.log(`[PermCheck] Is user ${req.user.id} the owner? ${isOwner}`);
      
      if (isOwner && allowedPermissions.includes('owner')) {
        console.log('[PermCheck] Access granted: User is owner');
        // Set list on request for later use
        req.list = list;
        return next();
      }
      
      // Check if user has required permission through sharing
      const userShare = list.sharedUsers.find(share => 
        share.user.toString() === req.user.id
      );
      console.log(`[PermCheck] Found shared user details: ${JSON.stringify(userShare)}`);
      
      if (userShare && allowedPermissions.includes(userShare.permissionLevel)) {
        console.log(`[PermCheck] Access granted: User has shared permission (${userShare.permissionLevel})`);
        // Set list and user's permission on request for later use
        req.list = list;
        req.userPermission = userShare.permissionLevel;
        return next();
      }
      
      // If we reach here, user doesn't have required permission
      console.warn(`[PermCheck] Access DENIED for user ${req.user.id}. Required: ${allowedPermissions.join(', ')}, User Share: ${JSON.stringify(userShare)}`);
      return res.status(403).json({ 
        message: 'Nincs jogosultságod ehhez a művelethez',
        error: { 
          type: 'PermissionDenied', 
          detail: `User needs one of these permissions: ${allowedPermissions.join(', ')}` 
        }
      });
    } catch (error) {
      console.error('[PermCheck] Internal Server Error during permission check:', error);
      return res.status(500).json({ 
        message: 'Szerver hiba a jogosultságok ellenőrzése során',
        error
      });
    }
  };
};

// Specific permission middleware instances for common operations
const viewPermission = checkListPermission(['owner', 'admin', 'edit', 'view']);
const editPermission = checkListPermission(['owner', 'admin', 'edit']);
const adminPermission = checkListPermission(['owner', 'admin']);
const ownerPermission = checkListPermission(['owner']);

module.exports = {
  checkListPermission,
  viewPermission,
  editPermission,
  adminPermission,
  ownerPermission
}; 