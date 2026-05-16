"use client";

import { useState } from "react";
import { Mail, Github, Send, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Us</h1>
        <p className="text-gray-600">
          Have a question, feedback, or just want to say hello? We&apos;d love to hear from you.
        </p>
      </div>

      {/* Contact info */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <a
          href="mailto:contact@arduinoforum.com"
          className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 hover:border-[#00979D] transition-colors"
        >
          <Mail className="w-4 h-4 text-[#00979D]" />
          contact@arduinoforum.com
        </a>
        <a
          href="https://github.com/arduino-forum/issues"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 hover:border-[#00979D] transition-colors"
        >
          <Github className="w-4 h-4 text-gray-800" />
          Report a bug on GitHub
        </a>
      </div>

      {/* Contact form */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        {sent ? (
          <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
            <CheckCircle className="w-12 h-12 text-[#00979D]" />
            <h2 className="text-lg font-semibold text-gray-900">Message sent!</h2>
            <p className="text-gray-500 text-sm">
              Thanks for reaching out. We&apos;ll get back to you as soon as possible.
            </p>
            <button
              onClick={() => { setSent(false); setName(""); setEmail(""); setMessage(""); }}
              className="mt-2 text-sm text-[#00979D] hover:underline"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00979D] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00979D] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we help?"
                required
                rows={5}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00979D] focus:border-transparent resize-none"
              />
            </div>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#00979D] text-white font-medium rounded-lg hover:bg-[#007A80] transition-colors"
            >
              <Send className="w-4 h-4" />
              Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
