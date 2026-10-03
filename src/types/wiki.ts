export type SourceType = 'video' | 'audio' | 'pdf' | 'text' | 'url';

export interface Citation {
  id: string; // e.g. "C1", "C2"
  sourceType: SourceType;
  sourceTitle?: string;
  timestampStart?: number; // seconds
  timestampEnd?: number; // seconds
  timestampLabel?: string; // e.g. "02:14" or "02:14 - 02:45"
  pageNumber?: number; // for PDF
  sectionHeading?: string;
  quote: string; // verbatim quote
  context: string; // explanation of relevance
  confidence?: number;
}

export interface WikiSection {
  id: string;
  heading: string;
  content: string; // markdown with [cite:C#] tags
  citationIds: string[];
}

export interface WikiArticle {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  readingTimeMinutes: number;
  summary: string;
  sections: WikiSection[];
  relatedArticleIds?: string[];
  keyTakeaways: string[];
}

export interface GlossaryTerm {
  term: string;
  definition: string;
  category?: string;
  citationId?: string;
}

export interface TimelineEvent {
  id: string;
  timestamp?: string; // e.g. "01:25" or "Section 2"
  seconds?: number;
  title: string;
  description: string;
  citationId?: string;
}

export interface EntityNode {
  id: string;
  name: string;
  type: 'concept' | 'person' | 'technology' | 'metric' | 'organization';
  description: string;
  connections: string[];
}

export interface WikiKnowledgeBase {
  id: string;
  title: string;
  synopsis: string;
  sourceType: SourceType;
  sourceName: string;
  sourceMediaUrl?: string; // Blob URL or sample URL for playback/preview
  sourceFileSize?: string;
  createdAt: string;
  stats: {
    articleCount: number;
    citationCount: number;
    termsCount: number;
    durationOrPages?: string;
  };
  overviewTakeaways: string[];
  articles: WikiArticle[];
  citations: Record<string, Citation>;
  glossary: GlossaryTerm[];
  timeline: TimelineEvent[];
  entityGraph: EntityNode[];
  suggestedQuestions: string[];
}

export interface QnATurn {
  id: string;
  question: string;
  answer: string;
  citations: Citation[];
  keyTakeaways: string[];
  followUpQuestions: string[];
  timestamp: string;
}
