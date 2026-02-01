import sqlite3
import json

class GeocoderCache:
    def __init__(self, db_path: str = ":memory:"):
        self.conn = sqlite3.connect(db_path)
        self.cur = self.conn.cursor()
        self.cur.execute("""
            CREATE TABLE IF NOT EXISTS Locations (
                address TEXT UNIQUE,
                lat REAL,
                lng REAL,
                geodata TEXT
            )
        """)
        self.conn.commit()

    def store_location(self, address: str, lat: float, lng: float, raw_data: dict):
        self.cur.execute("""
            INSERT OR REPLACE INTO Locations (address, lat, lng, geodata)
            VALUES (?, ?, ?, ?)
        """, (address, lat, lng, json.dumps(raw_data)))
        self.conn.commit()

    def get_location(self, address: str):
        self.cur.execute("SELECT lat, lng, geodata FROM Locations WHERE address = ?", (address,))
        row = self.cur.fetchone()
        if row:
            return {"lat": row[0], "lng": row[1], "geodata": json.loads(row[2])}
        return None

    def export_geojson(self):
        self.cur.execute("SELECT address, lat, lng FROM Locations")
        features = []
        for row in self.cur.fetchall():
            features.append({
                "type": "Feature",
                "geometry": {"type": "Point", "coordinates": [row[2], row[1]]},
                "properties": {"address": row[0]}
            })
        return {"type": "FeatureCollection", "features": features}
