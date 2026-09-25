"""Tests for Core HTTP authorization headers."""
from life.http_auth import auth_headers


def test_no_token(monkeypatch):
    monkeypatch.delenv("CORE_PAIR_TOKEN", raising=False)
    monkeypatch.delenv("CORE_API_TOKEN", raising=False)
    assert auth_headers() == {}


def test_api_token(monkeypatch):
    monkeypatch.delenv("CORE_PAIR_TOKEN", raising=False)
    monkeypatch.setenv("CORE_API_TOKEN", "api-token")
    assert auth_headers() == {"Authorization": "Bearer api-token"}


def test_pair_token_takes_precedence(monkeypatch):
    monkeypatch.setenv("CORE_API_TOKEN", "api-token")
    monkeypatch.setenv("CORE_PAIR_TOKEN", "pair-token")
    assert auth_headers() == {"Authorization": "Bearer pair-token"}
