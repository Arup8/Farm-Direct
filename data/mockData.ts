import { Product, Farmer, Banner, CartItem, Order, Review } from '../types';

export const banners: Banner[] = [
  {
    id: '1',
    image: 'https://images.pexels.com/photos/2933243/pexels-photo-2933243.jpeg',
    title: 'Farm Fresh Veggies, Fruits and Many More...',
    subtitle: 'Direct from farmers to your doorstep',
    url: '/products'
  },
  {
    id: '2',
    image: 'https://images.pexels.com/photos/5529599/pexels-photo-5529599.jpeg',
    title: 'Organic Fruits',
    subtitle: 'Freshly picked for you',
    url: '/products/fruits'
  },
  {
    id: '3',
    image: 'https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg',
    title: 'Seasonal Vegetables',
    subtitle: 'Locally grown and harvested',
    url: '/products/vegetables'
  }
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Cauliflower',
    price: 19,
    originalPrice: 40,
    discountPercentage: 52,
    unit: 'Pcs',
    image: 'https://images.pexels.com/photos/4086279/pexels-photo-4086279.jpeg',
    description: 'Fresh cauliflower directly from organic farms.',
    rating: 4.3,
    reviews: 12,
    sellerId: '1',
    sellerName: 'Papan Sen',
    sellerImage: 'https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg',
    distance: 2.4,
    highlights: ['Organic', 'Pesticide-free', 'Freshly harvested'],
    packaging: ['Eco-friendly packaging', 'Available in bundles']
  },
  {
    id: '2',
    name: 'Banana',
    price: 32,
    originalPrice: 60,
    discountPercentage: 47,
    unit: 'Doz',
    image: 'https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg',
    description: 'Sweet and ripe bananas, perfect for snacking.',
    rating: 4.5,
    reviews: 18,
    sellerId: '2',
    sellerName: 'Banti Das',
    sellerImage: 'https://images.pexels.com/photos/1882672/pexels-photo-1882672.jpeg',
    distance: 4.2,
    highlights: ['Rich in potassium', 'Natural sweetness', 'No artificial ripening'],
    packaging: ['Bundle packaging', 'Recyclable bags available']
  },
  {
    id: '3',
    name: 'Tomato',
    price: 50,
    originalPrice: 80,
    discountPercentage: 37,
    unit: 'Kg',
    image: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg',
    description: 'Juicy red tomatoes for your salads and cooking needs.',
    rating: 4.2,
    reviews: 15,
    sellerId: '1',
    sellerName: 'Papan Sen',
    sellerImage: 'https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg',
    distance: 2.4,
    highlights: ['Vine-ripened', 'Rich in lycopene', 'Locally grown'],
    packaging: ['Available in crates', 'Individual selection']
  },
  {
    id: '4',
    name: 'Garlic',
    price: 65,
    originalPrice: 90,
    discountPercentage: 28,
    unit: 'Kg',
    image: 'https://images.pexels.com/photos/4197491/pexels-photo-4197491.jpeg',
    description: 'Fresh garlic bulbs with strong flavor and aroma.',
    rating: 4.4,
    reviews: 10,
    sellerId: '2',
    sellerName: 'Banti Das',
    sellerImage: 'https://images.pexels.com/photos/1882672/pexels-photo-1882672.jpeg',
    distance: 4.2,
    highlights: ['Strong aroma', 'Long shelf life', 'Medicinal properties'],
    packaging: ['Mesh bags', 'Bulk options available']
  },
  {
    id: '5',
    name: 'Freshly Picked Potatoes',
    price: 32,
    originalPrice: 60,
    discountPercentage: 47,
    unit: 'Doz',
    image: 'https://images.pexels.com/photos/144248/potatoes-vegetables-erdfrucht-bio-144248.jpeg',
    description: 'Farm fresh potatoes perfect for all your cooking needs.',
    rating: 4.3,
    reviews: 19,
    sellerId: '1',
    sellerName: 'Papan Sen',
    sellerImage: 'https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg',
    distance: 2.4,
    highlights: ['Freshly harvested', 'Versatile for cooking', 'High quality'],
    packaging: ['Mesh bags', 'Available in different quantities']
  }
];

export const farmers: Farmer[] = [
  {
    id: '1',
    name: 'Papan Sen',
    image: 'https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg',
    rating: 4.3,
    distance: 2.4,
    products: 25,
    location: 'Liliuah, Howrah, West Bengal',
    bio: 'Organic farmer specializing in seasonal vegetables. Farming for over 15 years with sustainable practices.'
  },
  {
    id: '2',
    name: 'Banti Das',
    image: 'https://images.pexels.com/photos/1882672/pexels-photo-1882672.jpeg',
    rating: 4.7,
    distance: 4.2,
    products: 35,
    location: 'Shibpur, Howrah, West Bengal',
    bio: 'Third-generation farmer growing fruits and vegetables using traditional methods and organic fertilizers.'
  }
];

export const popularSearches = ['Potato', 'Ginger', 'Turmeric', 'Daal', 'Apple'];

export const cartItems: CartItem[] = [];

export const orders: Order[] = [];

export const reviews: Review[] = [];