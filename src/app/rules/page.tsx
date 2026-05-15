import { BookOpen } from "lucide-react";

export default function RulesPage() {
  const rules = [
    {
      number: 1,
      title: "Be Respectful",
      description:
        "Treat all community members with respect. Personal attacks, harassment, and hate speech are strictly prohibited. We are all here to learn and help each other.",
    },
    {
      number: 2,
      title: "Stay On Topic",
      description:
        "Keep discussions related to Arduino, electronics, and maker projects. Use the appropriate categories for your posts to help others find relevant content.",
    },
    {
      number: 3,
      title: "No Spam or Self-Promotion",
      description:
        "Do not post spam, excessive self-promotion, or irrelevant commercial content. Sharing your projects is welcome, but avoid posting solely for promotional purposes.",
    },
    {
      number: 4,
      title: "Search Before Asking",
      description:
        "Before posting a question, please search the forum to see if it has already been answered. Duplicate questions clutter the forum and make it harder to find information.",
    },
    {
      number: 5,
      title: "Provide Context",
      description:
        "When asking for help, provide as much context as possible: your Arduino model, code, error messages, wiring diagrams, and what you have already tried. This helps others help you faster.",
    },
    {
      number: 6,
      title: "Mark Solutions",
      description:
        "If a reply solves your problem, please mark it as the solution. This helps others with the same issue find the answer quickly.",
    },
    {
      number: 7,
      title: "Share Your Knowledge",
      description:
        "If you know the answer to someone's question, share it! The more we share, the stronger our community becomes. Provide clear, accurate, and helpful responses.",
    },
    {
      number: 8,
      title: "No Plagiarism",
      description:
        "Always credit original sources when sharing code, designs, or documentation. Do not claim others' work as your own.",
    },
    {
      number: 9,
      title: "Safe Content Only",
      description:
        "Do not share content that could be dangerous or harmful. This includes projects that could injure others or violate laws and regulations.",
    },
    {
      number: 10,
      title: "Moderator Decisions Are Final",
      description:
        "Our moderators work hard to keep this community a great place. If a moderator makes a decision, please respect it. You can appeal by contacting us privately.",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center gap-2 mb-2">
        <BookOpen className="w-5 h-5 text-[#00979D]" />
        <h1 className="text-2xl font-bold text-gray-900">Community Rules</h1>
      </div>
      <p className="text-gray-500 text-sm mb-6">
        Please read and follow these guidelines to keep Arduino Forum a helpful and welcoming community for everyone.
      </p>

      <div className="space-y-3">
        {rules.map((rule) => (
          <div
            key={rule.number}
            className="bg-white rounded-xl border border-gray-200 p-4"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#00979D] text-white rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">
                {rule.number}
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">{rule.title}</h2>
                <p className="text-sm text-gray-500 mt-1">{rule.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-[#00979D]/5 border border-[#00979D]/20 rounded-xl p-4 text-sm text-gray-600">
        <p>
          Violation of these rules may result in your post being removed or your account being suspended.
          If you see a rule violation, please report it to our moderation team.
        </p>
        <p className="mt-2">
          These rules may be updated from time to time. Thank you for being part of the Arduino Forum community!
        </p>
      </div>
    </div>
  );
}
