import React from 'react'
import Image from 'next/image';





const Foter = () => {
  return (
        <>
            <section className='h-50 bg-[#f7f7fc]'>
                <section className='flex justify-between px-10 py-8'>
                    <div>
                        {/* <Link key="home" href="/" className="text-xl font-black text-gray-900"> */}
                            <Image
                                src="/logo-en.svg"
                                alt="property-finder-logo"
                                width={120}
                                height={120}
                                className="text-xl font-black text-gray-900"
                            />
                        {/* </Link> */}
                    </div> 
                    <div>
                        Property Finder
                        <div>About us</div>
                        <div>Careers</div>
                    </div>
                    <div>
                        Real estate professionals
                        <div>PF Expert</div>
                    </div>
                    {/* <div>
                        <Image
                                src="/logo-en.svg"
                                alt="property-finder-logo"
                                width={100}
                                height={100}
                                className="text-xl font-black text-gray-900"
                        />
                    </div> */}
                </section>
            </section>
        </>  
  )
}

export default Foter; 