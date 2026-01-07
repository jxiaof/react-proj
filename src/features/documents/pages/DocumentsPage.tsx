import { useState, useRef, useMemo } from 'react';
import { ScrollablePageLayout } from '@/shared/components/layout/ScrollablePageLayout';
import { PageTransition } from '@/shared/components/PageTransition';
import { Button } from '@/shared/components/ui/Button';
import { Card, CardContent } from '@/shared/components/ui/Card';
import { LoadingSpinner } from '@/shared/components/feedback/LoadingSpinner';
import { DocumentViewer } from '@/shared/components/ui/DocumentViewer';
import { DocumentTabs } from '../components/DocumentTabs';
import { Upload, FileText, Trash2, Eye } from 'lucide-react';
import { useDocuments, useUploadDocument, useDeleteDocument } from '../hooks/useDocuments';
import type { Document } from '../api/documentTypes';
import { cn } from '@/shared/utils/cn';

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 生成模拟文档内容
function getMockDocumentContent(name: string, type: string): string {
  const mockContents: Record<string, string> = {
    'Q3 Financial Report.pdf': `# Q3 2023 财务报表

## 执行摘要
本季度公司实现营收 $45.2M，同比增长 18%，创历史新高。净利润达 $6.9M，利润率达 15.3%。

## 主要指标
- 总营收: $45.2M (↑8.9% QoQ)
- 毛利率: 72.5% (↑1.3pp)
- 净利润: $6.9M (↑19% YoY)
- 活跃用户: 125K (↑15% YoY)
- 客户留存率: 94% (↑2pp)

## 按地区营收分布
1. 北美: $22.6M (50%)
2. 欧洲: $13.5M (30%)
3. 亚太: $9.1M (20%)

## 成本结构
- 技术成本: 28%
- 销售成本: 35%
- 运营成本: 20%
- 其他: 17%

## 展望
Q4 预计继续保持增长势头，目标营收 $48M-50M。`,

    'Product Roadmap 2024.md': `# 产品路线图 2024

## Q1 2024
### 新功能
- [ ] AI 驱动的文档分析
- [ ] 支持 10+ 语言
- [ ] 团队协作功能
- [ ] 实时同步

### 改进
- [ ] 搜索性能优化
- [ ] UI/UX 增强
- [ ] API 文档完善

## Q2 2024
### 计划
- [ ] 高级搜索（语义理解）
- [ ] 自定义 AI 模型训练
- [ ] 企业级 SSO 集成

## Q3 2024
### 发布
- [ ] 实时协作编辑
- [ ] iOS/Android 移动应用
- [ ] GraphQL API v2

## Q4 2024
### 目标
- [ ] 白标解决方案
- [ ] 高级分析仪表板
- [ ] 第三方集成市场

## 优先级说明
P0 - 关键功能，必须交付
P1 - 重要功能，尽力交付
P2 - 可选功能，时间允许`,

    'API Documentation.pdf': `# API 文档

## 认证
所有 API 请求需在 Header 中包含有效的 API Key。

\`\`\`
Authorization: Bearer YOUR_API_KEY
\`\`\`

## 端点

### 获取文档列表
\`GET /api/documents\`

参数：
- limit: 10
- offset: 0

响应示例：
\`\`\`json
{
  "data": [...],
  "meta": {
    "total": 100,
    "limit": 10,
    "offset": 0
  }
}
\`\`\`

### 上传文档
\`POST /api/documents\`

内容类型: multipart/form-data

### 提问
\`POST /api/chat/messages\`

请求体：
\`\`\`json
{
  "conversation_id": "conv-123",
  "content": "文档中提到了什么？"
}
\`\`\`

## 错误处理
所有错误返回适当的 HTTP 状态码和错误信息。`,
  };

  return mockContents[name] || `# ${name}\n\n这是一份文档预览。\n\n文件类型: ${type}\n\n内容将在上传后显示。`;
}

function getDocumentCategory(mimeType: string): 'pdf' | 'word' | 'excel' | 'text' | 'other' {
    if (mimeType.includes('pdf')) return 'pdf';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'word';
    if (mimeType.includes('sheet') || mimeType.includes('excel')) return 'excel';
    if (mimeType.includes('markdown') || mimeType.includes('text/plain') || mimeType.includes('json') || mimeType.includes('xml')) return 'text';
    return 'other';
}

export default function DocumentsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<(Document & { content?: string }) | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'pdf' | 'word' | 'excel' | 'text' | 'other'>('all');

  const { data: documentsData, isLoading, error } = useDocuments();
  const uploadMutation = useUploadDocument();
  const deleteMutation = useDeleteDocument();

  const documents = documentsData?.data ?? [];

  // 根据活跃tab过滤文档
  const filteredDocuments = useMemo(() => {
      if (activeTab === 'all') return documents;
      // ✅ 只传一个参数
      return documents.filter(doc => getDocumentCategory(doc.mime_type) === activeTab);
  }, [documents, activeTab]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.currentTarget.files;
      if (!files) return;

      for (const file of Array.from(files)) {
          uploadMutation.mutate(file);
      }

      if (fileInputRef.current) {
          fileInputRef.current.value = '';
      }
  };

  const handleDelete = (id: string) => {
      if (confirm('确定要删除这个文档吗？')) {
          deleteMutation.mutate(id);
      }
  };

  const handleViewDocument = (doc: Document) => {
      const extMap: Record<string, string> = {
          pdf: 'pdf',
          doc: 'word',
          docx: 'word',
          xlsx: 'excel',
          xls: 'excel',
          txt: 'text',
          md: 'text',
          json: 'code',
          xml: 'code',
          jpg: 'image',
          jpeg: 'image',
          png: 'image',
      };

      const ext = doc.name.split('.').pop()?.toLowerCase() || '';
      const type = extMap[ext] || 'unknown';

      const docWithContent = {
          ...doc,
          content: getMockDocumentContent(doc.name, type),
      };

      setSelectedDoc(docWithContent);
      setViewerOpen(true);
  };

  return (
    <PageTransition>
      <ScrollablePageLayout 
        hideBottomNav={false}
        fullWidth={false}
        maxWidth="max-w-6xl"
        contentPadding="px-3 sm:px-4 md:px-6 py-6 md:py-8"
      >
        {/* 
          ✅ 改进：使用 space-y 统一间距，自动处理底部安全间距
          ScrollablePageLayout 会自动添加 H5 底部缓冲
        */}
        <div className="space-y-6 md:space-y-8">
          {/* Header */}
          <div className="animate-fadeInDown">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">我的文档</h1>
            <p className="text-sm md:text-base text-muted-foreground mt-2">
              管理和上传您的文档，开始智能问答
            </p>
          </div>

          {/* Upload Section */}
          <Card className="animate-fadeInUp">
            <CardContent className="pt-6">
              <div
                className="border-2 border-dashed border-primary/30 rounded-xl p-6 md:p-8 text-center hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors mb-4">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-base md:text-lg text-foreground">上传文档</h3>
                <p className="text-xs md:text-sm text-muted-foreground mt-2">
                  拖拽或点击选择，支持 PDF、Word、Markdown 等多种格式
                </p>
                <Button variant="outline" size="sm" className="mt-4">
                  选择文件
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.md,.txt,.xls,.xlsx,.json,.xml,.csv,.ppt,.pptx,.jpg,.jpeg,.png,.gif"
                />
              </div>
            </CardContent>
          </Card>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center py-12 animate-fadeInUp">
              <LoadingSpinner size="lg" />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive border border-destructive/20 animate-fadeInUp">
              加载文档失败: {error.message}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && documents.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-lg bg-muted mb-4">
                <FileText className="h-7 w-7 text-muted-foreground/60" />
              </div>
              <h3 className="text-lg font-semibold">还没有文档</h3>
              <p className="text-sm text-muted-foreground mt-2">上传您的第一个文档以开始</p>
            </div>
          )}

          {/* Document List */}
          {!isLoading && !error && documents.length > 0 && (
            <div className="space-y-4">
              <DocumentTabs 
                  documents={documents}
                  activeTab={activeTab}
                  onTabChange={(tab) => setActiveTab(tab as typeof activeTab)}
              />
              <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {filteredDocuments.map((doc, idx) => (
                    <Card
                        key={doc.id}
                        className="group overflow-hidden animate-scaleIn transition-all duration-300 hover:shadow-enhance hover:-translate-y-1"
                    >
                      <CardContent className="pt-5 relative">
                        {/* Status Indicator */}
                        <div className="absolute top-4 right-4">
                          <div
                            className={cn(
                              'w-2.5 h-2.5 rounded-full transition-all',
                              doc.status === 'ready'
                                  ? 'bg-green-500'
                                  : doc.status === 'processing'
                                      ? 'bg-yellow-500 animate-pulse'
                                      : doc.status === 'failed'
                                          ? 'bg-red-500'
                                          : 'bg-gray-400'
                            )}
                          />
                        </div>

                        {/* Icon and Title */}
                        <div className="flex gap-3 mb-4">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                              <FileText className="h-5 w-5 text-primary" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm truncate text-foreground group-hover:text-primary transition-colors">
                              {doc.name}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatFileSize(doc.size)} • {doc.mime_type.split('/')[1]?.toUpperCase() || '文件'}
                            </p>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <span
                          className={cn(
                            'inline-block text-xs px-2.5 py-1 rounded-md font-medium mt-3 transition-all',
                            doc.status === 'ready'
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                : doc.status === 'processing'
                                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 animate-pulse'
                                    : doc.status === 'failed'
                                        ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
                          )}
                        >
                          {doc.status === 'ready'
                              ? '就绪'
                              : doc.status === 'processing'
                                  ? '处理中'
                                  : doc.status === 'failed'
                                      ? '失败'
                                      : '待处理'}
                        </span>

                        {/* Actions */}
                        <div className="flex gap-2 pt-4 border-t border-border/20">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-xs h-9"
                            onClick={() => handleViewDocument(doc)}
                            disabled={doc.status !== 'ready'}
                            title={doc.status !== 'ready' ? '文档处理中，暂无法查看' : ''}
                          >
                            <Eye className="h-3.5 w-3.5 mr-1.5" />
                            查看
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(doc.id)}
                            disabled={deleteMutation.isPending}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 h-9 px-3"
                            title="删除文档"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                ))}
              </div>
            </div>
          )}
          
          {/* 
            ✅ 不需要额外的缓冲 div
            ScrollablePageLayout 会自动处理底部安全间距
          */}
        </div>
      </ScrollablePageLayout>

      {/* Document Viewer */}
      {selectedDoc && (
        <DocumentViewer
          open={viewerOpen}
          onOpenChange={setViewerOpen}
          document={selectedDoc}
        />
      )}
    </PageTransition>
  );
}
