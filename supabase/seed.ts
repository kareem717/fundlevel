/**
 * ! Executing this script will delete all data in your database and seed it with 10 users.
 * ! Make sure to adjust the script to your needs.
 * Use any TypeScript runner to run this script, for example: `npx tsx seed.ts`
 * Learn more about the Seed Client by following our guide: https://docs.snaplet.dev/seed/getting-started
 */
import { createSeedClient } from "@snaplet/seed";


const generateRoundDates = () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const endDate = new Date(tomorrow);
  endDate.setDate(endDate.getDate() + 30); // Setting end date 30 days after begins_at

  return {
    begins_at: tomorrow,
    ends_at: endDate
  }
}

const main = async () => {
  const seed = await createSeedClient();

  // Truncate all tables in the database
  await seed.$resetDatabase();

  // Seed the database with 10 users
  await seed.users((x) => x(10));

  await seed.industries((x) => x(50));

  await seed.accounts((x) => x(10, {
    businesses: (x) => x({ min: 0, max: 5 }, {
      business_industries: (x) => x({ min: 1, max: 8 }),
      ventures: (x) => x({ min: 0, max: 15 }, {
        rounds: (x) => x({ min: 0, max: 1 }, {
          ...generateRoundDates()
        })
      })
    })
  }));

  console.log("Database seeding completed!");

  process.exit();
};

main();