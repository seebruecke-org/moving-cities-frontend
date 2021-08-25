import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

import Approach from '@/components/Approach';
import Heading from '@/components/Heading';
import Paragraph from '@/components/Paragraph';
import Pill from '@/components/Pill';
import Select from '@/components/Select';
import SEO from '@/components/SEO';

import {
  fetchAllApproaches,
  fetchApproachCategories,
  fetchAllApproachCategoriesPaths
} from '@/lib/approaches';
import { getTranslations } from '@/lib/global';

export default function ApproachesOverviewPage({ approaches, categories }) {
  const router = useRouter();
  const { t: tApproaches } = useTranslation('approaches');

  const onChange = ({ value }) => {
    router.push(value);
  };

  return (
    <div className="px-6 md:pl-72 md:pr-0 pb-28 max-w-8xl">
      <SEO title={tApproaches('inspiringApproaches')} />

      <Heading level={1} className="my-10 md:mb-28">
        {tApproaches('inspiringApproaches')}
      </Heading>

      <Paragraph className="md:font-bold">{tApproaches('intro')}</Paragraph>

      <ul className="space-x-4 hidden md:flex">
        {categories.map(({ title, slug }) => (
          <li>
            <Pill target={`/approaches/${slug}`}>{title}</Pill>
          </li>
        ))}
      </ul>

      <Select
        options={categories.map(({ title, slug }) => ({
          value: `/approaches/${slug}`,
          label: title
        }))}
        onChange={onChange}
        className="md:hidden my-10"
      />

      <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
        {approaches.map((approach) => (
          <li>
            <Approach {...approach} uri={`/${approach.city.slug}/${approach.slug}`} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function getStaticPaths({ locales }) {
  const categories = await Promise.all(
    locales.map(async (locale) => await fetchAllApproachCategoriesPaths(locale))
  );

  const paths = categories.flat().map(({ slug }) => ({
    params: { slug: [slug] }
  }));

  return {
    paths,
    fallback: 'blocking'
  };
}

export async function getStaticProps({ locale }) {
  const translations = await getTranslations(locale, ['approaches']);
  const approaches = await fetchAllApproaches(locale);
  const categories = await fetchApproachCategories(locale);

  return {
    revalidate: 60,
    props: {
      ...translations,
      categories,
      approaches
    }
  };
}