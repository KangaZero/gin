"use client";

import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ShortcutDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ShortcutDialog({ open, onOpenChange }: ShortcutDialogProps) {
  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Keyboard Shortcuts</DialogTitle>
        <DialogDescription>
          A list of all available keyboard shortcuts for quick navigation and
          actions.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="flex items-center justify-between">
          <span className="font-medium">Profile</span>
          <kbd className="px-2 py-1 bg-muted rounded">⌘⇧P</kbd>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium">Billing</span>
          <kbd className="px-2 py-1 bg-muted rounded">⌘B</kbd>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium">Settings</span>
          <kbd className="px-2 py-1 bg-muted rounded">⌘S</kbd>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium">Shortcuts</span>
          <kbd className="px-2 py-1 bg-muted rounded">⌘K</kbd>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium">New Team</span>
          <kbd className="px-2 py-1 bg-muted rounded">⌘T</kbd>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium">Pets</span>
          <kbd className="px-2 py-1 bg-muted rounded">⌘H</kbd>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium">Users</span>
          <kbd className="px-2 py-1 bg-muted rounded">⌘U</kbd>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium">Login/Logout</span>
          <kbd className="px-2 py-1 bg-muted rounded">⌘L</kbd>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium">Close Dialog</span>
          <kbd className="px-2 py-1 bg-muted rounded">ESC</kbd>
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button>Close</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
