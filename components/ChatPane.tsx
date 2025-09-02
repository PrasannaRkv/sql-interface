"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import clsx from "clsx";
import { Textarea } from "./ui/textarea";

// import { Response } from '@/src/Components/ui/shadcn-io/ai/response';


export default function ChatPane() {
        const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
        const [input, setInput] = useState("");
        const [loading, setLoading] = useState(false);

        const sendMessage = async () => {
                if (!input.trim()) return;

                const newMessages = [...messages, { role: "user", content: input }];
                setMessages(newMessages);
                setInput("");
                setLoading(true);

                try {
                        const res = await fetch("/api/chat", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ messages: newMessages }),
                        });

                        const data = await res.json();
                        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
                } catch (err) {
                        setMessages((prev) => [...prev, { role: "assistant", content: "⚠️ Error talking to AI" }]);
                } finally {
                        setLoading(false);
                }
        };

        return (
                <Sheet>
                        <SheetTrigger asChild>
                                <Button variant="outline">💬 AI SQL Assistant</Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[400px] sm:w-[500px] flex flex-col px-4 py-2">
                                <SheetHeader>
                                        <SheetTitle>💬 AI SQL Assistant</SheetTitle>
                                </SheetHeader>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto px-4 space-y-2">
                                        <div className="flex flex-col gap-2">
                                                {messages.map((m, i) => (
                                                        <div
                                                                key={i}
                                                                className={clsx(
                                                                        "whitespace-break-spaces",
                                                                        m.role == "user" ? "pl-14 text-right text-foreground/50 italic" : "pr-14 text-left"
                                                                )}
                                                        >
                                                                {/* <Response> */}

                                                                {m.content}
                                                                {/* </Response> */}
                                                        </div>
                                                ))}
                                        </div>
                                        {loading && <p className="text-sm text-muted-foreground">Thinking...</p>}
                                </div>

                                {/* Input */}
                                <div className="flex gap-2 mt-2 h-32">
                                        <Textarea
                                                value={input}
                                                className="h-full"
                                                onChange={(e) => setInput(e.target.value)}
                                                placeholder="Ask me to write SQL..."
                                                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                                        />
                                        <Button onClick={sendMessage} disabled={loading}>
                                                Send
                                        </Button>
                                </div>
                        </SheetContent>
                </Sheet>
        );
}