
  export interface AssetAttributes {
    name: string;
    description: string;
    createdAt: string;
    URL: string;
  }
  
  export interface Asset {
    type: 'asset';
    id: string;
    attributes: AssetAttributes;
  }
  
  export interface ParticipantStats {
    DBNOs: number;
    assists: number;
    boosts: number;
    damageDealt: number;
    deathType: string;
    headshotKills: number;
    heals: number;
    killPlace: number;
    killStreaks: number;
    kills: number;
    longestKill: number;
    name: string;
    playerId: string;
    revives: number;
    rideDistance: number;
    roadKills: number;
    swimDistance: number;
    teamKills: number;
    timeSurvived: number;
    vehicleDestroys: number;
    walkDistance: number;
    weaponsAcquired: number;
    winPlace: number;
  }
  
  export interface Participant {
    type: 'participant';
    id: string;
    attributes: {
      stats: ParticipantStats;
      actor: string;
      shardId: string;
    };
  }
  
  // Roster type definition
  export interface RosterStats {
    rank: number;
    teamId: number;
  }
  
  export interface RosterParticipant {
    type: 'participant';
    id: string;
  }
  
  export interface Roster {
    type: 'roster';
    id: string;
    attributes: {
      stats: RosterStats;
      won: string;
      shardId: string;
    };
    relationships: {
      team: {
        data: null;
      };
      participants: {
        data: RosterParticipant[];
      };
    };
  }
  
  export type IncludedType = Asset | Participant | Roster;
  
  export interface PubgMatchResponse {
    data: {
      type: string;
      id: string;
      attributes: {
        matchType: string;
        duration: number;
        stats: object;
        gameMode: string;
        titleId: string;
        shardId: string;
        tags: object;
        mapName: string;
        createdAt: string;
        isCustomMatch: boolean;
        seasonState: string;
      };
      relationships: {
        rosters: { data: { type: string; id: string }[] };
        assets: { data: { type: string; id: string }[] };
      };
      links: { self: string; schema: string };
    };
    included: IncludedType[];
    links: { self: string };
    meta: Record<string, object>;
  }