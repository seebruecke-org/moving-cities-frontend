import { useTranslation } from 'next-i18next';

import Approach from '@/components/Approach';
import Button from '@/components/Button';
import CityIcon from '@/components/CityIcon';
import Heading from '@/components/Heading';
import Markdown from '@/components/Markdown';

export default function CityPreview({
  title,
  subtitle,
  uri,
  icon,
  approaches,
  summary,
  onClose = () => {}
}) {
  const { t } = useTranslation('city');
  const { t: tApproaches } = useTranslation('approaches');

  return (
    <article className="bg-yellow-300 px-10 pt-16 pb-16 h-full overflow-y-auto flex flex-col">
      <div className="flex mb-10 items-start">
        {icon && <CityIcon icon={icon} className="w-56 mr-12" />}

        <div className="mr-8">
          <h1 className="text-red-300 text-6xl font-raptor font-bold leading-none">{title}</h1>

          <p className="text-4xl leading-none font-raptor font-bold">{subtitle}</p>
        </div>

        <button onClick={onClose} className="group font-raptor font-semibold mt-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="37"
            height="37"
            viewBox="0 0 37 37"
            className="group-hover:text-red-300">
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-width="3"
              d="M3.6 3.5l30 30M3.6 33.5l30-30"
            />
          </svg>
          {t('close')}
        </button>
      </div>

      <div className="flex flex-col space-y-8 mt-16">
        <Heading level={2} as={3}>
          {summary.title}
        </Heading>

        <Markdown>{summary.content}</Markdown>

        {uri && (
          <Button href={uri} className="w-auto self-start">
            {t('viewCity')}
            <span className="text-red-300 ml-3 text-4xl leading-none -my-4">→</span>
          </Button>
        )}

        {approaches?.length > 0 && (
          <div className="space-y-8 pt-4">
            <Heading level={2} as={3}>
              {tApproaches('inspiringApproaches')}
            </Heading>

            <ul className="space-y-8">
              {approaches.map((approach) => (
                <li>
                  <Approach {...approach} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </article>
  );
}
