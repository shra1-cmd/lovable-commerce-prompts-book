
import React from 'react';
import Navigation from '../components/Navigation';
import { ShoppingCart, ArrowRight, Headphones, Home as HomeIcon, Watch } from 'lucide-react';
import { sampleProducts } from '../data/products';
import { Link } from 'react-router-dom';

const Home = () => {
  const featuredProducts = sampleProducts.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative h-[80vh] bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(59,130,246,0.3),transparent_50%)]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-center w-full">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
              Discover Tomorrow's
              <span className="block bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                Essentials
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Curated tech gear & lifestyle products for the future
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/products"
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-violet-500 text-white font-semibold rounded-lg shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-all duration-300 hover:scale-105"
              >
                Shop Now
                <ArrowRight className="inline-block ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-300 hover:scale-105">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products Carousel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Featured Products</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-violet-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProducts.map((product, index) => (
            <div 
              key={product.id}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:scale-105 overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative h-64 bg-gray-100 overflow-hidden">
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
                    ${product.price}
                  </span>
                  <button className="group/btn relative px-4 py-2 bg-gradient-to-r from-blue-500 to-violet-500 text-white rounded-lg shadow-[0_0_10px_rgba(59,130,246,0.3)] hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all duration-300 hover:scale-105">
                    <ShoppingCart className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-sm opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-now">
                      Grab it now →
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Quick Links */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Shop by Category</h2>
            <p className="text-gray-300 text-lg">Jump to your favorite products</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Headphones, name: "Headphones", count: "12 Products" },
              { icon: HomeIcon, name: "Smart Home", count: "8 Products" },
              { icon: Watch, name: "Accessories", count: "15 Products" }
            ].map((category, index) => (
              <div 
                key={category.name}
                className="group relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-violet-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <category.icon className="h-16 w-16 text-blue-400 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-xl font-semibold text-white mb-2">{category.name}</h3>
                <p className="text-gray-300">{category.count}</p>
                <div className="mt-4 text-blue-400 group-hover:text-blue-300 transition-colors">
                  <span className="text-sm">Jump to category →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Subscription */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Join Our Community</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Get the latest updates on new products and exclusive offers
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input 
              type="email" 
              placeholder="Enter your email…" 
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
            <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-violet-500 text-white font-semibold rounded-lg shadow-[0_0_10px_rgba(59,130,246,0.3)] hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all duration-300 hover:scale-105 animate-pulse">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
