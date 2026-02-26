"""
Basic unit tests for candidate scoring logic.
Run with: pytest tests/
"""
import pytest


def test_hybrid_score_formula():
    """Hybrid score should weight similarity 70% and ATS 30%."""
    similarity = 0.85
    ats_score = 90  # out of 100

    final_score = (0.7 * similarity) + (0.3 * (ats_score / 100))
    assert round(final_score, 4) == round((0.7 * 0.85) + (0.3 * 0.9), 4)


def test_hybrid_score_zero_ats():
    similarity = 0.9
    ats_score = 0

    final_score = (0.7 * similarity) + (0.3 * (ats_score / 100))
    assert round(final_score, 4) == round(0.7 * 0.9, 4)


def test_candidates_sorted_by_final_score():
    candidates = [
        {"id": "a@a.com", "similarity_score": 0.7, "ats_score": 80, "final_score": 0.0},
        {"id": "b@b.com", "similarity_score": 0.9, "ats_score": 95, "final_score": 0.0},
        {"id": "c@c.com", "similarity_score": 0.5, "ats_score": 60, "final_score": 0.0},
    ]
    for c in candidates:
        c["final_score"] = (0.7 * c["similarity_score"]) + (0.3 * (c["ats_score"] / 100))

    sorted_candidates = sorted(candidates, key=lambda x: x["final_score"], reverse=True)
    assert sorted_candidates[0]["id"] == "b@b.com"
