export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  unit: string;
  image: string;
  description: string;
  rating: number;
  reviews: number;
  sellerId: string;
  sellerName: string;
  sellerImage: string;
  distance: number;
  highlights: string[];
  packaging: string[];
}

export interface Farmer {
  id: string;
  name: string;
  image: string;
  rating: number;
  distance: number;
  products: number;
  location: string;
  bio: string;
}

export interface Banner {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  url: string;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  image: string;
  role: string;
  addresses: Address[];
}

export interface Address {
  id: string;
  name: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postal: string;
  country: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  items: CartItem[];
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  createdAt: Date;
  address: Address;
  paymentMethod: string;
  sellerId: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userImage: string;
  productId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}