import React from 'react';
import ProductList from '../components/ProductList';
import Cart from '../components/Cart';

const ShopPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Products</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* On large screens, Cart is on the right. On small screens, it's on top. */}
        <div className="lg:hidden">
          <Cart />
        </div>
        
        <div className="flex-grow">
          <ProductList />
        </div>
        
        <div className="hidden lg:block lg:w-1/3 xl:w-1/4">
          <div className="sticky top-4">
            <Cart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage; 