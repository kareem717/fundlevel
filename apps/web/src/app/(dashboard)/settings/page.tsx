import { UpdateAccountForm } from "@/components/forms/update-account-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const dynamic = 'force-dynamic'

const tabs = [
  {
    value: "account",
    label: "Account",
    content: <Card className="w-full">
      <CardContent>
        <CardHeader className="px-0">
          <CardTitle>Account</CardTitle>
          <CardDescription>
            Make changes to your account here. Click update account when you&apos;re done.
          </CardDescription>
        </CardHeader>
        <UpdateAccountForm />
      </CardContent>
    </Card>,
  },
]

export default async function SettingsPage({ params }: { params: { tab: string } }) {
  const tab = tabs.find((t) => t.value === params.tab) || tabs[0];

  return (
    <Tabs defaultValue={tab.value} className="w-full flex flex-col justify-center items-center">
      <TabsList className="w-full flex justify-center items-center gap-1">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value} className="w-full">{tab.label}</TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className="w-full">
          {tab.content}
        </TabsContent>
      ))}
    </Tabs >
  )
}