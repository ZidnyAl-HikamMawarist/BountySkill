import { test, expect } from '@playwright/test';

test.describe('SkillBounty Comprehensive E2E Tests', () => {

  test('Page 1: Landing Page renders Hero, Pipeline, Showcase & Trust', async ({ page }) => {
    await page.goto('/');
    
    // Check Brand & Hero headline
    await expect(page.locator('h1')).toContainText('Bukti Nyata');
    await expect(page.locator('h1')).toContainText('Bukan Sekadar CV');

    // Check Cold-start / Live banner
    await expect(page.locator('#cold-start-banner')).toBeVisible();

    // Check CTAs
    const cariBtn = page.getByRole('link', { name: 'Cari Bounty' });
    await expect(cariBtn).toBeVisible();

    const postingBtn = page.getByRole('link', { name: 'Posting Tugas' });
    await expect(postingBtn).toBeVisible();

    // Check Pipeline 3-step section
    await expect(page.getByText('Pipeline Pengerjaan Transparan')).toBeVisible();
    await expect(page.getByText('Posting & Deposit Escrow')).toBeVisible();
    await expect(page.getByText('Talent Kerjakan & Submit')).toBeVisible();
    await expect(page.getByText('Review & Dana Cair')).toBeVisible();
  });

  test('Page 2: Register Page - Role Toggle & Form Validation', async ({ page }) => {
    await page.goto('/register');

    await expect(page.locator('h1')).toContainText('Bergabung di SkillBounty');
    
    // Toggle role to Client
    const clientRoleBtn = page.getByRole('button', { name: /Klien \/ UMKM/i });
    await clientRoleBtn.click();

    // Toggle role back to Talent
    const talentRoleBtn = page.getByRole('button', { name: /Talent \/ Developer/i });
    await talentRoleBtn.click();

    // GitHub button exists
    await expect(page.getByText('Daftar Cepat dengan GitHub')).toBeVisible();

    // Password strength meter
    const pwdInput = page.locator('input[type="password"]');
    await pwdInput.fill('secret123');
    await expect(page.getByText('Kekuatan Sandi:')).toBeVisible();
  });

  test('Page 3: Login Page - Role Redirection & Quick Login Demo', async ({ page }) => {
    await page.goto('/login');

    await expect(page.locator('h1')).toContainText('Masuk ke SkillBounty');

    // Test Quick Demo Login as Talent
    await page.locator('#btn-demo-login-talent').click();
    await expect(page).toHaveURL(/.*\/talent\/dashboard/);
  });

  test('Page 4: Marketplace Bounty - Search & Filters', async ({ page }) => {
    await page.goto('/bounties');

    await expect(page.locator('h1')).toContainText('Marketplace Micro-Bounty');

    // Search filter
    const searchInput = page.locator('input[placeholder*="Cari bounty"]');
    await searchInput.fill('Next.js');
    await expect(page.getByText('Slicing Landing Page Figma').first()).toBeVisible();

    // Clear search and test category filter
    await searchInput.fill('');
    const categorySelect = page.locator('select').first();
    await categorySelect.selectOption('Bug Fixing');
    await expect(page.getByText('Fix Bug Infinite Re-render').first()).toBeVisible();
  });

  test('Page 5: Detail Bounty & Criteria Checklist', async ({ page }) => {
    await page.goto('/bounties/bounty-1');

    await expect(page.locator('h1')).toContainText('Slicing Landing Page');
    await expect(page.getByText('Kriteria Kelulusan Submission')).toBeVisible();
    await expect(page.getByText('REKENING BERSAMA (ESCROW)')).toBeVisible();
  });

  test('Page 6: Public Talent Profile & Live Iframe Preview', async ({ page }) => {
    await page.goto('/talent/user-talent-1');

    await expect(page.locator('h1')).toContainText('Budi Pratama');
    await expect(page.getByText('Portofolio Interaktif (Live Demo)')).toBeVisible();
    await expect(page.getByText('LIVE 200 OK').first()).toBeVisible();
  });

  test('Page 7: Talent Dashboard - Balance & Task History Tabs', async ({ page }) => {
    await page.goto('/talent/dashboard');

    await expect(page.locator('h1')).toContainText('Selamat Datang');
    await expect(page.getByText('SALDO DOMPET TERSEDIA')).toBeVisible();
    await expect(page.getByText('Riwayat Pengerjaan Tugas')).toBeVisible();

    // Tab filter
    await page.getByRole('button', { name: 'Selesai' }).click();
    await expect(page.getByText('Fix Bug Infinite Re-render')).toBeVisible();
  });

  test('Page 8: Portfolio CRUD - Add & Live URL Preview', async ({ page }) => {
    await page.goto('/talent/portfolio');

    await expect(page.locator('h1')).toContainText('Kelola Portofolio Interaktif');

    // Open Add Modal
    await page.getByRole('button', { name: 'Tambah Portofolio Baru' }).first().click();
    await expect(page.getByText('PRATINJAU LANGSUNG (LIVE PREVIEW EMBED):')).toBeVisible();

    // Close modal
    await page.getByRole('button', { name: 'Batal' }).click();
  });

  test('Page 9: Form Submission Tugas with Revision Tracker', async ({ page }) => {
    await page.goto('/bounties/bounty-1/submit');

    await expect(page.locator('h1')).toContainText('Kirim Submission Hasil Kerja');
    await expect(page.locator('label:has-text("LIVE DEMO URL")')).toBeVisible();
    await expect(page.locator('label:has-text("REPOSITORI KODE")')).toBeVisible();
  });

  test('Page 10: Talent Wallet - Balance & Payout Request Form', async ({ page }) => {
    await page.goto('/talent/wallet');

    await expect(page.locator('h1')).toContainText('Dompet & Penarikan Dana');
    await expect(page.getByText('SALDO DOMPET BERSIH')).toBeVisible();
    await expect(page.getByText('Form Pengajuan Penarikan Dana (Payout)')).toBeVisible();
  });

  test('Page 11: Client Dashboard - Escrow Monitoring & Review Action', async ({ page }) => {
    await page.goto('/client/dashboard');

    await expect(page.getByText('DASHBOARD KLIEN / UMKM')).toBeVisible();
    await expect(page.getByText('DANA TERKUNCI DI ESCROW')).toBeVisible();
    await expect(page.getByText('Daftar Bounty yang Anda Buat')).toBeVisible();
  });

  test('Page 12: Buat Bounty - 2-Step Wizard & Escrow Deposit', async ({ page }) => {
    await page.goto('/client/bounties/create');

    await expect(page.locator('h1')).toContainText('Spesifikasi Micro-Bounty');
    
    // Fill step 1
    await page.locator('input[placeholder*="Slicing Landing Page"]').fill('Pembuatan Landing Page Next.js');
    await page.locator('textarea[placeholder*="Jelaskan ruang lingkup"]').fill('Slicing tampilan web dan integrasi API sederhana');

    // Advance to step 2
    await page.getByRole('button', { name: /Lanjut ke Pembayaran Escrow/i }).click();
    await expect(page.locator('h1')).toContainText('Deposit Rekening Bersama (Escrow)');
    await expect(page.getByText('PILIH METODE PEMBAYARAN ESCROW:')).toBeVisible();
  });

  test('Page 13: Client Review Submission - Approve, Revision & Dispute', async ({ page }) => {
    await page.goto('/client/bounties/bounty-1/review/sub-1');

    await expect(page.locator('h1')).toContainText('Slicing Landing Page');
    await expect(page.getByText('Verifikasi Kriteria Kelulusan')).toBeVisible();

    // Verify 3 Action Buttons Exist
    await expect(page.getByRole('button', { name: /Setujui & Cairkan Dana/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Minta Revisi/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Ajukan Dispute/i })).toBeVisible();
  });

  test('Page 14: Review & Rating (2-Way Feedback)', async ({ page }) => {
    await page.goto('/bounties/bounty-3/review-feedback');

    await expect(page.locator('h1')).toContainText('Beri Rating & Ulasan Talenta');
    await expect(page.getByText('BERIKAN BINTANG:')).toBeVisible();
  });

  test('Page 15: Admin Dashboard - Dispute & Payout Metrics', async ({ page }) => {
    await page.goto('/admin/dashboard');

    await expect(page.locator('h1')).toContainText('SkillBounty Admin Hub');
    await expect(page.getByText('SENGKETA AKTIF')).toBeVisible();
    await expect(page.getByText('PENARIKAN MENUNGGU')).toBeVisible();
    await expect(page.getByText('TOTAL VOLUME ESCROW')).toBeVisible();
  });

  test('Page 16: Admin Dispute Moderation Case & Decision', async ({ page }) => {
    await page.goto('/admin/disputes/disp-1');

    await expect(page.locator('h1')).toContainText('Slicing Desain Checkout Form');
    await expect(page.getByText('Argumen Kedua Belah Pihak')).toBeVisible();
    await expect(page.getByText('Pemeriksaan Bukti Digital')).toBeVisible();
    await expect(page.getByText('Eksekusi Putusan Dana')).toBeVisible();
  });

  test('Page 17: Admin Withdrawal Verification Queue', async ({ page }) => {
    await page.goto('/admin/withdrawals');

    await expect(page.locator('h1')).toContainText('Verifikasi Penarikan Dana (Payout)');
    await expect(page.getByRole('main').getByText('Budi Pratama', { exact: true })).toBeVisible();
  });

  test('Page 18: Design System & State Kit Showcase', async ({ page }) => {
    await page.goto('/states-demo');

    await expect(page.locator('h1')).toContainText('Design System & State Kit Showcase');
    await expect(page.getByText('CI/CD Style Status Badges')).toBeVisible();
    await expect(page.getByText('Skeleton Loading States')).toBeVisible();
    await expect(page.getByText('Reusable Empty State Component')).toBeVisible();
    await expect(page.getByText('Reusable Error State Component')).toBeVisible();
  });

});
