import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAddState } from "@/app/store/slices/add"; // Redux slice for add state
import { RootState } from "@/app/store/store";
import Toast from "./Toast"; // Toast 컴포넌트

interface AddButtonProps {
    itemId: string;
    initialAddState: boolean;
    isLoggedIn: boolean;
    userId: number | null;
}

const AddButton: React.FC<AddButtonProps> = ({
    itemId,
    initialAddState,
    isLoggedIn,
    userId,
}) => {
    const dispatch = useDispatch();
    const addState = useSelector(
        (state: RootState) => state.add[itemId] ?? initialAddState
    ); // Redux 상태에서 add 상태 확인
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const handleAdd = async () => {
        if (!isLoggedIn || userId === null) {
            setToastMessage("로그인 후 추가할 수 있습니다.");
            return;
        }

        const newAddState = !addState; // 현재 상태를 반전시켜서 새로운 상태를 설정
        dispatch(setAddState({ itemId, addState: newAddState }));

        setToastMessage(newAddState ? "트랙이 추가되었습니다!" : "트랙이 제거되었습니다!");

        // 트랙 정보가 없는 경우, 서버에서 트랙 정보를 가져옵니다.
        let trackInfo = null;
        if (!trackInfo) {
            const response = await fetch(`/api/tracks/${itemId}`);
            if (response.ok) {
                trackInfo = await response.json();
            } else {
                setToastMessage("트랙 정보를 불러오는 데 실패했습니다.");
                return;
            }
        }

        // 서버로 add 상태 변경을 보내는 API 호출 코드
        const dataToSend = {
            trackId: itemId,
            userId,
            add: newAddState,
            trackInfo,
        };

        try {
            const response = await fetch(`/api/playlist`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`, // JWT 토큰 사용
                },
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                setToastMessage(
                    `트랙 추가 실패: ${errorData?.message || "알 수 없는 오류"}`
                );
                dispatch(setAddState({ itemId, addState: !newAddState })); // 실패 시 상태 롤백
            } else {
                setToastMessage("트랙 추가 성공!");
            }
        } catch (error) {
            setToastMessage("서버 통신 오류!");
            dispatch(setAddState({ itemId, addState: !newAddState })); // 실패 시 상태 롤백
        }
    };

    return (
        <div>
        {toastMessage && (
            <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
        )}
        <button
            onClick={handleAdd}
            style={{
            fontSize: "20px",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: addState ? "green" : "gray", // addState가 true일 때 색상 변경
            }}
        >
            {addState ? "✔" : "✚"} {/* 상태에 따라 버튼 텍스트 변경 */}
        </button>
        </div>
    );
};

export default AddButton;
