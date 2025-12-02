import { useRef, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { ChatMessage } from '@/components/ChatMessage';
import { ChatInput } from '@/components/ChatInput';
import { TypingIndicator } from '@/components/TypingIndicator';
import { handleSendMessage } from '@/lib/chat-api';
import { useChatSessions, useChatMessages } from '@/hooks/use-chat-sessions';

const suggestionChips = [
  "What are my rights as a tenant?",
  "How to apply for old age pension?",
  "Women's safety helplines",
  "Ration card eligibility",
];

export default function Dashboard() {
  const { profile } = useAuth();
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { sessions, createSession, updateSessionTitle, deleteSession } = useChatSessions();
  const { messages, addMessage, clearMessages } = useChatMessages(activeSessionId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleNewChat = () => {
    setActiveSessionId(null);
    clearMessages();
  };

  const handleSelectSession = (id: string) => {
    setActiveSessionId(id);
  };

  const handleDeleteSession = async (id: string) => {
    await deleteSession(id);
    if (activeSessionId === id) {
      setActiveSessionId(null);
      clearMessages();
    }
  };

  const handleSubmit = async (prompt: string) => {
    let currentSessionId = activeSessionId;
    const isNewSession = !currentSessionId;

    // Create a new session if none is active
    if (!currentSessionId) {
      const newSessionId = await createSession(prompt.slice(0, 50));
      if (!newSessionId) return;
      currentSessionId = newSessionId;
      setActiveSessionId(newSessionId);
    }

    // Add user message to database (pass session ID explicitly for new sessions)
    await addMessage('user', prompt, currentSessionId);
    setIsTyping(true);

    try {
      const response = await handleSendMessage(prompt);
      await addMessage('assistant', response, currentSessionId);

      // Update session title with first message if it's a new chat
      if (isNewSession) {
        await updateSessionTitle(currentSessionId, prompt.slice(0, 50));
      }
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
          onDeleteSession={handleDeleteSession}
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