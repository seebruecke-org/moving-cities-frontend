import clsx from 'clsx';
import Link from 'next/link';

export default function SidebarMenu({ items }) {
  return (
    <nav className="md:sticky top-0 md:h-screen w-72 flex-grow-0 flex-shrink-0 relative">
      <span className="absolute top-0 left-full w-3 bg-gradient-to-r from-black h-full opacity-20" />

      {items.map(({ target, label, active: topLevelActive, items }, index) => (
        <>
          <Link href={target}>
            <a
              className={clsx(
                'px-8 block whitespace-nowrap font-bold pb-8 hover:bg-yellow-300',
                topLevelActive && 'bg-yellow-300',
                index === 0 ? 'pt-16' : 'pt-8'
              )}>
              {label}
            </a>
          </Link>

          {items &&
            items.map(({ target, label, active }) => (
              <Link href={target}>
                <a
                  className={clsx(
                    'block pl-12 py-3 hover:underline',
                    active && 'underline',
                    topLevelActive && 'bg-yellow-300'
                  )}>
                  {label}
                </a>
              </Link>
            ))}
        </>
      ))}
    </nav>
  );
}