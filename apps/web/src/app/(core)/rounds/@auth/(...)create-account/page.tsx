"use client"

import { CreateAccountForm } from "@/components/auth/create-account-form"
import { Dialog, DialogTitle, DialogDescription, DialogHeader, DialogContent } from "@repo/ui/components/dialog"
import { useRouter } from "next/navigation"

export default function CreateAccountModal() {
  const router = useRouter()

  return (
    <Dialog open={true} onOpenChange={() => !open && router.back()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create an Account</DialogTitle>
          <DialogDescription>
            Please create an account to continue with your investment.
          </DialogDescription>
        </DialogHeader>
        <div className="px-4 pt-4">
          <CreateAccountForm redirect={undefined} onSuccess={() => router.back()} />
        </div>
      </DialogContent>
    </Dialog>
  )
} 