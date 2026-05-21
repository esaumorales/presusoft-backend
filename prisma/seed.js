import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.plan.upsert({
    where: { name: "Free" },
    update: {},
    create: {
      name: "Free",
      price: 0,
      billingCycle: "monthly",
      maxBudgets: 5,
      maxClients: 10,
      hasAi: false,
      hasExports: false,
      hasTeam: false,
    },
  });

  await prisma.plan.upsert({
    where: { name: "Pro" },
    update: {},
    create: {
      name: "Pro",
      price: 29,
      billingCycle: "monthly",
      maxBudgets: 100,
      maxClients: 200,
      hasAi: false,
      hasExports: true,
      hasTeam: false,
    },
  });

  await prisma.plan.upsert({
    where: { name: "Business" },
    update: {},
    create: {
      name: "Business",
      price: 79,
      billingCycle: "monthly",
      maxBudgets: 1000,
      maxClients: 1000,
      hasAi: true,
      hasExports: true,
      hasTeam: true,
    },
  });

  console.log("Seed ejecutado correctamente");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
