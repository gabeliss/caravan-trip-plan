import React from 'react';
import { Star } from 'lucide-react';

interface RestaurantCardProps {
  name: string;
  description: string;
  price: string;
  isFavorite?: boolean;
  location?: string;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  name,
  description,
  price,
  isFavorite,
  location
}) => {
  // Extract the name and price from the combined string
  const [restaurantName, priceLevel] = name.split('(');
  const formattedPrice = priceLevel ? `(${priceLevel}` : `(${price})`;

  return (
    <div className="bg-beige/10 rounded-lg p-4 hover:bg-beige/20 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-primary-dark">{restaurantName.trim()}</h4>
            {isFavorite && (
              <div className="flex items-center gap-1 text-primary-dark/80 text-sm">
                <Star className="w-4 h-4 fill-current" />
                <span className="italic">Caravan Favorite</span>
              </div>
            )}
          </div>
          {location && (
            <p className="text-sm text-gray-600 mt-1">{location}</p>
          )}
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
        <div className="text-sm font-medium text-primary-dark/80">
          {formattedPrice}
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;