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
  const position = [11.565514919297936, 104.89149013848618]; // Replace with your coordinates

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1 }}
      className="min-h-screen bg-white text-slate-700 selection:bg-slate-100 selection:text-slate-900 pb-24"
    >
      <div className="mx-auto max-w-5xl px-8 py-16 lg:py-24">
        <div>
          <h1 className="text-2xl font-bold">Contact Us</h1>
          <p>Would love to hear from you!</p>
        </div>

        {/* 2. Responsive Grid Container */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left Column: Your Form */}
          <div className="flex flex-col gap-6">
            <InputGroup>
              <InputGroupInput placeholder="Full Name" />
              <InputGroupAddon>
                <PersonStandingIcon />
              </InputGroupAddon>
            </InputGroup>

            <InputGroup>
              <InputGroupInput type="email" placeholder="Enter your email" />
              <InputGroupAddon>
                <MailIcon />
              </InputGroupAddon>
            </InputGroup>

            <InputGroup>
              <InputGroupInput placeholder="Phone number" />
              <InputGroupAddon>
                <PhoneCall />
              </InputGroupAddon>
            </InputGroup>

            <InputGroup>
              <InputGroupTextarea placeholder="Enter your message" />
              <InputGroupAddon align="block-end">
                <InputGroupText className="text-muted-foreground text-xs">
                  120 characters left
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>

            <button className="bg-slate-900 text-white py-2 px-4 rounded-md hover:bg-slate-800 transition">
              Send Message
            </button>
          </div>
          {/* Right Column: The Map */}
          <div className="h-[400px] w-full rounded-xl overflow-hidden border border-slate-200 shadow-sm z-0">
            <MapContainer
              center={position}
              zoom={13}
              scrollWheelZoom={false}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={position}>
                <Popup>
                  Bek Chan Market <br /> Anknoul, Kandal Province
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-3 pt-4 justify-center">
        {/* <SocialLink
          // href="https://github.com/juststudevpuc"
          icon={<Github size={30} color="#1877F2" />}
          label="GitHub"
        /> */}
        <SocialLink
          href="https://t.me/ictinfo2"
          icon={<Send size={30} color="#0088CC" />}
          label="Telegram"
        />
        {/* <SocialLink
          // href="http://linkedin.com/in/tep-panhasak-73420b390"
          icon={<Linkedin size={30} color="#0A66C2" />}
          label="Linkedin"
        /> */}
        <SocialLink
          // href="https://www.facebook.com/On.lySak2006"
          icon={<Facebook size={30} color="#1877F2" />}
          label="Facebook"
        />
        <SocialLink
          // href="https://www.facebook.com/On.lySak2006"
          icon={<Youtube size={30} color="#1877F2" />}
          label="Youtube"
        />
      </div>
    </motion.div>
  );
}
function SocialLink({ href, icon, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 text-slate-600 rounded-4xl text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-sky-950 hover:text-white hover:border-sky-950 transition-all duration-300"
    >
      {icon}
    </a>
  );
}
