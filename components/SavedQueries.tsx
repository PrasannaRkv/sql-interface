"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronDown, X } from "lucide-react";
import { useSafeLocalStorage } from "@/utils/useSafeLocalStorage";

export default function SavedQueries({
  onSelect,
  current
}: {
  current: string,
  onSelect: (sql: string) => void;
}) {
  const [savedSqls, setSavedSqls] = useSafeLocalStorage<string[]>("savedSqls", []);

  const saveCurrent = (q: string) => setSavedSqls((saved = []) => [...saved, q])
  const handleDelete = (index: number) => {
    setSavedSqls(savedSqls.filter((_, i) => i !== index));
  };

  const isAlreadySaved = savedSqls.includes(current);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-1">
          Saved
          <ChevronDown className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-2 space-y-1 w-[300px]">
          <ul className="max-h-[400px] overflow-y-auto space-y-1">
              {!isAlreadySaved && <><li
                key={'current'}
                onClick={() => saveCurrent(current)}
                className="italic cursor-pointer rounded-md px-2 py-1 text-sm hover:bg-accent hover:text-accent-foreground truncate"
                title={current}
              > Save: {current}</li>
                <hr />
                </>
              }
            {savedSqls.map((q, i) => (
              <li
                key={i}
                className="flex items-center justify-between rounded-md px-2 py-1 text-sm hover:bg-accent hover:text-accent-foreground"
              >
                <span
                  onClick={() => onSelect(q)}
                  className="cursor-pointer truncate flex-1"
                  title={q}
                >
                  {q}
                </span>
                <button
                  onClick={() => handleDelete(i)}
                  className="ml-2 text-muted-foreground hover:text-destructive"
                  title="Delete"
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}