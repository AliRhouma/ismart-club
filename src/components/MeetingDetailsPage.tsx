import { ArrowLeft, Calendar, Clock, Users, MapPin, Edit, MessageSquare, Lightbulb, CheckCircle, Plus, MoreVertical } from 'lucide-react';

interface Meeting {
  id: number;
  title: string;
  topic: string;
  date: string;
  time: string;
  groups: string[];
  members: string[];
  status: 'Upcoming' | 'Completed' | 'Cancelled';
  duration: string;
  location: string;
  description: string;
}

interface MeetingDetailsPageProps {
  meeting: Meeting;
  onBack: () => void;
}

const mockTopicsDiscussed = [
  {
    id: 1,
    title: 'Current Performance Analysis',
    description: 'Reviewed the team performance over the last 5 matches. Discussed both offensive and defensive statistics.',
    timestamp: '10:05 AM',
    duration: '25 min'
  },
  {
    id: 2,
    title: 'Tactical Adjustments',
    description: 'Proposed changes to formation and playing style. Focus on improving ball possession in midfield.',
    timestamp: '10:30 AM',
    duration: '35 min'
  },
  {
    id: 3,
    title: 'Player Development Plans',
    description: 'Individual development plans for key players. Special focus on young talents integration.',
    timestamp: '11:05 AM',
    duration: '20 min'
  },
  {
    id: 4,
    title: 'Upcoming Match Strategy',
    description: 'Detailed analysis of next opponent. Discussion of counter-tactics and set-piece strategies.',
    timestamp: '11:25 AM',
    duration: '30 min'
  }
];

const mockKeyPoints = [
  {
    id: 1,
    point: 'Team passing accuracy has improved by 12% over the last month',
    category: 'Performance',
    priority: 'High'
  },
  {
    id: 2,
    point: 'Need to work on defensive transitions during training sessions',
    category: 'Training',
    priority: 'High'
  },
  {
    id: 3,
    point: 'Three young academy players ready for senior team integration',
    category: 'Development',
    priority: 'Medium'
  },
  {
    id: 4,
    point: 'Set-piece conversion rate needs improvement - currently at 18%',
    category: 'Tactics',
    priority: 'High'
  },
  {
    id: 5,
    point: 'Video analysis system upgrade scheduled for next month',
    category: 'Technology',
    priority: 'Low'
  },
  {
    id: 6,
    point: 'Player feedback on new training regime has been positive',
    category: 'Feedback',
    priority: 'Medium'
  }
];

const mockDecisions = [
  {
    id: 1,
    decision: 'Implement new 4-3-3 formation starting next match',
    owner: 'Head Coach',
    deadline: '18 Jan 2026',
    status: 'In Progress'
  },
  {
    id: 2,
    decision: 'Schedule additional set-piece training sessions twice per week',
    owner: 'Assistant Coach',
    deadline: '16 Jan 2026',
    status: 'Approved'
  },
  {
    id: 3,
    decision: 'Integrate academy players into senior training on Wednesdays',
    owner: 'Academy Director',
    deadline: '20 Jan 2026',
    status: 'Pending'
  },
  {
    id: 4,
    decision: 'Conduct individual performance reviews with all starting XI',
    owner: 'Head Coach',
    deadline: '25 Jan 2026',
    status: 'Approved'
  },
  {
    id: 5,
    decision: 'Update video analysis software and train staff',
    owner: 'Video Analyst',
    deadline: '15 Feb 2026',
    status: 'Approved'
  }
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'High':
      return 'bg-error-50 text-error-600 border-error-200';
    case 'Medium':
      return 'bg-warning-50 text-warning-600 border-warning-200';
    case 'Low':
      return 'bg-success-50 text-success-600 border-success-200';
    default:
      return 'bg-neutral-100 text-subtext-color border-neutral-300';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Approved':
      return 'bg-success-50 text-success-600 border-success-200';
    case 'In Progress':
      return 'bg-brand-50 text-brand-600 border-brand-200';
    case 'Pending':
      return 'bg-warning-50 text-warning-600 border-warning-200';
    default:
      return 'bg-neutral-100 text-subtext-color border-neutral-300';
  }
};

const getGroupColor = (group: string) => {
  const colors = [
    'bg-brand-50 text-brand-600',
    'bg-warning-50 text-warning-600',
    'bg-success-50 text-success-600',
    'bg-error-50 text-error-600',
  ];
  const hash = group.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

export function MeetingDetailsPage({ meeting, onBack }: MeetingDetailsPageProps) {
  return (
    <div className="flex-1 overflow-y-auto bg-default-background">
      <div className="max-w-[1400px] mx-auto p-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-body text-subtext-color hover:text-default-font transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Meetings
        </button>

        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-heading-1 text-default-font">{meeting.title}</h1>
                <div className={`px-3 py-1 rounded-full text-caption-bold border ${
                  meeting.status === 'Upcoming'
                    ? 'bg-brand-50 text-brand-600 border-brand-200'
                    : meeting.status === 'Completed'
                    ? 'bg-success-50 text-success-600 border-success-200'
                    : 'bg-error-50 text-error-600 border-error-200'
                }`}>
                  {meeting.status}
                </div>
              </div>
              <p className="text-body text-subtext-color mb-4">{meeting.topic}</p>
              <p className="text-body text-default-font">{meeting.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                <Edit className="w-5 h-5 text-subtext-color" />
              </button>
              <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                <MoreVertical className="w-5 h-5 text-subtext-color" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-neutral-200">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-brand-50 rounded-lg">
                <Calendar className="w-5 h-5 text-brand-600" />
              </div>
              <div>
                <div className="text-caption text-subtext-color mb-1">Date</div>
                <div className="text-body-bold text-default-font">{meeting.date}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-brand-50 rounded-lg">
                <Clock className="w-5 h-5 text-brand-600" />
              </div>
              <div>
                <div className="text-caption text-subtext-color mb-1">Time</div>
                <div className="text-body-bold text-default-font">{meeting.time}</div>
                <div className="text-caption text-subtext-color">{meeting.duration}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-brand-50 rounded-lg">
                <MapPin className="w-5 h-5 text-brand-600" />
              </div>
              <div>
                <div className="text-caption text-subtext-color mb-1">Location</div>
                <div className="text-body-bold text-default-font">{meeting.location}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-brand-50 rounded-lg">
                <Users className="w-5 h-5 text-brand-600" />
              </div>
              <div>
                <div className="text-caption text-subtext-color mb-1">Participants</div>
                <div className="text-body-bold text-default-font">{meeting.members.length} members</div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-neutral-200 mt-6">
            <div className="text-caption-bold text-default-font mb-3">Groups</div>
            <div className="flex flex-wrap gap-2">
              {meeting.groups.map((group) => (
                <span
                  key={group}
                  className={`px-3 py-1.5 rounded-lg text-body ${getGroupColor(group)}`}
                >
                  {group}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-neutral-200 mt-6">
            <div className="text-caption-bold text-default-font mb-3">Participants</div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {meeting.members.map((member, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-neutral-100 rounded-lg px-3 py-2">
                  <div className="w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center">
                    <span className="text-caption-bold text-white">
                      {member.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                  <span className="text-body text-default-font">{member}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-brand-600" />
                  <h2 className="text-heading-2 text-default-font">Topics Discussed</h2>
                </div>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-brand-600 text-white rounded-lg text-caption-bold hover:bg-brand-700 transition-colors">
                  <Plus className="w-4 h-4" />
                  Add Topic
                </button>
              </div>

              <div className="space-y-4">
                {mockTopicsDiscussed.map((topic) => (
                  <div key={topic.id} className="bg-neutral-100 rounded-lg p-4 border border-neutral-200">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-heading-3 text-default-font">{topic.title}</h3>
                      <div className="flex items-center gap-2 text-caption text-subtext-color">
                        <Clock className="w-3 h-3" />
                        {topic.timestamp}
                      </div>
                    </div>
                    <p className="text-body text-subtext-color mb-2">{topic.description}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-caption text-subtext-color">Duration: {topic.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-success-600" />
                  <h2 className="text-heading-2 text-default-font">Decisions Made</h2>
                </div>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-green-button text-white rounded-lg text-caption-bold hover:opacity-90 transition-opacity">
                  <Plus className="w-4 h-4" />
                  Add Decision
                </button>
              </div>

              <div className="space-y-3">
                {mockDecisions.map((decision) => (
                  <div key={decision.id} className="bg-neutral-100 rounded-lg p-4 border border-neutral-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="text-body-bold text-default-font mb-2">{decision.decision}</p>
                        <div className="flex items-center gap-4 text-caption text-subtext-color">
                          <span>Owner: <span className="text-default-font font-medium">{decision.owner}</span></span>
                          <span>Deadline: <span className="text-default-font font-medium">{decision.deadline}</span></span>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-caption-bold border whitespace-nowrap ${getStatusColor(decision.status)}`}>
                        {decision.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-warning-600" />
                  <h2 className="text-heading-2 text-default-font">Key Points</h2>
                </div>
                <button className="p-1.5 hover:bg-neutral-100 rounded transition-colors">
                  <Plus className="w-4 h-4 text-subtext-color" />
                </button>
              </div>

              <div className="space-y-3">
                {mockKeyPoints.map((item) => (
                  <div key={item.id} className="bg-neutral-100 rounded-lg p-3 border border-neutral-200">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-caption text-subtext-color">{item.category}</span>
                      <div className={`px-2 py-0.5 rounded text-caption-bold border ${getPriorityColor(item.priority)}`}>
                        {item.priority}
                      </div>
                    </div>
                    <p className="text-body text-default-font">{item.point}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6">
              <h3 className="text-heading-3 text-default-font mb-4">Meeting Summary</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-body text-subtext-color">Topics Covered</span>
                  <span className="text-body-bold text-default-font">{mockTopicsDiscussed.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-body text-subtext-color">Key Points</span>
                  <span className="text-body-bold text-default-font">{mockKeyPoints.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-body text-subtext-color">Decisions</span>
                  <span className="text-body-bold text-default-font">{mockDecisions.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-body text-subtext-color">Action Items</span>
                  <span className="text-body-bold text-warning-600">
                    {mockDecisions.filter(d => d.status === 'Pending').length} pending
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
