import React from 'react';

const YOUTUBE_ID_PATTERN = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/;

const normalizeMarkdown = (content) => {
  return content
    .replaceAll('$\\rightarrow$', '→')
    .replaceAll('\\rightarrow', '→')
    .replace(/^\s*[-–—]{2,}\s*(.+?)\s*[-–—]{2,}\s*$/gm, '$1')
    .replace(/^\s*([*-])(?=\S)/gm, '$1 ');
};

const inlineMarkdown = (text) => {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\)|https?:\/\/\S+|\*\*[^*]+\*\*|\*[^*\n]+\*)/g);
  return parts.map((part, index) => {
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <a
          key={index}
          href={linkMatch[2]}
          target="_blank"
          rel="noreferrer"
          style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}
        >
          {inlineMarkdown(linkMatch[1])}
        </a>
      );
    }
    if (part.startsWith('http://') || part.startsWith('https://')) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noreferrer"
          style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}
        >
          {part}
        </a>
      );
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{inlineMarkdown(part.slice(2, -2))}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
};

const parseRecommendedVideos = (content) => {
  const sectionMatch = content.match(/(?:^|\n)##\s+Recommended Videos\s*\n([\s\S]*)$/i);
  if (!sectionMatch) {
    return { notesContent: content, videos: [] };
  }

  const notesContent = content.slice(0, sectionMatch.index).trim();
  const section = sectionMatch[1];
  const blocks = section.split(/\n(?=\d+\.\s+)/).map((block) => block.trim()).filter(Boolean);
  const videos = blocks
    .map((block) => {
      const titleMatch = block.match(/^\d+\.\s+\[([^\]]+)\]\(([^)]+)\)/);
      const channelMatch = block.match(/Channel:\s*(.+)/);
      const embedMatch = block.match(/Embed URL:\s*(https?:\/\/\S+)/);
      const url = titleMatch?.[2] || embedMatch?.[1] || '';
      const videoId = (embedMatch?.[1] || url).match(YOUTUBE_ID_PATTERN)?.[1];
      if (!videoId || !titleMatch?.[1]) return null;
      return {
        title: titleMatch[1],
        url,
        embedUrl: `https://www.youtube.com/embed/${videoId}`,
        channel: channelMatch?.[1]?.trim() || 'YouTube',
      };
    })
    .filter(Boolean);

  return { notesContent, videos };
};

const RecommendedVideos = ({ videos }) => {
  if (!videos.length) return null;

  return (
    <section style={{ marginTop: '22px' }}>
      <h3
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '24px',
          fontWeight: 800,
          lineHeight: 1.2,
          margin: '0 0 12px',
          color: 'var(--text)',
        }}
      >
        Recommended Videos
      </h3>
      <div style={{ display: 'grid', gap: '14px' }}>
        {videos.map((video) => (
          <article
            key={video.embedUrl}
            style={{
              overflow: 'hidden',
              border: '1px solid var(--border-light)',
              borderRadius: '12px',
              background: 'rgba(253, 248, 216, 0.42)',
              boxShadow: '0 8px 24px rgba(12, 26, 29, 0.06)',
            }}
          >
            <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', background: '#111' }}>
              <iframe
                src={video.embedUrl}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
              />
            </div>
            <div style={{ padding: '12px 14px 14px' }}>
              <a
                href={video.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'block',
                  color: 'var(--text)',
                  fontWeight: 700,
                  lineHeight: 1.35,
                  textDecoration: 'none',
                  marginBottom: '4px',
                }}
              >
                {video.title}
              </a>
              <p style={{ margin: 0, color: 'var(--text-mid)', fontSize: '13px', lineHeight: 1.5 }}>
                {video.channel}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

const MarkdownMessage = ({ content }) => {
  const { notesContent, videos } = parseRecommendedVideos(normalizeMarkdown(content));
  const lines = notesContent.split('\n');
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

    if (/^-{2,}$/.test(line)) {
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

  return (
    <div>
      {blocks}
      <RecommendedVideos videos={videos} />
    </div>
  );
};

export default MarkdownMessage;
