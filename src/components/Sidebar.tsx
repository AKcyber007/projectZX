import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  ShoppingCart, 
  Plus, 
  FileText, 
  Award, 
  LogOut,
  Package,
  Crown,
  PlayCircle,
  Receipt
} from 'lucide-react';
import { useSidebar } from '../contexts/SidebarContext';
import { useUser } from '../contexts/UserContext';

const Sidebar: React.FC = () => {
  const { isOpen, close } = useSidebar();
  const { isPremium } = useUser();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Marketplace', href: '/marketplace', icon: ShoppingCart },
    { name: 'Post Contract', href: '/post-contract', icon: Plus },
    { name: 'My Contracts', href: '/my-contracts', icon: FileText },
    { name: 'Contract Accounting', href: '/contract-accounting/dashboard', icon: Receipt, contractAccounting: true },
    { name: 'Points & Rewards', href: '/points-rewards', icon: Award },
    { name: 'Premium', href: '/subscription', icon: Crown, premium: true },
    { name: 'Demo', href: '/reserve-demo', icon: PlayCircle, demo: true },
  ];

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        close();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [close]);

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  const overlayVariants = {
    open: {
      opacity: 1,
      transition: {
        duration: 0.2
      }
    },
    closed: {
      opacity: 0,
      transition: {
        duration: 0.2
      }
    }
  };

  const renderNavItem = (item: any) => (
    <NavLink
      key={item.name}
      to={item.href}
      onClick={close}
      className={({ isActive }) =>
        `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
          isActive
            ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-600'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        } ${item.premium && !isPremium ? 'opacity-75' : ''}`
      }
    >
      <item.icon className={`w-5 h-5 mr-3 ${
        item.premium && isPremium ? 'text-yellow-500' : 
        item.demo ? 'text-blue-500' : 
        item.contractAccounting ? 'text-purple-500' : ''
      }`} />
      {item.name}
      {item.premium && isPremium && (
        <Crown className="w-3 h-3 ml-auto text-yellow-500" />
      )}
      {item.demo && (
        <span className="ml-auto text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full">
          Demo
        </span>
      )}
      {item.contractAccounting && (
        <span className="ml-auto text-xs bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded-full">
          New
        </span>
      )}
    </NavLink>
  );

  return (
    <>
      {/* Desktop Sidebar - Always visible on large screens */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:z-20">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex items-center flex-shrink-0 px-6 py-4 border-b border-gray-200">
            <Package className="w-8 h-8 text-primary-600" />
            <span className="ml-2 text-lg font-semibold text-gray-900">Project ZX</span>
            {isPremium && (
              <Crown className="w-4 h-4 ml-auto text-yellow-500" />
            )}
          </div>
          
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map(renderNavItem)}
          </nav>
          
          <div className="flex-shrink-0 p-4 border-t border-gray-200">
            <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors">
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={close}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="lg:hidden fixed inset-y-0 left-0 z-50 w-64"
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <div className="flex flex-col h-full bg-white border-r border-gray-200 shadow-xl">
              <div className="flex items-center flex-shrink-0 px-6 py-4 border-b border-gray-200">
                <Package className="w-8 h-8 text-primary-600" />
                <span className="ml-2 text-lg font-semibold text-gray-900">Project ZX</span>
                {isPremium && (
                  <Crown className="w-4 h-4 ml-auto text-yellow-500" />
                )}
              </div>
              
              <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                {navigation.map(renderNavItem)}
              </nav>
              
              <div className="flex-shrink-0 p-4 border-t border-gray-200">
                <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors">
                  <LogOut className="w-5 h-5 mr-3" />
                  Sign Out
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;