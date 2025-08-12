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

export default function ProductCatalog() {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartSummary | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showCart, setShowCart] = useState(false)

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

  const addToCart = async (productId: string, quantity: number = 1) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity }),
      })
      const data = await response.json()
      if (data.success) {
        await fetchCart() // Refresh cart
      }
    } catch (error) {
      console.error('Failed to add to cart:', error)
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">🛍️ Team Merchandise Store</h2>
        <button
          onClick={() => setShowCart(!showCart)}
          className="relative bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          View Cart
          {cart && cart.itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
              {cart.itemCount}
            </span>
          )}
        </button>
      </div>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-blue-900">Shopping Cart</h3>
            <button
              onClick={() => setShowCart(false)}
              className="text-blue-600 hover:text-blue-800"
            >
              ✕
            </button>
          </div>
          
          {!cart || cart.items.length === 0 ? (
            <p className="text-blue-700">Your cart is empty</p>
          ) : (
            <div className="space-y-3">
              {cart.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-white p-3 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.product.imageUrl || '/placeholder.jpg'}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <div className="font-medium text-gray-900">{item.product.name}</div>
                      <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                    </div>
                  </div>
                  <div className="font-semibold text-gray-900">
                    {formatPrice(item.product.price * item.quantity)}
                  </div>
                </div>
              ))}
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between items-center text-lg font-bold text-blue-900">
                  <span>Total:</span>
                  <span>{formatPrice(cart.total)}</span>
                </div>
              </div>
            </div>
          )}
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
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-green-600">
                  {formatPrice(product.price)}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => addToCart(product.id, 1)}
                    disabled={isLoading}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(!products || products.length === 0) && (
        <div className="text-center py-8">
          <div className="text-gray-500">Loading products...</div>
        </div>
      )}
    </div>
  )
}