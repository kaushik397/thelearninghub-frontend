import React from 'react';

const normalizeMarkdown = (content) => {
  return content
    .replaceAll('$\\rightarrow$', '→')
    .replaceAll('\\rightarrow', '→')
    .replace(/^\s*[-–—]{2,}\s*(.+?)\s*[-–—]{2,}\s*$/gm, '$1')
    .replace(/^\s*([*-])(?=\S)/gm, '$1 ');
};

const inlineMarkdown = (text) => {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*\n]+\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{inlineMarkdown(part.slice(2, -2))}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
};

const MarkdownMessage = ({ content }) => {
  const lines = normalizeMarkdown(content).split('\n');
  const blocks = [];
  let listItems = [];

  const flushList = () => {
    if (!listItems.length) return;
    blocks.push(
      <ul key={`list-${blocks.length}`} style={{ margin: '8px 0 12px', paddingLeft: '22px' }}>
        {listItems.map((item, index) => (
          <li key={index} style={{ marginBottom: '6px' }}>
            {inlineMarkdown(item)}
          </li>
        ))}
      </ul>
    );
    listItems = [];
  };

  lines.forEach((rawLine) => {
    const line = rawLine.trim();

    if (!line) {
      flushList();
      return;
    }

    if (/^-{3,}$/.test(line)) {
      flushList();
      blocks.push(<hr key={`hr-${blocks.length}`} style={{ border: 0, borderTop: '1px solid var(--border-light)', margin: '18px 0' }} />);
      return;
    }

    const headingMatch = line.match(/^(#{1,4})\s+(.*)$/);
    if (headingMatch) {
      flushList();
      const level = headingMatch[1].length;
      const Tag = level <= 2 ? 'h3' : 'h4';
      blocks.push(
        <Tag
          key={`heading-${blocks.length}`}
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: level <= 2 ? '24px' : '20px',
            fontWeight: 800,
            lineHeight: 1.2,
            margin: blocks.length ? '18px 0 8px' : '0 0 8px',
            color: 'var(--text)',
          }}
        >
          {inlineMarkdown(headingMatch[2])}
        </Tag>
      );
      return;
    }

    const listMatch = line.match(/^[*-]\s+(.*)$/);
    if (listMatch) {
      listItems.push(listMatch[1]);
      return;
    }

    flushList();
    blocks.push(
      <p key={`p-${blocks.length}`} style={{ margin: '0 0 10px' }}>
        {inlineMarkdown(line)}
      </p>
    );
  });

  flushList();

  return <div>{blocks}</div>;
};

export default MarkdownMessage;
