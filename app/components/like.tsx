// app/components/like.tsx
import { useState, useEffect } from "react";
import Toast from "./Toast";

interface LikeButtonProps {
  itemId: string; // 좋아요를 적용할 아이템의 ID
  initialLiked: boolean; // 초기 좋아요 상태
  onLikeChange: (liked: boolean) => void; // 좋아요 상태 변경 시 호출할 콜백
  isLoggedIn: boolean; // 로그인 상태
  userId: number | null; // 로그인된 사용자 ID (null일 수 있음)
}

const LikeButton: React.FC<LikeButtonProps> = ({
  itemId,
  initialLiked,
  onLikeChange,
  isLoggedIn,
  userId,
}) => {
  const [liked, setLiked] = useState(initialLiked);
  const [toastMessage, setToastMessage] = useState<string | null>(null); // 알림 메시지 상태
  const [trackInfo, setTrackInfo] = useState<any | null>(null); // 트랙 정보를 저장할 상태

  // Spotify에서 트랙 정보를 가져오는 함수
  const fetchTrackInfo = async (trackId: string) => {
    try {
      const response = await fetch(`/api/tracks/${trackId}`);
      if (!response.ok) {
        throw new Error(`트랙 정보를 가져오는 데 실패했습니다.`);
      }
      const data = await response.json();
      console.log("받은 트랙 정보:", data); // 트랙 정보 로그 출력
      setTrackInfo(data); // 트랙 정보 저장
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "알 수 없는 오류";
      setToastMessage(
        `Spotify에서 트랙 정보를 가져오는 데 실패했습니다. 오류: ${errorMessage}`
      );
      setLiked(false); // 트랙 정보가 없을 경우 좋아요를 취소하도록 처리
    }
  };

  const handleLike = async () => {
    if (!isLoggedIn || userId === null) {
      setToastMessage("로그인 후 좋아요를 눌러주세요.");
      return;
    }

    const newLikedState = !liked;
    setLiked(newLikedState);

    // 트랙 정보가 없으면 Spotify에서 가져온다.
    if (!trackInfo) {
      setToastMessage("트랙 정보를 불러오는 중입니다...");
      await fetchTrackInfo(itemId); // 트랙 정보 가져오기
    }

    // 트랙 정보가 없을 경우
    if (!trackInfo) {
      setToastMessage("트랙 정보가 부족합니다.");
      setLiked(false);
      return;
    }

    setToastMessage(`전송되는 데이터: ${JSON.stringify(trackInfo)}`);

    const dataToSend = {
      trackId: itemId,
      userId,
      liked: newLikedState,
      trackInfo: newLikedState && trackInfo ? trackInfo : {}, // trackInfo가 없으면 빈 객체로 처리
    };

    setToastMessage(`전송되는 데이터: ${JSON.stringify(dataToSend, null, 2)}`);

    try {
      const response = await fetch(`/api/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        setToastMessage(
          `좋아요 업데이트 실패: ${errorData?.message || "알 수 없는 오류"}`
        );
        setLiked(!newLikedState);
        return;
      }

      const data = await response.json();
      setToastMessage("좋아요 업데이트 성공!");
      onLikeChange(newLikedState);
    } catch (error) {
      setToastMessage("서버 통신 오류!");
      setLiked(!newLikedState);
    }
  };

  return (
    <div>
      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage(null)} // 알림 닫기
        />
      )}
      {isLoggedIn && userId !== null ? (
        <button
          onClick={handleLike}
          style={{
            fontSize: "24px",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: liked ? "red" : "black",
          }}
        >
          {liked ? "♥" : "♡"}
        </button>
      ) : (
        <button
          style={{
            fontSize: "24px",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          △
        </button>
      )}
    </div>
  );
};

export default LikeButton;
