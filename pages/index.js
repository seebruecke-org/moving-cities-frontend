import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import SEO from '@/components/SEO';
const Intro = dynamic(() => import('@/components/Intro'));
import { buildCMSUrl, createClient } from '@/lib/api';
import { fetchCounts } from '@/lib/cities';
import { fetchIntro } from '@/lib/intro';
import { getTranslations } from '@/lib/global';
import { fetchMenu } from '@/lib/menu';
import { fetchFooter } from '@/lib/footer';
import { fetchAllNewsEntries } from '@/lib/news';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { format } from 'date-fns';
import classNames from 'classnames';
import pinImage from '@/public/images/pin.svg';
import Image from 'next/image';
import Media from '@/components/Blocks/Media';
import Section from '@/components/Blocks/Section';
import Quote from '@/components/Blocks/Quote';
import DownloadSection from '@/components/Blocks/DownloadSection';
import VideoEmbed from '@/components/Blocks/VideoEmbed';
import MultiCollapsible from '@/components/Blocks/MultiCollapsible/MultiCollapsible';
import BlockSwitch from '@/components/Blocks/BlockSwitch';

export default function HomePage({ intro, counts, newsEntries }) {
  const { t: tNews } = useTranslation('news');
  const { t: tSlugs } = useTranslation('slugs');
  const [selectedNews, setSelectedNews] = useState(null);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const newsElement = document.querySelector('#news');
      if (newsElement && hash) {
        window.scrollTo({ top: newsElement.offsetTop - 20, behavior: 'smooth' });
      }
      if (hash) {
        const news = newsEntries.find((entry) => entry.slug === hash);
        if (news) {
          setSelectedNews(news);
        }
      } else {
        setSelectedNews(newsEntries[0]);
      }
    };

    // Scroll on initial load
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [newsEntries]);

  const handleTabClick = (news) => {
    setSelectedNews(news);
    window.location.hash = news.slug;
  };

  return (
    <>
      <SEO title={null} description={intro} metadata={intro?.metadata} />
      <Intro {...intro} {...counts} />
      <div className="mt-16 md:mt-32" id="news">
        <div className="mx-8 md:max-w-[66%] lg:ml-16">
          <h2 className="mb-16 md:mb-28 text-3xl md:text-4xl xl:text-4xl leading-none font-bold font-raptor">
            {tNews('news')}
          </h2>

          <p className="leading-tight font-bold font-raptor text-m md:text-xl xl:text-2xl md:font-bold">
            {tNews('intro')}
          </p>
        </div>

        <div className="mx-20 my-16 md:hidden">
          {newsEntries.map((news, nI) => (
            <Link href={`/${tSlugs('news')}/${news.slug}`} key={nI}>
              <a
                className={classNames('min-h-[190px] flex flex-col border px-4 py-3 font-raptor', {
                  'border-t-0': nI !== 0
                })}
                title={news.title}
              >
                <span className="flex">
                  <span className="uppercase text-m max-w-1/2 leading-8">{news.category}</span>
                  {news.isPinned && (
                    <span className="ml-auto" key={`pin-${news.slug}`}>
                      <Image src={pinImage} priority width={16} height={16} />
                    </span>
                  )}
                </span>
                <span className="flex-1 flex flex-col">
                  <span className="my-auto text-m font-bold leading-8">{news.title}</span>
                </span>
                <span className="text-m">{format(new Date(news?.date), 'yyyy/MM/dd')}</span>
              </a>
            </Link>
          ))}
        </div>

        <div className="hidden md:grid grid-cols-3 lg:grid-cols-4 ml-8 mt-20">
          <div className="col-span-1">
            {newsEntries.map((news, nI) => (
              <Link href={`/${tSlugs('news')}/${news.slug}`} key={news.slug}>
                <a
                  className={classNames(
                    'min-h-[190px] flex flex-col border px-4 py-3 font-raptor',
                    {
                      'border-t-0': nI !== 0,
                      'bg-yellow-300': news.slug === selectedNews?.slug
                    }
                  )}
                  title={news.title}
                  onClick={(e) => {
                    e.preventDefault();
                    handleTabClick(news);
                  }}
                >
                  <span className="flex">
                    <span className="uppercase text-m max-w-1/2 leading-8">{news.category}</span>
                    {news.isPinned && (
                      <span className="ml-auto">
                        <Image src={pinImage} priority className="w-4 h-4" />
                      </span>
                    )}
                  </span>
                  <span className="flex-1 flex flex-col">
                    <span className="my-auto text-m font-bold leading-8">{news.title}</span>
                  </span>
                  <span className="text-m">{format(new Date(news?.date), 'yyyy/MM/dd')}</span>
                </a>
              </Link>
            ))}
          </div>
          <div className="col-span-2 lg:col-span-3">
            {selectedNews ? (
              <article>
                <header className="bg-yellow-300 px-40 py-12 min-h-[190px] flex items-center">
                  <h3 className="font-raptor text-2xl md:text-4xl font-bold leading-none">
                    {selectedNews.title}
                  </h3>
                </header>
                {selectedNews.image?.url && (
                  <div className="relative w-full aspect-video">
                    <Image
                      src={buildCMSUrl(selectedNews.image.url)}
                      layout="fill"
                      alt={selectedNews.title}
                      objectFit="cover"
                      objectPosition="center"
                    />
                  </div>
                )}
                <div className="pl-32 pr-20">
                  <BlockSwitch
                    blocks={selectedNews.content}
                    renderers={{
                      Media,
                      Section,
                      Quote,
                      DownloadSection,
                      VideoEmbed,
                      MultiCollapsible
                    }}
                  />
                </div>
              </article>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}

export async function getStaticProps({ locale }) {
  const translations = await getTranslations(locale, ['intro', 'news']);
  const client = createClient();
  const data = await fetchIntro(client, locale);
  const counts = await fetchCounts(client, locale);
  const menu = await fetchMenu(client, locale);
  const footer = await fetchFooter(client, locale);

  const newsEntries = await fetchAllNewsEntries(client);

  // Sort news: pinned first, then by date descending
  const sortedNewsEntries = newsEntries.sort((a, b) => {
    if (a.isPinned === b.isPinned) {
      return new Date(b.date) - new Date(a.date);
    }
    return b.isPinned - a.isPinned;
  });

  return {
    revalidate: 360,
    props: {
      ...translations,
      ...data,
      counts,
      menu,
      footer,
      newsEntries: sortedNewsEntries
    }
  };
}
