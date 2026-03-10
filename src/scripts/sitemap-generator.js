import fs from 'fs';

const baseUrl = 'https://www.nxcar.in';

const routes = [
  '/',
  '/about',
  '/used-car-loan',
  '/calculator',
  '/car-services',
  '/partner',
  '/contact-us',
  '/sell',
  '/sell-used-cars-gurugram',
  '/used-cars',
  '/refer-to-friend',
  '/my-cars',
  '/my-transactions',
  '/profile-edit',
  '/blogs-of-nxcar',
  '/faq',
  '/privacy-policy',
  '/terms',
  '/grievance-policy',
  '/service-partner',
  '/extended-warranty-terms',
  '/login',
  '/loan-eligibility',
  '/insurance-check',
  '/challan-check',
  '/rc-check',
  '/rc-details',
  '/carscope',
  '/dealers',
  '/favorites',
  '/test-drive',
];

const cities = [
  'delhi', 'gurgaon', 'noida', 'faridabad', 'ghaziabad',
  'chandigarh', 'ludhiana', 'jalandhar', 'amritsar', 'mohali',
  'panchkula', 'jaipur', 'lucknow', 'meerut', 'dehradun',
  'gautam-buddha-nagar', 'mumbai', 'pune', 'ahmedabad', 'surat',
  'vadodara', 'nagpur', 'chennai', 'bangalore', 'hyderabad',
  'coimbatore', 'kochi', 'thiruvananthapuram', 'kolkata', 'patna',
  'bhubaneswar', 'cuttack', 'ranchi', 'gorakhpur', 'allahabad',
];

const today = new Date().toISOString();

let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

routes.forEach(route => {
  xml += `  <url>\n    <loc>${baseUrl}${route}</loc>\n    <lastmod>${today}</lastmod>\n  </url>\n`;
});

cities.forEach(city => {
  xml += `  <url>\n    <loc>${baseUrl}/used-cars/${city}</loc>\n    <lastmod>${today}</lastmod>\n  </url>\n`;
});

xml += `</urlset>\n`;

fs.writeFileSync('public/sitemap.xml', xml);

console.info('✅ Sitemap generated successfully!');
