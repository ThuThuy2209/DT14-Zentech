"""Anomaly detector for invoice extraction.

Provides a very lightweight, in‑memory duplicate detection. It keeps a
global ``_seen_invoices`` set of keys that uniquely identify an invoice.
The key is a tuple of ``(supplier_tax_id, invoice_number, invoice_date)``
– enough to catch exact repeats in the current session.

The function returns a list of flag identifiers (currently only
``"WARNING_DUPLICATE"``). Callers should merge this list with any existing
``flags`` field before returning the response.
"""

from __future__ import annotations

from typing import List, Set, Tuple

# Global store of processed invoice identifiers (in‑memory only).
_seen_invoices: Set[Tuple[str, str, str]] = set()


def _make_key(supplier_tax_id: str, invoice_number: str,
              invoice_date: str) -> Tuple[str, str, str]:
    """Create a hashable key for an invoice.

    The values are stripped of surrounding whitespace to avoid mismatches
    due to accidental spaces.
    """
    return (
        supplier_tax_id.strip(),
        invoice_number.strip(),
        invoice_date.strip(),
    )


def detect_duplicate(
    supplier_tax_id: str,
    invoice_number: str,
    invoice_date: str,
) -> List[str]:
    """Detect whether the supplied invoice has already been processed.

    The function updates the global ``_seen_invoices`` set and returns a list
    of flag strings. Currently only ``"WARNING_DUPLICATE"`` is defined.
    """
    flags: List[str] = []
    key = _make_key(supplier_tax_id, invoice_number, invoice_date)
    if key in _seen_invoices:
        flags.append("WARNING_DUPLICATE")
    else:
        _seen_invoices.add(key)
    return flags


__all__ = ["detect_duplicate"]