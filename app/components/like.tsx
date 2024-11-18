import { useState } from "react";

interface LikeButtonProps {
  itemId: number; // 좋아요를 적용할 아이템의 ID
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

  const handleLike = async () => {
    if (!isLoggedIn || userId === null) {
      console.log("로그인 후 좋아요를 눌러주세요.");
      return;
    }

    const newLikedState = !liked;
    setLiked(newLikedState);

    try {
      const response = await fetch(`/api/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // 토큰 인증
        },
        body: JSON.stringify({ trackId: itemId, userId, liked: newLikedState }),
      });

      console.log({
        trackId: itemId,
        userId: userId,
        liked: newLikedState,
      });

      if (response.ok) {
        onLikeChange(newLikedState); // 부모 컴포넌트에 변경 알림
      } else {
        const errorData = await response.json();
        console.error(
          "좋아요 업데이트 실패:",
          errorData.message || "알 수 없는 오류"
        );
        setLiked(!newLikedState); // 실패 시 상태 복원
      }
    } catch (error) {
      console.error("서버 통신 오류:", error);
      setLiked(!newLikedState); // 실패 시 상태 복원
    }
  };

  return isLoggedIn && userId !== null ? (
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
  );
};

export default LikeButton;
