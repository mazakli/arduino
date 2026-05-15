import NewPostForm from "@/components/NewPostForm";
import { PlusCircle } from "lucide-react";

export default function NewPostPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <PlusCircle className="w-5 h-5 text-[#00979D]" />
          <h1 className="text-2xl font-bold text-gray-900">Create New Post</h1>
        </div>
        <p className="text-sm text-gray-500">
          Share your question, project, or discussion with the Arduino community
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <NewPostForm />
      </div>
    </div>
  );
}
