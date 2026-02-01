import unittest
from email_analytics import process_mbox_data
from geosearch import GeocoderCache
from music_tracks import MusicDatabase
from pagerank import compute_pagerank

class TestMichiganDatabaseSystems(unittest.TestCase):
    def test_mbox(self):
        sample = "From: stephen.marquard@uct.ac.za Sat Jan  5 09:14:16 2008\nFrom: louis@media.berkeley.edu Fri Jan  4 18:10:48 2008\nFrom: zqian@umich.edu Fri Jan  4 16:10:39 2008"
        results = process_mbox_data(sample)
        self.assertEqual(len(results), 3)

    def test_geosearch(self):
        cache = GeocoderCache()
        cache.store_location("Ann Arbor, MI", 42.2808, -83.7430, {"status": "OK"})
        res = cache.get_location("Ann Arbor, MI")
        self.assertIsNotNone(res)
        self.assertEqual(res["lat"], 42.2808)

    def test_music_database(self):
        db = MusicDatabase()
        db.insert_track("Black Dog", "Led Zeppelin", "Led Zeppelin IV", "Rock", 296, 5, 100)
        catalog = db.query_catalog()
        self.assertEqual(len(catalog), 1)
        self.assertEqual(catalog[0], ("Black Dog", "Led Zeppelin", "Led Zeppelin IV", "Rock"))

    def test_pagerank(self):
        links = {"A": ["B", "C"], "B": ["C"], "C": ["A"]}
        ranks = compute_pagerank(links)
        self.assertAlmostEqual(sum(ranks.values()), 1.0, places=2)
        self.assertGreater(ranks["C"], ranks["B"])

if __name__ == "__main__":
    unittest.main()
