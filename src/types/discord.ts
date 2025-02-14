export enum DiscordChannelType {
  /**
   * A text channel within a guild
   */
  GuildText = 0,
  /**
   * A direct message between users
   */
  DM = 1,
  /**
   * A voice channel within a guild
   */
  GuildVoice = 2,
  /**
   * A direct message between multiple users
   */
  GroupDM = 3,
  /**
   * An organizational category that contains up to 50 channels
   */
  GuildCategory = 4,
  /**
   * A channel that users can follow and crosspost into their own guild
   */
  GuildAnnouncement = 5,
  /**
   * A temporary sub-channel within a Guild Announcement channel
   */
  AnnouncementThread = 10,
  /**
   * A temporary sub-channel within a Guild Text or Guild Forum channel
   */
  PublicThread = 11,
  /**
   * A temporary sub-channel within a Guild Text channel that is only viewable by those invited
   */
  PrivateThread = 12,
  /**
   * A voice channel for hosting events with an audience
   */
  GuildStageVoice = 13,
  /**
   * The channel in a Student Hub containing the listed servers
   */
  GuildDirectory = 14,
  /**
   * A channel that can only contain threads
   */
  GuildForum = 15,
  /**
   * A channel like forum channels but contains media for server subscriptions
   */
  GuildMedia = 16
}

export interface DiscordUser {
  id: string;
  username: string;
  displayName: string;
  status: string;
  activity: string;
}

export interface DiscordChannel {
  id: string;
  parentId: string | null;
  name: string;
  type: DiscordChannelType;
  users: DiscordUser[];
}

export interface DiscordGuild {
  id: string;
  name: string;
  iconURL: string | null;
  description: string | null;
  channels: DiscordChannel[];
}

export interface DiscordGuildsResponse {
  guilds: DiscordGuild[];
}

export interface PresenceLog {
  id: string;
  guild_id: string;
  user_id: string;
  username: string;
  old_status: string;
  new_status: string;
  old_activity: string | null;
  new_activity: string | null;
  client_status: string;
  created_at: string;
}

export function normalizeChannelType(type: string | number): DiscordChannelType {
  // If type is a number, return it directly if it's a valid DiscordChannelType
  if (typeof type === 'number') {
    if (type in DiscordChannelType) {
      return type;
    }
    console.warn(`Unknown numeric channel type: ${type}`);
    return DiscordChannelType.GuildText; // Default to text channel if unknown
  }

  // If type is a string, try to match it to enum names
  const normalized = type.toUpperCase().replace(/\s+/g, '');
  
  switch (normalized) {
    case 'TEXT':
    case 'GUILDTEXT':
      return DiscordChannelType.GuildText;
    case 'DM':
      return DiscordChannelType.DM;
    case 'VOICE':
    case 'GUILDVOICE':
      return DiscordChannelType.GuildVoice;
    case 'GROUPDM':
      return DiscordChannelType.GroupDM;
    case 'CATEGORY':
    case 'GUILDCATEGORY':
      return DiscordChannelType.GuildCategory;
    case 'ANNOUNCEMENT':
    case 'NEWS':
    case 'GUILDANNOUNCEMENT':
      return DiscordChannelType.GuildAnnouncement;
    case 'ANNOUNCEMENTTHREAD':
    case 'NEWSTHREAD':
      return DiscordChannelType.AnnouncementThread;
    case 'GUILDPUBLICTHREAD':
    case 'PUBLICTHREAD':
      return DiscordChannelType.PublicThread;
    case 'PRIVATETHREAD':
      return DiscordChannelType.PrivateThread;
    case 'STAGEVOICE':
    case 'GUILDSTAGEVOICE':
      return DiscordChannelType.GuildStageVoice;
    case 'DIRECTORY':
    case 'GUILDDIRECTORY':
      return DiscordChannelType.GuildDirectory;
    case 'FORUM':
    case 'GUILDFORUM':
      return DiscordChannelType.GuildForum;
    case 'MEDIA':
    case 'GUILDMEDIA':
      return DiscordChannelType.GuildMedia;
    default:
      console.warn(`Unknown string channel type: ${type}`);
      return DiscordChannelType.GuildText; // Default to text channel if unknown type
  }
}