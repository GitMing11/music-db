'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import ScrollToButton from '../components/scroll';

export default function GenrePage() {
	const [genres, setGenres] = useState<string[]>([]);
	const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
	const [savedGenres, setSavedGenres] = useState<string[]>([]);
	const [isGenresVisible, setIsGenresVisible] = useState(false);
	const router = useRouter();

	// API에서 장르를 가져오는 함수
	const fetchGenres = useCallback(async () => {
		try {
			const res = await fetch('/api/genres/local');

			if (!res.ok) {
				const errorData = await res.json();
				console.error('장르 목록 가져오기 실패:', errorData.error);
				return;
			}

			const data = await res.json();
			setGenres(data.genres);
		} catch (error) {
			console.error('장르 목록을 가져오는 중 오류 발생:', error);
		}
	}, []);

	const fetchSavedGenres = useCallback(async () => {
		try {
			const token = localStorage.getItem('token');

			if (!token) {
				console.error('인증되지 않은 사용자입니다.');
				return;
			}

			const res = await fetch('/api/genres/user', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (!res.ok) {
				const errorData = await res.json();
				console.error('저장된 장르 불러오기 실패:', errorData.error);
				return;
			}

			const data = await res.json();
			setSavedGenres(data.savedGenres || []); // 상태 업데이트
		} catch (error) {
			console.error('저장된 장르 불러오기 중 오류 발생:', error);
		}
	}, []);

	useEffect(() => {
		fetchGenres();
		fetchSavedGenres();
	}, [fetchGenres, fetchSavedGenres]);

	// 장르 선택 처리
	const handleGenreChange = async (genre: string) => {
		const isRemoving = selectedGenres.includes(genre); // 현재 선택된 상태인지 확인

		setSelectedGenres(
			(prevGenres) =>
				isRemoving
					? prevGenres.filter((g) => g !== genre) // 선택 해제
					: [...prevGenres, genre] // 선택
		);
	};

	useEffect(() => {
		if (savedGenres.length > 0) {
			setSelectedGenres(savedGenres);
		}
	}, [savedGenres]);

	// 선택한 장르를 저장하는 함수
	const handleSaveGenres = async () => {
		if (selectedGenres.length === 0) {
			alert('장르를 선택해주세요.');
			return;
		}

		try {
			const token = localStorage.getItem('token');

			if (!token) {
				alert('인증되지 않은 사용자입니다.');
				return;
			}

			// 기존에 저장된 장르를 지우기 위해 삭제 요청
			const genresToRemove = savedGenres.filter(
				(genre) => !selectedGenres.includes(genre)
			);

			// 삭제할 장르가 있으면 삭제
			if (genresToRemove.length > 0) {
				const removeRes = await fetch('/api/genres/remove', {
					method: 'DELETE',
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json', // body가 JSON이므로 Content-Type을 명시
					},
					body: JSON.stringify({ genres: genresToRemove }), // 삭제할 장르 목록 전달
				});

				if (!removeRes.ok) {
					const errorData = await removeRes.json();
					console.error('장르 삭제 실패:', errorData.error);
					alert('장르 삭제에 실패했습니다.');
					return;
				}
			}

			// 선택된 장르 저장 요청
			const res = await fetch('/api/genres/save', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ selectedGenres }),
			});

			const responseText = await res.text();
			console.log(responseText);

			if (!res.ok) {
				const errorData = JSON.parse(responseText);
				console.error('장르 저장 실패:', errorData.error);
				alert('장르 저장에 실패했습니다. 다시 시도해 주세요.');
				return;
			}

			const data = JSON.parse(responseText);
			if (data.message === '장르가 저장되었습니다.') {
				setSavedGenres(selectedGenres); // 저장된 장르 업데이트
				alert('선택한 장르가 저장되었습니다.');
			}
		} catch (error) {
			console.error('장르 저장 중 오류 발생:', error);
			alert('서버 오류가 발생했습니다. 다시 시도해 주세요.');
		}
	};

	// 장르 목록 보이기/숨기기 토글
	const toggleGenresVisibility = () => {
		setIsGenresVisible((prevState) => !prevState);
	};

	// 추천 페이지로 이동 (장르를 URL 쿼리 파라미터로 전달)
	const goToRecommendationPage = () => {
		const query = new URLSearchParams();
		savedGenres.forEach((genre) => query.append('genres', genre)); // 'genre'에서 'genres'로 변경
		router.push(`/recommendation?${query.toString()}`);
	};

	return (
		<main className="bg-[#1e1e1e] text-white min-h-screen flex flex-col items-center">
			<ScrollToButton />

			{/* 헤더 */}
			<section className="text-center py-6 px-8 bg-gradient-to-r from-[#901010] via-[#b01a1a] to-[#901010] text-white w-full shadow-md rounded-b-xl">
				<h1 className="text-4xl font-bold tracking-wide">장르 추천</h1>
			</section>

			{/* 장르 선택 UI */}
			<div className="flex flex-col items-center w-full max-w-3xl my-8 px-4 space-y-8">
				{/* 저장된 장르 표시 */}
				{savedGenres.length > 0 && (
					<div className="bg-[#282828] shadow-lg rounded-lg p-6 w-full flex justify-between items-center">
						<div>
							<h3 className="text-sm font-semibold text-gray-200 mb-2">
								저장된 장르
							</h3>
							<p className="text-sm text-gray-400">{savedGenres.join(', ')}</p>
						</div>

						{/* 추천 페이지로 이동 버튼 */}
						{/* <button
							onClick={goToRecommendationPage}
							className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
						>
							추천 페이지로 이동
						</button> */}
					</div>
				)}

				{/* 장르 선택 UI */}
				<div className="bg-[#282828] shadow-lg rounded-lg p-6 w-full">
					<div className="flex justify-between items-center w-full">
						<h2 className="text-xl font-semibold text-gray-100 mb-4">
							장르 선택
						</h2>
						{/* 전체 장르 선택 취소 버튼 */}
						{/* <button
							onClick={handleClearAllGenres}
							className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
						>
							전체 선택 취소
						</button> */}
					</div>

					{/* 더보기/접기 버튼 */}
					<button
						onClick={toggleGenresVisibility}
						className="text-blue-500 hover:text-blue-400 mb-4"
					>
						{isGenresVisible ? '접기' : '장르 선택 더보기'}
					</button>

					{/* 장르 목록 보이기/숨기기 */}
					{isGenresVisible && (
						<div className="flex flex-wrap gap-3 mb-4 justify-center">
							{genres.map((genre) => (
								<button
									key={genre}
									onClick={() => handleGenreChange(genre)}
									className={`px-4 py-2 border-2 border-solid rounded-full text-sm font-medium transition-all duration-200 ${
										selectedGenres.includes(genre) // 저장된 장르 또는 선택된 장르인지 확인
											? 'bg-[#b01a1a] text-white' // 활성화된 상태
											: 'bg-transparent text-blue-500 border-[#333333]' // 비활성화 상태
									} hover:bg-[#b01a1a] hover:text-white`}
								>
									{genre}
								</button>
							))}
						</div>
					)}

					{/* 장르 저장 버튼 */}
					<div className="mt-6">
						<button
							onClick={handleSaveGenres}
							className="w-full px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
						>
							선택한 장르 저장
						</button>
					</div>
				</div>
			</div>
		</main>
	);
}
