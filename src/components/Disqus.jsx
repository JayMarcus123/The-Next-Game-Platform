'use client';
import React from 'react';
import { DiscussionEmbed } from 'disqus-react';

export default function Disqus({ url, identifier, title }) {
  if (!url || !identifier || !title) {
    return <div>Loading comments...</div>;
  }

  return (
    <DiscussionEmbed
      shortname="retrogamewithsiya"
      config={{
        url: url,
        identifier: identifier,
        title: title,
        language: 'EN',
      }}
    />
  );
}
