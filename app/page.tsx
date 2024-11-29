'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { postClientCredentialsToken } from '@/app/api/spotify';

export default function Home() {
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [categories, setCategories] = useState<any[]>([]); // 카테고리 데이터를 저장할 상태

	// 홈 데이터 로딩을 위한 함수 (Spotify API 호출)
	const loadHomeData = async () => {
		try {
			// Client Credentials Token 요청
			const tokenResponse = await postClientCredentialsToken();
			const accessToken = tokenResponse.data.access_token;

			// 카테고리 데이터 요청 (카테고리 목록 가져오기)
			const categoriesResponse = await axios.get(
				'https://api.spotify.com/v1/browse/categories', // 카테고리 목록을 가져오는 API
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);

			// 가져온 카테고리 데이터 상태에 저장
			setCategories(categoriesResponse.data.categories.items);
			setLoading(false);
		} catch (error) {
			setError('데이터 로드 중 오류가 발생했습니다.');
			setLoading(false);
		}
	};

	// 데이터 로딩
	useEffect(() => {
		loadHomeData();
	}, []);

	if (loading) {
		return <div className="text-white text-center py-20">로딩 중...</div>;
	}

	if (error) {
		return <div className="text-white text-center py-20">{error}</div>;
	}

	return (
		<main className="bg-[#202020] text-white min-h-screen flex flex-col items-center justify-start">
			{/* Hero Section */}
			<section className="text-center py-24 px-6 bg-gradient-to-r from-[#901010] via-[#b01a1a] to-[#901010] text-white w-full">
				<h1 className="text-5xl font-bold mb-6 leading-tight">
					음악을 더 깊이 경험하세요
				</h1>
				<p className="text-xl mb-8 max-w-3xl mx-auto">
					좋아하는 음악을 탐색하고 추천받을 수 있습니다. 다양한 음악을 즐기세요!
				</p>
				<a
					href="#explore"
					className="bg-[#901010] text-white px-8 py-4 rounded-lg text-2xl hover:bg-[#a11212] transition-colors"
				>
					탐색하기
				</a>
			</section>

			{/* Explore Section */}
			<section
				id="explore"
				className="w-full bg-[#181818] py-20 px-6"
			>
				<h2 className="text-4xl text-center text-white mb-8">음악 카테고리</h2>
				<div className="flex flex-wrap justify-center gap-8">
					{categories.map((category) => (
						<div
							key={category.id}
							className="bg-[#333333] p-6 rounded-lg shadow-lg w-60"
						>
							<img
								src={
									category.icons[0]?.url ||
									'https://via.placeholder.com/300x300'
								}
								alt={category.name}
								className="mb-4 rounded-lg"
							/>
							<h3 className="text-xl font-semibold text-white">
								{category.name}
							</h3>
							<a
								href={`https://open.spotify.com/genre/${category.id}`}
								target="_blank"
								rel="noopener noreferrer"
								className="text-[#901010] hover:text-[#a11212] mt-4 inline-block"
							>
								더 보기
							</a>
						</div>
					))}
				</div>
			</section>
		</main>
	);
}
