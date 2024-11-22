SELECT 
    u.id AS user_id, 
    u.name AS user_name, 
    u.email AS user_email, 
    g.id AS genre_id, 
    g.name AS genre_name
FROM 
    _usergenres ug
JOIN 
    user u ON ug.B = u.id   -- B는 _usergenres에서 유저 번호 컬럼
JOIN 
    genre g ON ug.A = g.id  -- A는 _usergenres에서 장르 번호 컬럼
LIMIT 0, 1000;