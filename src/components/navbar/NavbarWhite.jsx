'use client';
import React, { useState, useEffect, useRef } from 'react';
import '@styles/navbar/NavbarWhite.css';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '@public/Images/ai/nohover.svg'
import Hamburger from '@public/Images/navbar/hamburger.png';
import Close from '@public/Images/navbar/close.png';
import DefaultProfile from '@public/Images/navbar/default.svg'
import profile from '@public/Images/ai/profile.svg'
import bell from '@public/Images/ai/bell.svg'
import drop from '@public/Images/ai/drop.svg'
import { UserAuth } from '@context/AuthContext';
import { useRouter } from "next/navigation";


export const NavbarWhite = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const router = useRouter();

  const menuRef = useRef(null);
  const {user, logOut, loading} = UserAuth();


  const handleMenuClick = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const handleDropDown = () => {
    setHover(!hover);
  };

  const handleLogOut = async () => {
    try {
      console.log("Logut Working")
      await logOut();
      setHover(false);
      router.push("/");
      router.reload();
    } catch (error) {
      console.log(error);
    }
  };
  function handleNavigation(targetPath) {
    if (targetPath.startsWith("#")) {
      setMenuOpen(false);
      setHover(false);
      document.body.classList.remove("overflow");
      const element = document.querySelector(targetPath);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else if (targetPath.startsWith("http")) {
      window.location.href = targetPath;
    } else if (router.pathname !== targetPath) {
      setMenuOpen(false);
      setHover(false);
      document.body.classList.remove("overflow");
      router.push(targetPath);
    }
  }
  if (loading) {
    return null; // Or a loading spinner, if preferred
  }

  return (
    <div className='navbar'>
      <div className='navbar-container'>
        <div className='navbar-logo'>
          <Link href="/" onClick={handleLinkClick}>
            <Image className='prfec-logo' src={Logo} alt="Logo" />
          </Link>
        </div>

        {!loading && !user ? (
          <div className='navbar-contents'>
           <div className='navbar-contents-image'><Image src={bell} width={16} height={16} alt='notification'/></div> 
           <div className='navbar-contents-image' onClick={handleDropDown}>
                <Image src={profile} width={16} height={16} alt='profile'/>
                <Image src={drop} width={12} alt='dropdown'/>
           </div> 
           {hover &&
              <div className="navbar-profile-dropdown">
              <Link href="https://prfec.ai/login" className='navbar-signup' onClick={() => handleNavigation("/login")} >
               Login
              </Link>
              <Link href="https://prfec.ai/signup" className='navbar-login' onClick={() => handleNavigation("/Signup")} >
                Signup
              </Link>

            </div>
           }
          </div>
        ):
        (
          <div className='navbar-contents'>
          <div className='navbar-contents'>
           <div className='navbar-contents-image'><Image src={bell} width={16} height={16} alt='notification'/></div> 
           <div className='navbar-contents-image' onClick={handleDropDown}>
                <Image src={profile} width={16} height={16} alt='profile'/>
                <Image src={drop} width={12} alt='dropdown'/>
           </div> 
           {hover &&
              <div className="navbar-profile-dropdown">
                <p onClick={handleLogOut}>Logout</p>
            </div>
           }
          </div>

          </div>
        )}

        <div className='navbar-menu-icons'>
          {!menuOpen && <Image src={Hamburger} alt="Menu" onClick={handleMenuClick} />}
          {menuOpen && <Image src={Close} alt="Close" onClick={handleMenuClick} />}
        </div>

        {menuOpen && (
          <div ref={menuRef} className="navbar-menu">
            {!loading && !user ? (
              <>

              <Link href="https://prfec.ai/login" className='navbar-signup' onClick={handleLinkClick}>Login</Link>
              <Link href="https://prfec.ai/login" className='navbar-login' onClick={handleLinkClick}>Signup</Link>
              </>
            ) : (
              <>
                <p onClick={handleLogOut}>Logout</p>
            </>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
