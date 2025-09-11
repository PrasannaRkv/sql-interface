"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Download } from "lucide-react";

interface DownloadButtonProps {
  getData: () => string;
  filename?: string;
  format?: "json" | "csv";
}

export function DownloadButton({
  getData,
  filename = "results",
  format = "json",
}: DownloadButtonProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleDownload = () => {
    try {
      setLoading(true);
      const text = getData();
      const blob = new Blob([text], {
        type: format === "json" ? "application/json" : "text/csv",
      });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${filename}.${format}`;
      link.click();

      setSuccess(true);
      setTimeout(() => setSuccess(false), 1500);
    } catch (err) {
      console.error("Download failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
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
        <Download className="w-4 h-4" />
      )}
      {success ? "Downloaded!" : `Download ${format.toUpperCase()}`}
    </Button>
  );
}