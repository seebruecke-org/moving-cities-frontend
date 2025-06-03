import Heading from '@/components/Heading';
import { useTranslation } from 'next-i18next';
import { getTranslations } from '@/lib/global';
import { createClient } from '@/lib/api';
import { fetchMenu } from '@/lib/menu';
import { fetchFooter } from '@/lib/footer';
import { useState } from 'react';
import SearchIcon from '@/components/Menu/assets/Search';
import Link from 'next/link';
import { fetchCounts } from '@/lib/cities';

export default function Search({ locale }) {
  const { t } = useTranslation('search');
  const { t: tSlugs } = useTranslation('slugs');

  const typeSlugs = {
    approaches: `/${tSlugs('approaches')}`,
    cities: '',
    networks: `/${tSlugs('networks')}`,
    'news-entries': `/${tSlugs('news')}`
  };

  const [searchString, setSearchString] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setIsLoading(true);
    const response = await fetch(`/api/search?locale=${locale}&query=${searchString}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const json = await response.json();
    setIsLoading(false);
    setResults(json?.results?.filter((item) => !!item));
  };

  return (
    <div className="md:flex pb-10 md:pb-0">
      <article>
        <Heading level={1} className="pl-8 md:pl-10 pt-10 md:pt-10 mb-4 md:mb-20 max-w-full">
          {t('title')}
        </Heading>

        <form className="px-8 md:px-10 max-w-8xl mt-8 md:mt-24 flex" onSubmit={handleSubmit}>
          <input
            className="text-l font-raptor border-2 px-4 py-2 w-[50vw] max-w-[400px] block"
            type={'text'}
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
            autoFocus={true}
          />
          <button
            type={'submit'}
            className="text-l font-raptor border-2 border-black -ml-1 px-4 py-2 text-white bg-pink-300 disabled:bg-grey-300"
            disabled={isLoading || searchString?.length < 1}
          >
            <SearchIcon />
          </button>
        </form>

        <div className="px-8 md:px-10 max-w-8xl my-8 md:my-24 flex flex-col gap-y-8">
          {results?.map((result, rI) => (
            <div key={rI}>
              <Link
                href={
                  result.type !== 'approaches'
                    ? `${typeSlugs[result.type]}/${result.data?.attributes?.slug}`
                    : `/${result.data?.attributes?.city?.data?.attributes?.slug}/${result.data?.attributes?.slug}`
                }
              >
                <a className="text-m font-raptor font-semibold hover:text-red-300">
                  {result.data?.attributes?.title ?? result.data?.attributes?.name}
                </a>
              </Link>
              <div className="text-xs text-black text-opacity-40">{t(`type.${result.type}`)}</div>
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}

export async function getStaticProps({ locale }) {
  const translations = await getTranslations(locale, ['search']);
  const client = createClient();
  const menu = await fetchMenu(client, locale);
  const footer = await fetchFooter(client, locale);
  const counts = await fetchCounts(client, locale);

  return {
    revalidate: 60,
    props: {
      ...translations,
      menu,
      footer,
      locale,
      counts
    }
  };
}
