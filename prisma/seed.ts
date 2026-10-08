import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.plan.upsert({
    where: { id: "free" },
    update: {
      displayName: "Free",
      monthlyCredits: 10,
      amountPaise: 0,
      sortOrder: 0,
      isPublic: true,
    },
    create: {
      id: "free",
      displayName: "Free",
      monthlyCredits: 10,
      amountPaise: 0,
      sortOrder: 0,
    },
  });

  await prisma.plan.upsert({
    where: { id: "pro" },
    update: {
      displayName: "Pro",
      monthlyCredits: 500,
      amountPaise: 149900,
      sortOrder: 1,
      isPublic: true,
    },
    create: {
      id: "pro",
      displayName: "Pro",
      monthlyCredits: 500,
      amountPaise: 149900,
      sortOrder: 1,
    },
  });

  await prisma.plan.upsert({
    where: { id: "business" },
    update: {
      displayName: "Business",
      monthlyCredits: 2500,
      amountPaise: 499900,
      sortOrder: 2,
      isPublic: true,
    },
    create: {
      id: "business",
      displayName: "Business",
      monthlyCredits: 2500,
      amountPaise: 499900,
      sortOrder: 2,
    },
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
