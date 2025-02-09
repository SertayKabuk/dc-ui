'use client';

import { DiscordChannel, DiscordChannelType } from "@/types/discord";
import { useState, useMemo } from "react";
import { ChevronRight } from "lucide-react";
import { Channel } from "./Channel";

interface ChannelTypeSectionProps {
  type: DiscordChannelType;
  channels: DiscordChannel[];
  childChannels: DiscordChannel[];
  icon: string;
  channelTypeIcons: Record<DiscordChannelType, string>;
  categoryName?: string;
  hideEmpty: boolean;
  voiceOnly: boolean;
}

export function ChannelTypeSection({ 
  type, 
  channels, 
  childChannels, 
  icon, 
  channelTypeIcons,
  categoryName,
  hideEmpty,
  voiceOnly
}: ChannelTypeSectionProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const filteredChannels = useMemo(() => {
    let filtered = channels;
    let filteredChildren = childChannels;

    if (voiceOnly) {
      filtered = filtered.filter(channel => 
        channel.type === DiscordChannelType.GuildVoice || 
        channel.type === DiscordChannelType.GuildStageVoice
      );
      filteredChildren = filteredChildren.filter(channel => 
        channel.type === DiscordChannelType.GuildVoice || 
        channel.type === DiscordChannelType.GuildStageVoice
      );
    }

    if (hideEmpty) {
      filtered = filtered.filter(channel => channel.users.length > 0);
      filteredChildren = filteredChildren.filter(channel => channel.users.length > 0);
    }

    return {
      channels: filtered,
      childChannels: filteredChildren
    };
  }, [channels, childChannels, hideEmpty, voiceOnly]);

  if ((hideEmpty || voiceOnly) && filteredChannels.channels.length === 0 && filteredChannels.childChannels.length === 0) {
    return null;
  }

  const getReadableTypeName = (channelType: DiscordChannelType): string => {
    const name = DiscordChannelType[channelType];
    return name.replace(/^Guild/, '').replace(/([A-Z])/g, ' $1').trim();
  };

  const renderChannel = (channel: DiscordChannel) => {
    return (
      <Channel 
        key={channel.id}
        channel={channel}
        icon={channelTypeIcons[channel.type]}
      />
    );
  };

  const sectionName = type === DiscordChannelType.GuildCategory 
    ? categoryName 
    : getReadableTypeName(type);

  return (
    <div className="space-y-2">
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex items-center justify-between text-left p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg group transition-colors"
      >
        <div className="flex items-center space-x-2">
          <ChevronRight 
            className={`w-4 h-4 transition-transform duration-200 ${isCollapsed ? '' : 'rotate-90'}`} 
          />
          <span className="mr-2">{icon}</span>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            {sectionName}
          </h3>
          <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-600 rounded-full">
            {filteredChannels.channels.length + filteredChannels.childChannels.length}
          </span>
        </div>
      </button>

      <div className={`space-y-2 ml-6 transition-all duration-200 ${isCollapsed ? 'hidden' : 'block'}`}>
        {type === DiscordChannelType.GuildCategory 
          ? filteredChannels.childChannels.map(renderChannel)
          : [...filteredChannels.channels, ...filteredChannels.childChannels].map(renderChannel)
        }
      </div>
    </div>
  );
}