import React, { useState } from 'react';
import { Check, Lock, Zap, Crown, Users } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

interface CoursePaywallProps {
  courseId: string;
  courseName: string;
  tier: 'free' | 'premium' | 'enterprise';
  pricing?: {
    oneTimeFee?: number;
    monthlyPrice?: number;
    yearlyPrice?: number;
    lifetimeAccess?: boolean;
    currency?: string;
    teamLicense?: {
      enabled: boolean;
      maxSeats?: number;
      pricePerSeat?: number;
    };
  };
  isSubscribed?: boolean;
  onSubscribe?: (subscriptionType: string) => void;
}

const CoursePriceDisplay: React.FC<CoursePaywallProps> = ({
  courseId,
  courseName,
  tier,
  pricing = {},
  isSubscribed = false,
  onSubscribe
}) => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (tier === 'free') {
    return null;
  }

  const handleSubscribe = async (type: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');

      // TODO: Replace with actual payment processing (Stripe/PayPal)
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/subscriptions/purchase`,
        {
          courseId,
          subscriptionType: type
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Subscription activated! Redirecting to payment...');
      if (onSubscribe) onSubscribe(type);

      // TODO: Redirect to payment page
      // window.location.href = response.data.paymentUrl;
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('Failed to activate subscription');
    } finally {
      setLoading(false);
    }
  };

  const currency = pricing.currency || '$';
  const plans = [];

  if (pricing.oneTimeFee) {
    plans.push({
      id: 'oneTime',
      name: 'Lifetime Access',
      price: pricing.oneTimeFee,
      billing: 'one-time',
      features: ['Full course access', 'All materials', 'Forever access', 'Certificate']
    });
  }

  if (pricing.monthlyPrice) {
    plans.push({
      id: 'monthly',
      name: 'Monthly Plan',
      price: pricing.monthlyPrice,
      billing: 'per month',
      features: ['Monthly access', 'All materials', 'Support', 'Certificate']
    });
  }

  if (pricing.yearlyPrice) {
    const savings = pricing.monthlyPrice && pricing.yearlyPrice < pricing.monthlyPrice * 12;
    plans.push({
      id: 'yearly',
      name: 'Annual Plan',
      price: pricing.yearlyPrice,
      billing: 'per year',
      features: ['Annual access', 'All materials', 'Priority support', 'Certificate'],
      badge: savings ? 'Save 20%' : undefined
    });
  }

  return (
    <div className="mb-8">
      <div className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200 rounded-lg p-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            {tier === 'premium' && <Zap size={20} className="text-green-600" />}
            {tier === 'enterprise' && <Crown size={20} className="text-purple-600" />}
            <h3 className="text-xl font-bold text-gray-900">
              {tier === 'premium' ? '🎯 Premium Course' : '👑 Enterprise Course'}
            </h3>
          </div>
          <p className="text-sm text-gray-700">
            This is a {tier} course. Upgrade to access all content.
          </p>
        </div>

        {isSubscribed ? (
          <div className="bg-green-100 border border-green-400 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-700">
              <Check size={20} />
              <span className="font-semibold">✓ You have access to this course</span>
            </div>
          </div>
        ) : (
          <>
            {plans.length > 0 ? (
              <div className={`grid gap-4 ${plans.length > 2 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`border-2 rounded-lg p-5 transition cursor-pointer ${
                      selectedPlan === plan.id
                        ? 'border-green-600 bg-white'
                        : 'border-gray-200 bg-white hover:border-green-400'
                    }`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-bold text-gray-900">{plan.name}</h4>
                      {plan.badge && (
                        <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">
                          {plan.badge}
                        </span>
                      )}
                    </div>

                    <div className="mb-4">
                      <div className="text-3xl font-bold text-gray-900">
                        {currency}
                        {plan.price}
                      </div>
                      <div className="text-xs text-gray-600">{plan.billing}</div>
                    </div>

                    <ul className="space-y-2 mb-4">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                          <Check size={16} className="text-green-600 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={loading}
                      className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition"
                    >
                      {loading ? 'Processing...' : 'Subscribe Now'}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 text-center text-gray-700">
                <p className="text-sm">
                  <Lock size={20} className="inline mr-2" />
                  This course is locked. Contact course creator for access.
                </p>
              </div>
            )}

            {pricing.teamLicense?.enabled && (
              <div className="mt-6 pt-6 border-t-2 border-green-200">
                <div className="flex items-center gap-2 mb-3">
                  <Users size={20} className="text-blue-600" />
                  <h5 className="font-bold text-gray-900">Team License</h5>
                </div>
                <p className="text-sm text-gray-700 mb-3">
                  Get group discounts for your team:
                  <br />
                  {pricing.teamLicense.maxSeats} seats available
                  <br />
                  {currency}
                  {pricing.teamLicense.pricePerSeat} per person
                </p>
                <button
                  onClick={() => handleSubscribe('teamLicense')}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg text-sm transition"
                >
                  {loading ? 'Processing...' : 'Get Team License'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CoursePriceDisplay;
