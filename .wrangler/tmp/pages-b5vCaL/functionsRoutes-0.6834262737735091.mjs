import { onRequest as __api_cascade_ts_onRequest } from "/Users/fredy/michigan-database-systems/functions/api/cascade.ts"
import { onRequest as __api_crawler_ts_onRequest } from "/Users/fredy/michigan-database-systems/functions/api/crawler.ts"
import { onRequest as __api_jsonb_query_ts_onRequest } from "/Users/fredy/michigan-database-systems/functions/api/jsonb-query.ts"
import { onRequest as __api_mail_analytics_ts_onRequest } from "/Users/fredy/michigan-database-systems/functions/api/mail-analytics.ts"
import { onRequest as __api_music_catalog_ts_onRequest } from "/Users/fredy/michigan-database-systems/functions/api/music-catalog.ts"
import { onRequest as __api_pagerank_ts_onRequest } from "/Users/fredy/michigan-database-systems/functions/api/pagerank.ts"
import { onRequest as __api_search_ts_onRequest } from "/Users/fredy/michigan-database-systems/functions/api/search.ts"
import { onRequest as __api_tfidf_ts_onRequest } from "/Users/fredy/michigan-database-systems/functions/api/tfidf.ts"

export const routes = [
    {
      routePath: "/api/cascade",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_cascade_ts_onRequest],
    },
  {
      routePath: "/api/crawler",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_crawler_ts_onRequest],
    },
  {
      routePath: "/api/jsonb-query",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_jsonb_query_ts_onRequest],
    },
  {
      routePath: "/api/mail-analytics",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_mail_analytics_ts_onRequest],
    },
  {
      routePath: "/api/music-catalog",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_music_catalog_ts_onRequest],
    },
  {
      routePath: "/api/pagerank",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_pagerank_ts_onRequest],
    },
  {
      routePath: "/api/search",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_search_ts_onRequest],
    },
  {
      routePath: "/api/tfidf",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_tfidf_ts_onRequest],
    },
  ]