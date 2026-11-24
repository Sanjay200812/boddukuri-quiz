import os
import re
import json
import time
from pypdf import PdfReader

PDF_DIR = r"H:\Mahi PDFs"
OUTPUT_FILE = r"scripts/pdf_search_results.json"

TOPIC_PATTERNS = {
    "Static GK — National Parks": [
        r"\bnational\s+park\b",
        r"\bnational\s+parks\b",
        r"\bwildlife\s+sanctuary\b",
        r"\bkaziranga\b",
        r"\bjim\s+corbett\b",
        r"\bhemis\b",
        r"\bkeibul\s+lamjao\b",
        r"\bgir\s+national\b",
        r"\bkanha\b",
        r"\bsundarban\b",
        r"\bsilent\s+valley\b",
        r"\bnamdapha\b",
        r"\bbandipur\b",
        r"\bmanas\s+national\b"
    ],
    "Current Affairs — PIB": [
        r"\bpress\s+information\s+bureau\b",
        r"\bpib\b",
        r"\bgovernment\s+scheme\b",
        r"\bpradhan\s+mantri\b",
        r"\bpm\s+surya\s+ghar\b",
        r"\bpm-ebus\b",
        r"\bchenab\s+rail\s+bridge\b",
        r"\bchandrayaan-3\b",
        r"\bjnanpith\b",
        r"\bunion\s+cabinet\s+approved\b"
    ],
    "Banking Awareness — Financial Awareness": [
        r"\breserve\s+bank\s+of\s+india\b",
        r"\brbi\b",
        r"\bmonetary\s+policy\b",
        r"\bmonetary\s+policy\s+committee\b",
        r"\brepo\s+rate\b",
        r"\bnon-performing\s+asset\b",
        r"\bnpa\b",
        r"\bcash\s+reserve\s+ratio\b",
        r"\bcrr\b",
        r"\bstatutory\s+liquidity\s+ratio\b",
        r"\bslr\b",
        r"\bnabard\b",
        r"\bsidbi\b",
        r"\bdicgc\b",
        r"\bfinancial\s+awareness\b",
        r"\bbanking\s+awareness\b",
        r"\bdigital\s+rupee\b",
        r"\bcbdc\b"
    ],
    "Union Cabinet Ministers and portfolios": [
        r"\bunion\s+cabinet\s+minister\b",
        r"\bunion\s+minister\b",
        r"\bcabinet\s+minister\b",
        r"\bcouncil\s+of\s+ministers\b",
        r"\brajnath\s+singh\b",
        r"\bamit\s+shah\b",
        r"\bnirmala\s+sitharaman\b",
        r"\bs\.\s*jaishankar\b",
        r"\bnitin\s+gadkari\b",
        r"\bashwini\s+vaishnaw\b",
        r"\bdharmendra\s+pradhan\b",
        r"\bj\.?\s*p\.?\s*nadda\b",
        r"\bshivraj\s+singh\s+chouhan\b",
        r"\bkumaraswamy\b",
        r"\bportfolio\s+allocation\b"
    ],
    "Ramsar Sites — 2026": [
        r"\bramsar\b",
        r"\bramsar\s+site\b",
        r"\bramsar\s+sites\b",
        r"\bwetlands?\s+of\s+international\s+importance\b",
        r"\bmontreux\s+record\b",
        r"\bchilika\s+lake\b",
        r"\bkeoladeo\b",
        r"\bloktak\s+lake\b",
        r"\bnanjarayan\b",
        r"\bkazhuveli\b",
        r"\btawa\s+reservoir\b",
        r"\baghanashini\b",
        r"\bmagadi\s+kere\b",
        r"\b85\s+ramsar\b"
    ],
    "UNESCO World Heritage Sites — 2026": [
        r"\bunesco\b",
        r"\bworld\s+heritage\s+site\b",
        r"\bworld\s+heritage\s+sites\b",
        r"\bworld\s+heritage\s+committee\b",
        r"\bcharaideo\b",
        r"\bmoidams?\b",
        r"\bsantiniketan\b",
        r"\bhoysala\b",
        r"\bdholavira\b",
        r"\bramappa\b",
        r"\bkhangchendzonga\b",
        r"\b43rd\s+world\s+heritage\b"
    ],
    "UNESCO Tentative List additions — 2026": [
        r"\btentative\s+list\b",
        r"\bunesco\s+tentative\b",
        r"\bmaratha\s+military\b",
        r"\bgwalior\s+fort\b",
        r"\bkhooni\s+bhandara\b",
        r"\bsun\s+temple\s+modhera\b",
        r"\bvadnagar\b",
        r"\bgeoglyphs?\s+of\s+konkan\b",
        r"\boperational\s+guidelines.*tentative\b"
    ],
    "Indian classical and folk dance forms": [
        r"\bclassical\s+dance\b",
        r"\bfolk\s+dance\b",
        r"\bbharatanatyam\b",
        r"\bkathak\b",
        r"\bkathakali\b",
        r"\bmohiniyattam\b",
        r"\bodissi\b",
        r"\bmanipuri\s+dance\b",
        r"\bkuchipudi\b",
        r"\bsattriya\b",
        r"\bbihu\b",
        r"\bgarba\b",
        r"\brouff\b",
        r"\blavani\b",
        r"\bcheraw\b",
        r"\bkalbelia\b",
        r"\bchhau\b",
        r"\bsangeet\s+natak\s+akademi\b",
        r"\bbirju\s+maharaj\b",
        r"\brukmini\s+devi\b",
        r"\bkelucharan\s+mohap\b"
    ],
    "Sixth Schedule of the Constitution": [
        r"\bsixth\s+schedule\b",
        r"\b6th\s+schedule\b",
        r"\bautonomous\s+district\s+council\b",
        r"\badcs?\b",
        r"\btribal\s+areas?\s+in\s+assam\b",
        r"\barticle\s+244\s*\(\s*2\s*\)",
        r"\barticle\s+275\s*\(\s*1\s*\)",
        r"\bbodoland\s+territorial\b",
        r"\bkarbi\s+anglong\b",
        r"\bdima\s+hasao\b",
        r"\bkhasi\s+hills\s+autonomous\b",
        r"\bgaro\s+hills\s+autonomous\b",
        r"\bjaintia\s+hills\s+autonomous\b",
        r"\bchakma\s+autonomous\b",
        r"\bmara\s+autonomous\b",
        r"\blai\s+autonomous\b",
        r"\bassam.*meghalaya.*tripura.*mizoram\b"
    ]
}

COMPILED_PATTERNS = {
    topic: [re.compile(p, re.IGNORECASE) for p in patterns]
    for topic, patterns in TOPIC_PATTERNS.items()
}

def clean_snippet(text, match_span, window=180):
    start = max(0, match_span[0] - window)
    end = min(len(text), match_span[1] + window)
    snippet = text[start:end].replace("\n", " ").replace("\r", " ")
    snippet = re.sub(r"\s+", " ", snippet).strip()
    return snippet

def main():
    print(f"Scanning directory: {PDF_DIR}")
    pdf_files = sorted([f for f in os.listdir(PDF_DIR) if f.lower().endswith(".pdf")])
    print(f"Found {len(pdf_files)} PDF files.")

    total_pages_all = 0
    topic_matches = {topic: [] for topic in TOPIC_PATTERNS}
    file_summaries = []

    start_time = time.time()

    for idx, filename in enumerate(pdf_files, 1):
        file_path = os.path.join(PDF_DIR, filename)
        file_size_kb = os.path.getsize(file_path) / 1024
        
        try:
            reader = PdfReader(file_path)
            num_pages = len(reader.pages)
            total_pages_all += num_pages
            
            file_topic_hits = {t: 0 for t in TOPIC_PATTERNS}
            
            for page_num, page in enumerate(reader.pages, 1):
                try:
                    text = page.extract_text() or ""
                except Exception as pe:
                    text = ""
                
                if not text:
                    continue
                
                for topic, regexes in COMPILED_PATTERNS.items():
                    for regex in regexes:
                        m = regex.search(text)
                        if m:
                            file_topic_hits[topic] += 1
                            snippet = clean_snippet(text, m.span())
                            topic_matches[topic].append({
                                "pdf": filename,
                                "page": page_num,
                                "matched_pattern": regex.pattern,
                                "matched_word": m.group(0),
                                "snippet": snippet
                            })
                            # One match per regex per page is enough
                            break

            file_summaries.append({
                "index": idx,
                "filename": filename,
                "pages": num_pages,
                "size_kb": round(file_size_kb, 1),
                "hits": {t: h for t, h in file_topic_hits.items() if h > 0}
            })

            if idx % 10 == 0 or idx == len(pdf_files):
                elapsed = time.time() - start_time
                print(f"[{idx}/{len(pdf_files)}] Processed {filename} ({num_pages} pgs) | Cum. Pages: {total_pages_all} | Elapsed: {elapsed:.1f}s")

        except Exception as e:
            print(f"Error processing {filename}: {e}")
            file_summaries.append({
                "index": idx,
                "filename": filename,
                "error": str(e)
            })

    # Summary Statistics
    summary = {
        "total_pdfs": len(pdf_files),
        "total_pages": total_pages_all,
        "scan_time_seconds": round(time.time() - start_time, 2),
        "topic_counts": {t: len(matches) for t, matches in topic_matches.items()},
        "file_summaries": file_summaries,
        "topic_matches": topic_matches
    }

    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as out:
        json.dump(summary, out, indent=2, ensure_ascii=False)

    print("\n========================================================")
    print("PDF CONTENT SCAN & TOPIC INDEXING COMPLETED")
    print("========================================================")
    print(f"Total PDFs Scanned: {len(pdf_files)}")
    print(f"Total Pages Indexed: {total_pages_all}")
    print(f"Total Time: {summary['scan_time_seconds']}s\n")
    print("Hits per Topic:")
    for topic, count in summary["topic_counts"].items():
        print(f" - {topic}: {count} matching page locations")
    print(f"\nSaved detailed index to: {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
