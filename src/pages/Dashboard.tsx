import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { ChatMessage } from '@/components/ChatMessage';
import { ChatInput } from '@/components/ChatInput';
import { TypingIndicator } from '@/components/TypingIndicator';
import { handleSendMessage } from '@/lib/chat-api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatSession {
  id: string;
  title: string;
  created_at: string;
}

// Dummy data for chat history
const dummySessions: ChatSession[] = [
  { id: '1', title: 'Welfare Scheme eligibility for farmers', created_at: new Date().toISOString() },
  { id: '2', title: 'Land Dispute question', created_at: new Date().toISOString() },
  { id: '3', title: "Women's safety laws in TN", created_at: new Date().toISOString() },
  { id: '4', title: 'Ration card application process', created_at: new Date().toISOString() },
  { id: '5', title: 'Senior citizen pension benefits', created_at: new Date().toISOString() },
];

const suggestionChips = [
  "What are my rights as a tenant?",
  "How to apply for old age pension?",
  "Women's safety helplines",
  "Ration card eligibility",
];

export default function Dashboard() {
  const { profile } = useAuth();
  const [sessions] = useState<ChatSession[]>(dummySessions);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleNewChat = () => {
    setActiveSessionId(null);
    setMessages([]);
  };

  const handleSelectSession = (id: string) => {
    setActiveSessionId(id);
    // In a real app, load messages for this session
    setMessages([]);
  };

  const handleSubmit = async (prompt: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: prompt,
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const response = await handleSendMessage(prompt);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const showWelcome = messages.length === 0;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar
          sessions={sessions}
          activeSessionId={activeSessionId}
          onNewChat={handleNewChat}
          onSelectSession={handleSelectSession}
        />

        <main className="flex-1 flex flex-col min-w-0">
          {/* Mobile Header */}
          <header className="lg:hidden flex items-center gap-3 p-4 border-b border-border">
            <SidebarTrigger className="h-9 w-9" />
            <h1 className="font-semibold text-foreground">People's Voice</h1>
          </header>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto">
              {showWelcome ? (
                <div className="h-full flex flex-col items-center justify-center px-4 py-8">
                  <div className="text-center max-w-xl space-y-4">
                    <h2 className="text-2xl sm:text-3xl font-semibold text-foreground">
                      Hello{profile?.display_name ? `, ${profile.display_name}` : ''}!
                    </h2>
                    <p className="text-lg text-muted-foreground">
                      How can I help you today?
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Ask about laws, women's safety, or welfare schemes.
                    </p>
                  </div>

                  <div className="mt-8 flex flex-wrap justify-center gap-2 max-w-2xl">
                    {suggestionChips.map((chip) => (
                      <button
                        key={chip}
                        onClick={() => handleSubmit(chip)}
                        className="px-4 py-2 text-sm bg-accent text-accent-foreground rounded-full hover:bg-accent/80 transition-colors"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
                  {messages.map((message) => (
                    <ChatMessage
                      key={message.id}
                      role={message.role}
                      content={message.content}
                    />
                  ))}
                  {isTyping && <TypingIndicator />}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t border-border bg-background p-4">
              <div className="max-w-3xl mx-auto">
                <ChatInput onSend={handleSubmit} disabled={isTyping} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
