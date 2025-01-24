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
							content: "Just pretend this is a real terms of service",
							...generateTimestamp(),
						},
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
