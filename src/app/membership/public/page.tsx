'use client';

import { useState, useEffect } from 'react';

interface MembershipTier {
  id: string;
  name: string;
  price: number;
  description: string;
  benefits: string[];
  isPopular?: boolean;
  createdAt: string;
}

export default function PublicMembership() {
  const [tiers, setTiers] = useState<MembershipTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTier, setSelectedTier] = useState<MembershipTier | null>(null);

  useEffect(() => {
    fetchMembershipTiers();
  }, []);

  const fetchMembershipTiers = async () => {
    try {
      const response = await fetch('/api/membership/tiers');
      if (response.ok) {
        const result = await response.json();
        const tiersArray = result.data || [];
        setTiers(tiersArray);
      }
    } catch (error) {
      console.error('Failed to fetch membership tiers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (tierId: string) => {
    try {
      const response = await fetch('/api/membership/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tierId }),
      });

      if (response.ok) {
        alert('Membership purchase initiated! You will be redirected to payment.');
        // In a real app, this would redirect to payment processor
      } else {
        alert('Failed to initiate purchase. Please try again.');
      }
    } catch (error) {
      console.error('Failed to purchase membership:', error);
      alert('Failed to initiate purchase. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading membership options...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🏆 Fan Membership
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join the 4bs0lut3-m4dn3ss family and get exclusive access to games, merchandise, and special events
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {tiers.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Membership Coming Soon</h3>
            <p className="text-gray-600">We're preparing exclusive membership tiers for our fans!</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Membership</h2>
              <p className="text-lg text-gray-600">
                Select the perfect membership tier for your level of fandom
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tiers.map((tier) => (
                <div
                  key={tier.id}
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all hover:scale-105 ${
                    tier.isPopular ? 'ring-4 ring-orange-500 ring-opacity-50' : ''
                  }`}
                >
                  {tier.isPopular && (
                    <div className="bg-orange-500 text-white text-center py-2 px-4 text-sm font-semibold">
                      MOST POPULAR
                    </div>
                  )}
                  
                  <div className="p-8">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {tier.name}
                      </h3>
                      <div className="text-4xl font-bold text-orange-600 mb-2">
                        ${tier.price}
                        <span className="text-lg text-gray-500 font-normal">/year</span>
                      </div>
                      <p className="text-gray-600">{tier.description}</p>
                    </div>

                    <div className="mb-8">
                      <h4 className="font-semibold text-gray-900 mb-4">What's included:</h4>
                      <ul className="space-y-3">
                        {tier.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start">
                            <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-700">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => setSelectedTier(tier)}
                      className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                        tier.isPopular
                          ? 'bg-orange-600 text-white hover:bg-orange-700'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      Choose {tier.name}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Features Section */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Become a Member?</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🎫</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Priority Access</h3>
              <p className="text-gray-600">Get first access to tickets for all games and special events</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Exclusive Discounts</h3>
              <p className="text-gray-600">Save on merchandise, concessions, and parking</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🎉</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Special Events</h3>
              <p className="text-gray-600">Attend member-only events and meet the team</p>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Modal */}
      {selectedTier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Complete Your Membership
                </h2>
                <button
                  onClick={() => setSelectedTier(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-6">
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {selectedTier.name} Membership
                    </h3>
                    {selectedTier.isPopular && (
                      <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                        POPULAR
                      </span>
                    )}
                  </div>
                  
                  <div className="text-3xl font-bold text-orange-600 mb-2">
                    ${selectedTier.price}/year
                  </div>
                  
                  <p className="text-gray-600 mb-4">{selectedTier.description}</p>
                  
                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Your benefits:</h4>
                    <ul className="space-y-1">
                      {selectedTier.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => handlePurchase(selectedTier.id)}
                    className="w-full bg-orange-600 text-white py-3 px-4 rounded-md hover:bg-orange-700 transition-colors font-semibold"
                  >
                    Purchase Membership - ${selectedTier.price}
                  </button>
                  <button
                    onClick={() => setSelectedTier(null)}
                    className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}