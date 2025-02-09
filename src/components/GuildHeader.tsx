'use client';
import Image from 'next/image';

interface GuildHeaderProps {
  guildIcon: string | null;
  guildName: string;
  description: string | null;
}

export function GuildHeader({ guildIcon, guildName, description }: GuildHeaderProps) {
  return (
    <div className="flex-1">
      <div className="flex items-center">
        <Image 
          src={guildIcon ? guildIcon : "https://cdn.discordapp.com/embed/avatars/0.png"}
          alt={guildName}
          width={32}
          height={32}
          className="rounded-full mr-3"
          onError={(e) => {
            e.currentTarget.src = "https://cdn.discordapp.com/embed/avatars/0.png";
          }}
        />
        <h2 className="text-2xl font-semibold">{guildName}</h2>
      </div>
      {description && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{description}</p>
      )}
    </div>
  );
}