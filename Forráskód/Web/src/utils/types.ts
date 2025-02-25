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
  priority?: 'LOW' | 'NORMAL' | 'HIGH';
  notes?: string;
  unit?: string;
}

export interface SharedUsers{
  user: User;
  permissionLevel: 'view' | 'edit';
}

export interface ShoppingList {
  _id: string;
  name: string;
  owner: User;
  products: Product[];
  sharedUsers: SharedUsers[];
  createdAt: Date;
  updatedAt: Date;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
} 

