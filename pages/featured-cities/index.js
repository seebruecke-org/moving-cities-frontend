import { useTranslation } from 'next-i18next';
import { Marker } from 'react-map-gl';
import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import SEO from '@/components/SEO';
import ThreadList from '@/components/ThreadList';
const FloatingCta = dynamic(() => import('@/components/FloatingCta'));
const MapboxMap = dynamic(() => import('@/components/MapboxMap'), { ssr: false });
import { createClient } from '@/lib/api';
import { fetchCounts, fetchFeaturedCities, fetchFeaturedCitiesLocalizations } from '@/lib/cities';
import { getTranslations } from '@/lib/global';
import { useWindowSize } from '@/lib/hooks';
import { renderMap } from '@/lib/map';
import { fetchMenu } from '@/lib/menu';
import useMapReducer from '@/lib/stores/map';
import CityPreview from '@/components/CityPreview';
import { fetchFooter } from '@/lib/footer';

function CityMarker({ id, name, ...props }) {
  return (
    <Marker key={`marker-${id}`} className="group" offsetLeft={-20} offsetTop={-20} {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 40 40"
        width="40"
        height="40"
        fill="none"
        className="cursor-pointer text-pink-300 hover:text-black"
      >
        <circle
          cx="20"
          cy="20"
          r="17"
          stroke="currentColor"
          stroke-dasharray="4 2"
          stroke-width="6"
        />
      </svg>

      <span className="text-center font-raptor font-bold hidden group-hover:block text-s absolute top-full left-2/4 -translate-x-2/4 leading-none">
        {name}
      </span>
    </Marker>
  );
}

export default function FeaturedCitiesOverview({ cities, counts, bounds, menu }) {
  const { width: windowWidth } = useWindowSize();
  const { t } = useTranslation();
  const { t: tCity } = useTranslation('city');
  const { t: tSlugs } = useTranslation('slugs');
  const [{ activeThread }, dispatch] = useMapReducer();

  const navItems = useMemo(() => {
    return cities.map(({ id, name, subtitle, slug, approaches, summary, reportFile, ...city }) => ({
      ...city,
      id,
      title: name,
      subtitle,
      target: `/${slug}`,
      active: activeThread?.id === id,
      data: {
        title: name,
        subtitle,
        uri: `/${slug}`,
        reportFile,
        approaches: approaches.map(({ slug: approachSlug, ...approach }) => ({
          uri: `/${slug}/${approachSlug}`,
          ...approach
        })),
        summary,
        icon: city.icon
      }
    }));
  }, [activeThread]);

  const markers = useMemo(() => {
    // don't show markers on the map, once a city was selected
    if (activeThread) {
      return null;
    }

    return cities.map(({ coordinates, id, name }) => {
      const [longitude, latitude] = coordinates?.geometry?.coordinates;

      return (
        <CityMarker
          id={id}
          latitude={latitude}
          longitude={longitude}
          name={name}
          onClick={() => {
            dispatch({ type: 'THREAD_ITEM_ACTIVATE', payload: { id, coordinates } });
          }}
        />
      );
    });
  }, [activeThread]);

  return (
    <div className="flex flex-col md:flex-row md:h-full w-full">
      <SEO title={tCity('featuredCities')} />

      <ThreadList
        pane={CityPreview}
        onAfterOpen={({ id, coordinates }) => {
          dispatch({ type: 'THREAD_ITEM_ACTIVATE', payload: { id, coordinates } });
        }}
        onAfterClose={() => {
          dispatch({ type: 'THREAD_ITEM_ACTIVATE', payload: null });
        }}
        items={navItems}
      />

      {renderMap(windowWidth) && markers && bounds && (
        <MapboxMap bounds={bounds}>{markers}</MapboxMap>
      )}

      {menu?.cta && (
        <FloatingCta target={`/${tSlugs('about')}/${menu.cta.slug}`} label={t('addCity')} />
      )}
    </div>
  );
}

export async function getStaticProps({ locale }) {
  const translations = await getTranslations(locale, ['city', 'approaches']);
  const client = createClient();
  const { cities, bounds } = await fetchFeaturedCities(client, locale);
  const localizations = await fetchFeaturedCitiesLocalizations();
  const counts = await fetchCounts(client, locale);
  const menu = await fetchMenu(client, locale);
  const footer = await fetchFooter(client, locale);

  return {
    revalidate: 240,
    props: {
      ...translations,
      cities,
      bounds,
      counts,
      menu,
      footer,
      localizations
    }
  };
}
