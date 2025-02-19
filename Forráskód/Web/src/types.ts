export interface User {
  _id: string;
  username: string;
  email: string;
}

export interface ProductCatalog {
  _id: string;
  name: string;
  categoryHierarchy: string[];
  defaultUnit: string;
  createdBy: User;
  lastUsed: Date;
  usageCount: number;
}

export interface Product {
  _id: string;
  catalogItem: ProductCatalog;
  quantity: number;
  isPurchased: boolean;
}

export interface SharedWith {
  user: User;
  permissionLevel: 'view' | 'edit';
}

export interface ShoppingList {
  _id: string;
  name: string;
  owner: User;
  products: Product[];
  sharedWith: SharedWith[];
  createdAt: Date;
  updatedAt: Date;
} 

