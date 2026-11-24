import os
import re
import json
from pypdf import PdfReader

PDF_DIR = r"H:\Mahi PDFs"

def search_terms_in_pdfs(terms):
    results = []
    regexes = [re.compile(t, re.IGNORECASE) for t in terms]
    for f in sorted(os.listdir(PDF_DIR)):
        if not f.lower().endswith(".pdf"):
            continue
        filepath = os.path.join(PDF_DIR, f)
        try:
            reader = PdfReader(filepath)
            for page_idx, page in enumerate(reader.pages, 1):
                text = page.extract_text() or ""
                for regex in regexes:
                    m = regex.search(text)
                    if m:
                        start = max(0, m.start() - 150)
                        end = min(len(text), m.end() + 150)
                        snip = text[start:end].replace("\n", " ").strip()
                        results.append({
                            "pdf": f,
                            "page": page_idx,
                            "term": m.group(0),
                            "snippet": snip
                        })
                        break
        except Exception as e:
            pass
    return results

print("=== CHECKING BROADER TERMS FOR SIXTH SCHEDULE ===")
sixth_results = search_terms_in_pdfs([
    r"sixth\s+schedule",
    r"6th\s+schedule",
    r"autonomous\s+district",
    r"article\s+244",
    r"tribal\s+areas",
    r"bodoland",
    r"ladakh.*schedule"
])
print(f"Sixth Schedule broader hits: {len(sixth_results)}")
for r in sixth_results[:10]:
    print(f"  * {r['pdf']} p.{r['page']} [{r['term']}]: {r['snippet'][:130]}...")

print("\n=== CHECKING BROADER TERMS FOR DANCE FORMS ===")
dance_results = search_terms_in_pdfs([
    r"\bdance\b",
    r"\bdances\b",
    r"\bfolk\s+dance\b",
    r"\bclassical\s+dance\b",
    r"\bnatya\b",
    r"\bgarba\b",
    r"\bbihu\b",
    r"\bchhau\b",
    r"\bkathak\b"
])
print(f"Dance broader hits: {len(dance_results)}")
for r in dance_results[:10]:
    print(f"  * {r['pdf']} p.{r['page']} [{r['term']}]: {r['snippet'][:130]}...")
