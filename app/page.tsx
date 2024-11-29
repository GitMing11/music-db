// app/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { postClientCredentialsToken } from "@/app/api/spotify";

interface Playlist {
  id: string;
  name: string;
  description: string;
  images: { url: string }[];
  external_urls: { spotify: string };
}

export default function Home() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const tokenResponse = await postClientCredentialsToken();
        const accessToken = tokenResponse.data.access_token;

        const playlistsResponse = await axios.get(
          "https://api.spotify.com/v1/browse/featured-playlists",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        // Set playlists data
        setPlaylists(playlistsResponse.data.playlists.items);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching Spotify playlists:", error);
        setError("Failed to load playlists");
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  return (
    <main className="bg-[#202020] text-white min-h-screen flex flex-col items-center justify-start">
      {/* Hero Section */}
      <section className="text-center py-24 px-6 bg-gradient-to-r from-[#901010] via-[#b01a1a] to-[#901010] text-white w-full">
        <h1 className="text-5xl font-bold mb-6 leading-tight">
          Discover Your Next Favorite Song
        </h1>
        <p className="text-xl mb-8 max-w-3xl mx-auto">
          Explore personalized music recommendations, curated playlists, and
          trending hits. Let us help you discover new tunes that match your
          vibe.
        </p>
        <a
          href="#explore"
          className="bg-[#901010] text-white px-8 py-4 rounded-lg text-2xl hover:bg-[#a11212] transition-colors"
        >
          Start Exploring
        </a>
      </section>

      {/* Featured Playlist Section */}
      <section
        id="explore"
        className="py-16 px-6 w-full bg-gray-900 text-center"
      >
        <h2 className="text-4xl font-semibold mb-12 text-white">
          Featured Playlists
        </h2>

        {/* Check if data is loading */}
        {loading && <p className="text-white text-lg">Loading playlists...</p>}

        {/* Show error message if any */}
        {error && <p className="text-red-500 text-lg">{error}</p>}

        {/* Display playlists */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              className="bg-white shadow-lg rounded-lg p-4 text-gray-700 hover:shadow-xl transition-all"
            >
              <div className="relative mb-4 overflow-hidden rounded-lg">
                <img
                  src={playlist.images[0]?.url}
                  alt={playlist.name}
                  className="w-[150] h-[150] object-cover rounded-lg mx-auto transition-transform duration-300 hover:scale-105"
                />
              </div>

              <h3 className="text-xl font-semibold mb-2">{playlist.name}</h3>

              <p className="text-sm text-gray-400 mb-3">
                {playlist.description}
              </p>

              <a
                href={playlist.external_urls.spotify}
                className="text-[#901010] hover:text-[#a11212] text-sm transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Listen Now
              </a>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}