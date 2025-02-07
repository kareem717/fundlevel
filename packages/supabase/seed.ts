/**
 * ! Executing this script will delete all data in your database and seed it with 10 users.
 * ! Make sure to adjust the script to your needs.
 * Use any TypeScript runner to run this script, for example: `npx tsx seed.ts`
 * Learn more about the Seed Client by following our guide: https://docs.snaplet.dev/seed/getting-started
 */
import { createSeedClient } from "@snaplet/seed";
import { randomInt } from "crypto";

const generateTimestamp = () => {
	return {
		created_at: new Date().toISOString(),
		updated_at: null,
		deleted_at: null,
	};
};

(async () => {
	const seed = await createSeedClient();

	console.log("Truncating all tables in the database");

	// Truncate all tables in the database
	await seed.$resetDatabase([
		"!*",
		"public.*",
		"!public.goose_db_version",
		"auth.users",
	]);

	console.log("Truncation completed!");

	console.log("Beginning seeding...");

	await seed.industries((x) =>
		x({ min: 5, max: 100 }, ({ index }) => ({
			...generateTimestamp(),
			name: `Industry ${index}`,
		}))
	);

	const { accounts } = await seed.users((x) =>
		x(
			{ min: 5, max: 10 },
			{
				accounts: (x) => x(1),
			}
		)
	);

	const FULL_ACCESS_PERMISSION_ID = 1;
	await seed.business_member_role_permissions((x) =>
		x(1, {
			id: FULL_ACCESS_PERMISSION_ID,
			value: "full_access",
			description: "Full access to the business",
		})
	);

	const OWNER_ROLE_ID = 1;
	await seed.business_member_roles((x) =>
		x(1, {
			name: "owner",
			id: OWNER_ROLE_ID,
			business_member_role_permission_assignments: (x) =>
				x(1, {
					permission_id: FULL_ACCESS_PERMISSION_ID,
				}),
		})
	);

	await seed.businesses((x) =>
		x(1, ({ index }) => ({
			...generateTimestamp(),
			display_name: "Fundlevel",
			business_legal_section: {
				business_number: randomInt(1000, 9999).toString() + index,
			},
			business_members: (x) =>
				x(1, {
					role_id: OWNER_ROLE_ID,
					account_id: accounts[randomInt(0, accounts.length - 1)].id,
					...generateTimestamp(),
				}),
			rounds: (x) =>
				x(1, {
					round_terms: {
						content: JSON.stringify({
							root: {
								children: [
									{
										children: [
											{
												detail: 0,
												format: 1,
												mode: "normal",
												style: "",
												text: "Investor Terms and Conditions",
												type: "text",
												version: 1,
											},
										],
										direction: "ltr",
										format: "center",
										indent: 0,
										type: "heading",
										version: 1,
										textFormat: 1,
										tag: "h2",
									},
									{
										children: [
											{
												detail: 0,
												format: 0,
												mode: "normal",
												style: "",
												text: "1. INVESTMENT OVERVIEW",
												type: "text",
												version: 1,
											},
										],
										direction: "ltr",
										format: "",
										indent: 0,
										type: "heading",
										version: 1,
										tag: "h3",
									},
									{
										children: [
											{
												detail: 0,
												format: 0,
												mode: "normal",
												style: "",
												text: "By investing through FundLevel's platform, investors acknowledge and agree to these terms. FundLevel provides a technology platform connecting accredited investors with investment opportunities. Minimum investment amount is $10,000 unless otherwise specified for particular offerings.",
												type: "text",
												version: 1,
											},
										],
										direction: "ltr",
										format: "",
										indent: 0,
										type: "paragraph",
										version: 1,
									},
									{
										children: [
											{
												detail: 0,
												format: 0,
												mode: "normal",
												style: "",
												text: "2. INVESTOR ELIGIBILITY",
												type: "text",
												version: 1,
											},
										],
										direction: "ltr",
										format: "",
										indent: 0,
										type: "heading",
										version: 1,
										tag: "h3",
									},
									{
										children: [
											{
												detail: 0,
												format: 0,
												mode: "normal",
												style: "",
												text: "Investors must qualify as accredited investors under applicable securities laws. Investors represent that all information provided during onboarding is accurate and complete. FundLevel reserves the right to verify accreditation status and reject any investor at its discretion.",
												type: "text",
												version: 1,
											},
										],
										direction: "ltr",
										format: "",
										indent: 0,
										type: "paragraph",
										version: 1,
									},
									{
										children: [
											{
												detail: 0,
												format: 0,
												mode: "normal",
												style: "",
												text: "3. INVESTMENT PROCESS",
												type: "text",
												version: 1,
											},
										],
										direction: "ltr",
										format: "",
										indent: 0,
										type: "heading",
										version: 1,
										tag: "h3",
									},
									{
										children: [
											{
												detail: 0,
												format: 0,
												mode: "normal",
												style: "",
												text: "Investments are made through FundLevel's platform. Funds must be transferred via ACH or wire transfer. Investment confirmations will be provided electronically. Investors acknowledge that investments are subject to various risks and may result in loss of principal.",
												type: "text",
												version: 1,
											},
										],
										direction: "ltr",
										format: "",
										indent: 0,
										type: "paragraph",
										version: 1,
									},
									{
										children: [
											{
												detail: 0,
												format: 0,
												mode: "normal",
												style: "",
												text: "4. FEES AND EXPENSES",
												type: "text",
												version: 1,
											},
										],
										direction: "ltr",
										format: "",
										indent: 0,
										type: "heading",
										version: 1,
										tag: "h3",
									},
									{
										children: [
											{
												detail: 0,
												format: 0,
												mode: "normal",
												style: "",
												text: "FundLevel charges a 2% annual management fee and 20% carried interest on profits. Additional fees may apply for specific investments. All fees will be clearly disclosed prior to investment commitment. Wire transfer and other administrative fees may apply.",
												type: "text",
												version: 1,
											},
										],
										direction: "ltr",
										format: "",
										indent: 0,
										type: "paragraph",
										version: 1,
									},
									{
										children: [
											{
												detail: 0,
												format: 0,
												mode: "normal",
												style: "",
												text: "5. GOVERNING LAW",
												type: "text",
												version: 1,
											},
										],
										direction: "ltr",
										format: "",
										indent: 0,
										type: "heading",
										version: 1,
										tag: "h3",
									},
									{
										children: [
											{
												detail: 0,
												format: 0,
												mode: "normal",
												style: "",
												text: "These terms are governed by the laws of Delaware. Any disputes shall be resolved through binding arbitration in Delaware. Investors waive any right to participate in class action lawsuits related to their investments through FundLevel.",
												type: "text",
												version: 1,
											},
										],
										direction: "ltr",
										format: "",
										indent: 0,
										type: "paragraph",
										version: 1,
									},
								],
								direction: "ltr",
								format: "",
								indent: 0,
								type: "root",
								version: 1,
							},
						}),
						...generateTimestamp(),
					},
					description: JSON.stringify({
						root: {
							children: [
								{
									children: [
										{
											detail: 0,
											format: 1,
											mode: "normal",
											style: "",
											text: "Fundlevel Seed Round",
											type: "text",
											version: 1,
										},
									],
									direction: "ltr",
									format: "center",
									indent: 0,
									type: "heading",
									version: 1,
									textFormat: 1,
									tag: "h2",
								},
								{
									children: [
										{
											detail: 0,
											format: 1,
											mode: "normal",
											style: "",
											text: "Who we are",
											type: "text",
											version: 1,
										},
									],
									direction: "ltr",
									format: "",
									indent: 0,
									type: "paragraph",
									version: 1,
									textFormat: 1,
									textStyle: "",
								},
								{
									children: [
										{
											detail: 0,
											format: 0,
											mode: "normal",
											style: "",
											text: "Fundlevel is a fintech company focusing on providing a streamlined fundraising experience. ",
											type: "text",
											version: 1,
										},
									],
									direction: "ltr",
									format: "",
									indent: 1,
									type: "paragraph",
									version: 1,
									textFormat: 0,
									textStyle: "",
								},
								{
									children: [
										{
											detail: 0,
											format: 1,
											mode: "normal",
											style: "",
											text: "Why we are raising",
											type: "text",
											version: 1,
										},
									],
									direction: "ltr",
									format: "",
									indent: 0,
									type: "paragraph",
									version: 1,
									textFormat: 1,
									textStyle: "",
								},
								{
									children: [
										{
											detail: 0,
											format: 0,
											mode: "normal",
											style: "",
											text: "The company is quickly growing and requires financial resources to complete tasks necessary for our core business operations; this includes things like a legal team, compliance advisory, and  payment processing. Our business model does not intrinsically requires a large cash injection to get started - but we do require ",
											type: "text",
											version: 1,
										},
										{
											detail: 0,
											format: 2,
											mode: "normal",
											style: "",
											text: "some",
											type: "text",
											version: 1,
										},
										{
											detail: 0,
											format: 0,
											mode: "normal",
											style: "",
											text: " financing to be able to ",
											type: "text",
											version: 1,
										},
										{ type: "linebreak", version: 1 },
									],
									direction: "ltr",
									format: "",
									indent: 1,
									type: "paragraph",
									version: 1,
									textFormat: 0,
									textStyle: "",
								},
								{
									children: [],
									direction: "ltr",
									format: "center",
									indent: 0,
									type: "paragraph",
									version: 1,
									textFormat: 0,
									textStyle: "",
								},
							],
							direction: "ltr",
							format: "",
							indent: 0,
							type: "root",
							version: 1,
							textFormat: 1,
						},
					}),
					status: "active",
					total_business_shares: 4500000,
					price_per_share_usd_cents: 150,
					total_shares_for_sale: 200000,
					remaining_shares: 1334,
					...generateTimestamp(),
				}),
		}))
	);

	console.log("Seeding completed!");

	process.exit();
})();