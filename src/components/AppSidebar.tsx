import { Plus, MessageSquare, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

interface ChatSession {
  id: string;
  title: string;
  created_at: string;
}

interface AppSidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onNewChat: () => void;
  onSelectSession: (id: string) => void;
}

export function AppSidebar({ 
  sessions, 
  activeSessionId, 
  onNewChat, 
  onSelectSession 
}: AppSidebarProps) {
  const { profile, signOut } = useAuth();

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="p-4">
        <Button 
          onClick={onNewChat}
          className="w-full justify-start gap-2"
          variant="outline"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </SidebarHeader>

      <SidebarContent>
        <div className="px-4 py-2">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Recent Chats
          </h3>
        </div>
        <ScrollArea className="flex-1 px-2">
          <SidebarMenu>
            {sessions.map((session) => (
              <SidebarMenuItem key={session.id}>
                <SidebarMenuButton
                  onClick={() => onSelectSession(session.id)}
                  isActive={activeSessionId === session.id}
                  className="w-full justify-start gap-2 text-left"
                >
                  <MessageSquare className="h-4 w-4 shrink-0" />
                  <span className="truncate">{session.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
            {sessions.length === 0 && (
              <p className="px-4 py-8 text-sm text-muted-foreground text-center">
                No conversations yet. Start a new chat!
              </p>
            )}
          </SidebarMenu>
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <User className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-medium truncate">
              {profile?.display_name || 'User'}
            </span>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={signOut}
            className="shrink-0 text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
