'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import UserProfile from '@/components/UserProfile';

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminStore() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    imageUrl: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const result = await response.json();
        const productsArray = result.data || [];
        setProducts(productsArray);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async () => {
    if (!newProduct.name.trim() || !newProduct.price.trim()) return;

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProduct.name,
          price: parseFloat(newProduct.price),
          imageUrl: newProduct.imageUrl || undefined,
        }),
      });

      if (response.ok) {
        setNewProduct({ name: '', price: '', imageUrl: '' });
        setIsCreating(false);
        fetchProducts();
      }
    } catch (error) {
      console.error('Failed to create product:', error);
    }
  };

  const deleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchProducts();
        setSelectedProduct(null);
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute requiredRole="ADMIN">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading store management...</p>
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
                  🛍️ Store Admin
                </h1>
                <div className="ml-4 text-sm text-gray-600">
                  {products.length} products
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <a 
                  href="/store/public" 
                  target="_blank"
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  View Public Store →
                </a>
                <UserProfile />
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-2xl font-bold text-gray-900">{products.length}</div>
                <div className="text-sm text-gray-600">Total Products</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-2xl font-bold text-gray-900">
                  ${products.reduce((sum, p) => sum + p.price, 0).toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Total Inventory Value</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-2xl font-bold text-gray-900">
                  ${products.length > 0 ? (products.reduce((sum, p) => sum + p.price, 0) / products.length).toFixed(2) : '0.00'}
                </div>
                <div className="text-sm text-gray-600">Average Price</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-2xl font-bold text-gray-900">
                  {products.filter(p => p.imageUrl).length}
                </div>
                <div className="text-sm text-gray-600">With Images</div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Product Management</h2>
                <button
                  onClick={() => setIsCreating(true)}
                  className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
                >
                  Add New Product
                </button>
              </div>
            </div>

            {/* Create Product Form */}
            {isCreating && (
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Product</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name
                    </label>
                    <input
                      type="text"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g., Team Jersey, Basketball, Cap"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="29.99"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image URL (optional)
                    </label>
                    <input
                      type="url"
                      value={newProduct.imageUrl}
                      onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="https://example.com/product-image.jpg"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={createProduct}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                    >
                      Add Product
                    </button>
                    <button
                      onClick={() => {
                        setIsCreating(false);
                        setNewProduct({ name: '', price: '', imageUrl: '' });
                      }}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Products List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">All Products</h3>
              </div>
              {products.length === 0 ? (
                <div className="p-6 text-center">
                  <div className="text-4xl mb-4">🛍️</div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">No Products Yet</h4>
                  <p className="text-gray-600">Add your first product to get started!</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="p-6 hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedProduct(product)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                            {product.imageUrl ? (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <span className="text-white text-xl">🏀</span>
                            )}
                          </div>
                          <div>
                            <h4 className="text-lg font-medium text-gray-900">
                              {product.name}
                            </h4>
                            <div className="text-2xl font-bold text-orange-600">
                              ${product.price.toFixed(2)}
                            </div>
                            <div className="text-xs text-gray-500">
                              Created: {new Date(product.createdAt).toLocaleString()}
                            </div>
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
          </div>
        </main>

        {/* Product Details Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Product Management
                  </h2>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="mb-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                      {selectedProduct.imageUrl ? (
                        <img
                          src={selectedProduct.imageUrl}
                          alt={selectedProduct.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-white text-2xl">🏀</span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {selectedProduct.name}
                      </h3>
                      <div className="text-3xl font-bold text-orange-600">
                        ${selectedProduct.price.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Product Information</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>ID: {selectedProduct.id}</div>
                      <div>Created: {new Date(selectedProduct.createdAt).toLocaleString()}</div>
                      <div>Last Updated: {new Date(selectedProduct.updatedAt).toLocaleString()}</div>
                      <div>Image URL: {selectedProduct.imageUrl || 'No image'}</div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => deleteProduct(selectedProduct.id)}
                      className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                      Delete Product
                    </button>
                    <button
                      onClick={() => setSelectedProduct(null)}
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