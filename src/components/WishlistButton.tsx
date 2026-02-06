import React, { useState } from 'react';
import { Heart, Trash2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

interface WishlistButtonProps {
  courseId: string;
  isInWishlist?: boolean;
  onWishlistChange?: (inWishlist: boolean) => void;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({
  courseId,
  isInWishlist: initialState = false,
  onWishlistChange
}) => {
  const [isInWishlist, setIsInWishlist] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [token] = useState(localStorage.getItem('token'));

  const handleToggleWishlist = async () => {
    if (!token) {
      toast.error('Please login to add to wishlist');
      return;
    }

    setLoading(true);
    try {
      if (isInWishlist) {
        // Remove from wishlist
        await axios.delete(
          `${import.meta.env.VITE_API_BASE_URL}/wishlist/${courseId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsInWishlist(false);
        toast.success('Removed from wishlist');
      } else {
        // Add to wishlist
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/wishlist/${courseId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsInWishlist(true);
        toast.success('Added to wishlist');
      }
      onWishlistChange?.(!isInWishlist);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update wishlist');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleWishlist}
      disabled={loading}
      className={`p-3 rounded-full transition ${
        isInWishlist
          ? 'bg-red-100 dark:bg-red-900/30 text-red-600'
          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 hover:bg-red-100 hover:text-red-600'
      }`}
    >
      <Heart size={24} className={isInWishlist ? 'fill-current' : ''} />
    </button>
  );
};

export default WishlistButton;
