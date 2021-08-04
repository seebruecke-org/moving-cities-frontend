import Context from '@/components/Blocks/Context';
import Intro from '@/components/Blocks/Intro';
import Quote from '@/components/Blocks/Quote';
import Section from '@/components/Blocks/Section';

const BLOCKS = {
  Context: Context,
  Intro: Intro,
  Quote: Quote,
  Section: Section
};

export default function BlockSwitch({ blocks }) {
  return (
    <div className="flex flex-col">
      {blocks.map(({ __typename, ...block }) => {
        const Component = BLOCKS?.[__typename] ?? null;

        return <Component {...block} />;
      })}
    </div>
  );
}