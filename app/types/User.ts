export type Genre = {
  id: number;
  name: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  genres: Genre[];
};

// @/app/types.ts
export interface Track {
  id: string;
  name: string;
  artist: string;
  album: string;
  imageUrl: string;
  spotifyUrl: string;
  isLiked: boolean;
}

export interface Playlist {
  id: number;
  name: string;
  tracks: Track[];  // Playlist 안에 Track 배열을 포함
}
