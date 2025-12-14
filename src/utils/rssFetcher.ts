export interface RSSItem {
  title: string;
  link: string;
  description: string;
}

export async function fetchRSSFeed(url: string): Promise<RSSItem[]> {
  const items: RSSItem[] = [];

  try {
    const proxies = [
      `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
      `https://corsproxy.io/?${encodeURIComponent(url)}`,
      `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`
    ];

    let rssText = '';

    for (const proxyUrl of proxies) {
      try {
        console.log('Trying proxy:', proxyUrl.substring(0, 60));
        const response = await fetch(proxyUrl);

        if (response.ok) {
          const text = await response.text();

          if (proxyUrl.includes('rss2json') && text.startsWith('{')) {
            const json = JSON.parse(text);
            if (json.status === 'ok' && json.items) {
              return json.items.map((item: any) => ({
                title: item.title || '',
                link: item.link || item.guid || '',
                description: item.description || item.content || ''
              }));
            }
          }

          if (text.includes('<rss') || text.includes('<feed') || text.includes('<item>') || text.includes('<entry>')) {
            rssText = text;
            break;
          }
        }
      } catch (e) {
        console.log('Proxy failed:', e);
        continue;
      }
    }

    if (!rssText) {
      console.log('All proxies failed for:', url);
      return [];
    }

    const itemMatches = rssText.matchAll(/<item[^>]*>([\s\S]*?)<\/item>/gi);

    for (const match of itemMatches) {
      const itemXml = match[1];

      let title = '';
      const titleMatch = itemXml.match(/<title[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i);
      if (titleMatch) title = titleMatch[1].replace(/<[^>]*>/g, '').trim();

      let link = '';
      const linkMatch = itemXml.match(/<link[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/i);
      if (linkMatch) link = linkMatch[1].trim();
      if (!link) {
        const guidMatch = itemXml.match(/<guid[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/guid>/i);
        if (guidMatch) link = guidMatch[1].trim();
      }

      let description = '';
      const descMatch = itemXml.match(/<description[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i);
      if (descMatch) description = descMatch[1].replace(/<[^>]*>/g, ' ').trim().substring(0, 1000);

      if (title && link) {
        items.push({ title, link, description });
      }
    }

    if (items.length === 0) {
      const entryMatches = rssText.matchAll(/<entry[^>]*>([\s\S]*?)<\/entry>/gi);

      for (const match of entryMatches) {
        const entryXml = match[1];

        let title = '';
        const titleMatch = entryXml.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
        if (titleMatch) title = titleMatch[1].replace(/<[^>]*>/g, '').trim();

        let link = '';
        const linkMatch = entryXml.match(/<link[^>]*href=["']([^"']+)["']/i);
        if (linkMatch) link = linkMatch[1];

        let description = '';
        const summaryMatch = entryXml.match(/<summary[^>]*>([\s\S]*?)<\/summary>/i);
        if (summaryMatch) description = summaryMatch[1].replace(/<[^>]*>/g, ' ').trim();

        const contentMatch = entryXml.match(/<content[^>]*>([\s\S]*?)<\/content>/i);
        if (contentMatch && !description) description = contentMatch[1].replace(/<[^>]*>/g, ' ').trim();

        if (title && link) {
          items.push({ title, link, description });
        }
      }
    }

  } catch (e) {
    console.error('RSS fetch error:', e);
  }

  console.log(`Fetched ${items.length} items from RSS`);
  return items;
}
