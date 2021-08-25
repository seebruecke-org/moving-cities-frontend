import { fetchAPI } from '@/lib/api';
import { getBlockFragments } from '@/lib/blocks';

export async function fetchFeaturedCities(locale) {
  const { cities } = await fetchAPI(
    `
    query FeaturedCities($locale: String = "en") {
      cities(where: { locale: $locale, is_featured: true }) {
        name
        subtitle
        slug
        icon

        summary {
          title
          content
        }

        approaches {
          title
          slug

          categories {
            title
          }
        }
      }
    }`,
    { locale }
  );

  return cities;
}

export async function fetchAllCitiesByCountry(locale) {
  const { countries } = await fetchAPI(
    `
    query AllCitiesByCountry($locale: String = "en") {
      countries(where: { locale: $locale }) {
        name

        cities {
          name

          networks {
            name
            slug
          }
        }
      }
    }`,
    { locale }
  );

  return countries;
}

export async function fetchCityBySlug(slug, locale) {
  const data = await fetchAPI(
    `
    query CityBySlug($locale: String = "en", $slug: String) {
      cities(where: { locale: $locale, slug: $slug }) {
        name
        slug
        subtitle
        icon

        summary {
          title
          content
        }

        takeaways {
          content
        }

        report {
          title
          intro
          file {
            url
          }
        }

        content {
          __typename
          ${getBlockFragments(['Section', 'Quote', 'NetworksSummary'])}
        }

        approaches {
          title
          slug

          categories {
            title
          }
        }

        country {
          name
          content {
            __typename
          ${getBlockFragments(['Richtext'])}
          }
        }
      }
    }`,
    { locale, slug }
  );

  if (!data) {
    return null;
  }

  const { cities } = data;

  return cities[0];
}

export async function fetchApproaches(locale, slug) {
  const data = await fetchAPI(
    `
    query ApproachesBySlug($locale: String = "en", $slug: String) {
      cities(where: { locale: $locale, slug: $slug }) {
        approaches {
          title
          slug
        }
      }
    }`,
    { locale, slug }
  );

  if (!data) {
    return null;
  }

  const { cities } = data;

  return cities[0];
}

export async function fetchAllCityPaths(locale) {
  const { cities } = await fetchAPI(
    `
    query FeaturedCityPaths($locale: String = "en") {
      cities(where: { locale: $locale, is_featured: true }) {
        slug
      }
    }`,
    { locale }
  );

  return cities;
}