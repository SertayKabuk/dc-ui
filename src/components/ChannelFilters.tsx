'use client';

interface ChannelFiltersProps {
  hideEmpty: boolean;
  voiceOnly: boolean;
  onHideEmptyChange: (value: boolean) => void;
  onVoiceOnlyChange: (value: boolean) => void;
}

export function ChannelFilters({ 
  hideEmpty, 
  voiceOnly, 
  onHideEmptyChange, 
  onVoiceOnlyChange 
}: ChannelFiltersProps) {
  const handleEmptyFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onHideEmptyChange(e.target.checked);
  };

  const handleVoiceFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onVoiceOnlyChange(e.target.checked);
  };

  return (
    <div className="flex items-center space-x-4 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
      <label className="inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={hideEmpty}
          onChange={handleEmptyFilterChange}
          className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
        />
        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
          Hide empty channels
        </span>
      </label>

      <label className="inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={voiceOnly}
          onChange={handleVoiceFilterChange}
          className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
        />
        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
          Show only voice channels
        </span>
      </label>
    </div>
  );
}