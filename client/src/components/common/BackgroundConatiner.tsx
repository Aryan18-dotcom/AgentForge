interface BackgroundContainerProps {
  children?: React.ReactNode;
}

export default function BackgroundContainer({ children }: BackgroundContainerProps) {

  return (
    <div className="min-h-screen w-full bg-[#0f131d] relative flex flex-col justify-start items-center overflow-x-hidden select-none">

      {/* AMBIENT SOFT RADIAL BACKGROUND GLOWS */}
      <div
        className="absolute inset-0 bg-[radial-gradient(#334155_1.6px,transparent_1.6px)] bg-[size:24px_24px] opacity-20 pointer-events-none"
      />

      {/* BOUNDARY ALIGNMENT LAYOUT ANCHOR */}
      <div className="absolute top-0 bottom-0 w-full max-w-6xl mx-auto px-6 md:px-12 pointer-events-none hidden md:block z-10">
        <div className="w-full h-full relative">

          {/* LEFT STRIPE COLUMN */}
          <div
            className="absolute -left-8 top-0 bottom-0 w-8 opacity-40 border-x-2 border-neutral-600 bg-[linear-gradient(135deg,#4a4455_25%,transparent_25%,transparent_50%,#4a4455_50%,#4a4455_75%,transparent_75%,transparent)] bg-[size:10px_10px]"
          />

          {/* RIGHT STRIPE COLUMN */}
          <div
            className="absolute -right-8 top-0 bottom-0 w-8 opacity-40 border-x-2 border-neutral-600 bg-[linear-gradient(45deg,#4a4455_25%,transparent_25%,transparent_50%,#4a4455_50%,#4a4455_75%,transparent_75%,transparent)] bg-[size:10px_10px]"
          />

        </div>
      </div>

      {/* CENTRALIZED MAIN WORKSPACE CONTAINER */}
      <div className="w-full max-w-6xl mx-auto px-6 md:px-12 py-8 relative z-20 flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}