import clsx from 'clsx';
import Link from 'next/link';

export default function BackTo({ title, uri, className }) {
  return (
    <header>
      <Link href={uri}>
        <a
          className={clsx(
            'font-bold font-raptor text-s block py-6 shadow-xl px-6 hover:text-red-300',
            className
          )}
        >
          <span className="text-red-300 mr-2">⟵</span>
          {title}
        </a>
      </Link>
    </header>
  );
}
