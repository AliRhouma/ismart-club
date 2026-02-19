import { Document } from '../types/document';

export type { Document } from '../types/document';

const STORAGE_KEY = 'documents';

export const storage = {
  getAllDocuments(): Document[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading documents:', error);
      return [];
    }
  },

  getDocument(id: string): Document | null {
    const documents = this.getAllDocuments();
    return documents.find(doc => doc.id === id) || null;
  },

  saveDocument(document: Document): void {
    try {
      const documents = this.getAllDocuments();
      const existingIndex = documents.findIndex(doc => doc.id === document.id);
      
      if (existingIndex >= 0) {
        documents[existingIndex] = {
          ...document,
          updatedAt: Date.now(),
        };
      } else {
        documents.push({
          ...document,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
    } catch (error) {
      console.error('Error saving document:', error);
    }
  },

  deleteDocument(id: string): void {
    try {
      const documents = this.getAllDocuments();
      const filtered = documents.filter(doc => doc.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  },

  generateId(): string {
    return `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },
};

export const getAllDocuments = storage.getAllDocuments.bind(storage);
export const getDocument = storage.getDocument.bind(storage);
export const saveDocument = storage.saveDocument.bind(storage);
export const deleteDocument = storage.deleteDocument.bind(storage);
export const generateId = storage.generateId.bind(storage);
