import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export function useChatSessions() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSessions = useCallback(async () => {
    if (!user) {
      setSessions([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('chat_sessions')
      .select('id, title, created_at, updated_at')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (!error && data) {
      setSessions(data);
    }
    setLoading(false);
  }, [user]);

  // Initial fetch and real-time subscription
  useEffect(() => {
    fetchSessions();

    if (!user) return;

    // Subscribe to real-time changes
    const channel = supabase
      .channel('chat-sessions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_sessions',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchSessions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchSessions, user]);

  const createSession = async (title: string = 'New Chat'): Promise<string | null> => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('chat_sessions')
      .insert({ user_id: user.id, title })
      .select('id')
      .single();

    if (!error && data) {
      await fetchSessions();
      return data.id;
    }
    return null;
  };

  const updateSessionTitle = async (sessionId: string, title: string) => {
    const { error } = await supabase
      .from('chat_sessions')
      .update({ title, updated_at: new Date().toISOString() })
      .eq('id', sessionId);

    if (!error) {
      await fetchSessions();
    }
  };

  const deleteSession = async (sessionId: string) => {
    const { error } = await supabase
      .from('chat_sessions')
      .delete()
      .eq('id', sessionId);

    if (!error) {
      await fetchSessions();
    }
  };

  return {
    sessions,
    loading,
    createSession,
    updateSessionTitle,
    deleteSession,
    refetchSessions: fetchSessions,
  };
}

export function useChatMessages(sessionId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMessages = useCallback(async () => {
    if (!sessionId) {
      setMessages([]);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('chat_messages')
      .select('id, role, content, created_at')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setMessages(data.map(m => ({
        ...m,
        role: m.role as 'user' | 'assistant'
      })));
    }
    setLoading(false);
  }, [sessionId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const addMessage = async (role: 'user' | 'assistant', content: string, overrideSessionId?: string) => {
    const targetSessionId = overrideSessionId || sessionId;
    if (!targetSessionId) return null;

    const { data, error } = await supabase
      .from('chat_messages')
      .insert({ session_id: targetSessionId, role, content })
      .select('id, role, content, created_at')
      .single();

    if (!error && data) {
      const newMessage: Message = {
        ...data,
        role: data.role as 'user' | 'assistant'
      };
      setMessages(prev => [...prev, newMessage]);
      return newMessage;
    }
    return null;
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return {
    messages,
    loading,
    addMessage,
    clearMessages,
    refetchMessages: fetchMessages,
  };
}
