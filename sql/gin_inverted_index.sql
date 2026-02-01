-- PostgreSQL GIN (Generalized Inverted Index) Full-Text Search
CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    search_vector tsvector GENERATED ALWAYS AS (
        to_tsvector('english', coalesce(title, '') || ' ' || coalesce(body, ''))
    ) STORED
);

-- Fast GIN inverted index
CREATE INDEX idx_articles_search_gin ON articles USING gin(search_vector);

-- Search Query Execution Example
-- SELECT id, title, ts_rank(search_vector, to_tsquery('english', 'database & postgresql')) AS rank
-- FROM articles
-- WHERE search_vector @@ to_tsquery('english', 'database & postgresql')
-- ORDER BY rank DESC;
