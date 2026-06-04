import('./src/modules/ai/ai.service.js').then(async (m) => {
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();
  const budget = await prisma.budget.findFirst({ orderBy: { createdAt: 'desc' } });
  console.log('Testing budget ID:', budget.id);
  try {
    await m.generateHeuristicBudget('test', budget.id, 'peru', 'full');
    console.log('Success');
  } catch(e) {
    console.error('ERROR:', e);
  } finally {
    await prisma.$disconnect();
  }
})
