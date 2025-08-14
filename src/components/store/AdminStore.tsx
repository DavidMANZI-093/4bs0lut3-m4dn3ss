'use client'

import { useState, useEffect } from 'react'

interface Product {
  id: string
  name: string
  price: number
  imageUrl: string | null
  createdAt: string
}

interface CartItem {
  id: string
  productId: string
  quantity: number
  product: Product
}

interface CartSummary {
  items: CartItem[]
  total: number
  itemCount: number
}

export default function AdminStore() {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartSummary | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  // Form state for creating/editing products
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 0,
    imageUrl: ''
  })

  useEffect(() => {
    fetchProducts()
    fetchCart()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      if (data.success) {
        setProducts(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    }
  }

  const fetchCart = async () => {
    try {
      const response = await fetch('/api/cart')
      const data = await response.json()
      if (data.success) {
        setCart(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error)
    }
  }

  const createProduct = async () => {
    if (!newProduct.name.trim() || newProduct.price <= 0) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      })
      const data = await response.json()
      if (data.success) {
        await fetchProducts()
        setNewProduct({ name: '', price: 0, imageUrl: '' })
        setShowCreateForm(false)
      }
    } catch (error) {
      console.error('Failed to create product:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      if (data.success) {
        await fetchProducts()
        setSelectedProduct(null)
      }
    } catch (error) {
      console.error('Failed to delete product:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">🛍️ Store Management Admin</h2>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Add Product
          </button>
          <div className="text-sm text-gray-600 flex items-center">
            Total Products: {products?.length || 0}
          </div>
        </div>
      </div>

      {/* Create Product Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New Product</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (optional)</label>
                <input
                  type="url"
                  value={newProduct.imageUrl}
                  onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={createProduct}
                  disabled={isLoading || !newProduct.name.trim() || newProduct.price <= 0}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  Add Product
                </button>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Product Management</h3>
              <button
                onClick={() => setSelectedProduct(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <img
                  src={selectedProduct.imageUrl || '/placeholder.jpg'}
                  alt={selectedProduct.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-xl">{selectedProduct.name}</h4>
                  <p className="text-2xl font-bold text-green-600 mt-1">
                    {formatPrice(selectedProduct.price)}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Created: {formatDate(selectedProduct.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => deleteProduct(selectedProduct.id)}
                  disabled={isLoading}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  Delete Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(products || []).map((product) => (
          <div key={product.id} className="bg-white rounded-lg card-shadow border border-gray-200 overflow-hidden">
            <img
              src={product.imageUrl || '/placeholder.jpg'}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-bold text-green-600">
                  {formatPrice(product.price)}
                </span>
              </div>
              <div className="text-xs text-gray-500 mb-3">
                Created: {formatDate(product.createdAt)}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedProduct(product)}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Manage
                </button>
                <button
                  onClick={() => deleteProduct(product.id)}
                  disabled={isLoading}
                  className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(!products || products.length === 0) && (
        <div className="text-center py-8">
          <div className="text-gray-500">No products yet. Add your first product!</div>
        </div>
      )}

      {/* Current Cart Summary (for admin reference) */}
      {cart && cart.items.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-yellow-900 mb-2">Current Cart Activity</h3>
          <p className="text-yellow-700">
            {cart.itemCount} items in cart, Total: {formatPrice(cart.total)}
          </p>
        </div>
      )}
    </div>
  )
}