"use client";

import { getBusinessCreateRoundrequirements } from "@/actions/busineses";
import { useBusiness } from "@/components/providers/business-provider";
import { CreateRoundForm } from "./components/create-round-form";
import { useAction } from "next-safe-action/hooks";
import { RoundCreateRequirements } from "@repo/sdk";
import { useState, useEffect } from "react";

export default function CreateRoundPage() {
  const [reqs, setReqs] = useState<RoundCreateRequirements | undefined>()
  const { selectedBusiness } = useBusiness()
  const { execute, isExecuting } = useAction(getBusinessCreateRoundrequirements, {
    onSuccess: ({ data }) => {
      console.log(data)
      if (data?.requirements && Object.values(data.requirements).some(req => req === false)) {
        setReqs(data.requirements)
      }
    },
    onError: (error) => {
      console.error(error)
    }
  })

  useEffect(() => {
    execute(selectedBusiness.id)
  }, [selectedBusiness.id])

  return (
    <div>
      {isExecuting ?
        <div>Loading...</div>
        : reqs ?
          <div>{JSON.stringify(reqs, null, 2)}</div>
          : <CreateRoundForm />
      }
    </div>
  )
}