import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Cpu } from "lucide-react";
import PrintButton from "@/components/PrintButton";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ code: string }>;
}

export default async function CertificatePage({ params }: Props) {
  const { code } = await params;

  const certificate = await prisma.certificate.findUnique({
    where: { uniqueCode: code },
    include: {
      user: { select: { username: true } },
      post: { select: { title: true, content: true } },
    },
  });

  if (!certificate) {
    notFound();
  }

  return (
    <>
      {/* Print button - hidden when printing */}
      <div className="print:hidden flex justify-end px-6 pt-4">
        <PrintButton />
      </div>

      {/* Certificate */}
      <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50 print:bg-white print:p-0">
        <div className="w-full max-w-2xl bg-white border-4 border-[#00979D] rounded-2xl p-10 shadow-xl print:shadow-none print:border-4 print:rounded-none">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#00979D] rounded-2xl mb-4">
              <Cpu className="w-10 h-10 text-white" />
            </div>
            <div className="text-sm font-semibold tracking-widest text-[#00979D] uppercase mb-1">
              arduinoforum.com
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Community Achievement Certificate
            </h1>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex-1 h-px bg-gray-200" />
            <div className="w-2 h-2 rounded-full bg-[#00979D]" />
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Content */}
          <div className="text-center space-y-4 mb-8">
            <p className="text-gray-500 text-sm">This certificate is awarded to</p>
            <p className="text-4xl font-bold text-gray-900">
              {certificate.user.username}
            </p>
            <p className="text-gray-500 text-sm">
              in recognition of their outstanding project
            </p>
            <div className="bg-gray-50 rounded-xl px-6 py-4 inline-block max-w-lg mx-auto">
              <p className="text-xl font-semibold text-gray-800">
                {certificate.post.title}
              </p>
            </div>
            <p className="text-gray-500 text-sm">
              shared with the Arduino Forum community
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex-1 h-px bg-gray-200" />
            <div className="w-2 h-2 rounded-full bg-[#00979D]" />
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Footer */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">
                Date Issued
              </p>
              <p className="text-sm font-semibold text-gray-700">
                {format(new Date(certificate.issuedAt), "MMMM d, yyyy")}
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-1">🏆</div>
              <p className="text-xs text-gray-400">Arduino Forum</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 uppercase tracking-wide">
                Certificate ID
              </p>
              <p className="text-xs font-mono text-gray-600 break-all max-w-32">
                {certificate.uniqueCode.slice(0, 8).toUpperCase()}
              </p>
            </div>
          </div>

          {/* Verification */}
          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">
              Verify this certificate at{" "}
              <span className="text-[#00979D]">
                arduinoforum.com/certificates/{certificate.uniqueCode}
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
