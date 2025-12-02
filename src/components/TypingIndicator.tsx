import { Bot } from 'lucide-react';

export function TypingIndicator() {
  return (
    <div className="flex gap-3 fade-in">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
        <Bot className="w-4 h-4 text-primary-foreground" />
      </div>
      <div className="bg-card rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-border/50">
        <div className="typing-indicator flex gap-1">
          <span className="w-2 h-2 bg-muted-foreground rounded-full" />
          <span className="w-2 h-2 bg-muted-foreground rounded-full" />
          <span className="w-2 h-2 bg-muted-foreground rounded-full" />
        </div>
      </div>
    </div>
  );
}
