"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy, Download } from "lucide-react";

interface CopyButtonProps {
  getData: () => string; // function returning data to copy
  format?: "json" | "csv";
}

export function CopyButton({ getData, format = "json" }: CopyButtonProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleCopy = async () => {
    try {
      setLoading(true);
      const text = getData();
      await navigator.clipboard.writeText(text);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 1500);
    } catch (err) {
      console.error("Copy failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCopy}
      disabled={loading}
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
    >
      {loading ? (
        <span className="animate-spin">⏳</span>
      ) : success ? (
        <Check className="w-4 h-4 text-green-600" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
      {success ? "Copied!" : `Copy ${format.toUpperCase()}`}
    </Button>
  );
}