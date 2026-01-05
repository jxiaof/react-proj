export interface Document {
  id: string;
  name: string;
  size: number;
  mime_type: string;
  status: 'pending' | 'processing' | 'ready' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface DocumentFilters {
  search?: string;
  status?: Document['status'];
  limit?: number;
  offset?: number;
}

export interface UploadDocumentRequest {
  file: File;
}
