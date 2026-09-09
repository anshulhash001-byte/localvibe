import { Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-cream to-sand-100 border-t border-sand-200 px-6 pt-8 pb-6 mt-4">
      {/* Social icons */}
      <div className="flex items-center justify-center gap-3 mb-5">
        <a
          href="https://instagram.com/localvibe"
          target="_blank"
          rel="noopener noreferrer"
          className="w-9 h-9 bg-white border border-sand-200 rounded-full flex items-center justify-center hover:border-terracotta-300 hover:bg-terracotta-50 transition-all active:scale-95"
          aria-label="Instagram"
        >
          <Instagram className="w-4 h-4 text-teal-700" />
        </a>
        <a
          href="https://twitter.com/localvibe"
          target="_blank"
          rel="noopener noreferrer"
          className="w-9 h-9 bg-white border border-sand-200 rounded-full flex items-center justify-center hover:border-terracotta-300 hover:bg-terracotta-50 transition-all active:scale-95"
          aria-label="Twitter"
        >
          <Twitter className="w-4 h-4 text-teal-700" />
        </a>
      </div>

      {/* Links */}
      <div className="flex items-center justify-center gap-4 text-[11px] text-sand-600 mb-4 flex-wrap">
        <a href="/privacy" className="hover:text-teal-700 transition-colors">Privacy Policy</a>
        <span className="text-sand-300">•</span>
        <a href="/terms" className="hover:text-teal-700 transition-colors">Terms of Service</a>
        <span className="text-sand-300">•</span>
        <a href="mailto:hello@localvibe.app" className="hover:text-teal-700 transition-colors">Contact Us</a>
      </div>

      {/* Copyright */}
      <p className="text-center text-[11px] text-sand-500 leading-relaxed">
        © 2026 LocalVibe. Made with <span className="text-terracotta-500">❤️</span> in Jaipur
      </p>
    </footer>
  );
}
