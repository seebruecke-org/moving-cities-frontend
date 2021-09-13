import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import clsx from 'clsx';

import BlockSwitch from '@/components/Blocks/BlockSwitch';
import Heading from '@/components/Heading';
import Richtext from '@/components/Blocks/Richtext';

import styles from './styles.module.css';

export default function CountryContext({ name, content, open = false }) {
  const [isOpen, setIsOpen] = useState(open);
  const { t } = useTranslation('city');

  return (
    <div className="md:py-12">
      <details className="border-t-2 border-b-2" onToggle={() => setIsOpen(!isOpen)} open={isOpen}>
        <summary
          className={clsx(
            styles.summary,
            isOpen && 'mb-10 border-b-2',
            'cursor-pointer hover:bg-black hover:text-white pb-4'
          )}>
          <Heading level={2} className="px-10 pt-6 flex justify-between sm:items-center">
            {t('politicalContext', { name })}

            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="23" fill="none" viewBox="0 0 40 23">
              <path stroke="#F55511" stroke-linecap="round" stroke-width="3" d="m2 2 18 18L38 2"/>
            </svg>
          </Heading>
        </summary>

        <div className="px-10 py-12">
          <BlockSwitch blocks={content} renderers={{ Richtext }} />
        </div>
      </details>
    </div>
  );
}
