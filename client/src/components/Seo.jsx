/**
 * Per-page SEO: title, description, Open Graph, canonical, and optional JSON-LD.
 * Powered by react-helmet-async. See /docs/architecture.md — "SEO".
 */
import { Helmet } from 'react-helmet-async';
import { ORG } from '../lib/site.js';

const SITE_URL = import.meta.env.VITE_SITE_URL || ORG.url;

export default function Seo({ title, description, path = '/', image, jsonLd }) {
  const fullTitle = title ? `${title} · ${ORG.name}` : `${ORG.name} — ${ORG.tagline}`;
  const url = `${SITE_URL}${path}`;
  const desc =
    description ||
    `${ORG.name} brings primary healthcare and humanitarian aid to underserved communities across ${ORG.regions.join(', ')}.`;
  const ogImage = image || `${SITE_URL}/og-cover.png`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={ORG.name} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={ogImage} />

      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  );
}

/** Organisation JSON-LD — included once on the home page. */
export const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'NGO',
  name: ORG.name,
  url: ORG.url,
  email: ORG.email,
  telephone: ORG.phone,
  foundingDate: String(ORG.founded),
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Aarogya Bhavan, Boring Road',
    addressLocality: 'Patna',
    addressRegion: 'Bihar',
    postalCode: '800001',
    addressCountry: 'IN',
  },
  areaServed: ORG.regions,
  sameAs: Object.values(ORG.social),
};
