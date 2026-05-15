import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generateAiReply(
  postTitle: string,
  postContent: string
): Promise<string> {
  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system:
        "You are a helpful Arduino expert on an Arduino community forum. Answer the following question helpfully and concisely. Provide practical code examples when relevant. Format your response in a friendly, community-oriented way.",
      messages: [
        {
          role: "user",
          content: `**${postTitle}**\n\n${postContent}`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type === "text") {
      return content.text;
    }
    return "Thank you for your question! Let me help you with this Arduino topic.";
  } catch (error) {
    console.error("AI reply generation failed:", error);
    return "Thank you for your question! The Arduino community is here to help. Please check our documentation and feel free to ask follow-up questions.";
  }
}

export function stripUrls(content: string): string {
  // Strip URLs from content for anonymous users
  return content.replace(/https?:\/\/[^\s]+/g, "[link removed]");
}
