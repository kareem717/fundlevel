"use client";

import { ComponentPropsWithoutRef, FC, useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent } from "@fundlevel/ui/components/dialog";

export interface DialogLayoutProps
  extends ComponentPropsWithoutRef<typeof Dialog> {
  children: React.ReactNode;
}

export const DialogLayout: FC<DialogLayoutProps> = ({ children, ...props }) => {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    router.back();
  };

  return (
    <Dialog {...props} onOpenChange={handleClose} open={open}>
      <DialogContent className="w-min min-w-80 rounded-md">
        {children}
      </DialogContent>
    </Dialog>
  );
};
