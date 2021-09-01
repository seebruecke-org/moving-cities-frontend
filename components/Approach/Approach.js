import { useTranslation } from 'next-i18next';
import Link from 'next/link';

import Heading from '@/components/Heading';

export default function Approach({ title, city, categories = [], uri }) {
  const { t } = useTranslation('approaches');

  return (
    <Link href={uri}>
      <a className="flex flex-col rounded-xl border-2 border-black hover:border-red-300 p-7 group h-full">
        <Heading level={3} as={4}>
          {city?.name && (
            <span className="block text-l mb-4 font-normal">
              {city.name}
              <span className="sr-only">:</span>
            </span>
          )}

          {title}
        </Heading>

        <ul className="flex flex-wrap mt-2 mb-4">
          {categories.map(({ title }, index) => (
            <li className="flex flex-wrap">
              {index > 0 && <span className="font-raptor text-m leading-normal mx-2">•</span>}
              <p className="font-raptor text-m leading-normal">{title}</p>
            </li>
          ))}
        </ul>

        <button
          type="button"
          tabIndex="-1"
          className="font-raptor font-bold text-m mt-auto justify-end self-start">
          {t('readMore')}
          <span className="group-hover:text-red-300 ml-2">⟶</span>
        </button>
      </a>
    </Link>
  );
}
