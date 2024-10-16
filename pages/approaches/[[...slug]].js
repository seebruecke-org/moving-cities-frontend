import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

import Approach from '@/components/Approach';
import Pill from '@/components/Pill';
import Select from '@/components/Select';
import SEO from '@/components/SEO';

import { createClient } from '@/lib/api';
import {
  fetchAllApproaches,
  fetchApproachCategories,
  fetchAllApproachCategoriesPaths,
  fetchApproachCategoryLocalizationsBySlug
} from '@/lib/approaches';
import { getTranslations } from '@/lib/global';
import { mapStrapiToFELocale } from '@/lib/i18n';
import { fetchMenu } from '@/lib/menu';
import { fetchFooter } from '@/lib/footer';
import { fetchCounts } from '@/lib/cities';

export default function ApproachesOverviewPage({ approaches, approachesCount, categories }) {
  const router = useRouter();
  const { t: tSlugs } = useTranslation('slugs');
  const { t: tApproaches } = useTranslation('approaches');

  const onChange = ({ value }) => {
    router.push(value);
  };

  return (
    <div className="mx-6 md:ml-72 md:mr-16 md:pr-0 pb-10 max-w-8xl">
      <SEO title={tApproaches('inspiringApproaches')} />

      <h1 className="my-10 md:mt-20 md:mb-28 text-4xl md:text-5xl xl:text-6xl leading-none font-bold font-raptor">
        {tApproaches('inspiringApproaches')}
      </h1>

      <p className="leading-tight font-raptor text-m md:text-xl xl:text-2xl md:font-bold">
        {tApproaches('intro', { count: approachesCount })}
      </p>

      <ul className="hidden md:flex md:flex-wrap mt-12">
        {categories.map(({ title, slug }) => (
          <li className="mr-6 mb-6">
            <Pill
              target={`/${tSlugs('approaches')}/${slug}`}
              active={slug === router?.query?.slug?.[0]}
            >
              {title}
            </Pill>
          </li>
        ))}
      </ul>

      <Select
        options={categories.map(({ title, slug }) => ({
          value: `/${tSlugs('approaches')}/${slug}`,
          label: title
        }))}
        onChange={onChange}
        className="md:hidden my-10"
      />

      <ul className="grid grid-cols-1 md:grid-cols-3 gap-8 my-12">
        {approaches
          .filter(({ city }) => !!city)
          .map((approach) => (
            <li>
              <Approach {...approach} uri={`/${approach.city.slug}/${approach.slug}`} />
            </li>
          ))}
      </ul>
    </div>
  );
}

export async function getStaticPaths({ locales }) {
  const client = createClient();
  const categories = await Promise.all(
    locales.map(async (locale) => await fetchAllApproachCategoriesPaths(client, locale))
  );

  const paths = categories.flat().map(({ slug, locale }) => ({
    params: { slug: [slug] },
    locale: mapStrapiToFELocale(locale)
  }));

  return {
    paths: [...paths, ...locales.map((locale) => ({ params: { slug: null }, locale }))],
    fallback: 'blocking'
  };
}

export async function getStaticProps({ locale, params: { slug } }) {
  const translations = await getTranslations(locale, ['approaches']);
  const client = createClient();
  const { approaches, approachesCount } = await fetchAllApproaches(client, locale, slug?.[0]);
  const categories = await fetchApproachCategories(client, locale);
  const localizations = await fetchApproachCategoryLocalizationsBySlug(client, locale, slug?.[0]);
  const menu = await fetchMenu(client, locale);
  const footer = await fetchFooter(client, locale);
  const counts = await fetchCounts(client, locale);

  return {
    revalidate: 240,
    props: {
      ...translations,
      categories,
      approaches,
      approachesCount,
      menu,
      footer,
      localizations,
      counts
    }
  };
}
