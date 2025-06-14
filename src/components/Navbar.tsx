import React from 'react';
import { Bell, Search, User, Menu, X, Crown } from 'lucide-react';
import { useSidebar } from '../contexts/SidebarContext';
import { useUser } from '../contexts/UserContext';

const Navbar: React.FC = () => {
  const { isOpen, toggle } = useSidebar();
  const { isPremium } = useUser();

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 relative z-30">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <button
            onClick={toggle}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle sidebar"
          >
            {isOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
          
          <h1 className="text-xl font-semibold text-gray-900 hidden sm:block">
            Project ZX - Contract Module
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search contracts..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-64"
            />
          </div>
          
          <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center relative">
              <User className="w-4 h-4 text-white" />
              {isPremium && (
                <Crown className="w-3 h-3 text-yellow-400 absolute -top-1 -right-1" />
              )}
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center space-x-1">
                <p className="text-sm font-medium text-gray-900">John Doe</p>
                {isPremium && (
                  <Crown className="w-3 h-3 text-yellow-500" />
                )}
              </div>
              <p className="text-xs text-gray-500">
                {isPremium ? 'Premium User' : 'Standard User'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;