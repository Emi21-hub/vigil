import ChatAssistant from "@/components/ChatAssistant";

export const metadata = {
  title: "Advisor — Vigil",
  description: "A rule-based advisor (not AI) to build your alert chain in Vigil.",
};

export default function ChatPage() {
  return <ChatAssistant />;
}
