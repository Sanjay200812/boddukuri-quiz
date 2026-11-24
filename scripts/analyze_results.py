import json

with open('scripts/pdf_search_results.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Total PDFs: {data['total_pdfs']}, Total Pages: {data['total_pages']}")
print("-" * 60)

for topic, matches in data['topic_matches'].items():
    print(f"\n=== {topic} ({len(matches)} hits) ===")
    pdf_counts = {}
    for m in matches:
        pdf_counts[m['pdf']] = pdf_counts.get(m['pdf'], 0) + 1
    top_pdfs = sorted(pdf_counts.items(), key=lambda x: x[1], reverse=True)[:8]
    for p, c in top_pdfs:
        print(f"  - {p}: {c} pages")
    
    # Print 2 distinct snippets
    shown = 0
    for m in matches[:5]:
        print(f"    * {m['pdf']} (p. {m['page']}) [{m['matched_word']}]: {m['snippet'][:150]}...")
        shown += 1
        if shown >= 2:
            break
