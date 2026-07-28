"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { classroomsService } from "@/lib/api/classrooms";
import { Classroom } from "@/lib/common/types";

const CODE_LENGTH = 6;

interface JoinClassroomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJoined: (classroom: Classroom) => void;
}

export function JoinClassroomDialog({
  open,
  onOpenChange,
  onJoined,
}: JoinClassroomDialogProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setCode("");
    setError(null);
    setSubmitting(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) reset();
    onOpenChange(nextOpen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== CODE_LENGTH || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      const response = await classroomsService.enroll(code);

      if (response.success && response.data) {
        onJoined(response.data);
        reset();
        onOpenChange(false);
      } else {
        setError(response.error || "Could not join that classroom.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Join a classroom</DialogTitle>
            <DialogDescription>
              Ask your teacher for the {CODE_LENGTH}-character class code.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-2 py-4">
            <Label htmlFor="class-code">Class code</Label>
            <Input
              id="class-code"
              value={code}
              onChange={(e) => {
                // Uppercase as they type so the field matches the code they were given.
                setCode(e.target.value.toUpperCase().trim().slice(0, CODE_LENGTH));
                setError(null);
              }}
              placeholder="K7F2QX"
              autoComplete="off"
              autoFocus
              className="font-mono text-lg tracking-[0.3em] uppercase"
              aria-invalid={!!error}
              aria-describedby={error ? "class-code-error" : undefined}
            />
            {error && (
              <p id="class-code-error" className="text-sm text-red-500">
                {error}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={code.length !== CODE_LENGTH || submitting}>
              {submitting ? "Joining..." : "Join"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
