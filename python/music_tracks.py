import sqlite3

class MusicDatabase:
    def __init__(self, db_path: str = ":memory:"):
        self.conn = sqlite3.connect(db_path)
        self.cur = self.conn.cursor()
        self.setup_schema()

    def setup_schema(self):
        self.cur.executescript("""
            CREATE TABLE IF NOT EXISTS Artist (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE
            );

            CREATE TABLE IF NOT EXISTS Genre (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE
            );

            CREATE TABLE IF NOT EXISTS Album (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT UNIQUE,
                artist_id INTEGER,
                FOREIGN KEY (artist_id) REFERENCES Artist(id)
            );

            CREATE TABLE IF NOT EXISTS Track (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT UNIQUE,
                album_id INTEGER,
                genre_id INTEGER,
                len INTEGER, rating INTEGER, count INTEGER,
                FOREIGN KEY (album_id) REFERENCES Album(id),
                FOREIGN KEY (genre_id) REFERENCES Genre(id)
            );
        """)
        self.conn.commit()

    def insert_track(self, title, artist, album, genre, length=0, rating=0, count=0):
        self.cur.execute("INSERT OR IGNORE INTO Artist (name) VALUES (?)", (artist,))
        self.cur.execute("SELECT id FROM Artist WHERE name = ?", (artist,))
        artist_id = self.cur.fetchone()[0]

        self.cur.execute("INSERT OR IGNORE INTO Genre (name) VALUES (?)", (genre,))
        self.cur.execute("SELECT id FROM Genre WHERE name = ?", (genre,))
        genre_id = self.cur.fetchone()[0]

        self.cur.execute("INSERT OR IGNORE INTO Album (title, artist_id) VALUES (?, ?)", (album, artist_id))
        self.cur.execute("SELECT id FROM Album WHERE title = ?", (album,))
        album_id = self.cur.fetchone()[0]

        self.cur.execute("""
            INSERT OR REPLACE INTO Track (title, album_id, genre_id, len, rating, count)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (title, album_id, genre_id, length, rating, count))
        self.conn.commit()

    def query_catalog(self):
        self.cur.execute("""
            SELECT Track.title, Artist.name, Album.title, Genre.name
            FROM Track
            JOIN Album ON Track.album_id = Album.id
            JOIN Artist ON Album.artist_id = Artist.id
            JOIN Genre ON Track.genre_id = Genre.id
            ORDER BY Track.title
        """)
        return self.cur.fetchall()
