'use client';

import { DiscordChannel, DiscordChannelType, DiscordGuild } from "@/types/discord";
import { ChannelTypeSection } from "./ChannelTypeSection";
import { ChannelFilters } from "./ChannelFilters";
import { GuildHeader } from "./GuildHeader";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const channelTypeIcons: Record<DiscordChannelType, string> = {
  [DiscordChannelType.GuildText]: "💭",
  [DiscordChannelType.DM]: "📩",
  [DiscordChannelType.GuildVoice]: "🔊",
  [DiscordChannelType.GroupDM]: "👥",
  [DiscordChannelType.GuildCategory]: "📁",
  [DiscordChannelType.GuildAnnouncement]: "📢",
  [DiscordChannelType.AnnouncementThread]: "🧵",
  [DiscordChannelType.PublicThread]: "🧵",
  [DiscordChannelType.PrivateThread]: "🔒",
  [DiscordChannelType.GuildStageVoice]: "🎭",
  [DiscordChannelType.GuildDirectory]: "📚",
  [DiscordChannelType.GuildForum]: "💬",
  [DiscordChannelType.GuildMedia]: "🎬"
};

const channelTypeOrder: DiscordChannelType[] = [
  DiscordChannelType.GuildCategory,
  DiscordChannelType.GuildAnnouncement,
  DiscordChannelType.GuildText,
  DiscordChannelType.GuildVoice,
  DiscordChannelType.GuildStageVoice,
  DiscordChannelType.GuildForum,
  DiscordChannelType.GuildMedia,
  DiscordChannelType.PublicThread,
  DiscordChannelType.PrivateThread,
  DiscordChannelType.AnnouncementThread
];

function groupChannelsByType(channels: DiscordChannel[]): Record<DiscordChannelType, DiscordChannel[]> {
  const categories = channels.filter(channel => channel.type === DiscordChannelType.GuildCategory);
  const nonCategories = channels.filter(channel => channel.type !== DiscordChannelType.GuildCategory);

  const groupedByParent = nonCategories.reduce((acc, channel) => {
    const parentKey = channel.parentId || 'root';
    if (!acc[parentKey]) {
      acc[parentKey] = [];
    }
    acc[parentKey].push(channel);
    return acc;
  }, {} as Record<string, DiscordChannel[]>);

  const grouped = {} as Record<DiscordChannelType, DiscordChannel[]>;
  grouped[DiscordChannelType.GuildCategory] = categories.map(category => ({
    ...category,
    children: groupedByParent[category.id] || []
  })) as DiscordChannel[];

  const rootChannels = groupedByParent['root'] || [];
  rootChannels.forEach(channel => {
    if (!grouped[channel.type]) {
      grouped[channel.type] = [];
    }
    grouped[channel.type].push(channel);
  });

  Object.values(grouped).forEach(channels => {
    channels.sort((a, b) => a.name.localeCompare(b.name));
  });

  return grouped;
}

interface GuildSectionProps {
  guild: DiscordGuild;
}

export function GuildSection({ guild }: GuildSectionProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hideEmpty, setHideEmpty] = useState(false);
  const [voiceOnly, setVoiceOnly] = useState(false);
  const groupedChannels = groupChannelsByType(guild.channels);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex items-center text-left p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <ChevronRight 
          className={`w-5 h-5 transition-transform duration-200 ${isCollapsed ? '' : 'rotate-90'}`} 
        />
        <div className="flex-1">
          <GuildHeader 
            guildIcon={guild.iconURL}
            guildName={guild.name}
            description={guild.description}
          />
        </div>
      </button>
      
      <div className={`transition-all duration-200 ${isCollapsed ? 'hidden' : 'block'}`}>
        <div className="px-6 pb-6">
          <div className="flex justify-between items-center">
            <Link 
              href={`/discord/${guild.id}/presence`}
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View Presence Logs →
            </Link>
          </div>
          <ChannelFilters 
            hideEmpty={hideEmpty}
            voiceOnly={voiceOnly}
            onHideEmptyChange={setHideEmpty}
            onVoiceOnlyChange={setVoiceOnly}
          />
          
          <div className="space-y-6">
            {groupedChannels[DiscordChannelType.GuildCategory]?.map(category => {
              const children = (category as DiscordChannel & { children: DiscordChannel[] }).children || [];
              return (
                <ChannelTypeSection 
                  key={category.id}
                  type={DiscordChannelType.GuildCategory}
                  channels={[]}
                  childChannels={children}
                  icon={channelTypeIcons[DiscordChannelType.GuildCategory]}
                  channelTypeIcons={channelTypeIcons}
                  categoryName={category.name}
                  hideEmpty={hideEmpty}
                  voiceOnly={voiceOnly}
                />
              );
            })}
            
            {channelTypeOrder
              .filter(type => type !== DiscordChannelType.GuildCategory)
              .map(type => {
                const channels = groupedChannels[type] || [];
                if (channels.length === 0) return null;

                return (
                  <ChannelTypeSection 
                    key={type}
                    type={type}
                    channels={channels}
                    childChannels={[]}
                    icon={channelTypeIcons[type]}
                    channelTypeIcons={channelTypeIcons}
                    hideEmpty={hideEmpty}
                    voiceOnly={voiceOnly}
                  />
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}