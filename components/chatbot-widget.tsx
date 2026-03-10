"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Trash2, Loader2 } from "lucide-react";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { ScrollArea } from "@components/ui/scroll-area";
import { cn } from "@lib/utils";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

interface Conversation {
  id: number;
  title: string;
  messages: Message[];
}

const STORAGE_KEY = "nxcar_conversation_id";

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [streamingContent, setStreamingContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent, scrollToBottom]);

  useEffect(() => {
    const storedId = localStorage.getItem(STORAGE_KEY);
    if (storedId) {
      const id = parseInt(storedId);
      setConversationId(id);
      loadConversation(id);
    }
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const loadConversation = async (id: number) => {
    try {
      const response = await fetch(`/api/conversations/${id}`);
      if (response.ok) {
        const data: Conversation = await response.json();
        setMessages(data.messages || []);
      } else if (response.status === 404) {
        localStorage.removeItem(STORAGE_KEY);
        setConversationId(null);
        setMessages([]);
      }
    } catch (error) {
    }
  };

  const createConversation = async (): Promise<number> => {
    const response = await fetch("/api/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Nxcar Assistant Chat" }),
    });
    const data = await response.json();
    localStorage.setItem(STORAGE_KEY, data.id.toString());
    setConversationId(data.id);
    return data.id;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);
    setStreamingContent("");

    const tempUserMessage: Message = {
      id: Date.now(),
      role: "user",
      content: userMessage,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMessage]);

    try {
      let currentConversationId = conversationId;
      if (!currentConversationId) {
        currentConversationId = await createConversation();
      }

      const response = await fetch(
        `/api/conversations/${currentConversationId}/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: userMessage }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.content) {
                  fullContent += data.content;
                  setStreamingContent(fullContent);
                }
                if (data.done) {
                  const assistantMessage: Message = {
                    id: Date.now() + 1,
                    role: "assistant",
                    content: fullContent,
                    createdAt: new Date().toISOString(),
                  };
                  setMessages((prev) => [...prev, assistantMessage]);
                  setStreamingContent("");
                }
                if (data.error) {
                  throw new Error(data.error);
                }
              } catch (e) {
              }
            }
          }
        }
      }
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearConversation = async () => {
    if (conversationId) {
      try {
        await fetch(`/api/conversations/${conversationId}`, {
          method: "DELETE",
        });
      } catch (error) {
      }
    }
    localStorage.removeItem(STORAGE_KEY);
    setConversationId(null);
    setMessages([]);
    setStreamingContent("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-4 z-50 w-[360px] max-w-[calc(100vw-2rem)] h-[500px] max-h-[calc(100vh-8rem)] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            style={{ backgroundColor: "#0D1117" }}
            data-testid="chatbot-panel"
          >
            <div
              className="flex items-center justify-between px-4 py-3 border-b"
              style={{ borderColor: "#30363D" }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#0EA9B2" }}
                >
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">
                    Nxcar Assistant
                  </h3>
                  <p className="text-xs" style={{ color: "#8B949E" }}>
                    Here to help you
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClearConversation}
                  className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10"
                  title="Clear conversation"
                  data-testid="button-clear-chat"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10"
                  data-testid="button-close-chat"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.length === 0 && !streamingContent && (
                  <div className="text-center py-8">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                      style={{ backgroundColor: "rgba(14, 169, 178, 0.1)" }}
                    >
                      <MessageCircle
                        className="w-8 h-8"
                        style={{ color: "#0EA9B2" }}
                      />
                    </div>
                    <h4 className="text-white font-medium mb-2">
                      Welcome to Nxcar!
                    </h4>
                    <p className="text-sm" style={{ color: "#8B949E" }}>
                      Ask me about car buying, selling, loans, valuations, or
                      any platform features.
                    </p>
                  </div>
                )}

                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex",
                      message.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm",
                        message.role === "user"
                          ? "rounded-br-md"
                          : "rounded-bl-md"
                      )}
                      style={{
                        backgroundColor:
                          message.role === "user" ? "#0EA9B2" : "#21262D",
                        color: message.role === "user" ? "#fff" : "#E6EDF3",
                      }}
                      data-testid={`message-${message.role}-${message.id}`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}

                {streamingContent && (
                  <div className="flex justify-start">
                    <div
                      className="max-w-[85%] rounded-2xl rounded-bl-md px-4 py-2.5 text-sm"
                      style={{
                        backgroundColor: "#21262D",
                        color: "#E6EDF3",
                      }}
                    >
                      <p className="whitespace-pre-wrap">{streamingContent}</p>
                    </div>
                  </div>
                )}

                {isLoading && !streamingContent && (
                  <div className="flex justify-start">
                    <div
                      className="rounded-2xl rounded-bl-md px-4 py-3"
                      style={{ backgroundColor: "#21262D" }}
                    >
                      <div className="flex items-center gap-1">
                        <span
                          className="w-2 h-2 rounded-full animate-bounce"
                          style={{
                            backgroundColor: "#0EA9B2",
                            animationDelay: "0ms",
                          }}
                        />
                        <span
                          className="w-2 h-2 rounded-full animate-bounce"
                          style={{
                            backgroundColor: "#0EA9B2",
                            animationDelay: "150ms",
                          }}
                        />
                        <span
                          className="w-2 h-2 rounded-full animate-bounce"
                          style={{
                            backgroundColor: "#0EA9B2",
                            animationDelay: "300ms",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="p-4 border-t" style={{ borderColor: "#30363D" }}>
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-1 border-none text-white placeholder:text-gray-500"
                  style={{ backgroundColor: "#21262D" }}
                  data-testid="input-chat-message"
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="h-9 w-9 p-0"
                  style={{
                    backgroundColor: "#0EA9B2",
                    color: "#fff",
                  }}
                  data-testid="button-send-message"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105"
        style={{ backgroundColor: "#0EA9B2" }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        data-testid="button-open-chatbot"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageCircle className="w-6 h-6 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
