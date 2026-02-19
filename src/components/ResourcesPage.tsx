import { useState } from 'react';

type TabType = 'procedes' | 'reglements' | 'organigramme';

export function ResourcesPage() {
  const [activeTab, setActiveTab] = useState<TabType>('procedes');

  const tabs = [
    { id: 'procedes' as TabType, label: 'Procédés' },
    { id: 'reglements' as TabType, label: 'Reglements' },
    { id: 'organigramme' as TabType, label: 'Organigramme' }
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-default-background">
      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-heading-1 text-default-font mb-2">Resources</h1>
          <p className="text-body text-subtext-color">Access organizational resources and documentation</p>
        </div>

        <div className="bg-neutral-50 border border-neutral-200 rounded-lg overflow-hidden">
          <div className="border-b border-neutral-200 bg-neutral-100">
            <div className="flex gap-1 p-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-lg text-body-bold transition-colors ${
                    activeTab === tab.id
                      ? 'bg-neutral-50 text-brand-600 shadow-sm'
                      : 'text-subtext-color hover:text-default-font hover:bg-neutral-50/50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-8">
            {activeTab === 'procedes' && (
              <div className="text-center py-12">
                <p className="text-body text-subtext-color">Procédés content will be added here</p>
              </div>
            )}

            {activeTab === 'reglements' && (
              <div className="text-center py-12">
                <p className="text-body text-subtext-color">Reglements content will be added here</p>
              </div>
            )}

            {activeTab === 'organigramme' && (
              <div className="text-center py-12">
                <p className="text-body text-subtext-color">Organigramme content will be added here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
