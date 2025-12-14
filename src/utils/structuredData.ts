export const getOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "MaSécurité.be",
  "url": "https://masecurite.be",
  "logo": "https://masecurite.be/green_modern_marketing_logo.png",
  "description": "Protection complète pour votre famille et votre vie numérique. Solutions de cybersécurité simples et efficaces pour particuliers en Belgique.",
  "telephone": "+32-1-618-60-98",
  "email": "contact@masecurite.be",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "BE",
    "addressRegion": "Belgique"
  },
  "sameAs": [],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+32-1-618-60-98",
    "contactType": "Customer Support",
    "availableLanguage": ["French", "Dutch", "English"],
    "areaServed": "BE"
  }
});

export const getWebSiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "MaSécurité.be",
  "url": "https://masecurite.be",
  "description": "Protection complète pour votre famille et votre vie numérique",
  "publisher": {
    "@type": "Organization",
    "name": "MaSécurité.be"
  }
});

export const getServiceSchema = (serviceName: string, serviceDescription: string, price?: string) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": serviceName,
  "provider": {
    "@type": "Organization",
    "name": "MaSécurité.be"
  },
  "description": serviceDescription,
  "areaServed": "BE",
  ...(price && {
    "offers": {
      "@type": "Offer",
      "price": price,
      "priceCurrency": "EUR"
    }
  })
});

export const getBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

export const getFAQSchema = (faqs: Array<{ question: string; answer: string }>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});
