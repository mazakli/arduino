import Link from "next/link";
import { Cpu, Bot } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-white py-4 px-6">
      <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5 text-[#00979D]" />
          <span>© 2026 Arduino Forum</span>
        </div>

        <div className="flex items-center gap-3 flex-wrap justify-center">
          <Link href="/privacy" className="hover:text-[#00979D] transition-colors">
            Privacy Policy
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/cookies" className="hover:text-[#00979D] transition-colors">
            Cookie Policy
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/about" className="hover:text-[#00979D] transition-colors">
            About
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/contact" className="hover:text-[#00979D] transition-colors">
            Contact
          </Link>
        </div>

        <div className="flex items-center gap-1.5 text-gray-400">
          <Bot className="w-3.5 h-3.5 text-[#00979D]" />
          <span>Powered by AI</span>
        </div>
      </div>
    </footer>
  );
}
