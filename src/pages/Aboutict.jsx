export default function Aboutict() {
  return (
    <div className="">
        {/* Note: This section should likely be placed OUTSIDE your main 'max-w-7xl' container 
    so it spans the full width of the screen. */}

<section className="relative w-full h-[70vh] min-h-[500px] flex items-center overflow-hidden group">
  
  {/* --- BACKGROUND IMAGE --- */}
  {/* Added 'group-hover:scale-105' for a subtle, premium slow-zoom effect on hover */}
  <div className="absolute inset-0 w-full h-full">
    <img
      src="image/ict6.jpg"
      alt="ICT Center Campus"
      className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-105"
    />
  </div>

  {/* --- GRADIENT OVERLAY --- */}
  {/* Changed from flat color to a horizontal gradient. 
      Dark on the left for text readability, clear on the right to show the image. */}
  <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/60 to-transparent z-10" />

  {/* --- CONTENT CONTAINER --- */}
  {/* Aligned to the left within a standard max-width container */}
  <div className="relative z-20 w-full max-w-7xl mx-auto px-6 lg:px-8 h-full flex items-center">
    <div className="max-w-2xl">
      {/* Optional: A small accent line common in academic design */}
      <div className="h-1 w-20 bg-amber-600 mb-6"></div>
      
      <h1 className="text-white font-serif font-bold tracking-tight leading-tight drop-shadow-md
                     text-4xl sm:text-5xl md:text-6xl">
        ICT Center <br />
        <span className="block mt-2 font-sans font-light text-2xl sm:text-3xl md:text-4xl text-amber-400/90">
          of Technology
        </span>
      </h1>
      
      <p className="mt-6 text-lg leading-8 text-slate-200 max-w-xl font-light drop-shadow">
        Where tradition meets innovation. Shaping the future leaders of the digital world through excellence in education and research.
      </p>
    </div>
  </div>
</section>
    </div>
  );
}
