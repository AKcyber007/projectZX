import React from 'react';
import { Crown, Check, Star, Zap, Shield, TrendingUp, Calendar, Lock } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

const PremiumSubscriptionPage: React.FC = () => {
  const { isPremium, togglePremium } = useUser();

  const premiumFeatures = [
    {
      icon: Calendar,
      title: 'Future Contract Reservations',
      description: 'Reserve future contracts with 20% upfront payment and secure your deals in advance',
      highlight: true
    },
    {
      icon: Star,
      title: 'Priority Contract Listings',
      description: 'Your contracts appear at the top of marketplace searches for maximum visibility'
    },
    {
      icon: TrendingUp,
      title: 'Advanced Analytics Dashboard',
      description: 'Detailed insights, profit analysis, and market trends to optimize your business'
    },
    {
      icon: Shield,
      title: 'Enhanced Security & Verification',
      description: 'Premium verification badge and enhanced security features for trusted transactions'
    },
    {
      icon: Zap,
      title: 'Instant Contract Matching',
      description: 'AI-powered contract matching based on your history and preferences'
    },
    {
      icon: Lock,
      title: 'Exclusive Premium Support',
      description: '24/7 priority support with dedicated account manager and faster response times'
    }
  ];

  const pricingPlans = [
    {
      name: 'Standard',
      price: 'Free',
      period: 'forever',
      description: 'Perfect for getting started',
      features: [
        'Post unlimited contracts',
        'Browse marketplace',
        'Basic analytics',
        'Standard support',
        'Points & rewards system'
      ],
      current: !isPremium,
      buttonText: 'Current Plan',
      buttonDisabled: true
    },
    {
      name: 'Premium',
      price: '₹2,999',
      period: 'per month',
      description: 'Unlock advanced features and future contracts',
      features: [
        'Everything in Standard',
        'Future contract reservations',
        'Priority listings',
        'Advanced analytics',
        'Premium verification badge',
        'Priority support',
        'AI-powered matching'
      ],
      current: isPremium,
      buttonText: isPremium ? 'Current Plan' : 'Upgrade to Premium',
      buttonDisabled: isPremium,
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'pricing',
      description: 'For large organizations',
      features: [
        'Everything in Premium',
        'Custom integrations',
        'Dedicated account manager',
        'White-label solutions',
        'Advanced reporting',
        'Custom contract templates'
      ],
      current: false,
      buttonText: 'Contact Sales',
      buttonDisabled: false
    }
  ];

  const handleUpgrade = () => {
    if (!isPremium) {
      togglePremium();
      // In a real app, this would trigger payment processing
      console.log('Upgrading to Premium...');
    }
  };

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Crown className="w-12 h-12 text-yellow-500" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Unlock Premium Features
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Take your contract management to the next level with advanced features, 
          future contract reservations, and priority support.
        </p>
      </div>

      {/* Current Status Banner */}
      {isPremium && (
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl p-6 text-center">
          <div className="flex items-center justify-center space-x-2 text-white">
            <Crown className="w-6 h-6" />
            <h2 className="text-2xl font-bold">You're a Premium Member!</h2>
          </div>
          <p className="text-yellow-100 mt-2">
            Enjoy all premium features including future contract reservations
          </p>
        </div>
      )}

      {/* Premium Features */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          Premium Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {premiumFeatures.map((feature, index) => (
            <div 
              key={index} 
              className={`p-6 rounded-xl border-2 transition-all ${
                feature.highlight 
                  ? 'border-yellow-300 bg-yellow-50' 
                  : 'border-gray-200 hover:border-primary-300'
              }`}
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                feature.highlight 
                  ? 'bg-yellow-100' 
                  : 'bg-primary-100'
              }`}>
                <feature.icon className={`w-6 h-6 ${
                  feature.highlight 
                    ? 'text-yellow-600' 
                    : 'text-primary-600'
                }`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {feature.description}
              </p>
              {feature.highlight && (
                <div className="mt-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Future Contracts Explanation */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            How Future Contract Reservations Work
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Post Future Contract</h3>
              <p className="text-gray-600 text-sm">
                Sellers post contracts with future availability dates, allowing buyers to plan ahead
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Reserve with 20%</h3>
              <p className="text-gray-600 text-sm">
                Premium buyers can reserve contracts by paying 20% upfront, securing the deal
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">3. Execute or Forfeit</h3>
              <p className="text-gray-600 text-sm">
                Complete the contract on the due date, or forfeit the 20% as compensation to the seller
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          Choose Your Plan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <div 
              key={index}
              className={`relative p-6 rounded-xl border-2 transition-all ${
                plan.popular 
                  ? 'border-primary-500 shadow-lg scale-105' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-2">
                  <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                  {plan.period !== 'pricing' && (
                    <span className="text-gray-600 ml-1">/{plan.period}</span>
                  )}
                </div>
                <p className="text-gray-600 text-sm">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start space-x-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={plan.name === 'Premium' ? handleUpgrade : undefined}
                disabled={plan.buttonDisabled}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  plan.current
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    : plan.popular
                    ? 'bg-primary-600 hover:bg-primary-700 text-white'
                    : 'bg-gray-900 hover:bg-gray-800 text-white'
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          Frequently Asked Questions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              What happens if I cancel a reserved future contract?
            </h3>
            <p className="text-gray-600 text-sm">
              If you cancel before the exercise date, the 20% upfront payment is forfeited to the seller as compensation for holding the contract.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Can I upgrade or downgrade my plan anytime?
            </h3>
            <p className="text-gray-600 text-sm">
              Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades take effect at the next billing cycle.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              How far in advance can I post future contracts?
            </h3>
            <p className="text-gray-600 text-sm">
              Premium users can post future contracts up to 12 months in advance, giving maximum flexibility for planning.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Is there a limit on future contract reservations?
            </h3>
            <p className="text-gray-600 text-sm">
              Premium users can reserve unlimited future contracts, subject to available funds for the 20% upfront payments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumSubscriptionPage;