// src/components/footer/ConditionalFooter.js
"use client"; // Make this component run on the client side only

import { Navbar } from './Navbar';
import { NavbarWhite } from './NavbarWhite';
import { usePathname } from 'next/navigation';

export default function ConditionalNavbar() {
  const pathname = usePathname();
  const footerHiddenPaths = ['/ai','/content-generation-ai'];

  // Show the footer only if the pathname is not in the list of paths to hide it
  return !footerHiddenPaths.includes(pathname) ? <NavbarWhite/> : <NavbarWhite/>;
}
