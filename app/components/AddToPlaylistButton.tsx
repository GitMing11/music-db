// @/app/components/AddToPlaylistButton.tsx

import React from "react";
import axios from "axios";

interface AddToPlaylistButtonProps {
    trackId: string;
    trackName: string;
    }

    const AddToPlaylistButton: React.FC<AddToPlaylistButtonProps> = ({ trackId, trackName }) => {
    const handleAddToPlaylist = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
        alert("로그인 후 이용해주세요.");
        return;
        }

        try {
        await axios.post(
            "/api/playlist/add",
            { trackId },
            {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            }
        );
        alert(`\"${trackName}\"이(가) 플레이리스트에 추가되었습니다.`);
        } catch (error) {
        console.error("Error adding track to playlist:", error);
        }
    };

    return (
        <button
        onClick={handleAddToPlaylist}
        className="bg-gray-600 text-white px-3 py-2 text-sm rounded-full shadow-lg hover:bg-gray-800 transition-all duration-200 transform hover:scale-110"
        >
        ➕
        </button>
    );
};

export default AddToPlaylistButton;
