export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  let { query, locale } = req.query;

  if (!query) {
    return res.status(400).json({ message: 'Query parameter is required' });
  }

  if (!locale) {
    locale = 'de';
  }

  const contentTypes = [
    {
      type: 'approaches',
      fields: ['title', 'summary']
    },
    {
      type: 'cities',
      fields: ['name', 'subtitle', 'takeaways', 'summary', 'reasoning']
    },
    {
      type: 'networks',
      fields: ['name']
    },
    {
      type: 'news-entries',
      fields: ['title', 'region', 'teaser']
    }
  ];

  try {
    const searchResults = await Promise.all(
      contentTypes.map((type) =>
        fetch(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}/${
            type.type
          }?locale=${locale}&populate=*&${type.fields
            ?.map(
              (field, i) => `&filters[$or][${i}][${field}][$containsi]=${encodeURIComponent(query)}`
            )
            ?.join('')}`
        )
          .then((response) => response.json())
          .then((data) => {
            return data.data?.map((data) => ({
              type: type.type,
              data: data
            }));
          })
      )
    );

    res.status(200).json({ results: searchResults.flat(1) });
  } catch (error) {
    console.error('Search API error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
