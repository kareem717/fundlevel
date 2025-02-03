import { StripeOnboardRedirector } from "./components/stripe-onboarding-redirector";
import { notFound } from "next/navigation";
import { StripeDashboardRedirector } from "./components/stripe-dashboard-redirector";
import { getBusinessStripeAccountAction } from "@/actions/business";

export default async function FundingPage({ params }: { params: Promise<{ businessId: string }> }) {
	const businessId = parseInt((await params).businessId);

	//TODO: not needed tbh
	if (isNaN(businessId)) {
		return notFound();
	}

	const stripeAccount = (await getBusinessStripeAccountAction(businessId))?.data?.stripeAccount;

	return (
		<div>
			Funding
			{!stripeAccount || stripeAccount.stripe_disabled_reason ?
				<StripeOnboardRedirector businessId={businessId} />
				:
				<StripeDashboardRedirector stripeAccount={stripeAccount} businessId={businessId} />
			}
		</div>
	);
}

