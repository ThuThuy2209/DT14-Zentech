'''python
"""Simple evaluation script for the OCR invoice extraction endpoint.

It reads a `ground_truth.json` file that contains an array of objects with the
following shape:

```json
{
  "file_path": "samples/invoice1.pdf",
  "expected": { ... invoice schema ... }
}
```

For each entry the script:
1. Sends the file to ``/api/v1/ai/invoices/extract-ocr``.
2. Receives the JSON response.
3. Compares the fields (ignoring ``flags``) using ``sklearn.metrics`` to
   compute precision, recall and F1 for each numeric / string field.
4. Prints a summary table.

Running the script:
```bash
python -m eval.evaluate   # from the repository root
```
Make sure the FastAPI service is running locally (default ``http://127.0.0.1:5000``).
"""

import json
import os
import pathlib
import sys
from collections import Counter
from typing import Any, Dict, List

import httpx
from sklearn.metrics import precision_score, recall_score, f1_score

BASE_URL = os.getenv("AI_SERVICE_URL", "http://127.0.0.1:5000")
GROUND_TRUTH_PATH = pathlib.Path(__file__).parent / "ground_truth.json"

def load_ground_truth() -> List[Dict[str, Any]]:
    with open(GROUND_TRUTH_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def post_invoice(file_path: pathlib.Path) -> Dict[str, Any]:
    url = f"{BASE_URL}/api/v1/ai/invoices/extract-ocr"
    with open(file_path, "rb") as f:
        files = {"file": (file_path.name, f, "application/pdf")}
        resp = httpx.post(url, files=files, timeout=30)
    resp.raise_for_status()
    return resp.json()["data"]

def flatten_invoice(data: Dict[str, Any]) -> Dict[str, Any]:
    """Flatten nested structures (e.g., items) into a simple dict for metric
    comparison. For now we keep only top‑level scalar fields.
    """
    flat = {k: v for k, v in data.items() if not isinstance(v, (list, dict))}
    return flat

def compare_records(pred: Dict[str, Any], true: Dict[str, Any]) -> Dict[str, float]:
    """Return precision, recall and f1 for the overlapping keys.
    Missing or mismatched values count as errors.
    """
    y_true = []
    y_pred = []
    for key in true:
        true_val = true[key]
        pred_val = pred.get(key)
        y_true.append(str(true_val).lower())
        y_pred.append(str(pred_val).lower() if pred_val is not None else "")
    precision = precision_score(y_true, y_pred, average="macro", zero_division=0)
    recall = recall_score(y_true, y_pred, average="macro", zero_division=0)
    f1 = f1_score(y_true, y_pred, average="macro", zero_division=0)
    return {"precision": precision, "recall": recall, "f1": f1}

def main() -> None:
    cases = load_ground_truth()
    scores = []
    for case in cases:
        file_path = pathlib.Path(case["file_path"]).resolve()
        expected = case["expected"]
        try:
            result = post_invoice(file_path)
        except Exception as e:
            print(f"[ERROR] {file_path.name}: {e}", file=sys.stderr)
            continue
        score = compare_records(flatten_invoice(result), flatten_invoice(expected))
        scores.append(score)
        print(f"{file_path.name}: P={score['precision']:.2f} R={score['recall']:.2f} F1={score['f1']:.2f}")
    if not scores:
        print("No successful evaluations.")
        return
    # Aggregate macro‑average across all cases
    agg = Counter()
    for s in scores:
        agg["precision"] += s["precision"]
        agg["recall"] += s["recall"]
        agg["f1"] += s["f1"]
    n = len(scores)
    print("\n=== Overall Macro‑Average ===")
    print(f"Precision: {agg['precision']/n:.3f}")
    print(f"Recall   : {agg['recall']/n:.3f}")
    print(f"F1 Score : {agg['f1']/n:.3f}")

if __name__ == "__main__":
    main()
'''