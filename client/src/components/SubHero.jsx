import React from 'react';

function SubHero() {
  return (
    <div className="bg-black p-10 px-6 md:px-28 lg:px-36 flex flex-col md:flex-row gap-10 justify-center items-center">
      <img 
        src="https://www.tubeguruji.com/_next/image?url=%2Fpanda.png&w=128&q=75" 
        alt="panda" 
        className="w-40 h-40 bg-transparent" 
      />
      <div>
        <h2 className="font-bold text-[29px] text-white">
          Welcome to <span className="text-primary">Projects</span> Academy
        </h2>
        <h2 className="text-gray-500">
          Explore, Learn and Build All Real Life Projects
        </h2>
      </div>
    </div>
  );
}

export default SubHero;
