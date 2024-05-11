'use client';

import Link from 'next/link';
import NavLinks from './navlinks';
import NovaLogo from './novalogo';
import { PowerIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function SideNav() {
  const router = useRouter(); 

  const handleSignOut = () => {
    router.push('/');

  }
  return (
    <div className="side-nav">
      <Link href="/">
        <div className="side-nav__logo-container">
        <Image
        src="/NovaLogo.png"
        width={250}
        height={70}
        alt='Nova Energy Logo'
      />          
        </div>
      </Link>
      <div className="side-nav__content">
        <NavLinks />
        <form onSubmit={(e) => e.preventDefault}>
          <button type="button" onClick={handleSignOut} className="side-nav__signout-button">
            <PowerIcon className="icon" />
            <div className="side-nav__signout-text">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}
