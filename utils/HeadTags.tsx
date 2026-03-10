"use client";

import { useEffect } from 'react';
import TagManager from 'react-gtm-module';

declare global {
  interface Window {
    __gtmLoaded?: boolean;
  }
}

function HeadTags() {
  const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || '';

  useEffect(() => {
    if (GTM_ID && !window.__gtmLoaded) {
      TagManager.initialize({ gtmId: GTM_ID });
      window.__gtmLoaded = true;
    }

    const pinterestMeta = document.createElement('meta');
    pinterestMeta.name = 'p:domain_verify';
    pinterestMeta.content = 'd573b6bb014793eb387845f2183fac45';
    document.head.appendChild(pinterestMeta);

    return () => {
      document.head.removeChild(pinterestMeta);
    };
  }, [GTM_ID]);

  return null;
}

export default HeadTags;
