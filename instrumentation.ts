export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { pool } = await import('./lib/db');

    const urlUpdates: [number, string][] = [
      [1, 'https://www.nxcar.in/blog/category/blog/why-buying-a-brand-new-car-is-the-dumbest-financial-decision-youll-ever-make-1768657322354-30'],
      [2, 'https://www.nxcar.in/blog/category/blog'],
      [3, 'https://www.nxcar.in/blog/category/blog/modern-car-infotainment-systems-are-actively-dangerous-1768657322467-59'],
      [4, 'https://www.nxcar.in/blog/category/blog/the-uncomfortable-truth-about-car-safety-in-india-1768657322464-58'],
      [5, 'https://www.nxcar.in/blog/category/blog/why-your-next-car-should-be-boring-1768657322460-57'],
      [6, 'https://www.nxcar.in/blog/category/news/renault-announces-india-specific-electric-platform-for-sub-rs-10-lakh-evs-1768657322325-22'],
      [7, 'https://www.nxcar.in/blog/category/news/autonomous-vehicle-testing-gets-green-signal-on-delhi-mumbai-expressway-1768657322339-26'],
      [8, 'https://www.nxcar.in/blog/category/news/flex-fuel-vehicles-launched-as-government-pushes-ethanol-blending-1768657322346-28'],
      [9, 'https://www.nxcar.in/blog/category/news/two-wheeler-sales-hit-record-25-million-units-amid-electric-shift-1768657322343-27'],
      [10, 'https://www.nxcar.in/blog/category/news/auto-component-sector-achieves-record-exports-of-22-billion-1768657322335-25'],
      [11, 'https://www.nxcar.in/blog/category/insights/engine-oil-viscosity-and-specifications-decoded-1768657322552-89'],
      [12, 'https://www.nxcar.in/blog/category/insights/suspension-geometry-understanding-what-makes-cars-handle-1768657322549-88'],
      [13, 'https://www.nxcar.in/blog/category/insights/wheel-alignment-science-and-specifications-explained-1768657322547-87'],
      [14, 'https://www.nxcar.in/blog/category/culture/bollywoods-love-affair-with-imported-cars-1768657322673-130'],
      [15, 'https://www.nxcar.in/blog/category/insights/understanding-vehicle-electrical-systems-12v-to-48v-migration-1768657322544-86'],
      [16, 'https://www.nxcar.in/blog/category/culture'],
      [17, 'https://www.nxcar.in/blog/category/research/urban-mobility-patterns-post-pandemic-a-gps-analysis-1768657322587-101'],
      [18, 'https://www.nxcar.in/blog/category/research/connected-vehicle-data-privacy-consumer-attitudes-and-regulatory-frameworks-1768657322638-119'],
      [19, 'https://www.nxcar.in/blog/category/research/vehicle-end-of-life-management-informal-recycling-sector-analysis-1768657322636-118'],
      [20, 'https://www.nxcar.in/blog/category/research/mobility-as-a-service-integration-challenges-in-indian-urban-contexts-1768657322630-116'],
      [21, 'https://www.nxcar.in/blog/category/news/flex-fuel-vehicles-launched-as-government-pushes-ethanol-blending-1768657322346-28'],
      [22, 'https://www.nxcar.in/blog/category/news/two-wheeler-sales-hit-record-25-million-units-amid-electric-shift-1768657322343-27'],
      [23, 'https://www.nxcar.in/blog/category/news/autonomous-vehicle-testing-gets-green-signal-on-delhi-mumbai-expressway-1768657322339-26'],
      [24, 'https://www.nxcar.in/blog/category/news/auto-component-sector-achieves-record-exports-of-22-billion-1768657322335-25'],
      [25, 'https://www.nxcar.in/blog/category/blog/why-buying-a-brand-new-car-is-the-dumbest-financial-decision-youll-ever-make-1768657322354-30'],
      [26, 'https://www.nxcar.in/blog/category/blog/modern-car-infotainment-systems-are-actively-dangerous-1768657322467-59'],
      [27, 'https://www.nxcar.in/blog/category/blog/why-you-should-never-buy-a-car-in-the-first-month-of-launch-1768657322385-38'],
      [28, 'https://www.nxcar.in/blog/category/blog/the-real-reason-your-car-insurance-claim-got-rejected-1768657322457-56'],
      [29, 'https://www.nxcar.in/blog/category/blog'],
    ];

    try {
      const client = await pool.connect();
      try {
        let updated = 0;
        for (const [id, url] of urlUpdates) {
          const result = await client.query(
            'UPDATE blog_articles SET external_url = $1 WHERE id = $2 AND external_url IS DISTINCT FROM $1',
            [url, id]
          );
          updated += result.rowCount || 0;
        }
        if (updated > 0) {
          console.log(`[blog-migration] Fixed ${updated} blog article URLs`);
        }
      } finally {
        client.release();
      }
    } catch (err) {
      console.error('[blog-migration] Failed to fix blog URLs:', err);
    }
  }
}
