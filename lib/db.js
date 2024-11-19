// lib/db.js
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  uri: process.env.DATABASE_URL, // DATABASE_URL 환경 변수로부터 연결 URI 가져오기
});

export default pool;
