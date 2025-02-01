/**
 * ! Executing this script will delete all data in your database and seed it with 10 users.
 * ! Make sure to adjust the script to your needs.
 * Use any TypeScript runner to run this script, for example: `npx tsx seed.ts`
 * Learn more about the Seed Client by following our guide: https://docs.snaplet.dev/seed/getting-started
 */
import { createSeedClient } from "@snaplet/seed";
import { randomInt } from "crypto";

const generateBusinessRound = () => {
	const total_shares_for_sale = randomInt(1000000);
	const total_business_shares = randomInt(
		total_shares_for_sale + 1000000,
		total_shares_for_sale + 1000000000
	);
	const price_per_share_usd_cents = randomInt(1, 9999) * 100;

	return {
		total_shares_for_sale,
		price_per_share_usd_cents,
		total_business_shares,
	};
};

const generateTimestamp = () => {
	return {
		created_at: new Date().toISOString(),
		updated_at: null,
		deleted_at: null,
	};
};

const generateBusinessDescription = () => {
	const descriptions = [
		`<div style="text-align: center;"><b>Revolutionary Tech Startup</b></div>
		<p>Our <i>innovative platform</i> leverages cutting-edge AI technology to transform the way businesses operate. With a proven track record of <u>300% YoY growth</u>, we're positioned to disrupt the $50B enterprise software market.</p>`,

		`<div style="text-align: center;"><b>Sustainable Energy Solutions</b></div>
		<p>Pioneering the future of <i>renewable energy storage</i>, our patented technology achieves <u>95% efficiency</u> in energy conversion. We're backed by leading climate tech investors and have secured partnerships with major utility providers.</p>`,

		`<div style="text-align: center;"><b>Health Tech Innovation</b></div>
		<p>Our <i>AI-powered diagnostic platform</i> has demonstrated <u>99% accuracy</u> in early disease detection. FDA approval expected in Q4, with letters of intent from 5 major hospital networks.</p>`,
	];
	return descriptions[randomInt(0, descriptions.length - 1)];
};

const generateTermsContent = () => {
	return `<div style="text-align: center;"><b>INVESTMENT TERMS AND CONDITIONS</b></div>
	<p><b>1. Investment Overview</b></p>
	<p>This investment opportunity is offered in accordance with <i>Regulation CF</i> under the Securities Act of 1933.</p>
	
	<p><b>2. Risk Factors</b></p>
	<p><u>Please carefully consider the following risks</u>:</p>
	<ul>
		<li>Limited operating history</li>
		<li>Competitive market conditions</li>
		<li>Regulatory uncertainties</li>
	</ul>
	
	<p><b>3. Investor Rights</b></p>
	<p>Investors will receive <i>Class A Common Shares</i> with the following rights:</p>
	<ul>
		<li>Pro-rata voting rights</li>
		<li>Information rights</li>
		<li>First right of refusal on future rounds</li>
	</ul>`;
};

const main = async () => {
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
		x({ min: 5, max: 10 }, ({ index }) => ({
			...generateTimestamp(),
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
				x(
					{ min: 1, max: 10 },
					{
						round_terms: {
							content: generateTermsContent(),
							...generateTimestamp(),
						},
						description: generateBusinessDescription(),
						...generateBusinessRound(),
						...generateTimestamp(),
					}
				),
		}))
	);

	console.log("Seeding completed!");

	process.exit();
};

main();
