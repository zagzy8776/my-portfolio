import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title?: string
  description?: string
  path?: string
  image?: string
  type?: 'website' | 'article'
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
}

const SITE = 'https://portfolios-ruby-alpha.vercel.app'
const DEFAULT_TITLE = 'Zagzy Link — Portfolio'
const DEFAULT_DESC =
  'Portfolio of Zagzy Link — creative fullstack founder based in Nigeria. Selected work in fintech, media, clinical systems, and digital products.'

export default function SEO({
  title,
  description = DEFAULT_DESC,
  path = '',
  image = `${SITE}/isdore.png`,
  type = 'website',
  jsonLd,
}: SEOProps) {
  const fullTitle = title ? `${title} · Zagzy Link` : DEFAULT_TITLE
  const url = `${SITE}${path}`

  const personLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Ekenedirichukwu Isdore Amadi',
    alternateName: 'Zagzy Link',
    url: SITE,
    jobTitle: 'Founder & Full-stack Engineer',
    worksFor: {
      '@type': 'Organization',
      name: 'Vura Tech Hub',
    },
    sameAs: [
      'https://github.com/zagzy8776',
      'https://x.com/zagzylinks',
      'https://www.linkedin.com/in/isidore-amadi-2494061b2',
    ],
    email: 'amadiisdore92@gmail.com',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'NG',
    },
  }

  const graph = Array.isArray(jsonLd)
    ? [personLd, ...jsonLd]
    : jsonLd
      ? [personLd, jsonLd]
      : [personLd]

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Zagzy Link" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      <script type="application/ld+json">{JSON.stringify(graph)}</script>
    </Helmet>
  )
}
