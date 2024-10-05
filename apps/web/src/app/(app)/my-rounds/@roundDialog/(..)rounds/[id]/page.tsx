"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

import { RoundViewHero } from "@/components/app/rounds/view/hero"
import { RoundViewDetails } from "@/components/app/rounds/view/details"
import { faker } from "@faker-js/faker";
import { RoundViewInvestmentCard, MiniRoundViewInvestmentCard } from "@/components/app/rounds/view/investment-card";
import Link from "next/link";
import RoundViewPage from "@/app/(app)/rounds/[id]/page";

export default function RoundDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const images = Array.from({ length: 15 }).map((_, index) => `/filler.jpeg`);

  const handleClose = () => {
    setOpen(false);
    router.back();
  }

  return (
    <Dialog
      onOpenChange={handleClose}
      open={open}
    >
      <DialogContent className="w-full max-w-screen-lg max-h-screen">
        <RoundViewPage />
      </DialogContent>
    </Dialog>
  )

}