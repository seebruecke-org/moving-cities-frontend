import { createClient } from '@/lib/api';
import { fetchMenu } from '@/lib/menu';
import { getTranslations } from '@/lib/global';
import { useTranslation } from 'next-i18next';
import { fetchAllNewsEntries, fetchNewsLocalizations } from '@/lib/news';
import NewsEntry from '@/components/NewsEntry';
import { fetchFooter } from '@/lib/footer';
import { fetchCounts } from '@/lib/cities';

export default function NewsOverviewPage({ newsEntries }) {
  const { t: tNews } = useTranslation('news');
  const { t: tSlugs } = useTranslation('slugs');

  return (
    <div className="mx-6 md:ml-72 md:mr-16 md:pr-0 pb-10 max-w-8xl">
      <h1 className="my-10 md:mt-20 md:mb-28 text-4xl md:text-5xl xl:text-6xl leading-none font-bold font-raptor">
        {tNews('news')}
      </h1>

      <p className="leading-tight font-raptor text-m md:text-xl xl:text-2xl md:font-bold">
        {tNews('intro')}
      </p>

      <ul className="grid grid-cols-1 md:grid-cols-3 gap-8 my-12">
        {newsEntries
          ?.sort((a, b) => new Date(b.date) - new Date(a.date))
          ?.map((newsEntry) => (
            <li>
              <NewsEntry {...newsEntry} uri={`/${tSlugs('news')}/${newsEntry.slug}`} />
            </li>
          ))}
      </ul>
    </div>
  );
}

export async function getStaticProps({ locale }) {
  const translations = await getTranslations(locale, ['news']);
  const client = createClient();
  const newsEntries = await fetchAllNewsEntries(client);
  const localizations = await fetchNewsLocalizations();
  const menu = await fetchMenu(client, locale);
  const footer = await fetchFooter(client, locale);
  const counts = await fetchCounts(client, locale);

  return {
    revalidate: 240,
    props: {
      ...translations,
      menu,
      footer,
      newsEntries,
      localizations,
      counts
    }
  };
}
