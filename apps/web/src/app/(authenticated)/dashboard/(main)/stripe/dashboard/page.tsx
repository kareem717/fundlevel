import { StripeDashboardRedirector } from "./components/redirector";

export default function StripeDashboardPage() {
  //TODO: check that business has completed the onboarding process
  return (
    <div>
      Stripe Dashboard
      <StripeDashboardRedirector />
    </div>
  )
}