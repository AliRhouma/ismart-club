import { ChevronLeft, ChevronRight } from 'lucide-react';

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function CalendarWeek() {
  return (
    <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-heading-2 text-default-font">This Week – Training & Survey Schedule</h2>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-neutral-100 rounded-md transition-colors">
            <ChevronLeft className="w-5 h-5 text-default-font" />
          </button>
          <button className="p-2 hover:bg-neutral-100 rounded-md transition-colors">
            <ChevronRight className="w-5 h-5 text-default-font" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {weekDays.map((day) => (
          <div key={day} className="text-center">
            <div className="bg-neutral-100 rounded-lg p-4 min-h-32 border border-neutral-200">
              <div className="text-body-bold text-default-font mb-2">{day}</div>
              <div className="text-caption text-subtext-color">No events</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
