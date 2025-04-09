import { Fragment, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import Close from '@/components/Menu/assets/Close';
import Bars from '@/components/Menu/assets/Bars';
import { useRouter } from 'next/router';
import Search from '@/components/Menu/assets/Search';
import LanguageSwitch from '@/components/Menu/LanguageSwitch';
import { useIsMounted } from '@/lib/hooks';
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import Tooltip from '@/components/Menu/Tooltip';

export default function Menu({ main_items, secondary_items, localizations, counts }) {
  const { t } = useTranslation();
  const { t: tSlugs } = useTranslation('slugs');
  const { locales, locale } = useRouter();
  const overlayRef = useRef();
  const isFirstRender = useIsMounted();
  const itemRefs = useRef([]);
  const [tooltipPosition, setTooltipPosition] = useState({});

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const currentRef = overlayRef?.current;

    if (isFirstRender) {
      clearAllBodyScrollLocks();
      return;
    }

    if (open === true) {
      disableBodyScroll(currentRef);
    } else {
      clearAllBodyScrollLocks();
    }
  }, [open]);

  const handleItemEnter = (activeItemIndex) => {
    const activeRef = itemRefs.current[activeItemIndex];

    if (activeRef) {
      const { clientWidth } = activeRef;

      setTooltipPosition({
        left: clientWidth / 2
      });
    }
  };

  return (
    <header
      className={classNames(
        'top-0 w-full z-[100] bg-gradient-to-bl from-red-300 to-pink-300 text-white px-8 md:px-16 flex flex-col',
        open ? 'fixed xl:sticky bottom-0 h-full xl:bottom-auto xl:h-24' : 'sticky h-24'
      )}
    >
      <div className="h-24 w-full flex items-center">
        <Link href={'/'}>
          <a
            className="uppercase font-raptor font-semibold text-xl xl:hover:text-black"
            onClick={() => setOpen(false)}
          >
            <span className="xl:hidden">{t('menu.name')}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="826"
              height="447"
              viewBox="0 0 826 447"
              className="h-14 w-auto relative hidden xl:block"
            >
              <path
                fill="currentColor"
                d="M37 111c10-61 70-57 99-48 29 10 53 83 114 99S317 9 364 0c46-8 19 104 68 111 49 8 58-75 112-85s45 37 128 54c83 18 91-24 131-17 41 8 20 84-7 99-27 14-6 81 21 140s-26 55-83 37c-57-19-13 81-82 104-68 24-25-66-47-141s-54 8-115 29-89-56-114-88c-26-32-101 134-139 114s-14-43-54-68c-40-24-105 47-159 7-55-41 1-109 13-185z"
              />
            </svg>
          </a>
        </Link>
        <div className="hidden xl:flex gap-x-8 ml-12">
          {secondary_items
            ?.filter((i) => i.page !== 'search')
            ?.map((item, iI) => (
              <Link href={`/${tSlugs(item.page)}`} key={iI}>
                <a
                  className="font-raptor font-bold text-l hover:text-black"
                  onClick={
                    item.page === 'news'
                      ? (e) => {
                          e.preventDefault();
                          const newsElement = document.querySelector('#news');
                          if (newsElement) {
                            window.scrollTo({
                              top: newsElement.offsetTop - 20,
                              behavior: 'smooth'
                            });
                          }
                        }
                      : null
                  }
                >
                  {item.title}
                </a>
              </Link>
            ))}
        </div>
        <div className="hidden xl:flex gap-x-8 ml-auto">
          {main_items
            ?.filter((i) => i.page !== 'search')
            ?.map((item, iI) => (
              <Link href={`/${tSlugs(item.page)}`} key={iI}>
                <a
                  className="font-raptor font-bold text-l hover:text-black uppercase relative group"
                  ref={(ref) => (itemRefs.current[iI] = ref)}
                  onMouseEnter={() => handleItemEnter(iI)}
                >
                  {item.title}
                  <Tooltip
                    className="hidden group-hover:block normal-case font-normal text-opacity-60"
                    style={tooltipPosition}
                  >
                    {t(`menu.tooltip.${item.page}`, { count: counts[`${item.page}Count`] })}
                  </Tooltip>
                </a>
              </Link>
            ))}
        </div>
        <div className="hidden xl:flex gap-x-8 ml-16">
          {main_items?.find((i) => i.page === 'search') ||
          secondary_items?.find((i) => i.page === 'search') ? (
            <Link href={`/${tSlugs('search')}`}>
              <a className="hover:text-black">
                <Search />
              </a>
            </Link>
          ) : null}
          <LanguageSwitch current={locale} locales={locales} localizations={localizations} />
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="ml-auto w-10 h-10 flex items-center xl:hidden"
          aria-label={open ? t('menu.burger.close') : t('menu.burger.open')}
        >
          {open ? <Close /> : <Bars />}
        </button>
      </div>
      {open ? (
        <div className="flex-1 flex flex-col pt-8 pb-12 xl:hidden" ref={overlayRef}>
          <div className="mb-4 flex flex-col">
            {main_items?.map((item, iI) => (
              <Link href={`/${tSlugs(item.page)}`} key={iI}>
                <a className="font-raptor font-bold text-2xl" onClick={() => setOpen(false)}>
                  {item.page === 'search' ? <Search /> : item.title}
                </a>
              </Link>
            ))}
          </div>
          <div className="mt-auto flex flex-col">
            {secondary_items?.map((item, iI) => (
              <Link href={`/${tSlugs(item.page)}`} key={iI}>
                <a className="font-raptor font-bold text-xl" onClick={() => setOpen(false)}>
                  {item.page === 'search' ? <Search /> : item.title}
                </a>
              </Link>
            ))}
          </div>
          <div className="mt-12 flex gap-x-2">
            {locales?.map((locale, lI) => (
              <Fragment key={lI}>
                <Link
                  href={localizations && localizations[locale] ? localizations[locale] : ''}
                  locale={locale}
                >
                  <a
                    className="font-raptor font-medium text-m text-center uppercase leading-none"
                    onClick={() => setOpen(false)}
                  >
                    {locale}
                  </a>
                </Link>
                {lI !== locales.length - 1 ? (
                  <span className="font-raptor font-medium text-m text-center uppercase leading-none">
                    |
                  </span>
                ) : null}
              </Fragment>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
