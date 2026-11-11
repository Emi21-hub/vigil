import ChatAssistant from "@/components/ChatAssistant";

export const metadata = {
  title: "Asesor — Vigil",
  description: "Asesor basado en reglas (no IA) para armar tu cadena de avisos en Vigil.",
};

export default function ChatPage() {
  return <ChatAssistant />;
}
