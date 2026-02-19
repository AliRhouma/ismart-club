import { Clock, User } from 'lucide-react';

interface QuestionnaireCardProps {
  title: string;
  schedule: string;
  level: string;
  tags: string[];
  isActive: boolean;
}

export function QuestionnaireCard({ title, schedule, level, tags, isActive }: QuestionnaireCardProps) {
  return (
    <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-5 hover:border-neutral-300 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-heading-3 text-default-font">{title}</h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success-600"></div>
          <span className="text-body text-success-600">Active</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-subtext-color">
          <Clock className="w-4 h-4" />
          <span className="text-body">{schedule}</span>
        </div>

        <div className="flex items-center gap-2 text-subtext-color">
          <User className="w-4 h-4" />
          <span className="text-body">{level}</span>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-transparent border border-brand-600 text-brand-600 rounded-full text-caption"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
