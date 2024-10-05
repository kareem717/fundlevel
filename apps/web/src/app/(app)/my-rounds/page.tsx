import { ActiveRoundIndex } from "@/components/app/rounds/index/active-round-index"
import { PastRoundIndex } from "@/components/app/rounds/index/past-round-index"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


export default async function MyRoundsPage({ searchParams }: { searchParams: { tab: string } }) {
  const tabs = [
    {
      value: "active",
      label: "Active",
      component: <ActiveRoundIndex />,
    },
    {
      value: "past",
      label: "Past",
      component: <PastRoundIndex />,
    },
  ]

  const defaultTab = tabs.find((tab) => tab.value === searchParams.tab) || tabs[0]


  return (
    <div className="p-8 flex flex-col gap-16 justify-center items-center max-w-screen-2xl mx-auto">
      <Tabs defaultValue={defaultTab.value} className="w-full space-y-10">
        <TabsList className="w-full">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="w-full">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            {tab.component}
          </TabsContent>
        ))}
      </Tabs>
    </div>


  )
}