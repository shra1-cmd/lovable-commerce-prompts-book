
import React, { useState } from 'react';
import { User, LogOut, Store } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import ProfileModal from './ProfileModal';
import SellerModal from './SellerModal';

interface ProfileDropdownProps {
  isLoggedIn: boolean;
  onSignIn: () => void;
  onSignUp: () => void;
  onLogout: () => void;
  onProfile: () => void;
  onOrders: () => void;
}

const ProfileDropdown = ({ 
  isLoggedIn, 
  onSignIn, 
  onSignUp, 
  onLogout, 
  onProfile, 
  onOrders 
}: ProfileDropdownProps) => {
  const { toast } = useToast();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSellerModalOpen, setIsSellerModalOpen] = useState(false);

  const handleLogout = () => {
    onLogout();
    toast({
      title: "You've been logged out.",
      duration: 3000,
    });
  };

  const handleProfile = () => {
    setIsProfileModalOpen(true);
  };

  const handleSeller = () => {
    setIsSellerModalOpen(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative h-10 w-10 rounded-full hover:bg-gray-100 transition-colors"
          >
            <User className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-white shadow-lg border border-gray-200">
          {!isLoggedIn ? (
            <>
              <DropdownMenuItem onClick={onSignIn} className="cursor-pointer">
                Sign In
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onSignUp} className="cursor-pointer">
                Create Account
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem onClick={handleProfile} className="cursor-pointer">
                <User className="h-4 w-4 mr-2" />
                My Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onOrders} className="cursor-pointer">
                My Orders
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSeller} className="cursor-pointer">
                <Store className="h-4 w-4 mr-2" />
                Seller Portal
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                <LogOut className="h-4 w-4 mr-2" />
                Log out
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      <SellerModal
        isOpen={isSellerModalOpen}
        onClose={() => setIsSellerModalOpen(false)}
      />
    </>
  );
};

export default ProfileDropdown;
