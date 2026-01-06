import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ChatState {
  // 收藏的对话 ID
  favoriteConversationIds: Set<string>;
  
  // 添加到收藏
  addFavorite: (id: string) => void;
  
  // 从收藏移除
  removeFavorite: (id: string) => void;
  
  // 检查是否已收藏
  isFavorite: (id: string) => boolean;
  
  // 获取所有收藏
  getFavorites: () => string[];
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      favoriteConversationIds: new Set(),
      
      addFavorite: (id: string) =>
        set((state) => ({
          favoriteConversationIds: new Set([...state.favoriteConversationIds, id]),
        })),
      
      removeFavorite: (id: string) =>
        set((state) => {
          const newSet = new Set(state.favoriteConversationIds);
          newSet.delete(id);
          return { favoriteConversationIds: newSet };
        }),
      
      isFavorite: (id: string) => get().favoriteConversationIds.has(id),
      
      getFavorites: () => Array.from(get().favoriteConversationIds),
    }),
    {
      name: 'chat-storage',
      storage: {
        getItem: (name) => {
          const item = localStorage.getItem(name);
          if (!item) return null;
          const parsed = JSON.parse(item);
          return {
            ...parsed,
            state: {
              ...parsed.state,
              favoriteConversationIds: new Set(parsed.state.favoriteConversationIds || []),
            },
          };
        },
        setItem: (name, value) => {
          localStorage.setItem(
            name,
            JSON.stringify({
              ...value,
              state: {
                ...value.state,
                favoriteConversationIds: Array.from(value.state.favoriteConversationIds),
              },
            })
          );
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);