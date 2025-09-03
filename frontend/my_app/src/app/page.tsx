export default function HomePage() {
  return (
    <section className="relative h-[400px] bg-cover bg-center bg-[url('https://static-assets.propertyfinder.com/images/homepage/hero/sa-desktop.jpg')]">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent"></div>

      {/* Title */}
      <h1 className="relative z-10 text-center text-white text-5xl pt-[80px] pb-[60px]">
        Find every home here
      </h1>

      {/* Search container */}
      <div className="relative z-10 bg-black/20 backdrop-blur-sm px-1 py-5 rounded-4xl mx-[170px]">
        {/* Toggle group */}
        <div className="flex items-center justify-center max-w-xl mx-auto mb-4">
          <button
            type="button"
            className="w-full border-l border-t border-b text-base font-medium rounded-l-4xl text-black bg-white hover:bg-gray-100 px-4 py-1"
          >
            Buy
          </button>
          <button
            type="button"
            className="w-full border text-base font-medium text-black bg-white hover:bg-gray-100 px-4 py-1"
          >
            Rent
          </button>
          <button
            type="button"
            className="w-full border-t border-b border-r text-base font-medium rounded-r-4xl text-black bg-white hover:bg-gray-100 px-4 py-1"
          >
            Commercial
          </button>
        </div>




        {/* Search input + dropdowns */}
        <div className="flex items-center w-full max-w-4xl mx-auto bg-white rounded-4xl shadow-md overflow-hidden">
          {/* Input field */}
          <input
            type="text"
            placeholder="City, community or building"
            className="flex-1 px-4 py-3 text-gray-700 focus:outline-none"
          />

          {/* First dropdown */}
          <div className="relative group">
            <button className="px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none">
              Property type ▼
            </button>
            <ul className="absolute left-0 mt-1 w-40 bg-white border rounded-lg shadow-lg hidden group-hover:block">
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Buy</li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Rent</li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Commercial</li>
            </ul>
          </div>

          {/* Second dropdown */}
          <div className="relative group">
            <button className="px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none">
              Beds & Baths ▼
            </button>
            <ul className="absolute left-0 mt-1 w-48 bg-white border rounded-lg shadow-lg hidden group-hover:block">
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Riyadh</li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Jeddah</li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Dammam</li>
            </ul>
          </div>

          {/* Search button */}
          <button className="px-6 py-3 bg-[#ea3934] text-white font-semibold hover:bg-[#97211e] transition">
            Search
          </button>
        </div>
      </div>
    </section>
  );
}
