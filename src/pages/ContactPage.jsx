import { Label } from "@/components/ui/label";
import {
  Facebook,
  Github,
  Linkedin,
  LinkIcon,
  MailIcon,
  PersonStandingIcon,
  PhoneCall,
  Send,
  Youtube,
} from "lucide-react";
import { motion } from "framer-motion";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";

// 1. Import Map Components and CSS
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons not showing in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function ContactPage() {
  const position = [11.565521516446795, 104.89173724305618]; // ICT Center Coordinates

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="min-h-screen bg-slate-50 text-slate-700 selection:bg-[#003868] selection:text-white pb-24"
    >
      <div className="mx-auto max-w-7xl px-6 py-16 lg:py-24">
        
        {/* --- HEADER SECTION --- */}
        <div className="mb-16 text-center px-4">
          <span className="text-amber-600 font-bold uppercase tracking-[0.25em] text-xs block mb-3">
            Get in Touch
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-[#003868] uppercase tracking-tight mb-6">
            Contact Us
          </h1>
          <div className="w-16 h-1 bg-amber-500 mx-auto mb-6"></div>
          <p className="text-slate-500 text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-medium">
            We would love to hear from you. Whether you have questions about our
            courses, admissions, or campus facilities, our administrative team
            is ready to assist you.
          </p>
        </div>

        {/* --- FORM & MAP GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Left Column: The Formal Inquiry Form */}
          <div className="bg-white border border-slate-300 p-8 shadow-sm relative flex flex-col gap-6">
            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-[#003868]"></div>
            
            <h3 className="text-lg font-black text-[#003868] uppercase tracking-widest mb-2 border-b border-slate-200 pb-4">
              Submit an Inquiry
            </h3>

            <div className="flex flex-col gap-5">
              <InputGroup className="rounded-none border-slate-300 focus-within:border-[#003868] shadow-sm">
                <InputGroupInput placeholder="Full Name" className="rounded-none text-sm border-none" />
                <InputGroupAddon className="bg-slate-50 border-l border-slate-300 rounded-none">
                  <PersonStandingIcon size={18} className="text-slate-500" />
                </InputGroupAddon>
              </InputGroup>

              <InputGroup className="rounded-none border-slate-300 focus-within:border-[#003868] shadow-sm">
                <InputGroupInput type="email" placeholder="Email Address" className="rounded-none text-sm border-none" />
                <InputGroupAddon className="bg-slate-50 border-l border-slate-300 rounded-none">
                  <MailIcon size={18} className="text-slate-500" />
                </InputGroupAddon>
              </InputGroup>

              <InputGroup className="rounded-none border-slate-300 focus-within:border-[#003868] shadow-sm">
                <InputGroupInput placeholder="Phone Number" className="rounded-none text-sm border-none" />
                <InputGroupAddon className="bg-slate-50 border-l border-slate-300 rounded-none">
                  <PhoneCall size={18} className="text-slate-500" />
                </InputGroupAddon>
              </InputGroup>

              <InputGroup className="rounded-none border-slate-300 focus-within:border-[#003868] shadow-sm">
                <InputGroupTextarea placeholder="Enter your message..." className="rounded-none text-sm min-h-[120px] border-none" />
                <InputGroupAddon align="block-end" className="bg-slate-50 border-t border-slate-300 rounded-none">
                  <InputGroupText className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    120 characters left
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>

              <button className="mt-2 w-full bg-[#003868] hover:bg-[#002b50] text-white py-4 px-6 rounded-none font-black uppercase tracking-[0.15em] text-xs transition-colors shadow-sm">
                Send Message
              </button>
            </div>
          </div>

          {/* Right Column: The Framed Map */}
          <div className="h-[450px] lg:h-auto min-h-[450px] w-full bg-slate-200 p-2 border border-slate-300 shadow-sm relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-amber-500 z-10"></div>
            <div className="h-full w-full relative z-0 border border-slate-300 bg-white">
              <MapContainer
                center={position}
                zoom={14}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position}>
                  <Popup>
                    <strong className="text-[#003868] uppercase font-bold tracking-wider text-xs block mb-1">
                      ICT Center
                    </strong>
                    Kampuchea Krom Blvd, <br /> Phnom Penh
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </div>

        {/* --- OFFICIAL CHANNELS (SOCIALS) --- */}
        <div className="mt-20 pt-10 border-t border-slate-300 max-w-4xl mx-auto text-center w-full">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-8">
            Official Channels
          </p>
          <div className="flex flex-wrap gap-6 justify-center">
            <SocialLink
              href="https://t.me/ictinfo2"
              icon={<Send size={20} color="#0088CC" />}
              label="Telegram"
              className="border-slate-300 hover:border-[#0088CC] hover:bg-blue-50/50 text-[#0088CC]"
            />
            <SocialLink
              href="#"
              icon={<Facebook size={20} color="#1877F2" />}
              label="Facebook"
              className="border-slate-300 hover:border-[#1877F2] hover:bg-blue-50/50 text-[#1877F2]"
            />
            <SocialLink
              href="#"
              icon={<Youtube size={20} color="#FF0000" />}
              label="Youtube"
              className="border-slate-300 hover:border-[#FF0000] hover:bg-red-50/50 text-[#FF0000]"
            />
          </div>
        </div>

      </div>
    </motion.div>
  );
}

// 2. Updated SocialLink Component
function SocialLink({ href, icon, label, className }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      // Merging the base classic styles with the dynamic color classes passed as props
      className={`flex items-center gap-3 px-8 py-4 border bg-white shadow-sm font-black text-xs uppercase tracking-widest transition-all rounded-none ${className}`}
    >
      {icon}
      <span className="text-slate-700">{label}</span>
    </a>
  );
}