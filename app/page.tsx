import Chat from "./components/Chat";
import { ChatProvider } from "./context/ChatContext";

export default function Home() {
  return (
    <main>     
      <ChatProvider>
        <Chat />
      </ChatProvider>
    </main>
  )
}
