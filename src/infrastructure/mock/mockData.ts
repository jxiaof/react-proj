import type { Document } from '@/features/documents/api/documentTypes';
import type { Conversation } from '@/features/conversations/api/conversationTypes';
import type { Message } from '@/features/chat/api/chatTypes';

// Mock Documents
export const mockDocuments: Document[] = [
  {
    id: 'doc-1',
    name: 'Q3 Financial Report.pdf',
    size: 2458624,
    mime_type: 'application/pdf',
    status: 'ready',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'doc-2',
    name: 'Product Roadmap 2024.md',
    size: 45056,
    mime_type: 'text/markdown',
    status: 'ready',
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'doc-3',
    name: 'Technical Architecture.docx',
    size: 1258291,
    mime_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    status: 'ready',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'doc-4',
    name: 'User Research Notes.txt',
    size: 12800,
    mime_type: 'text/plain',
    status: 'processing',
    created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
  {
    id: 'doc-5',
    name: 'API Documentation.pdf',
    size: 892416,
    mime_type: 'application/pdf',
    status: 'ready',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Mock Conversations
export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    title: 'Financial Analysis Q3',
    document_ids: ['doc-1'],
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'conv-2',
    title: 'Product Planning',
    document_ids: ['doc-2'],
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'conv-3',
    title: 'Architecture Review',
    document_ids: ['doc-3', 'doc-5'],
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Mock Messages by conversation
export const mockMessages: Record<string, Message[]> = {
  'conv-1': [
    {
      id: 'msg-1',
      conversation_id: 'conv-1',
      role: 'user',
      content: 'What are the key financial highlights from the Q3 report?',
      created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'msg-2',
      conversation_id: 'conv-1',
      role: 'assistant',
      content: `Based on the Q3 Financial Report, here are the key highlights:

**Revenue Performance**
- Total revenue: $45.2M (↑ 18% YoY)
- Recurring revenue: $38.1M (↑ 24% YoY)

**Profitability**
- Gross margin: 72.5%
- Operating margin: 15.3%
- Net income: $6.9M

**Key Metrics**
- Customer acquisition cost decreased by 12%
- Customer lifetime value increased by 28%
- Churn rate reduced to 2.1%`,
      sources: [
        {
          document_id: 'doc-1',
          document_name: 'Q3 Financial Report.pdf',
          content: 'Revenue section highlights',
          relevance_score: 0.95,
        },
      ],
      created_at: new Date(Date.now() - 1 * 60 * 60 * 1000 + 5000).toISOString(),
    },
    {
      id: 'msg-3',
      conversation_id: 'conv-1',
      role: 'user',
      content: 'How does this compare to Q2?',
      created_at: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
    },
    {
      id: 'msg-4',
      conversation_id: 'conv-1',
      role: 'assistant',
      content: `Comparing Q3 to Q2 performance:

| Metric | Q2 | Q3 | Change |
|--------|-----|-----|--------|
| Revenue | $41.5M | $45.2M | +8.9% |
| Gross Margin | 71.2% | 72.5% | +1.3pp |
| Net Income | $5.8M | $6.9M | +19% |

Q3 showed significant improvement in all key areas, with particularly strong growth in recurring revenue and customer retention.`,
      sources: [
        {
          document_id: 'doc-1',
          document_name: 'Q3 Financial Report.pdf',
          content: 'Quarterly comparison section',
          relevance_score: 0.92,
        },
      ],
      created_at: new Date(Date.now() - 50 * 60 * 1000 + 5000).toISOString(),
    },
  ],
  'conv-2': [
    {
      id: 'msg-5',
      conversation_id: 'conv-2',
      role: 'user',
      content: 'What are the main features planned for 2024?',
      created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'msg-6',
      conversation_id: 'conv-2',
      role: 'assistant',
      content: `According to the Product Roadmap 2024, the main features planned are:

**Q1 2024**
- AI-powered document analysis
- Multi-language support (10+ languages)
- Team collaboration features

**Q2 2024**
- Advanced search with semantic understanding
- Custom AI model training
- Enterprise SSO integration

**Q3 2024**
- Real-time collaboration
- Mobile app launch (iOS & Android)
- API v2 with GraphQL support

**Q4 2024**
- White-label solution
- Advanced analytics dashboard
- Third-party integrations marketplace`,
      sources: [
        {
          document_id: 'doc-2',
          document_name: 'Product Roadmap 2024.md',
          content: 'Feature roadmap overview',
          relevance_score: 0.98,
        },
      ],
      created_at: new Date(Date.now() - 5 * 60 * 60 * 1000 + 5000).toISOString(),
    },
  ],
  'conv-3': [
    {
      id: 'msg-7',
      conversation_id: 'conv-3',
      role: 'user',
      content: 'Explain the overall system architecture',
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'msg-8',
      conversation_id: 'conv-3',
      role: 'assistant',
      content: `The system follows a modern microservices architecture:

**Frontend Layer**
- React SPA with TypeScript
- TanStack Query for server state
- Zustand for client state

**API Gateway**
- Authentication & rate limiting
- Request routing
- API versioning

**Backend Services**
- Document Service: File processing & storage
- Chat Service: Conversation management
- AI Service: LLM integration & RAG pipeline
- Search Service: Vector search & indexing

**Data Layer**
- PostgreSQL: Primary database
- Redis: Caching & sessions
- Milvus: Vector embeddings
- S3: Document storage

**Infrastructure**
- Kubernetes for orchestration
- Prometheus + Grafana for monitoring
- ELK stack for logging`,
      sources: [
        {
          document_id: 'doc-3',
          document_name: 'Technical Architecture.docx',
          content: 'System overview section',
          relevance_score: 0.96,
        },
        {
          document_id: 'doc-5',
          document_name: 'API Documentation.pdf',
          content: 'API architecture section',
          relevance_score: 0.88,
        },
      ],
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 5000).toISOString(),
    },
  ],
};

// Helper to generate new IDs
let idCounter = 100;
export const generateId = (prefix: string) => `${prefix}-${++idCounter}`;
