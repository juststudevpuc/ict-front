import { useState, useRef } from "react"; // Import useRef!
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ... imports remain the same

export function NavDropdown({ item }) {
  const [open, setOpen] = useState(false);
  const timerRef = useRef(null);

  const handleMouseEnter = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => {
      setOpen(false);
    }, 150); // 150ms delay is the sweet spot
  };

  return (
    <div
      className="relative flex items-center h-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* STEP 1: modal={false} is CRITICAL. 
         It prevents the 'focus lock' that causes flickering on hover.
      */}
      <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
        <DropdownMenuTrigger 
          className="flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.15em] text-slate-600 hover:text-slate-900 outline-none py-4"
        >
          {item.label}
          <ChevronDown
            className={`h-3 w-3 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </DropdownMenuTrigger>

        {/* STEP 2: The "Bridge". 
           sideOffset={-5} pulls the menu UP by 5 pixels to overlap the trigger.
           This ensures your mouse never hits a "dead zone".
        */}
        <DropdownMenuContent 
            align="start" 
            sideOffset={-5} 
            className="w-48 p-2 bg-white/95 backdrop-blur-md mt-2"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
          {item.children.map((child) => (
            <DropdownMenuItem key={child.to} asChild>
              <Link
                to={child.to}
                className="w-full cursor-pointer text-xs font-medium uppercase tracking-wider block py-1"
              >
                {child.label}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}