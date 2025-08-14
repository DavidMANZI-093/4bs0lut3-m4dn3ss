'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import UserProfile from '@/components/UserProfile';

interface MembershipTier {
    id: string;
    name: string;
    price: number;
    description: string;
    benefits: string[];
    isPopular: boolean;
    createdAt: string;
    updatedAt: string;
}

interface Member {
    id: string;
    email: string;
    tierName: string;
    status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
    joinedAt: string;
    expiresAt: string;
}

export default function AdminMembership() {
    const [tiers, setTiers] = useState<MembershipTier[]>([]);
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'tiers' | 'members'>('tiers');
    const [selectedTier, setSelectedTier] = useState<MembershipTier | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [newTier, setNewTier] = useState({
        name: '',
        price: '',
        description: '',
        benefits: [''],
        isPopular: false,
    });

    useEffect(() => {
        fetchTiers();
        fetchMembers();
    }, []);

    const fetchTiers = async () => {
        try {
            const response = await fetch('/api/membership/tiers');
            if (response.ok) {
                const result = await response.json();
                setTiers(result.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch tiers:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMembers = async () => {
        try {
            const response = await fetch('/api/membership/members');
            if (response.ok) {
                const result = await response.json();
                setMembers(result.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch members:', error);
        }
    };

    const createTier = async () => {
        if (!newTier.name.trim() || !newTier.price.trim() || !newTier.description.trim()) return;

        try {
            const response = await fetch('/api/membership/tiers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newTier.name,
                    price: parseFloat(newTier.price),
                    description: newTier.description,
                    benefits: newTier.benefits.filter(b => b.trim()),
                    isPopular: newTier.isPopular,
                }),
            });

            if (response.ok) {
                setNewTier({ name: '', price: '', description: '', benefits: [''], isPopular: false });
                setIsCreating(false);
                fetchTiers();
            }
        } catch (error) {
            console.error('Failed to create tier:', error);
        }
    };

    const deleteTier = async (tierId: string) => {
        if (!confirm('Are you sure you want to delete this membership tier?')) return;

        try {
            const response = await fetch(`/api/membership/tiers/${tierId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchTiers();
                setSelectedTier(null);
            }
        } catch (error) {
            console.error('Failed to delete tier:', error);
        }
    };

    const addBenefit = () => {
        setNewTier({ ...newTier, benefits: [...newTier.benefits, ''] });
    };

    const updateBenefit = (index: number, value: string) => {
        const updatedBenefits = [...newTier.benefits];
        updatedBenefits[index] = value;
        setNewTier({ ...newTier, benefits: updatedBenefits });
    };

    const removeBenefit = (index: number) => {
        const updatedBenefits = newTier.benefits.filter((_, i) => i !== index);
        setNewTier({ ...newTier, benefits: updatedBenefits });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACTIVE': return 'bg-green-100 text-green-800';
            case 'EXPIRED': return 'bg-yellow-100 text-yellow-800';
            case 'CANCELLED': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <ProtectedRoute requiredRole="ADMIN">
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading membership management...</p>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute requiredRole="ADMIN">
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <header className="bg-white shadow-sm border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center">
                                <h1 className="text-xl font-semibold text-gray-900">
                                    🏆 Membership Admin
                                </h1>
                                <div className="ml-4 text-sm text-gray-600">
                                    {tiers.length} tiers • {members.length} members
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <a
                                    href="/membership"
                                    target="_blank"
                                    className="text-sm text-blue-600 hover:text-blue-800"
                                >
                                    View Public Membership →
                                </a>
                                <UserProfile />
                            </div>
                        </div>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                        {/* Tabs */}
                        <div className="mb-6">
                            <nav className="flex space-x-8">
                                <button
                                    onClick={() => setActiveTab('tiers')}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'tiers'
                                        ? 'border-orange-500 text-orange-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    Membership Tiers ({tiers.length})
                                </button>
                                <button
                                    onClick={() => setActiveTab('members')}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'members'
                                        ? 'border-orange-500 text-orange-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    Members ({members.length})
                                </button>
                            </nav>
                        </div>

                        {activeTab === 'tiers' && (
                            <>
                                {/* Stats */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                                    <div className="bg-white rounded-lg shadow p-6">
                                        <div className="text-2xl font-bold text-gray-900">{tiers.length}</div>
                                        <div className="text-sm text-gray-600">Total Tiers</div>
                                    </div>
                                    <div className="bg-white rounded-lg shadow p-6">
                                        <div className="text-2xl font-bold text-gray-900">
                                            {tiers.filter(t => t.isPopular).length}
                                        </div>
                                        <div className="text-sm text-gray-600">Popular Tiers</div>
                                    </div>
                                    <div className="bg-white rounded-lg shadow p-6">
                                        <div className="text-2xl font-bold text-gray-900">
                                            ${tiers.length > 0 ? Math.min(...tiers.map(t => t.price)).toFixed(2) : '0.00'}
                                        </div>
                                        <div className="text-sm text-gray-600">Lowest Price</div>
                                    </div>
                                    <div className="bg-white rounded-lg shadow p-6">
                                        <div className="text-2xl font-bold text-gray-900">
                                            ${tiers.length > 0 ? Math.max(...tiers.map(t => t.price)).toFixed(2) : '0.00'}
                                        </div>
                                        <div className="text-sm text-gray-600">Highest Price</div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="bg-white rounded-lg shadow p-6 mb-6">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-lg font-medium text-gray-900">Tier Management</h2>
                                        <button
                                            onClick={() => setIsCreating(true)}
                                            className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
                                        >
                                            Add New Tier
                                        </button>
                                    </div>
                                </div>

                                {/* Create Tier Form */}
                                {isCreating && (
                                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Membership Tier</h3>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Tier Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={newTier.name}
                                                        onChange={(e) => setNewTier({ ...newTier, name: e.target.value })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                        placeholder="e.g., Bronze, Silver, Gold"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Annual Price ($)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        value={newTier.price}
                                                        onChange={(e) => setNewTier({ ...newTier, price: e.target.value })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                        placeholder="99.99"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Description
                                                </label>
                                                <textarea
                                                    value={newTier.description}
                                                    onChange={(e) => setNewTier({ ...newTier, description: e.target.value })}
                                                    rows={2}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                    placeholder="Brief description of this membership tier"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Benefits
                                                </label>
                                                {newTier.benefits.map((benefit, index) => (
                                                    <div key={index} className="flex items-center space-x-2 mb-2">
                                                        <input
                                                            type="text"
                                                            value={benefit}
                                                            onChange={(e) => updateBenefit(index, e.target.value)}
                                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                            placeholder="Enter a benefit"
                                                        />
                                                        {newTier.benefits.length > 1 && (
                                                            <button
                                                                onClick={() => removeBenefit(index)}
                                                                className="text-red-600 hover:text-red-800"
                                                            >
                                                                Remove
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                                <button
                                                    onClick={addBenefit}
                                                    className="text-orange-600 hover:text-orange-800 text-sm"
                                                >
                                                    + Add Benefit
                                                </button>
                                            </div>
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id="isPopular"
                                                    checked={newTier.isPopular}
                                                    onChange={(e) => setNewTier({ ...newTier, isPopular: e.target.checked })}
                                                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                                />
                                                <label htmlFor="isPopular" className="ml-2 block text-sm text-gray-900">
                                                    Mark as popular tier
                                                </label>
                                            </div>
                                            <div className="flex space-x-3">
                                                <button
                                                    onClick={createTier}
                                                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                                                >
                                                    Create Tier
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setIsCreating(false);
                                                        setNewTier({ name: '', price: '', description: '', benefits: [''], isPopular: false });
                                                    }}
                                                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Tiers List */}
                                <div className="bg-white rounded-lg shadow overflow-hidden">
                                    <div className="px-6 py-4 border-b border-gray-200">
                                        <h3 className="text-lg font-medium text-gray-900">All Membership Tiers</h3>
                                    </div>
                                    {tiers.length === 0 ? (
                                        <div className="p-6 text-center">
                                            <div className="text-4xl mb-4">🏆</div>
                                            <h4 className="text-lg font-semibold text-gray-900 mb-2">No Tiers Yet</h4>
                                            <p className="text-gray-600">Create your first membership tier to get started!</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-gray-200">
                                            {tiers.map((tier) => (
                                                <div
                                                    key={tier.id}
                                                    className="p-6 hover:bg-gray-50 cursor-pointer"
                                                    onClick={() => setSelectedTier(tier)}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center space-x-3 mb-2">
                                                                <h4 className="text-lg font-medium text-gray-900">
                                                                    {tier.name}
                                                                </h4>
                                                                <div className="text-xl font-bold text-orange-600">
                                                                    ${tier.price}/year
                                                                </div>
                                                                {tier.isPopular && (
                                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                                                        POPULAR
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-gray-600 text-sm mb-2">
                                                                {tier.description}
                                                            </p>
                                                            <div className="text-xs text-gray-500">
                                                                {tier.benefits.length} benefits • Created: {new Date(tier.createdAt).toLocaleDateString()}
                                                            </div>
                                                        </div>
                                                        <div className="ml-4">
                                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {activeTab === 'members' && (
                            <>
                                {/* Member Stats */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                                    <div className="bg-white rounded-lg shadow p-6">
                                        <div className="text-2xl font-bold text-gray-900">
                                            {members.filter(m => m.status === 'ACTIVE').length}
                                        </div>
                                        <div className="text-sm text-gray-600">Active Members</div>
                                    </div>
                                    <div className="bg-white rounded-lg shadow p-6">
                                        <div className="text-2xl font-bold text-gray-900">
                                            {members.filter(m => m.status === 'EXPIRED').length}
                                        </div>
                                        <div className="text-sm text-gray-600">Expired</div>
                                    </div>
                                    <div className="bg-white rounded-lg shadow p-6">
                                        <div className="text-2xl font-bold text-gray-900">
                                            {members.filter(m => m.status === 'CANCELLED').length}
                                        </div>
                                        <div className="text-sm text-gray-600">Cancelled</div>
                                    </div>
                                    <div className="bg-white rounded-lg shadow p-6">
                                        <div className="text-2xl font-bold text-gray-900">{members.length}</div>
                                        <div className="text-sm text-gray-600">Total Members</div>
                                    </div>
                                </div>

                                {/* Members List */}
                                <div className="bg-white rounded-lg shadow overflow-hidden">
                                    <div className="px-6 py-4 border-b border-gray-200">
                                        <h3 className="text-lg font-medium text-gray-900">All Members</h3>
                                    </div>
                                    {members.length === 0 ? (
                                        <div className="p-6 text-center">
                                            <div className="text-4xl mb-4">👥</div>
                                            <h4 className="text-lg font-semibold text-gray-900 mb-2">No Members Yet</h4>
                                            <p className="text-gray-600">Members will appear here once they purchase memberships!</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-gray-200">
                                            {members.map((member) => (
                                                <div key={member.id} className="p-6">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center space-x-3 mb-2">
                                                                <h4 className="text-lg font-medium text-gray-900">
                                                                    {member.email}
                                                                </h4>
                                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                                                                    {member.status}
                                                                </span>
                                                            </div>
                                                            <p className="text-gray-600 text-sm mb-1">
                                                                {member.tierName} Member
                                                            </p>
                                                            <div className="text-xs text-gray-500">
                                                                Joined: {new Date(member.joinedAt).toLocaleDateString()} •
                                                                Expires: {new Date(member.expiresAt).toLocaleDateString()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </main>

                {/* Tier Details Modal */}
                {selectedTier && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        Tier Management
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
                                    <div className="flex items-center space-x-3 mb-4">
                                        <h3 className="text-xl font-semibold text-gray-900">
                                            {selectedTier.name}
                                        </h3>
                                        <div className="text-2xl font-bold text-orange-600">
                                            ${selectedTier.price}/year
                                        </div>
                                        {selectedTier.isPopular && (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                                                POPULAR
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-gray-700 mb-4">
                                        {selectedTier.description}
                                    </p>

                                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                        <h4 className="font-semibold text-gray-900 mb-2">Benefits ({selectedTier.benefits.length})</h4>
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

                                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                        <h4 className="font-semibold text-gray-900 mb-2">Tier Information</h4>
                                        <div className="text-sm text-gray-600 space-y-1">
                                            <div>ID: {selectedTier.id}</div>
                                            <div>Created: {new Date(selectedTier.createdAt).toLocaleString()}</div>
                                            <div>Last Updated: {new Date(selectedTier.updatedAt).toLocaleString()}</div>
                                        </div>
                                    </div>

                                    <div className="flex space-x-3">
                                        <button
                                            onClick={() => deleteTier(selectedTier.id)}
                                            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                                        >
                                            Delete Tier
                                        </button>
                                        <button
                                            onClick={() => setSelectedTier(null)}
                                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}