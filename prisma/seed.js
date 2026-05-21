import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed User Subscription Plans (SaaS)
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

  // Seed Providers and Provider Plans (Catálogo de Proveedores Externos)
  const resend = await prisma.provider.upsert({
    where: { name: "Resend" },
    update: { description: "Transactional Email Service for Developers" },
    create: {
      name: "Resend",
      description: "Transactional Email Service for Developers",
    },
  });

  await prisma.providerPlan.deleteMany({ where: { providerId: resend.id } });
  await prisma.providerPlan.createMany({
    data: [
      {
        providerId: resend.id,
        name: "Free",
        price: 0.00,
        billingCycle: "monthly",
        description: "3,000 emails/month, 100 emails/day, 1 domain",
      },
      {
        providerId: resend.id,
        name: "Pro",
        price: 20.00,
        billingCycle: "monthly",
        description: "50,000 emails/month, unlimited domains, dedicated IP options",
      },
    ],
  });

  const mailgun = await prisma.provider.upsert({
    where: { name: "Mailgun" },
    update: { description: "Email Delivery and Automation Service" },
    create: {
      name: "Mailgun",
      description: "Email Delivery and Automation Service",
    },
  });

  await prisma.providerPlan.deleteMany({ where: { providerId: mailgun.id } });
  await prisma.providerPlan.createMany({
    data: [
      {
        providerId: mailgun.id,
        name: "Trial",
        price: 0.00,
        billingCycle: "monthly",
        description: "5,000 emails/month for 3 months, tracking and analytics",
      },
      {
        providerId: mailgun.id,
        name: "Foundation",
        price: 35.00,
        billingCycle: "monthly",
        description: "50,000 emails/month, 24/7 support, inbound routing",
      },
    ],
  });

  const sendgrid = await prisma.provider.upsert({
    where: { name: "Sendgrid" },
    update: { description: "Email Delivery, Marketing, and API Service" },
    create: {
      name: "Sendgrid",
      description: "Email Delivery, Marketing, and API Service",
    },
  });

  await prisma.providerPlan.deleteMany({ where: { providerId: sendgrid.id } });
  await prisma.providerPlan.createMany({
    data: [
      {
        providerId: sendgrid.id,
        name: "Free",
        price: 0.00,
        billingCycle: "monthly",
        description: "100 emails/day, ticket support, design editor",
      },
      {
        providerId: sendgrid.id,
        name: "Essentials",
        price: 19.95,
        billingCycle: "monthly",
        description: "50,000 emails/month, analytics, automated warmup",
      },
    ],
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
