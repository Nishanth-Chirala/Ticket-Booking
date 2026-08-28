import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';

const Footer = () => {
  return (
    <footer className="mt-24 w-full border-t border-white/5 bg-surface/40 px-6 pt-14 text-zinc-400 md:mt-32 md:px-16 lg:px-36">
      <div className="flex w-full flex-col justify-between gap-12 border-b border-white/10 pb-12 md:flex-row md:gap-16">
        <div className="md:max-w-sm">
          <img alt="QuickShow" className="h-10" src={assets.logo} />
          <p className="mt-5 text-sm leading-relaxed text-zinc-400">
            Book cinema tickets in seconds. Discover what&apos;s playing, pick
            your seats, and enjoy the show — all in one place.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <img
              src={assets.googlePlay}
              alt="Google Play"
              className="h-9 w-auto opacity-90 transition hover:opacity-100"
            />
            <img
              src={assets.appStore}
              alt="App Store"
              className="h-9 w-auto opacity-90 transition hover:opacity-100"
            />
          </div>
        </div>

        <div className="flex flex-1 items-start gap-16 md:justify-end md:gap-24">
          <div>
            <h2 className="mb-4 text-sm font-semibold tracking-wide text-white uppercase">
              Company
            </h2>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="transition hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <a href="#" className="transition hover:text-white">
                  About us
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-white">
                  Contact us
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-white">
                  Privacy policy
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mb-4 text-sm font-semibold tracking-wide text-white uppercase">
              Get in touch
            </h2>
            <div className="space-y-2.5 text-sm">
              <p>+1-234-567-890</p>
              <p>contact@quickshow.com</p>
            </div>
          </div>
        </div>
      </div>

      <p className="py-6 text-center text-xs text-zinc-500">
        Copyright {new Date().getFullYear()} © QuickShow. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
