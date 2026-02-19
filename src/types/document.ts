export interface Document {
  id: string;
  title: string;
  content: any; // TipTap JSON content
  createdAt: number;
  updatedAt: number;
}

export interface BlockMenuItem {
  title: string;
  description: string;
  icon: string;
  command: (props: any) => void;
}
