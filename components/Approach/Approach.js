import Link from 'next/link';

import Heading from '@/components/Heading';

export default function Approach({ title, pillars = [], uri }) {
  return (
    <Link href={uri}>
      <a className="rounded-xl border-2 border-black hover:border-red-300 p-7 block group">
        <Heading level={3} as={4}>
          {title}
        </Heading>

        <ul className="flex flex-wrap mt-2">
          {pillars.map((pillar, index) => (
            <li className="flex flex-wrap">
              {index > 0 && <span className="text-m mx-2">•</span>}
              <p className="text-xl">{pillar}</p>
            </li>
          ))}
        </ul>

        <button type="button" tabIndex="-1" className="font-raptor font-bold text-xl mt-4">
          Read more
          <span className="group-hover:text-red-300 ml-2">⟶</span>
        </button>
      </a>
    </Link>
  );
}