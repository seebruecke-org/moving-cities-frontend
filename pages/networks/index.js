import { useSelector, useDispatch } from 'react-redux';
import { useI18n } from 'next-localization';
import { useCallback } from 'react';
import dynamic from 'next/dynamic';

import Layout from '../../components/Layout';

import BottomSheet from '../../components/BottomSheet';
import MapCityMarker from '../../components/MapCityMarker';
import MapNetworkPopup from '../../components/MapNetworkPopup';
import NetworkListItem from '../../components/NetworkListItem';
import SidebarList from '../../components/SidebarList';
import Main from '../../components/Main';
import Navigation from '../../components/Navigation';
import SEO from '../../components/SEO';
import Sidebar from '../../components/Sidebar';

import { fetcher } from '../../lib/hooks/useAPI';
import { getTranslations } from '../../lib/default';
import { getMapBounds, getCitiesCenter } from '../../lib/coordiantes';

const Map = dynamic(() => import('../../components/Map'));

const NetworksPage = () => {
  const networks = useSelector((state) => state.networks) || [];
  const activeNetwork = networks.find(({ isActive }) => isActive === true);
  const cities = networks.map(({ cities }) => cities, []).flat();
  const navigation = useSelector((state) => state.navigation);
  const fitBounds = activeNetwork
    ? useCallback(getMapBounds(activeNetwork.cities), [activeNetwork.cities])
    : useCallback(getMapBounds(cities), [cities]);
  const i18n = useI18n();
  const dispatch = useDispatch();

  const mapProps = {
    fitBounds,
    fitBoundsOptions: {
      duration: 0,
      padding: 50
    },
    flyToOptions: {
      speed: 1.2
    },

    onClick() {
      dispatch({
        type: 'SET_ACTIVE_NETWORK',
        slug: null
      });
    }
  };

  return (
    <Layout>
      <SEO title={i18n.t('city.networks')} />

      <Main>
        <Map infoControl={false} {...mapProps}>
          {networks.map(({ cities, isHighlighted, isActive, ...network }) => {
            return cities.map(({ name, coordinates }) => {
              return (
                <MapCityMarker
                  coordinates={coordinates}
                  key={`map-city-${name}`}
                  isActive={isActive}
                  isHighlighted={isHighlighted}
                  onClick={() => {
                    dispatch({
                      type: 'SET_ACTIVE_NETWORK',
                      slug: network.slug
                    });
                  }}
                />
              );
            });
          })}

          {activeNetwork && <MapNetworkPopup {...activeNetwork} />}
        </Map>
      </Main>

      <Sidebar>
        <Navigation items={navigation} />
        <BottomSheet>
          <SidebarList label={i18n.t('city.networks')}>
            {networks.map(({ name, slug, isActive }) => (
              <NetworkListItem
                key={`sidebar-${name}`}
                slug={slug}
                name={name}
                isActive={isActive}
                onClick={(event) => {
                  event.preventDefault();

                  dispatch({
                    type: 'SET_ACTIVE_NETWORK',
                    slug: slug
                  });
                }}
                onMouseEnter={() => {
                  dispatch({
                    type: 'SET_HIGHLIGHTED_NETWORK',
                    slug: slug
                  });
                }}
                onMouseLeave={() => {
                  dispatch({
                    type: 'SET_HIGHLIGHTED_NETWORK',
                    slug: null
                  });
                }}
              />
            ))}
          </SidebarList>
        </BottomSheet>
      </Sidebar>
    </Layout>
  );
};

export async function getStaticProps({ locale }) {
  const lngDict = await getTranslations(locale);
  const { networks } = await fetcher(`
    query {
      networks(sort: "name") {
        name
        slug

        cities {
          name
          coordinates

          country {
            slug
          }
        }
      }
    }
  `);

  return {
    revalidate: 120,
    props: {
      lngDict,
      initialReduxState: {
        networks
      }
    }
  };
}

export default NetworksPage;
