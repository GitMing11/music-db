'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface ArtistModalProps {
  artist: any;
  onClose: () => void;
}

const ArtistModal: React.FC<ArtistModalProps> = ({ artist, onClose }) => {
  const [userId, setUserId] = useState<string | null>(null); // userId 상태 관리
  const [message, setMessage] = useState<string>(''); // 메시지 상태 관리

  // useEffect를 사용해 localStorage에서 userId 가져오기
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserId = localStorage.getItem('userId');
      console.log('Stored userId:', storedUserId); // 로그 추가
      if (storedUserId) {
        setUserId(storedUserId);
      }
    }
  }, []);

  const handleSave = async () => {
    if (!userId || userId === 'undefined') {
      setMessage('로그인 정보가 없습니다. 다시 로그인 해주세요.');
      console.error('Missing userId:', userId); // 로그 추가
      return;
    }

    try {
      const response = await fetch('/api/save-artist-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          artistId: artist.id,
          name: artist.name,
          imageUrl: artist.images[0]?.url,
          userId: userId, // 상태에서 userId를 전달
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        setMessage(`정보 저장에 실패했습니다: ${errorText}`);
        return;
      }

      const result = await response.json();
      if (result.error) {
        setMessage(`정보 저장에 실패했습니다: ${result.error}`);
      } else if (result.details) {
        setMessage(`정보 저장에 실패했습니다: ${result.details}`);
      } else {
        setMessage('아티스트 정보가 저장되었습니다!');
        setTimeout(() => setMessage(''), 3000);
        onClose(); // 저장 후 모달 닫기
      }
    } catch (error) {
      console.error('Error saving artist info:', error);
      setMessage('서버 오류로 정보를 저장할 수 없습니다.');
    }
  };

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

        {/* Save Info 버튼 */}
        <div className="mt-4 flex justify-center space-x-4">
          <button
            onClick={handleSave}
            className="bg-[#901010] text-white py-2 px-4 rounded-full transition-colors duration-300 hover:bg-[#b21212]"
          >
            Save Info
          </button>
        </div>

        {/* 성공 메시지 */}
        {message && (
          <div className="fixed top-0 left-0 right-0 bg-green-600 text-white text-center font-semibold p-4">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtistModal;
