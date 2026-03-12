import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/login',
          '/otp',
          '/otp-submitted',
          '/dealer-login',
          '/profile-edit',
          '/upload-documents',
          '/sell-form-submitted',
          '/sell-car-edit/',
          '/my-transactions',
          '/partners-account',
          '/city-filter',
        ],
      },
      {
        userAgent: 'GPTBot',
        allow: '/',
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
      },
      {
        userAgent: 'Claude-Web',
        allow: '/',
      },
      {
        userAgent: 'Anthropic-AI',
        allow: '/',
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
      },
    ],
    sitemap: 'https://nxcar.in/sitemap.xml',
  };
}
