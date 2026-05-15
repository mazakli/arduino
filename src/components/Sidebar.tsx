"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Home,
  Grid,
  Megaphone,
  BookOpen,
  Users,
  Trophy,
  User,
  Menu,
  X,
  Cpu,
  Bell,
  LogIn,
  UserPlus,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import NotificationBell from "./NotificationBell";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/categories", label: "Categories", icon: Grid },
  { href: "/announcements", label: "Announcements", icon: Megaphone },
  { href: "/rules", label: "Rules", icon: BookOpen },
  { href: "/teams", label: "Teams", icon: Users },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b border-gray-200">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#00979D] rounded-lg flex items-center justify-center">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg text-gray-900">Arduino Forum</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navLinks.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive(href)
                ? "bg-[#00979D] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </Link>
        ))}

        {session?.user && (
          <Link
            href="/profile"
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive("/profile")
                ? "bg-[#00979D] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <User className="w-4 h-4 flex-shrink-0" />
            My Profile
          </Link>
        )}
      </nav>

      {/* Bottom section */}
      <div className="p-3 border-t border-gray-200">
        {session?.user ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-3 py-2">
              <div className="w-8 h-8 bg-[#00979D] rounded-full flex items-center justify-center text-white text-sm font-bold">
                {session.user.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {session.user.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {session.user.email}
                </p>
              </div>
              <NotificationBell />
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 w-full px-3 py-2 text-sm font-medium text-[#00979D] border border-[#00979D] rounded-lg hover:bg-[#00979D] hover:text-white transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Login
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 w-full px-3 py-2 text-sm font-medium text-white bg-[#00979D] rounded-lg hover:bg-[#007A80] transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              Register
            </Link>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-[#F8F9FA] border-r border-gray-200 h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 p-2 bg-white rounded-lg shadow-md border border-gray-200"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5 text-gray-700" />
      </button>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-64 bg-[#F8F9FA] h-full flex flex-col shadow-xl">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-gray-200"
              aria-label="Close menu"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
}
