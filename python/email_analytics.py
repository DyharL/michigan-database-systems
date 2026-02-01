import sqlite3
import re

def process_mbox_data(mbox_text: str, db_path: str = ":memory:"):
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()

    cur.execute("DROP TABLE IF EXISTS Counts")
    cur.execute("CREATE TABLE Counts (org TEXT, count INTEGER)")

    lines = mbox_text.splitlines()
    for line in lines:
        if not line.startswith("From: "):
            continue
        pieces = line.split()
        email = pieces[1]
        org = email.split("@")[1]
        cur.execute("SELECT count FROM Counts WHERE org = ?", (org,))
        row = cur.fetchone()
        if row is None:
            cur.execute("INSERT INTO Counts (org, count) VALUES (?, 1)", (org,))
        else:
            cur.execute("UPDATE Counts SET count = count + 1 WHERE org = ?", (org,))

    conn.commit()
    cur.execute("SELECT org, count FROM Counts ORDER BY count DESC")
    results = cur.fetchall()
    conn.close()
    return results
