/**
 * 构建信息 - 用于验证 mock 数据是否被正确打包
 */
export const BUILD_INFO = {
  version: import.meta.env.VITE_APP_VERSION || '0.0.0',
  buildTime: import.meta.env.BUILD_TIME || new Date().toISOString(),
  env: import.meta.env.MODE,
  hasMockData: true, // ✅ 始终为 true（确保 mock 数据被打包）
  apiUrl: import.meta.env.VITE_API_URL || 'none',
} as const;

// ✅ 验证函数：确认 mock 数据可用
export async function verifyMockData() {
  try {
    const { mockDocuments, mockConversations, mockMessages, mockProviders } = await import('@/infrastructure/mock/mockData');
    
    console.log('✅ Mock data verified:', {
      documents: mockDocuments.length,
      conversations: mockConversations.length,
      messages: Object.keys(mockMessages).length,
      providers: mockProviders.length,
    });

    return {
      success: true,
      data: {
        documents: mockDocuments.length,
        conversations: mockConversations.length,
        messages: Object.keys(mockMessages).length,
        providers: mockProviders.length,
      },
    };
  } catch (error) {
    console.error('❌ Mock data verification failed:', error);
    return { success: false, error };
  }
}