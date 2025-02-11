import { DiscordUser } from "@/types/discord";
import { useState } from "react";
import { ChevronRight } from "lucide-react";

interface UserListProps {
  users: DiscordUser[];
}

export function UserList({ users }: UserListProps) {
  const [isOfflineCollapsed, setIsOfflineCollapsed] = useState(true);
  
  if (!users.length) return null;

  const onlineUsers = users.filter(user => user.status !== 'offline');
  const offlineUsers = users.filter(user => user.status === 'offline');

  const renderUser = (user: DiscordUser) => (
    <div key={user.id} className="flex flex-col py-1">
      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
        <span className="w-2 h-2 rounded-full mr-2" style={{ 
          backgroundColor: user.status === 'online' || user.status === 'connected' ? '#22c55e' : 
                         user.status === 'idle' ? '#eab308' : 
                         user.status === 'dnd' ? '#ef4444' : '#6b7280'
        }}/>
        <span>{user.username}</span>
        {user.displayName && user.displayName !== user.username && (
          <span className="text-gray-400 dark:text-gray-500 ml-1">({user.displayName})</span>
        )}
      </div>
      {user.activity && (
        <div className="ml-4 text-xs text-gray-500 dark:text-gray-500">
          {user.activity}
        </div>
      )}
    </div>
  );

  return (
    <div className="mt-2 pl-6">
      {/* Online users */}
      {onlineUsers.map(renderUser)}

      {/* Offline users section */}
      {offlineUsers.length > 0 && (
        <div>
          <button
            onClick={() => setIsOfflineCollapsed(!isOfflineCollapsed)}
            className="flex items-center py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            <ChevronRight 
              className={`w-3 h-3 transition-transform duration-200 ${isOfflineCollapsed ? '' : 'rotate-90'}`} 
            />
            <span className="ml-1">Offline — {offlineUsers.length}</span>
          </button>
          <div className={`space-y-1 ${isOfflineCollapsed ? 'hidden' : 'block'}`}>
            {offlineUsers.map(renderUser)}
          </div>
        </div>
      )}
    </div>
  );
}