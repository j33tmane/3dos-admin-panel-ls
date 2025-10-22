"use client";

import { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TagInputProps {
  id?: string;
  label?: string;
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  maxLength?: number;
  disabled?: boolean;
  className?: string;
  description?: string;
}

export function TagInput({
  id,
  label,
  value = [],
  onChange,
  placeholder = "Type and press Enter to add tags",
  maxTags = 20,
  maxLength = 50,
  disabled = false,
  className,
  description,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
      // Remove last tag if input is empty and backspace is pressed
      removeTag(value.length - 1);
    }
  };

  const addTag = () => {
    const trimmedValue = inputValue.trim();
    if (
      trimmedValue &&
      !value.includes(trimmedValue) &&
      value.length < maxTags &&
      trimmedValue.length <= maxLength
    ) {
      const newTags = [...value, trimmedValue];
      console.log("TagInput adding tag:", trimmedValue, "New tags:", newTags);
      onChange(newTags);
      setInputValue("");
    }
  };

  const removeTag = (index: number) => {
    const newTags = value.filter((_, i) => i !== index);
    onChange(newTags);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Prevent adding if max tags reached
    if (value.length >= maxTags && newValue.length > inputValue.length) {
      return;
    }
    setInputValue(newValue);
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label htmlFor={id}>{label}</Label>}

      <div className="min-h-[40px] border border-input rounded-md bg-background px-3 py-2 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex flex-wrap gap-1 items-center">
          {value.map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="flex items-center gap-1 px-2 py-1 text-xs"
            >
              <span className="max-w-[200px] truncate">{tag}</span>
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </Badge>
          ))}

          {value.length < maxTags && (
            <Input
              id={id}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={value.length === 0 ? placeholder : ""}
              disabled={disabled}
              className="border-0 shadow-none focus-visible:ring-0 p-0 h-auto min-w-[120px] flex-1"
              maxLength={maxLength}
            />
          )}
        </div>
      </div>

      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}

      {value.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {value.length}/{maxTags} tags • Max {maxLength} characters per tag
        </p>
      )}
    </div>
  );
}
