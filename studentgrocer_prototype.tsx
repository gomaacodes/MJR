import React, { useState, useMemo } from 'react';

// --- MOCK DATA (Based on provided Database Schema) ---
const MOCK_PRODUCTS = [
  { id: 1, name: "M&M's Peanut Chocolate Candies", category: "Snacks", weight: "125g", image: "https://placehold.co/200x200/f59e0b/ffffff?text=M%26Ms", barcode: "5000159461122" },
  { id: 2, name: "Relentless Origin Energy Drink", category: "Beverages", volume: "500ml", image: "https://placehold.co/200x200/3b82f6/ffffff?text=Relentless", barcode: "5060166690000" },
  { id: 3, name: "Meal Deal: Sandwich + Snack + Drink", category: "Meal Deals", image: "https://placehold.co/200x200/10b981/ffffff?text=Meal+Deal", barcode: "MEALDEAL1" }
];

const MOCK_BRANCHES = [
  { id: 101, storeName: "Sainsbury's Local", branchName: "Buchanan Bus Station", distance: "0.1 mi", lat: 55.864, lng: -4.249, hours: "07:00 - 23:00" },
  { id: 102, storeName: "Sainsbury's", branchName: "Buchanan Galleries", distance: "0.4 mi", lat: 55.862, lng: -4.253, hours: "08:00 - 20:00" },
  { id: 103, storeName: "Tesco Express", branchName: "Sauchiehall St", distance: "0.6 mi", lat: 55.865, lng: -4.257, hours: "06:00 - 23:00" }
];

const MOCK_PRODUCT_BRANCHES = [
  // M&Ms Prices
  { id: 1, productId: 1, branchId: 101, price: 1.75, memberPrice: null, available: true, restock: "IN_STOCK", offers: ["Student ID: 10% Off"] },
  { id: 2, productId: 1, branchId: 102, price: 1.50, memberPrice: 1.25, available: true, restock: "IN_STOCK", offers: ["Nectar Card Price: £1.25"] },
  { id: 3, productId: 1, branchId: 103, price: 1.60, memberPrice: 1.60, available: false, restock: "TOMORROW", offers: [] },
  // Relentless Prices
  { id: 4, productId: 2, branchId: 101, price: 1.00, memberPrice: null, available: true, restock: "IN_STOCK", offers: ["Deliveroo Plus: Free Delivery"] },
  { id: 5, productId: 2, branchId: 102, price: 1.30, memberPrice: null, available: true, restock: "IN_STOCK", offers: [] }
];

// --- ICONS (Inline SVGs for portability) ---
const SearchIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const ListIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
const BellIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;
const ReceiptIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const MapPinIcon = () => <svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const ClockIcon = () => <svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const TagIcon = () => <svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>;


export default function App() {
  const [activeTab, setActiveTab] = useState('search');
  
  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-gray-50 shadow-2xl relative overflow-hidden font-sans">
      {/* Header */}
      <header className="bg-indigo-600 text-white p-4 pt-8 rounded-b-2xl shadow-md z-10">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight">MJR</h1>
            <p className="text-indigo-200 text-sm flex items-center mt-1">
              <MapPinIcon /> Glasgow, G1 (Near Buchanan)
            </p>
          </div>
          <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center font-bold text-lg border-2 border-indigo-300">
            JS
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-24 p-4">
        {activeTab === 'search' && <SearchTab />}
        {activeTab === 'lists' && <ListsTab />}
        {activeTab === 'alerts' && <AlertsTab />}
        {activeTab === 'receipts' && <ReceiptsTab />}
      </main>

      {/* Bottom Navigation */}
      <nav className="absolute bottom-0 w-full bg-white border-t border-gray-200 flex justify-around p-3 pb-6 z-20">
        <NavButton icon={<SearchIcon />} label="Search" active={activeTab === 'search'} onClick={() => setActiveTab('search')} />
        <NavButton icon={<ListIcon />} label="Lists" active={activeTab === 'lists'} onClick={() => setActiveTab('lists')} />
        <NavButton icon={<BellIcon />} label="Alerts" active={activeTab === 'alerts'} onClick={() => setActiveTab('alerts')} badge="3" />
        <NavButton icon={<ReceiptIcon />} label="Savings" active={activeTab === 'receipts'} onClick={() => setActiveTab('receipts')} />
      </nav>
    </div>
  );
}

// --- TAB COMPONENTS ---

function SearchTab() {
  const [query, setQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Handle Search Input
  const handleSearch = (e) => {
    setQuery(e.target.value);
  };

  const searchResults = query 
    ? MOCK_PRODUCTS.filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
    : MOCK_PRODUCTS;

  return (
    <div className="animate-fade-in flex flex-col h-full">
      {/* Search Bar */}
      <div className="relative mb-6">
        <input 
          type="text" 
          value={query}
          onChange={handleSearch}
          placeholder="Search products, brands, or meal deals..." 
          className="w-full bg-white border border-gray-300 rounded-xl py-3 pl-10 pr-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
        />
        <div className="absolute left-3 top-3.5 text-gray-400">
          <SearchIcon />
        </div>
      </div>

      {selectedProduct ? (
        <div>
          <button 
            onClick={() => setSelectedProduct(null)}
            className="mb-4 text-indigo-600 text-sm font-bold flex items-center gap-1 hover:text-indigo-800"
          >
            ← Back to search results
          </button>
          <ProductComparison product={selectedProduct} />
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <h3 className="font-bold text-gray-700 mb-2">Products</h3>
          {searchResults.length > 0 ? (
            searchResults.map(product => (
              <div 
                key={product.id} 
                onClick={() => setSelectedProduct(product)}
                className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <img src={product.image} alt={product.name} className="w-16 h-16 rounded-lg object-cover bg-gray-100" />
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">{product.name}</h4>
                  <p className="text-xs text-gray-500 mt-1">{product.category}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 mt-10">
              <p>No products found for "{query}".</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ProductComparison({ product }) {
  // Join branches with prices for this product
  const branchesWithPrices = useMemo(() => {
    return MOCK_PRODUCT_BRANCHES
      .filter(pb => pb.productId === product.id)
      .map(pb => {
        const branch = MOCK_BRANCHES.find(b => b.id === pb.branchId);
        return { ...pb, branch };
      })
      .sort((a, b) => {
        // Sort by price, then by distance
        const priceA = a.memberPrice || a.price;
        const priceB = b.memberPrice || b.price;
        if (priceA !== priceB) return priceA - priceB;
        return parseFloat(a.branch.distance) - parseFloat(b.branch.distance);
      });
  }, [product]);

  return (
    <div className="flex flex-col gap-4 pb-4">
      {/* Product Header */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
        <img src={product.image} alt={product.name} className="w-20 h-20 rounded-lg object-cover bg-gray-100" />
        <div>
          <h2 className="font-bold text-gray-800 leading-tight">{product.name}</h2>
          <p className="text-sm text-gray-500 mt-1">{product.category} • {product.weight || product.volume}</p>
        </div>
      </div>

      <div className="flex justify-between items-end mt-2">
        <h3 className="font-bold text-gray-700">Compare Nearby Stores</h3>
        <span className="text-xs text-gray-500">Sorted by lowest price</span>
      </div>

      {/* Branch List */}
      <div className="flex flex-col gap-3">
        {branchesWithPrices.map((item) => (
          <div key={item.id} className={`bg-white rounded-xl p-4 shadow-sm border ${item.available ? 'border-gray-200' : 'border-red-200 opacity-75'} relative overflow-hidden`}>
            
            {/* Best Price Badge */}
            {item === branchesWithPrices[0] && item.available && (
              <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                BEST DEAL
              </div>
            )}

            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-bold text-gray-800">{item.branch.storeName}</h4>
                <p className="text-sm text-gray-600 flex items-center mt-0.5">
                  <MapPinIcon /> {item.branch.branchName} <span className="mx-1 text-gray-300">•</span> <span className="font-medium text-indigo-600">{item.branch.distance}</span>
                </p>
                <p className="text-xs text-gray-500 flex items-center mt-1">
                  <ClockIcon /> {item.branch.hours}
                </p>
              </div>

              <div className="text-right">
                {item.memberPrice ? (
                  <>
                    <div className="text-xs text-gray-400 line-through">£{item.price.toFixed(2)}</div>
                    <div className="text-xl font-bold text-indigo-700">£{item.memberPrice.toFixed(2)}</div>
                  </>
                ) : (
                  <div className="text-xl font-bold text-gray-800 mt-2">£{item.price.toFixed(2)}</div>
                )}
              </div>
            </div>

            {/* Availability & Offers Section */}
            <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-2 items-center justify-between">
              <div>
                {item.available ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    In Stock
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                    Out of Stock (Restocks {item.restock.toLowerCase()})
                  </span>
                )}
              </div>

              {item.offers.length > 0 && (
                <div className="flex gap-1 flex-wrap justify-end">
                  {item.offers.map((offer, idx) => (
                    <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-100 text-yellow-800 border border-yellow-200">
                      <TagIcon /> {offer}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- PLACEHOLDER TABS (To show complete app vision) ---

function ListsTab() {
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">My Grocery Lists</h2>
        <button className="bg-indigo-100 text-indigo-700 text-sm font-bold px-3 py-1.5 rounded-lg hover:bg-indigo-200 transition-colors">+ New List</button>
      </div>
      
      <div className="flex gap-2 mb-4">
        <span className="bg-indigo-600 text-white text-xs px-3 py-1.5 rounded-full font-bold cursor-pointer">Weekly</span>
        <span className="bg-white border border-gray-300 text-gray-600 text-xs px-3 py-1.5 rounded-full font-bold cursor-pointer hover:bg-gray-50">One-Off</span>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4 relative">
        <div className="absolute top-4 right-4 text-indigo-600 text-sm font-bold cursor-pointer hover:underline">Edit</div>
        <div className="flex justify-between items-center border-b pb-3 mb-3 pr-10">
          <h3 className="font-bold text-lg">Weekly Flat Shop</h3>
          <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded font-bold">12 items</span>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">Compare total list price across nearby stores to find the cheapest basket.</p>
        
        <div className="space-y-3">
          {/* Split Basket Option */}
          <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg border border-indigo-200">
            <div>
              <p className="font-bold text-indigo-800 flex items-center gap-1">
                Split Basket (Max Savings) <span className="text-sm">🌟</span>
              </p>
              <p className="text-xs text-indigo-600 mt-1">Sainsbury's Bus Station + Tesco Express</p>
            </div>
            <p className="font-bold text-lg text-indigo-800">£22.10</p>
          </div>

          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div>
              <p className="font-bold text-gray-800">Sainsbury's Buchanan</p>
              <p className="text-xs text-gray-500">0.4 miles away • 12/12 items in stock</p>
            </div>
            <p className="font-bold text-lg text-gray-800">£24.50</p>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div>
              <p className="font-bold text-gray-800">Tesco Express Sauchiehall</p>
              <p className="text-xs text-gray-500">0.6 miles away • 11/12 items in stock</p>
            </div>
            <p className="font-bold text-lg text-gray-800">£26.80</p>
          </div>
        </div>
        
        <button className="w-full mt-4 bg-indigo-600 text-white font-bold py-2 rounded-lg hover:bg-indigo-700 transition-colors">
          View Full Comparison
        </button>
      </div>
    </div>
  );
}

function AlertsTab() {
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Local Alerts</h2>
        <span className="text-sm text-indigo-600 font-bold">Filters</span>
      </div>
      
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 rounded-r-lg shadow-sm">
        <div className="flex">
          <div className="flex-shrink-0">
            <TagIcon />
          </div>
          <div className="ml-3">
            <p className="text-sm font-bold text-yellow-800">Yellow Sticker Alert!</p>
            <p className="text-sm text-yellow-700 mt-1">
              Sainsbury's Buchanan Bus Station just marked down Sandwiches to 50p. (Expiring today)
            </p>
            <p className="text-xs text-yellow-600 mt-2 font-medium">0.1 miles away • Reported 5 mins ago</p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4 rounded-r-lg shadow-sm">
        <div className="flex">
          <div className="flex-shrink-0">
            <TagIcon />
          </div>
          <div className="ml-3">
            <p className="text-sm font-bold text-blue-800">New Deliveroo Offer</p>
            <p className="text-sm text-blue-700 mt-1">
              Co-op Hope Street is offering £5 off orders over £15 for the next 2 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReceiptsTab() {
  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Savings & Receipts</h2>
      
      <div className="mb-6">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-xl text-white shadow-lg text-center">
          <p className="text-indigo-100 font-medium">Weekly Savings</p>
          <p className="text-5xl font-bold mt-2 mb-1">£12.40</p>
          <p className="text-xs text-indigo-200">vs. standard store prices</p>
        </div>
      </div>

      <h3 className="font-bold text-gray-700 mb-3">Recent Uploads</h3>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-3 border-b flex justify-between items-center">
          <div>
            <p className="font-bold text-sm">Sainsbury's Buchanan</p>
            <p className="text-xs text-gray-500">Today, 14:30</p>
          </div>
          <p className="font-bold text-gray-800 text-sm">Verified</p>
        </div>
        <div className="p-3 flex justify-between items-center">
          <div>
            <p className="font-bold text-sm">Tesco Express</p>
            <p className="text-xs text-gray-500">Yesterday, 18:15</p>
          </div>
          <p className="font-bold text-gray-800 text-sm">Verified</p>
        </div>
      </div>
      
      <button className="w-full mt-6 bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-colors shadow-md flex items-center justify-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        Scan Receipt
      </button>
    </div>
  );
}

// --- UTILITIES ---

function NavButton({ icon, label, active, onClick, badge }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-full relative ${active ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
    >
      <div className="relative">
        {icon}
        {badge && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {badge}
          </span>
        )}
      </div>
      <span className="text-[10px] mt-1 font-medium">{label}</span>
    </button>
  );
}