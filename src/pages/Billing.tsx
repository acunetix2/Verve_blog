import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Check, Sparkles, Zap, Building2, CreditCard, TrendingUp, BarChart3, Gift, Shield, Headphones } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useTheme } from "@/components/ThemeContext";

const fontStyle = {
  fontFamily: "'Roboto', 'Segoe UI', sans-serif",
  fontSize: "0.8125rem",
};

const smallFontStyle = {
  fontFamily: "'Roboto', 'Segoe UI', sans-serif",
  fontSize: "0.75rem",
};

export default function Billing() {
  const { actualTheme } = useTheme();
  const [selectedPlan, setSelectedPlan] = useState("starter");
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [formData, setFormData] = useState({
    cardholderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
  const [errors, setErrors] = useState({
    cardholderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: "$3",
      yearlyPrice: "$15",
      desc: "Perfect for individuals and small projects.",
      features: ["1 Workspace", "Basic Analytics", "Email Support"],
      icon: Sparkles,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: "pro",
      name: "Pro",
      price: "$6",
      yearlyPrice: "$20",
      desc: "Best for growing teams and businesses.",
      features: ["5 Workspaces", "Advanced Analytics", "Priority Support"],
      icon: Zap,
      gradient: "from-purple-500 to-pink-500",
      popular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "Custom",
      yearlyPrice: "Custom",
      desc: "Full power for enterprises and large teams.",
      features: ["Unlimited Workspaces", "Dedicated Manager", "Full Reporting"],
      icon: Building2,
      gradient: "from-slate-700 to-slate-900",
    },
  ];

  // Load PayPal Script dynamically
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_PAYPAL_CLIENT_ID}&currency=USD`;
    script.async = true;
    script.onload = () => {
      if (window.paypal) {
        window.paypal.Buttons({
          createOrder: (data, actions) => {
            const planValue =
              selectedPlan === "starter"
                ? billingCycle === "monthly"
                  ? "3.00"
                  : "6.00"
                : selectedPlan === "pro"
                ? billingCycle === "monthly"
                  ? "7.00"
                  : "15.00"
                : "0";
            return actions.order.create({
              purchase_units: [{ amount: { value: planValue } }],
            });
          },
          onApprove: async (data, actions) => {
            try {
              const details = await actions.order.capture();
              toast.success(`PayPal Payment Successful: ${details.id}`);
            } catch (err) {
              console.error(err);
              toast.error("PayPal Payment failed");
            }
          },
        }).render("#paypal-button");
      }
    };
    document.body.appendChild(script);
  }, [selectedPlan, billingCycle]);

  const getPrice = (plan) => {
    if (plan.price === "Custom") return "Custom";
    return billingCycle === "monthly" ? plan.price : plan.yearlyPrice;
  };

  const handleInputChange = (field, value) => {
    if (field === "cardNumber") {
      value = value.replace(/\D/g, "").replace(/(\d{4})/g, "$1 ").trim();
      if (value.replace(/\s/g, "").length > 16) return;
    }
    if (field === "expiryDate") {
      value = value.replace(/\D/g, "");
      if (value.length >= 3) {
        value = value.slice(0, 2) + "/" + value.slice(2, 4);
      }
      if (value.length > 5) return;
    }
    if (field === "cvv") {
      value = value.replace(/\D/g, "");
      if (value.length > 4) return;
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleBlur = (field) => {
    let error = "";
    switch (field) {
      case "cardholderName":
        error = !formData.cardholderName ? "Cardholder name is required" : "";
        break;
      case "cardNumber":
        error = !formData.cardNumber ? "Card number is required" : "";
        break;
      case "expiryDate":
        error = !formData.expiryDate ? "Expiry date is required" : "";
        break;
      case "cvv":
        error = !formData.cvv ? "CVV is required" : "";
        break;
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const validateForm = () => {
    const newErrors = {
      cardholderName: !formData.cardholderName ? "Cardholder name is required" : "",
      cardNumber: !formData.cardNumber ? "Card number is required" : "",
      expiryDate: !formData.expiryDate ? "Expiry date is required" : "",
      cvv: !formData.cvv ? "CVV is required" : "",
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch("/api/payments/stripe-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: selectedPlan, billingCycle }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error?.error || "Stripe session creation failed");
      }

      const session = await response.json();
      const stripe = window.Stripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
      const result = await stripe.redirectToCheckout({ sessionId: session.id });
      if (result.error) toast.error(result.error.message);
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  return (
    <div className={`w-full min-h-screen py-16 px-4 md:px-8 transition-colors duration-300 ${
      actualTheme === 'dark'
        ? 'bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900'
        : 'bg-gradient-to-b from-slate-50 via-white to-blue-50'
    }`}>
      <Toaster position="top-right" />
      
      {/* Hero Section */}
      <div className="max-w-4xl text-left mx-auto mb-16" style={{ fontFamily: "'Google Sans', sans-serif" }}>
        <h1 className={`text-2xl md:text-3xl font-bold mb-4 ${
          actualTheme === 'dark'
            ? 'text-white'
            : 'text-slate-900'
        }`}>
          Upgrade your account
        </h1>
        
        <p className={` max-w-1xl mx-auto mb-8 ${
          actualTheme === 'dark'
            ? 'text-slate-400'
            : 'text-slate-600'
        }`} style={{ fontFamily: "'Google Sans', sans-serif" }}>
          Choose the perfect plan for your needs. Upgrade, downgrade, or cancel anytime with no hidden fees.
        </p>

        {/* Billing Cycle Toggle */}
        <div className="flex justify-center mb-12" style={smallFontStyle}>
          <div className={`inline-flex rounded-full p-1 ${
            actualTheme === 'dark'
              ? 'bg-slate-800 border border-slate-700'
              : 'bg-gray-100 border border-gray-200'
          }`}>
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${
                billingCycle === "monthly"
                  ? actualTheme === 'dark'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-blue-600 shadow-lg'
                  : actualTheme === 'dark'
                    ? 'text-slate-400'
                    : 'text-slate-600'
              }`} style={smallFontStyle}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 relative ${
                billingCycle === "yearly"
                  ? actualTheme === 'dark'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-blue-600 shadow-lg'
                  : actualTheme === 'dark'
                    ? 'text-slate-400'
                    : 'text-slate-600'
              }`} style={smallFontStyle}
            >
              Yearly
              <span className="absolute -top-3 -right-3 bg-amber-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                Save 20%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-1xl mx-auto mb-16" style={{ fontFamily: "'Google Sans', sans-serif" }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const isSelected = selectedPlan === plan.id;
            
            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer group ${
                  isSelected
                    ? actualTheme === 'dark'
                      ? 'scale-105 shadow-2xl'
                      : 'scale-105 shadow-2xl'
                    : 'hover:shadow-lg'
                }`}
                onClick={() => setSelectedPlan(plan.id)} style={{ fontFamily: "'Google Sans', sans-serif" }}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-4 py-1.5 rounded-bl-lg">
                    POPULAR
                  </div>
                )}

                {/* Card Background */}
                <div className={`p-8 h-full relative overflow-hidden rounded-2xl border transition-all duration-300 ${
                  isSelected
                    ? actualTheme === 'dark'
                      ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-blue-500/50'
                      : 'bg-gradient-to-br from-blue-50 to-white border-blue-400'
                    : actualTheme === 'dark'
                      ? 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                }`}>
                  {/* Gradient Background Effect */}
                  <div className={`absolute inset-0 opacity-10 ${
                    isSelected ? 'opacity-20' : ''
                  } bg-gradient-to-br ${plan.gradient}`}></div>

                  <div className="relative z-10">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${plan.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    {/* Plan Name */}
                    <h3 className={`text-2xl font-bold mb-2 ${
                      actualTheme === 'dark' ? 'text-white' : 'text-slate-900'
                    }`}>
                      {plan.name}
                    </h3>

                    {/* Description */}
                    <p className={`text-sm mb-6 ${
                      actualTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {plan.desc}
                    </p>

                    {/* Price */}
                    <div className="mb-8">
                      <div className="flex items-baseline gap-1">
                        <span className={`text-5xl font-bold ${
                          actualTheme === 'dark' ? 'text-white' : 'text-slate-900'
                        }`}>
                          {getPrice(plan)}
                        </span>
                        {plan.price !== "Custom" && (
                          <span className={`text-lg font-medium ${
                            actualTheme === 'dark' ? 'text-slate-500' : 'text-slate-500'
                          }`}>
                            /{billingCycle === "monthly" ? "mo" : "yr"}
                          </span>
                        )}
                      </div>
                      {billingCycle === "yearly" && plan.price !== "Custom" && (
                        <p className={`text-sm mt-1 ${
                          actualTheme === 'dark' ? 'text-slate-500' : 'text-slate-500'
                        }`}>
                          Billed annually
                        </p>
                      )}
                    </div>

                    {/* Features */}
                    <ul className="mb-8 space-y-3">
                      {plan.features.map((f, idx) => (
                        <li key={idx} className={`flex items-center gap-3 ${
                          actualTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                        }`}>
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                            actualTheme === 'dark'
                              ? 'bg-blue-500/20'
                              : 'bg-blue-100'
                          }`}>
                            <Check className={`w-3 h-3 ${
                              actualTheme === 'dark'
                                ? 'text-blue-400'
                                : 'text-blue-600'
                            }`} />
                          </div>
                          <span className="text-sm font-medium">{f}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Select Button */}
                    <Button
                      className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                        isSelected
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
                          : actualTheme === 'dark'
                            ? 'bg-slate-700 hover:bg-slate-600 text-white'
                            : 'bg-slate-200 hover:bg-slate-300 text-slate-900'
                      }`}
                    >
                      {isSelected ? '✓ Selected' : 'Choose Plan'}
                    </Button>

                    {/* Payment Options (Show when selected) */}
                    {isSelected && (
                      <div className="mt-6 space-y-3 animate-in fade-in">
                        <Button
                          onClick={handleSubmit}
                          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
                        >
                          <CreditCard className="w-5 h-5" /> Pay with Card
                        </Button>
                        <div id="paypal-button" className="mt-2"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Features Comparison */}
      <div className="max-w-6xl mx-auto mb-16">
        <h2 className={`text-3xl font-bold text-center mb-12 ${
          actualTheme === 'dark' ? 'text-white' : 'text-slate-900'
        }`}>
          Plan Features
        </h2>

        <div className={`rounded-2xl border overflow-hidden ${
          actualTheme === 'dark'
            ? 'border-slate-700 bg-slate-800/50'
            : 'border-gray-200 bg-white'
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`${
                  actualTheme === 'dark'
                    ? 'border-b border-slate-700 bg-slate-900/50'
                    : 'border-b border-gray-200 bg-gray-50'
                }`}>
                  <th className={`text-left px-6 py-4 font-semibold ${
                    actualTheme === 'dark' ? 'text-slate-200' : 'text-slate-900'
                  }`}>
                    Feature
                  </th>
                  {plans.map((plan) => (
                    <th key={plan.id} className={`text-center px-6 py-4 font-semibold ${
                      actualTheme === 'dark' ? 'text-slate-200' : 'text-slate-900'
                    }`}>
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: 'Users', values: [1, 5, 'Unlimited'] },
                  { label: 'Storage', values: ['5GB', '50GB', 'Unlimited'] },
                  { label: 'Email Support', values: [true, true, true] },
                  { label: 'Priority Support', values: [false, true, true] },
                  { label: 'Custom Domain', values: [false, true, true] },
                  { label: 'API Access', values: [false, false, true] },
                ].map((row, idx) => (
                  <tr key={idx} className={`border-t ${
                    actualTheme === 'dark' ? 'border-slate-700' : 'border-gray-200'
                  } ${idx % 2 === 0 ? (actualTheme === 'dark' ? 'bg-slate-800/30' : 'bg-gray-50') : ''}`}>
                    <td className={`px-6 py-4 font-medium ${
                      actualTheme === 'dark' ? 'text-slate-200' : 'text-slate-900'
                    }`}>
                      {row.label}
                    </td>
                    {row.values.map((value, idx) => (
                      <td key={idx} className="text-center px-6 py-4">
                        {typeof value === 'boolean' ? (
                          value ? (
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          ) : (
                            <div className={`w-5 h-5 rounded-full mx-auto ${
                              actualTheme === 'dark' ? 'bg-slate-700' : 'bg-gray-300'
                            }`}></div>
                          )
                        ) : (
                          <span className={actualTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'}>
                            {value}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto mb-16">
        <h2 className={`text-3xl font-bold text-center mb-12 ${
          actualTheme === 'dark' ? 'text-white' : 'text-slate-900'
        }`}>
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {[
            {
              q: 'Can I change my plan anytime?',
              a: 'Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.'
            },
            {
              q: 'What payment methods do you accept?',
              a: 'We accept all major credit cards (Visa, Mastercard, American Express) and PayPal.'
            },
            {
              q: 'Is there a free trial?',
              a: 'Yes, all new users get a 14-day free trial. No credit card required to start.'
            },
            {
              q: 'Do you offer refunds?',
              a: 'We offer a 30-day money-back guarantee if you\'re not satisfied with our service.'
            }
          ].map((faq, idx) => (
            <div
              key={idx}
              className={`rounded-lg border p-6 transition-all hover:shadow-md ${
                actualTheme === 'dark'
                  ? 'border-slate-700 bg-slate-800/50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <h3 className={`font-semibold mb-2 ${
                actualTheme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                {faq.q}
              </h3>
              <p className={actualTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Support Section */}
      <div className="max-w-4xl mx-auto text-center">
        <div className={`rounded-2xl border p-8 ${
          actualTheme === 'dark'
            ? 'border-slate-700 bg-slate-800/50'
            : 'border-gray-200 bg-blue-50'
        }`}>
          <h2 className={`text-2xl font-bold mb-4 ${
            actualTheme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            Need help choosing?
          </h2>
          <p className={`mb-6 ${
            actualTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Our sales team is here to help you find the perfect plan for your needs.
          </p>
          <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-lg font-semibold">
            <Headphones className="w-5 h-5 mr-2" /> Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}
