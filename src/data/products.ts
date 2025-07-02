
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}

export const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    price: 79.99,
    description: 'High-quality wireless headphones with noise cancellation and long battery life.',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop'
  },
  {
    id: '2',
    name: 'Smart Watch',
    price: 299.99,
    description: 'Feature-rich smartwatch with fitness tracking, notifications, and GPS.',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop'
  },
  {
    id: '3',
    name: 'Laptop Backpack',
    price: 49.99,
    description: 'Durable and stylish laptop backpack with multiple compartments.',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop'
  },
  {
    id: '4',
    name: 'Bluetooth Speaker',
    price: 89.99,
    description: 'Portable Bluetooth speaker with excellent sound quality and waterproof design.',
    imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop'
  },
  {
    id: '5',
    name: 'Coffee Maker',
    price: 129.99,
    description: 'Programmable coffee maker with thermal carafe and auto-brew feature.',
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop'
  },
  {
    id: '6',
    name: 'Gaming Mouse',
    price: 59.99,
    description: 'High-precision gaming mouse with customizable RGB lighting and programmable buttons.',
    imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop'
  }
];
