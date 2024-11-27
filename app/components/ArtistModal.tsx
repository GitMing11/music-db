// components/ArtistModal.tsx
import React from 'react';
import Link from 'next/link';

interface ArtistModalProps {
  artist: any;
  onClose: () => void;
}

const ArtistModal: React.FC<ArtistModalProps> = ({ artist, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-[#1c1c1c] p-6 rounded-lg shadow-lg max-w-md w-full">
        <button
          onClick={onClose}
          className="text-white float-right hover:text-red-500 transition-colors"
        >
          ✖
        </button>
        <h2 className="text-2xl font-semibold mb-2 text-center">
          {artist.name}
        </h2>
        {artist.images && artist.images.length > 0 && (
          <img
            src={artist.images[0].url}
            alt={artist.name}
            className="w-full h-auto max-h-48 object-contain rounded-lg mb-4"
          />
        )}
        <p className="text-white mb-2">Genres: {artist.genres.join(', ')}</p>
        <p className="text-white mb-4">Popularity: {artist.popularity}</p>
        <Link
          href={`https://open.spotify.com/artist/${artist.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#b21212] text-white py-2 px-4 rounded-full transition-colors duration-300 hover:bg-[#901010] text-center"
        >
          Visit on Spotify
        </Link>
      </div>
    </div>
  );
};

export default ArtistModal;
