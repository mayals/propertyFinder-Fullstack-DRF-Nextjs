export default function HomePage() {
            return (
                <>
                <div className="relative h-[400px] bg-cover bg-center bg-[url('https://static-assets.propertyfinder.com/images/homepage/hero/sa-desktop.jpg')]">
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent"></div>

                  {/* Content on top */}
                  <div className="relative z-10">
                    <h1 className="text-center text-white text-5xl pt-[30px] pb-[60px]">
                      Find every home here
                    </h1>

                    <div className="flex items-center justify-center max-w-md mx-auto">
                      <button type="button" className="w-full border-l border-t border-b text-base font-medium rounded-l-md text-black bg-white hover:bg-gray-100 px-4 py-2">
                        Buy
                      </button>
                      <button type="button" className="w-full border text-base font-medium text-black bg-white hover:bg-gray-100 px-4 py-2">
                        Rent
                      </button>
                      <button type="button" className="w-full border-t border-b border-r text-base font-medium rounded-r-md text-black bg-white hover:bg-gray-100 px-4 py-2">
                        Commercial
                      </button>
                    </div>
                  </div>
                </div>
            </>)
}