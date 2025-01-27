interface Dimensions {
    height: number;
    depth: number;
    width: number;
  }
  
  interface Rating {
    rate: number;
    count: number;
  }
  
 export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
   category: 'tshirt' | 'short' | 'jeans' | 'hoodie' | 'shirt'
    discountPercent: number;
    isNew: boolean;
    colors: string[];
    sizes: string[];
    stock: number;
  }
  