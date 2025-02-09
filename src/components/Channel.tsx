import { DiscordChannel } from "@/types/discord";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { UserList } from "./UserList";

interface ChannelProps {
  channel: DiscordChannel;
  icon: string;
}

export function Channel({ channel, icon }: ChannelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="ml-6 mb-2">
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex items-center text-left py-1 px-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded group transition-colors"
      >
        <ChevronRight 
          className={`w-3 h-3 transition-transform duration-200 ${isCollapsed ? '' : 'rotate-90'} opacity-0 group-hover:opacity-100`} 
        />
        <span className="mx-2">{icon}</span>
        <span className="text-gray-700 dark:text-gray-300">{channel.name}</span>
        {channel.users.length > 0 && (
          <span className="ml-2 px-1.5 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-600 rounded-full">
            {channel.users.length}
          </span>
        )}
      </button>
      <div className={`transition-all duration-200 ${isCollapsed ? 'hidden' : 'block'}`}>
        <UserList users={channel.users} />
      </div>
    </div>
  );
}