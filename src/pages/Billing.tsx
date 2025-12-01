import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Check, Sparkles, Zap, Building2, CreditCard } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function Billing() {
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
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-4 md:p-8 flex flex-col items-center">
      <Toaster position="top-right" />
      {/* Header */}
      <div className="text-center mb-8 md:mb-12">
        <div className="inline-block mb-4">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold px-4 py-1.5 rounded-full">
            Transparent Pricing
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent">
          Choose Your Plan
        </h1>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto">
          Flexible pricing that scales with your business. Upgrade, downgrade,
          or cancel anytime.
        </p>
      </div>

      {/* Billing Toggle */}
      <Tabs defaultValue="monthly" className="mb-10" onValueChange={(value) => setBillingCycle(value)}>
        <TabsList className="bg-white shadow-md p-1 rounded-xl border border-slate-200">
          <TabsTrigger
            value="monthly"
            className="rounded-lg px-6 py-2.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
          >
            Monthly
          </TabsTrigger>
          <TabsTrigger
            value="yearly"
            className="rounded-lg px-6 py-2.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
          >
            Yearly
            <span className="ml-2 text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full">
              Save 20%
            </span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mb-12">
        {plans.map((plan, index) => {
          const Icon = plan.icon;
          return (
            <div key={plan.id} className="relative" style={{ animationDelay: `${index * 100}ms` }}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                    MOST POPULAR
                  </span>
                </div>
              )}

              <Card
                className={`rounded-3xl shadow-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 overflow-hidden ${
                  selectedPlan === plan.id
                    ? "border-blue-600 ring-4 ring-blue-200"
                    : "border-slate-200 hover:border-slate-300"
                } ${plan.popular ? "mt-4" : ""}`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                <div className={`h-2 bg-gradient-to-r ${plan.gradient}`}></div>
                <CardContent className="p-8">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${plan.gradient} flex items-center justify-center mb-6 shadow-lg`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2 text-slate-900">{plan.name}</h2>
                  <p className="text-slate-600 mb-6 text-sm">{plan.desc}</p>

                  {/* Price */}
                  <div className="mb-8">
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-bold text-slate-900">{getPrice(plan)}</span>
                      {plan.price !== "Custom" && (
                        <span className="text-lg font-medium text-slate-500">
                          /{billingCycle === "monthly" ? "mo" : "yr"}
                        </span>
                      )}
                    </div>
                    {billingCycle === "yearly" && plan.price !== "Custom" && (
                      <p className="text-sm text-slate-500 mt-1">Billed annually</p>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="mb-8 space-y-3">
                    {plan.features.map((f, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-slate-700">
                        <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3.5 h-3.5 text-blue-600" />
                        </div>
                        <span className="text-sm">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full text-base font-semibold py-6 rounded-xl transition-all duration-300 ${
                      selectedPlan === plan.id
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                        : "bg-slate-900 hover:bg-slate-800 text-white"
                    }`}
                  >
                    {selectedPlan === plan.id ? "✓ Selected" : "Choose Plan"}
                  </Button>

                  {selectedPlan === plan.id && (
                    <div className="mt-6 space-y-3">
                      <Button
                        onClick={handleSubmit}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2"
                      >
                        <CreditCard className="w-5 h-5" /> Pay with Card (Stripe)
                      </Button>

                      <div id="paypal-button" className="mt-2"></div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Payment Details Form */}
      <div className="w-full max-w-3xl p-8 bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
            <Check className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Payment Details</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Cardholder Name"
                value={formData.cardholderName}
                onChange={(e) => handleInputChange("cardholderName", e.target.value)}
                onBlur={() => handleBlur("cardholderName")}
                className={`rounded-xl border-slate-300 focus:ring-2 focus:ring-blue-500 py-6 ${
                  errors.cardholderName ? "border-red-500 focus:ring-red-500" : ""
                }`}
              />
              {errors.cardholderName && (
                <p className="text-red-500 text-sm mt-1 ml-1">{errors.cardholderName}</p>
              )}
            </div>
            <div className="md:col-span-2">
              <Input
                placeholder="Card Number"
                value={formData.cardNumber}
                onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                onBlur={() => handleBlur("cardNumber")}
                maxLength={19}
                className={`rounded-xl border-slate-300 focus:ring-2 focus:ring-blue-500 py-6 ${
                  errors.cardNumber ? "border-red-500 focus:ring-red-500" : ""
                }`}
              />
              {errors.cardNumber && (
                <p className="text-red-500 text-sm mt-1 ml-1">{errors.cardNumber}</p>
              )}
            </div>
            <div>
              <Input
                placeholder="Expiry Date (MM/YY)"
                value={formData.expiryDate}
                onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                onBlur={() => handleBlur("expiryDate")}
                maxLength={5}
                className={`rounded-xl border-slate-300 focus:ring-2 focus:ring-blue-500 py-6 ${
                  errors.expiryDate ? "border-red-500 focus:ring-red-500" : ""
                }`}
              />
              {errors.expiryDate && (
                <p className="text-red-500 text-sm mt-1 ml-1">{errors.expiryDate}</p>
              )}
            </div>
            <div>
              <Input
                placeholder="CVV"
                value={formData.cvv}
                onChange={(e) => handleInputChange("cvv", e.target.value)}
                onBlur={() => handleBlur("cvv")}
                maxLength={4}
                className={`rounded-xl border-slate-300 focus:ring-2 focus:ring-blue-500 py-6 ${
                  errors.cvv ? "border-red-500 focus:ring-red-500" : ""
                }`}
              />
              {errors.cvv && (
                <p className="text-red-500 text-sm mt-1 ml-1">{errors.cvv}</p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-xl font-semibold"
          >
            Submit Payment Details
          </Button>
        </form>
      </div>
    </div>
  );
}
