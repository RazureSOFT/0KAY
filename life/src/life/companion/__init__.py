"""Companion package.

The authoritative implementation is :class:`CompanionSystem` in
:mod:`life.companion.legacy`; this package re-exports it plus the small helpers
its callers share.

The former per-domain managers (``relationship`` / ``calendar`` / ``proactive``
/ ``user_model``) re-implemented the same tables and methods, were never
instantiated, and had already diverged from ``CompanionSystem`` (a fresh-database
crash in ``decay_relationships``, a different ``add_social_edge`` contract,
duplicate ``CREATE TABLE`` statements).  They have been removed so each table has
exactly one owner.
"""
from __future__ import annotations

from .legacy import (
    CompanionSystem,
    GROUP_NEGATIVE,
    GROUP_POSITIVE,
    GROUP_STOPWORDS,
    new_id,
    now,
)

__all__ = [
    "CompanionSystem",
    "GROUP_POSITIVE",
    "GROUP_NEGATIVE",
    "GROUP_STOPWORDS",
    "new_id",
    "now",
]
