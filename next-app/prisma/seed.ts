import prisma from "../lib/db";

async function main() {
  await prisma.gameId.upsert({
    where: { id: 1 },
    update: {},
    create: {
      currGameId: 1,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    console.log("db seeding completed");
  });
