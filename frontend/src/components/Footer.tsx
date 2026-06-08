import { Link } from 'react-router-dom';
import { CarIcon } from './icons';

const COLUMNS = [
  {
    title: 'Quick Links',
    links: [
      ['Home', '/'],
      ['Browse Cars', '/cars'],
      ['List Your Car', '/register'],
      ['My Bookings', '/bookings'],
    ],
  },
  {
    title: 'Resources',
    links: [
      ['Help Center', '/'],
      ['Terms of Service', '/'],
      ['Privacy Policy', '/'],
      ['Insurance', '/'],
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 text-lg font-extrabold text-gray-900">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 text-white">
              <CarIcon width={16} height={16} />
            </span>
            Alpha<span className="text-brand-600">Rentals</span>
          </div>
          <p className="mt-3 text-sm text-gray-500">
            Premium self-drive car rentals across India — luxury and everyday vehicles for every
            journey, with transparent GST pricing and UPI payments.
          </p>
          <div className="mt-4 flex gap-3 text-gray-400">
            <span>📘</span>
            <span>📸</span>
            <span>🐦</span>
            <span>✉️</span>
          </div>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">{col.title}</h4>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              {col.links.map(([label, to]) => (
                <li key={label}>
                  <Link to={to} className="hover:text-brand-600">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Contact</h4>
          <ul className="mt-4 space-y-2 text-sm text-gray-600">
            <li>Hi-Tech City Road</li>
            <li>Hyderabad, Telangana 500081</li>
            <li>+91 90000 00000</li>
            <li>support@alpharentals.in</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-100">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-gray-500 sm:flex-row">
          <span>© {new Date().getFullYear()} Alpha Rentals. All rights reserved.</span>
          <span className="flex gap-4">
            <Link to="/" className="hover:text-brand-600">Privacy</Link>
            <Link to="/" className="hover:text-brand-600">Terms</Link>
            <Link to="/" className="hover:text-brand-600">Cookies</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
