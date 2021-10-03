import { PrismaClient } from '.prisma/client';

const prisma = new PrismaClient();

const main = async () => {
  const users = await prisma.user.findMany();
};

main()
  .catch((error) => {
    throw error;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
