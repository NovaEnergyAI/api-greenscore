'use client';

import {
  KeyIcon,
  PlusIcon,
  ClipboardDocumentCheckIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

// Map of links to display in the side navigation.
const links = [
  { name: 'Authenticate', href: '/dashboard/authenticate', icon: KeyIcon },
  { name: 'Add Asset', href: '/dashboard/add-asset', icon: PlusIcon },
  { name: 'Get All Assets', href: '/dashboard/get-assets', icon: ClipboardDocumentCheckIcon },
  { name: 'Attestations', href: '/dashboard/attestations', icon: ClipboardDocumentCheckIcon },
  // { name: 'Add Template', href: '/dashboard/add-template', icon: PlusIcon },
  // { name: 'Get Templates', href: '/dashboard/get-templates', icon: Squares2X2Icon },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <div className="nav-links">
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx('nav-link', {
              'nav-link--active': pathname === link.href,
            })}
          >
            <LinkIcon className="nav-link__icon" />
            <p className="nav-link__text">{link.name}</p>
          </Link>
        );
      })}
    </div>
  );
}
