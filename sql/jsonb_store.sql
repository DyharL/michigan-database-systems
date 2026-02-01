-- PostgreSQL JSONB Document Store with Binary Indexing
CREATE TABLE customer_events (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    payload JSONB NOT NULL
);

-- Index for deep JSON path lookups
CREATE INDEX idx_events_payload_gin ON customer_events USING gin (payload jsonb_path_ops);

-- Sample Query using JSON containment and path operators:
-- SELECT id, payload->>'action' AS action, payload->'metadata'->>'browser' AS browser
-- FROM customer_events
-- WHERE payload @> '{"type": "conversion", "verified": true}';
