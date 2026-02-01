-- Term Frequency - Inverse Document Frequency (TF-IDF) in pure SQL
WITH doc_words AS (
    SELECT id AS doc_id, lower(word) AS word
    FROM articles, regexp_split_to_table(body, '\s+') AS word
    WHERE length(word) > 2
),
tf AS (
    SELECT doc_id, word, count(*)::float AS term_count,
           (count(*)::float / (SELECT count(*) FROM doc_words dw2 WHERE dw2.doc_id = doc_words.doc_id)) AS tf_score
    FROM doc_words
    GROUP BY doc_id, word
),
idf AS (
    SELECT word,
           ln((SELECT count(DISTINCT id) FROM articles)::float / (1 + count(DISTINCT doc_id))) AS idf_score
    FROM doc_words
    GROUP BY word
)
SELECT tf.doc_id, tf.word, (tf.tf_score * idf.idf_score) AS tfidf_rank
FROM tf
JOIN idf ON tf.word = idf.word
ORDER BY tfidf_rank DESC;
