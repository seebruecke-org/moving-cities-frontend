import { fetchAPI } from '@/lib/api';
import { getBlockFragments } from '@/lib/blocks';
import { i18n } from '../next-i18next.config';
import { getTranslations } from '@/lib/global';
import { createInstance } from 'i18next';

export async function fetchNewsEntryBySlug(client, slug) {
  const data = await fetchAPI(
    client,
    `
            query NewsEntryBySlug($slug: String) {
                newsEntries(filters: { slug: { eq: $slug } }) {
                    data {
                        attributes {
                            createdAt
                            title
                            slug
                            category
                            date
                            isPinned
                            image {
                                data {
                                    attributes {
                                        url
                                    }
                                }
                            }
                            
                            content {
                                __typename
                                ${getBlockFragments([
                                  'Media',
                                  'Section',
                                  'Quote',
                                  'DownloadSection',
                                  'VideoEmbed',
                                  'MultiCollapsible'
                                ])}
                            }
                        }
                    }
                }
            }
        `,
    { slug }
  );

  if (!data) {
    return null;
  }

  const { newsEntries } = data;
  return newsEntries[0];
}

export async function fetchNewsLocalizationsBySlug(slug) {
  const { locales } = i18n;
  return await locales?.reduce(async (a, v) => {
    const { _nextI18Next: nextI18Next } = await getTranslations(v, []);
    const i18n = await createInstance({
      ...nextI18Next?.userConfig,
      lng: v,
      resources: nextI18Next?.initialI18nStore
    });
    await i18n.init();
    return { ...(await a), [v]: `/${v}/${i18n.t('news', { ns: 'slugs', lng: v })}/${slug}` };
  }, {});
}

export async function fetchAllNewsEntries(client) {
  const { newsEntries } = await fetchAPI(
    client,
    `
        query AllNewsEntries {
            newsEntries: newsEntries {
                data {
                    attributes {
                        title
                        slug
                        category
                        teaser
                        date
                        isPinned
                        image {
                            data {
                                attributes {
                                    url
                                }
                            }
                        }
                        
                        content {
                            __typename
                            ${getBlockFragments([
                              'Media',
                              'Section',
                              'Quote',
                              'DownloadSection',
                              'VideoEmbed',
                              'MultiCollapsible'
                            ])}
                        }
                    }
                }
            }
        }
        `
  );

  return newsEntries;
}

export async function fetchNewsLocalizations() {
  const { locales } = i18n;
  return await locales?.reduce(async (a, v) => {
    const { _nextI18Next: nextI18Next } = await getTranslations(v, []);
    const i18n = await createInstance({
      ...nextI18Next?.userConfig,
      lng: v,
      resources: nextI18Next?.initialI18nStore
    });
    await i18n.init();
    return { ...(await a), [v]: `/${v}/${i18n.t('news', { ns: 'slugs', lng: v })}` };
  }, {});
}

export async function fetchAllNewsEntryPaths(client) {
  const { newsEntries } = await fetchAPI(
    client,
    `
        query AllNewsEntryPaths {
            newsEntries: newsEntries {
                data {
                    attributes {
                        slug
                    }
                }
            }
        }
        `
  );

  return newsEntries;
}
