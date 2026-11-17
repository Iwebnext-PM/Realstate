import React, { useEffect } from 'react';
import { useSite } from '../context/SiteContext';

interface DocumentHeadProps {
  title?: string;
  description?: string;
  ogImage?: string;
  jsonLd?: Record<string, unknown>;
}

export const DocumentHead: React.FC<DocumentHeadProps> = ({
  title,
  description,
  ogImage,
  jsonLd,
}) => {
  const { seoConfig, generalConfig } = useSite();

  const finalTitle = title || seoConfig.defaultTitle || generalConfig.businessName;
  const finalDescription = description || seoConfig.defaultDescription;
  const finalImage = ogImage || seoConfig.ogImageUrl;

  useEffect(() => {
    document.title = finalTitle;

    const setMeta = (selector: string, attrName: 'name' | 'property', attrVal: string, content: string) => {
      if (!content) return;
      let el = document.querySelector<HTMLMetaElement>(selector);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attrVal);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('meta[name="description"]', 'name', 'description', finalDescription);
    setMeta('meta[property="og:title"]', 'property', 'og:title', finalTitle);
    setMeta('meta[property="og:description"]', 'property', 'og:description', finalDescription);
    setMeta('meta[property="og:site_name"]', 'property', 'og:site_name', generalConfig.businessName);
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', finalTitle);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', finalDescription);

    if (finalImage) {
      setMeta('meta[property="og:image"]', 'property', 'og:image', finalImage);
      setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', finalImage);
    }

    const currentUrl = window.location.origin + window.location.pathname;
    setMeta('meta[property="og:url"]', 'property', 'og:url', currentUrl);

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = currentUrl;

    if (generalConfig.faviconUrl) {
      let favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
      if (!favicon) {
        favicon = document.createElement('link');
        favicon.rel = 'icon';
        document.head.appendChild(favicon);
      }
      favicon.href = generalConfig.faviconUrl;
    }

    const scriptId = 'dynamic-jsonld-schema';
    const existingScript = document.getElementById(scriptId);
    if (jsonLd) {
      const script = existingScript || document.createElement('script');
      script.id = scriptId;
      script.setAttribute('type', 'application/ld+json');
      script.textContent = JSON.stringify(jsonLd);
      if (!existingScript) {
        document.head.appendChild(script);
      }
    } else if (existingScript) {
      existingScript.remove();
    }
  }, [finalTitle, finalDescription, finalImage, generalConfig.businessName, generalConfig.faviconUrl, jsonLd]);

  return null;
};
