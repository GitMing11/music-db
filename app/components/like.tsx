// app/components/like.tsx
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLikeState } from "@/app/store/slices/like";
import { RootState } from "@/app/store/store";
import Toast from "./Toast";

interface LikeButtonProps {
  itemId: string;
  initialLiked: boolean;
  isLoggedIn: boolean;
  userId: number | null;
}

const LikeButton: React.FC<LikeButtonProps> = ({
  itemId,
  initialLiked,
  isLoggedIn,
  userId,
}) => {
  const dispatch = useDispatch();
  const liked = useSelector(
    (state: RootState) => state.like[itemId] ?? initialLiked
  ); // Redux 상태 확인
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleLike = async () => {
    if (!isLoggedIn || userId === null) {
      setToastMessage("로그인 후 좋아요를 눌러주세요.");
      return;
    }

    const newLikedState = !liked;
    dispatch(setLikeState({ itemId, liked: newLikedState }));

    setToastMessage(newLikedState ? "좋아요 추가!" : "좋아요 취소!");

    // 서버로 좋아요 상태 변경을 보내는 API 호출 코드 추가
    const dataToSend = {
      trackId: itemId,
      userId,
      liked: newLikedState,
    };

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
        dispatch(setLikeState({ itemId, liked: !newLikedState })); // 실패 시 상태 되돌리기
      } else {
        setToastMessage("좋아요 업데이트 성공!");
      }
    } catch (error) {
      setToastMessage("서버 통신 오류!");
      dispatch(setLikeState({ itemId, liked: !newLikedState })); // 실패 시 상태 되돌리기
    }
  };

  return (
    <div>
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
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
    </div>
  );
};

export default LikeButton;
