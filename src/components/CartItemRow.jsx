import React from 'react';

const CartItemRow = ({ item, onRemove, showRemove = true }) => {
  const hasDiscount = Math.round(item.discountPercentage) > 0;
  const discountedPrice = item.price * (1 - item.discountPercentage / 100);

  return (
    <div className="flex justify-between items-center gap-4">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <img
          src={item.thumbnail}
          alt={item.title}
          className="w-16 h-16 object-cover rounded flex-shrink-0"
          loading="lazy"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate">{item.title}</h3>
          <div className="flex items-center text-sm text-gray-500">
            <div>
              {hasDiscount ? (
                <>
                  <span className="text-black font-bold">${discountedPrice.toFixed(2)}</span>
                  <span className="line-through ml-2">${item.price.toFixed(2)}</span>
                </>
              ) : (
                <span className="text-black font-bold">${item.price.toFixed(2)}</span>
              )}
            </div>
            <span className="ml-2 flex-shrink-0">x {item.quantity}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 flex-shrink-0">
        <p className="font-semibold w-24 text-right break-all">
          ${(discountedPrice * item.quantity).toFixed(2)}
        </p>
        {showRemove && (
          <button
            onClick={onRemove}
            className="text-red-500 hover:text-red-700 font-bold"
            title="Remove item"
          >
            X
          </button>
        )}
      </div>
    </div>
  );
};

export default CartItemRow; 