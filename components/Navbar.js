import React, { useState } from "react";
import NavItem from "./NavItem";

const MENU_LIST = [
  { text: "Home", href: "/" },
  { text: "Getting Started", href: "/getting-started" },
  { text: "Application Performance", href: "/application-performance" },
  { text: "Application Security", href: "/application-security" },
  { text: "Observability", href: "/observability" },
  { text: "Management", href: "/management" },
  { text: "Video Streaming", href: "/video-streaming" },
];
const Navbar = () => {
  const [navActive, setNavActive] = useState(null);
  const [activeIdx, setActiveIdx] = useState(-1);

  return (
      <nav className='bg-purple-400 mb-8 py-4'>
        <div onClick={() => setNavActive(!navActive)} ></div>
        <div className={`${navActive ? "active" : ""} nav__menu-list flex justify-center text-white`}>
          {MENU_LIST.map((menu, idx) => (
            <div className='m-2'
              onClick={() => {
                setActiveIdx(idx);
                setNavActive(false);
              }}
              key={menu.text}
            >
              <NavItem active={activeIdx === idx} {...menu} />
            </div>
          ))}
        </div>
      </nav>
  );
};

export default Navbar;
