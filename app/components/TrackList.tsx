// components/TrackList.tsx
import React from "react";

export interface Track {
  id: string;
  name: string;
  artist: string;
  album: string;
  imageUrl: string;
  spotifyUrl: string;
}

interface TrackListProps {
  tracks: Track[];
}

export default function TrackList({ tracks }: TrackListProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {tracks.map((track) => (
        <a
          key={track.id}
          href={track.spotifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <img
            src={track.imageUrl}
            alt={`${track.name} album cover`}
            className="w-28 h-28 object-cover rounded-md mb-2 mx-auto"
          />
          <h3 className="text-lg font-semibold text-center">{track.name}</h3>
          <p className="text-xs text-gray-400 text-center">
            {track.artist} - {track.album}
          </p>
        </a>
      ))}
    </div>
  );
}
