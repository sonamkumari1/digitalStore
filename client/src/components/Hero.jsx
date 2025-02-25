import { Button } from '@/components/ui/button'
import React from 'react'
import { useNavigate } from 'react-router-dom'

function Hero() {
  const navigate = useNavigate();

  return (
    <div className="bg-black p-10 px-6 md:px-28 lg:px-36 gap-10 pt-16">
      <div className="flex flex-col-reverse md:grid md:grid-cols-2 gap-10">
        
        {/* ✅ Left Section (Text) */}
        <div className="pt-6 md:pt-12 text-center md:text-left">
          <h2 className="font-bold text-4xl md:text-6xl text-white mt-5 mb-4 pb-3 leading-tight">
            Speed Up your <br className="hidden md:block" /> Creative workflow
          </h2>
          <p className="text-gray-200 mt-3 md:mt-5 mb-4 text-md">
            Join a growing family of 43,436 designers, creators, and makers around the world.
          </p>

          <div className="flex justify-center md:justify-start gap-5 mt-6 md:mt-8">
            <Button className="bg-yellow-500" onClick={() => navigate('/explore')}>Explore</Button>
            <Button className="bg-red-600" onClick={() => navigate('/dashboard')}>Sell</Button>
          </div>
        </div>

        {/* ✅ Right Section (Image) */}
        <div className="flex items-center justify-center">
          <img 
            className="w-64 h-64 md:w-96 md:h-96" 
            src="https://png.pngtree.com/png-vector/20240819/ourmid/pngtree-retro-computer-clipart-illustration-vintage-technology-png-image_13545687.png" 
            alt="Retro Computer"
          />
        </div>

      </div>
    </div>
  )
}

export default Hero;
