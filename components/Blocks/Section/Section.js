import Columns from '@/components/Columns';
import Heading from '@/components/Heading';
import Markdown from '@/components/Markdown';

export default function Section({ title, sectionContent: { content } }) {
  return (
    <Columns className="my-6 md:my-8 max-w-8xl pl-8 pr-8 md:pr-0 md:pl-10">
      {title ? (
        <Heading level={2} className="mb-8 md:mb-0">
          {title}
        </Heading>
      ) : (
        <span />
      )}

      <Markdown isSmall={false}>{content}</Markdown>
    </Columns>
  );
}
