def compute_pagerank(links: dict[str, list[str]], damping: float = 0.85, iterations: int = 20):
    pages = list(links.keys())
    n = len(pages)
    if n == 0:
        return {}

    ranks = {p: 1.0 / n for p in pages}

    for _ in range(iterations):
        next_ranks = {}
        for p in pages:
            incoming_sum = 0.0
            for other, dests in links.items():
                if len(dests) == 0:
                    incoming_sum += ranks[other] / n
                elif p in dests:
                    incoming_sum += ranks[other] / len(dests)
            next_ranks[p] = ((1.0 - damping) / n) + (damping * incoming_sum)
        ranks = next_ranks

    total = sum(ranks.values())
    return {p: round(r / total, 4) for p, r in ranks.items()}
