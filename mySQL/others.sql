-- 모든 데이터베이스 목록 보기
SHOW DATABASES;

-- '@@' 데이터베이스 사용 (본인 데이터베이스 이름) - USE
USE @@;

-- '@@' 데이터베이스의 테이블 목록 보기 - SHOW
SHOW TABLES;

-- 특정 테이블 구조 확인 - DESCRIBE
DESCRIBE _usergenres;
DESCRIBE `user`;

-- 특정 테이블의 모든 데이터 조회 - SELECT
SELECT * FROM user;
SELECT * FROM genre;
SELECT * FROM track;
SELECT * FROM _usergenres;

-- 'like' 테이블에서 'userId'가 1인 데이터 조회
SELECT * FROM `like` WHERE `userId` = 1;

-- 특정 테이블의 모든 데이터 삭제 - DELETE
DELETE FROM `track`;

-- 'like' 테이블에서 'userId'가 1인 데이터 삭제
DELETE FROM `like` WHERE `userId` = 1;  -- 'userId'가 1인 데이터 삭제