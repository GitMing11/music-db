SELECT 
    u.id AS user_id,
    u.name AS user_name,
    u.email AS user_email,
    t.id AS track_id,
    t.name AS track_name,
    t.artistName AS artist_name,
    t.albumName AS album_name,
    t.imageUrl AS track_image_url,
    t.spotifyUrl AS track_spotify_url,
    l.likedAt AS liked_at
FROM 
    User u
JOIN 
    `Like` l ON u.id = l.userId
JOIN 
    Track t ON l.trackId = t.id
ORDER BY 
    u.id, l.likedAt DESC;