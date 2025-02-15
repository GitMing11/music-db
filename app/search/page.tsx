'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import TrackList, { Track } from '@/app/components/TrackList';
import axios from 'axios';

export default function SearchPage() {
	const searchParams = useSearchParams();
	const query = searchParams?.get('query') || '';
	const router = useRouter();
	const [tracks, setTracks] = useState<Track[]>([]);
	const [recentSearches, setRecentSearches] = useState<string[]>([]);
	const [showAllSearches, setShowAllSearches] = useState(false); // 접기/펼치기 상태

	// 최근 검색어 저장 함수
	const saveRecentSearch = (newQuery: string) => {
		setRecentSearches((prevSearches) => {
			const updatedSearches = [
				newQuery,
				...prevSearches.filter((search) => search !== newQuery),
			];
			localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
			return updatedSearches;
		});
	};

	// 최근 검색어 삭제 함수
	const deleteRecentSearch = (searchToDelete: string) => {
		setRecentSearches((prevSearches) => {
			const updatedSearches = prevSearches.filter(
				(search) => search !== searchToDelete
			);
			localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
			return updatedSearches;
		});
	};

	// 모든 검색어 삭제 함수
	const clearAllSearches = () => {
		setRecentSearches([]);
		localStorage.removeItem('recentSearches');
	};

	const searchTracks = async (query: string) => {
		try {
			const token = localStorage.getItem('token'); // 토큰 가져오기
			const headers: Record<string, string> = {};

			if (token) {
				headers.Authorization = `Bearer ${token}`; // 토큰이 있을 경우 Authorization 헤더 추가
			}

			const response = await axios.get(`/api/tracks/search`, {
				params: { query },
				headers, // 조건부로 설정된 헤더 사용
			});

			setTracks(response.data);
		} catch (error) {}
	};

	// 컴포넌트가 마운트되었을 때 recentSearches를 localStorage에서 불러오기
	useEffect(() => {
		const storedRecentSearches = localStorage.getItem('recentSearches');
		if (storedRecentSearches) {
			setRecentSearches(JSON.parse(storedRecentSearches));
		}
	}, []);

	// 쿼리가 변경되면 트랙 검색 및 최근 검색어 저장
	useEffect(() => {
		if (query) {
			searchTracks(query);
			saveRecentSearch(query);
		}
	}, [query]);

	return (
		<main className="bg-[#121212] text-white min-h-screen flex flex-col items-center py-10 px-6">
			<h2 className="text-3xl font-semibold text-center text-white mb-6">
				Search Results for "
				<span className="font-light text-gray-400">{query}</span>"
			</h2>

			{/* 최근 검색어 표시 */}
			<div className="w-full max-w-3xl mb-8">
				<h3 className="text-xl font-medium text-white mb-4">Recent Searches</h3>
				<div className="flex justify-end mb-4">
					<button
						onClick={clearAllSearches}
						className="text-red-500 hover:text-red-700 transition-colors duration-200 text-sm"
					>
						Clear All
					</button>
				</div>
				<div
					className={`relative flex flex-wrap gap-2 justify-center ${
						showAllSearches ? '' : 'max-h-[3.5rem] overflow-hidden'
					}`}
				>
					{recentSearches.map((search, index) => (
						<div
							key={index}
							className="flex items-center bg-[#1c1c1c] rounded-full px-4 py-2"
						>
							<button
								onClick={() => {
									router.push(`?query=${search}`);
								}}
								className="bg-[#333333] text-white px-4 py-2 text-sm rounded-full shadow-lg hover:bg-[#555555] transition-all duration-200 transform hover:scale-110"
							>
								{search}
							</button>
							<button
								onClick={() => deleteRecentSearch(search)}
								className="text-red-500 hover:text-red-700 transition-colors duration-200 ml-2 text-lg"
							>
								❌
							</button>
						</div>
					))}
				</div>

				{/* 접기/펼치기 버튼 */}
				{recentSearches.length > 5 && (
					<div className="text-center mt-2">
						<button
							onClick={() => setShowAllSearches(!showAllSearches)}
							className="text-blue-500 hover:text-blue-700 transition-colors duration-200 text-sm"
						>
							{showAllSearches ? 'Show Less' : 'Show More'}
						</button>
					</div>
				)}
			</div>

			{/* 트랙 리스트 */}
			<div className="w-full max-w-3xl">
				<h3 className="text-xl font-medium text-white mb-4">Tracks</h3>
				<TrackList tracks={tracks} />
			</div>
		</main>
	);
}