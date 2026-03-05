import { Fragment } from 'react';

function parseLine(line: string) {
  const parts: React.ReactNode[] = [];
  const regex = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      parts.push(line.slice(lastIndex, match.index));
    }
    parts.push(
      <strong key={match.index} className="font-semibold text-gray-900">
        {match[1]}
      </strong>
    );
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < line.length) {
    parts.push(line.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [line];
}

export function SlideContent({ content }: { content: string[] }) {
  const elements: React.ReactNode[] = [];
  let listBuffer: string[] = [];
  let key = 0;

  const flushList = () => {
    if (listBuffer.length === 0) return;
    elements.push(
      <ul key={`list-${key++}`} className="space-y-2 my-3">
        {listBuffer.map((item, i) => (
          <li
            key={i}
            className="flex items-start gap-2.5 text-[15px] leading-relaxed text-gray-700"
          >
            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
            <span>{parseLine(item)}</span>
          </li>
        ))}
      </ul>
    );
    listBuffer = [];
  };

  for (const line of content) {
    if (line.startsWith('## ')) {
      flushList();
      elements.push(
        <h3
          key={`h-${key++}`}
          className="text-lg font-bold text-gray-900 mt-6 mb-2 pb-1 border-b border-gray-100"
        >
          {line.slice(3)}
        </h3>
      );
    } else if (line.startsWith('- ')) {
      const items = line.split('\n').filter(Boolean);
      for (const item of items) {
        listBuffer.push(item.replace(/^- /, ''));
      }
    } else if (line.startsWith('«') || line.startsWith('« ')) {
      flushList();
      elements.push(
        <blockquote
          key={`q-${key++}`}
          className="border-l-3 border-blue-400 pl-4 py-2 my-3 italic text-gray-600 bg-blue-50/50 rounded-r-lg text-[15px] leading-relaxed"
        >
          {parseLine(line)}
        </blockquote>
      );
    } else {
      flushList();
      elements.push(
        <p key={`p-${key++}`} className="text-[15px] leading-relaxed text-gray-700 my-2">
          {parseLine(line)}
        </p>
      );
    }
  }

  flushList();

  return <div>{elements.map((el, i) => <Fragment key={i}>{el}</Fragment>)}</div>;
}
