interface TabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: {
    id: string;
    label: string;
    icon: string;
    count?: number;
  }[];
}

const DashboardTabs = ({ activeTab, onTabChange, tabs }: TabsProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-6 p-1">
      <div className="flex flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex items-center space-x-2 px-4 py-3 rounded-md font-medium transition-all duration-300 mr-1 mb-1
              ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }
            `}
          >
            <span className="text-lg">{tab.icon}</span>
            <span className="whitespace-nowrap">{tab.label}</span>
            {tab.count !== undefined && (
              <span className={`
                text-xs px-2 py-1 rounded-full font-semibold
                ${
                  activeTab === tab.id
                    ? 'bg-white/20 text-white'
                    : 'bg-blue-100 text-blue-800'
                }
              `}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DashboardTabs;
