import prisma from '../src/lib/prisma';

async function enableRLS() {
  const tables = [
    'User',
    'PortfolioItem',
    'Bounty',
    'Submission',
    'Escrow',
    'Dispute',
    'Review',
    'Withdrawal'
  ];

  console.log('🔒 Enabling Row Level Security (RLS) on all Supabase tables...');

  for (const table of tables) {
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "${table}" ENABLE ROW LEVEL SECURITY;`);
      console.log(`✅ RLS successfully enabled for table: "${table}"`);
    } catch (error) {
      console.error(`❌ Failed to enable RLS for "${table}":`, error);
    }
  }

  console.log('🎉 All tables in Supabase now have Row Level Security enabled!');
}

enableRLS()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
