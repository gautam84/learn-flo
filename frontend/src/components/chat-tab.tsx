"use client";

import { useState, useEffect, useRef } from "react";
import { mockChatMessages } from "@/lib/mockChat";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ChatTab() {
  const [messages, setMessages] = useState(mockChatMessages);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage = {
      id: messages.length + 1,
      sender: "You",
      message: input,
      timestamp: new Date().toISOString(),
    };
    setMessages([...messages, newMessage]);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-[80vh] max-h-[700px] rounded-lg border shadow-sm overflow-hidden bg-white">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-sm p-3 rounded-xl shadow ${
              msg.sender === "You" ? "ml-auto bg-blue-100" : "bg-white"
            }`}
          >
            <div className="text-sm font-medium text-gray-700">{msg.sender}</div>
            <div className="text-base text-gray-900">{msg.message}</div>
            <div className="text-xs text-gray-500 text-right">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply Box */}
      <div className="p-3 border-t bg-white">
        <Textarea
          className="w-full min-h-24 resize-none mb-2"
          placeholder="Type your reply here... (Ctrl+Enter to send)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="flex justify-end">
          <Button onClick={handleSend}>Send</Button>
        </div>
      </div>
    </div>
  );
}
