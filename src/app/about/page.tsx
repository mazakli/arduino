import type { Metadata } from "next";
import { Cpu, Bot, Users, Award, Shield, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "About Arduino Forum",
  description: "Learn about the Arduino Forum community - our mission, values, and features.",
};

const features = [
  {
    icon: Bot,
    title: "AI-Assisted Answers",
    description:
      "Get intelligent, context-aware answers powered by AI when the community needs a helping hand.",
  },
  {
    icon: Users,
    title: "Team System",
    description:
      "Join or create teams, collaborate with other makers, and compete on the leaderboard.",
  },
  {
    icon: Award,
    title: "Certificates",
    description:
      "Earn verified certificates for outstanding project posts, recognized by the community.",
  },
  {
    icon: Shield,
    title: "Equal Community",
    description:
      "No paywalls, no tiers. Every member has the same voice and the same access.",
  },
  {
    icon: Zap,
    title: "Open Source Spirit",
    description:
      "Built with transparency and sharing at its core, just like the Arduino ecosystem itself.",
  },
  {
    icon: Cpu,
    title: "Maker-First Design",
    description:
      "Designed for makers, hobbyists, students, and professionals working with Arduino.",
  },
];

const stats = [
  { label: "Community Driven", value: "100%", desc: "No corporate agenda" },
  { label: "Open Source Spirit", value: "Always", desc: "Sharing & transparency" },
  { label: "AI-Powered Help", value: "24/7", desc: "Instant assistance" },
];

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      {/* Hero */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-[#00979D] rounded-lg flex items-center justify-center">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">About Arduino Forum</h1>
        </div>
        <p className="text-lg text-gray-600 leading-relaxed">
          Arduino Forum is a transparent, equal, and community-driven space for everyone who
          works with Arduino — from beginners to seasoned engineers. Our mission is simple:
          help makers help each other.
        </p>
      </div>

      {/* Mission */}
      <div className="bg-[#00979D]/5 border border-[#00979D]/20 rounded-2xl p-6 mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">Our Mission</h2>
        <p className="text-gray-700 leading-relaxed">
          We believe that knowledge should be free, communities should be equal, and every
          question deserves a thoughtful answer. Arduino Forum was built to provide exactly
          that — a place where the maker community can ask, answer, collaborate, and grow
          together without barriers.
        </p>
      </div>

      {/* Features */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">Platform Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="bg-white border border-gray-200 rounded-xl p-4 flex gap-3"
            >
              <div className="w-8 h-8 bg-[#00979D]/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon className="w-4 h-4 text-[#00979D]" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 text-sm">{title}</h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">What We Stand For</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map(({ label, value, desc }) => (
            <div
              key={label}
              className="bg-white border border-gray-200 rounded-xl p-5 text-center"
            >
              <div className="text-2xl font-bold text-[#00979D]">{value}</div>
              <div className="text-sm font-medium text-gray-900 mt-1">{label}</div>
              <div className="text-xs text-gray-500 mt-1">{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer note */}
      <div className="text-sm text-gray-500 border-t border-gray-200 pt-6">
        Arduino Forum is an independent community project and is not officially affiliated
        with Arduino LLC or Arduino AG. Arduino is a registered trademark.
      </div>
    </div>
  );
}
