"""Environment awareness: configured timezone, location, weather and holidays.

Network access is optional and fails soft. A missing provider, key or network
never blocks the companion; the environment block simply degrades to whatever is
known locally.
"""

from __future__ import annotations

import json
import time
from datetime import date, datetime, timedelta
from pathlib import Path
from typing import Any, Callable

try:
    from zoneinfo import ZoneInfo
except ImportError:  # pragma: no cover - Python < 3.9
    ZoneInfo = None

FIXED_HOLIDAYS = {
    "01-01": "元旦",
    "02-14": "情人节",
    "03-08": "妇女节",
    "04-01": "愚人节",
    "05-01": "劳动节",
    "05-04": "青年节",
    "06-01": "儿童节",
    "07-01": "建党节",
    "08-01": "建军节",
    "09-10": "教师节",
    "10-01": "国庆节",
    "11-11": "双十一",
    "12-24": "平安夜",
    "12-25": "圣诞节",
}

# Minimal WMO weather-code mapping (open-meteo).
WMO_CODES = {
    0: "晴", 1: "大致晴朗", 2: "局部多云", 3: "阴", 45: "有雾", 48: "雾凇",
    51: "小毛毛雨", 53: "毛毛雨", 55: "浓毛毛雨", 56: "冻毛毛雨", 57: "浓冻毛毛雨",
    61: "小雨", 63: "中雨", 65: "大雨", 66: "冻雨", 67: "强冻雨",
    71: "小雪", 73: "中雪", 75: "大雪", 77: "雪粒",
    80: "阵雨", 81: "强阵雨", 82: "暴雨", 85: "阵雪", 86: "强阵雪",
    95: "雷雨", 96: "雷雨伴冰雹", 99: "强雷雨伴冰雹",
}


def _float(value: Any, default: float = 0.0) -> float:
    try:
        return float(value)
    except (TypeError, ValueError):
        return default


class EnvironmentSystem:
    """Locally-known environment with an optional cached weather fetch."""

    def __init__(self, data_dir: str, settings_getter: Callable[[], dict] | None = None):
        self.data_dir = Path(data_dir)
        self.settings_getter = settings_getter or (lambda: {})
        self._cache_path = self.data_dir / "environment.json"
        self._weather_cache: dict[str, Any] = {}
        self._loaded = False

    # -- settings ---------------------------------------------------------
    def _settings(self) -> dict:
        try:
            return dict(self.settings_getter() or {})
        except Exception:
            return {}

    def timezone_name(self) -> str:
        return str(self._settings().get("env_timezone") or "Asia/Shanghai")

    def now(self) -> datetime:
        name = self.timezone_name()
        if ZoneInfo is not None:
            try:
                return datetime.now(ZoneInfo(name))
            except Exception:
                pass
        return datetime.now()

    def location_text(self) -> str:
        return str(self._settings().get("env_city") or "").strip()

    def _coordinates(self) -> tuple[float, float] | None:
        settings = self._settings()
        lat, lon = settings.get("env_latitude"), settings.get("env_longitude")
        if lat not in (None, "") and lon not in (None, ""):
            return _float(lat), _float(lon)
        return None

    def fetch_enabled(self) -> bool:
        return str(self._settings().get("enable_environment_fetch", "0")) == "1"

    # -- holidays ---------------------------------------------------------
    def holiday_on(self, day: date) -> str:
        return FIXED_HOLIDAYS.get(day.strftime("%m-%d"), "")

    def upcoming_holiday(self, days: int = 7) -> dict[str, Any] | None:
        current = self.now().date()
        for offset in range(1, max(1, int(days)) + 1):
            target = current + timedelta(days=offset)
            name = self.holiday_on(target)
            if name:
                return {"title": name, "in_days": offset, "occurs_on": target.isoformat()}
        return None

    # -- weather ----------------------------------------------------------
    def _load_cache(self) -> None:
        if self._loaded:
            return
        self._loaded = True
        try:
            self._weather_cache = json.loads(self._cache_path.read_text(encoding="utf-8"))
        except (FileNotFoundError, ValueError):
            self._weather_cache = {}

    def cached_weather(self) -> dict[str, Any]:
        self._load_cache()
        return dict(self._weather_cache) if isinstance(self._weather_cache, dict) else {}

    async def weather(self, force: bool = False) -> dict[str, Any]:
        """Return cached weather, refreshing it when enabled and stale."""
        self._load_cache()
        ttl = max(5, int(_float(self._settings().get("weather_cache_minutes"), 60))) * 60
        fresh = time.time() - float(self._weather_cache.get("fetched_at") or 0) < ttl
        if self._weather_cache and fresh and not force:
            return self.cached_weather()
        if not self.fetch_enabled():
            return self.cached_weather()
        coords = self._coordinates()
        if not coords:
            return self.cached_weather()
        try:
            fetched = await self._fetch_open_meteo(*coords)
        except Exception:
            return self.cached_weather()
        if fetched:
            self._weather_cache = fetched
            try:
                self.data_dir.mkdir(parents=True, exist_ok=True)
                self._cache_path.write_text(json.dumps(fetched, ensure_ascii=False), encoding="utf-8")
            except OSError:
                pass
        return self.cached_weather()

    async def _fetch_open_meteo(self, latitude: float, longitude: float) -> dict[str, Any]:
        import httpx

        url = "https://api.open-meteo.com/v1/forecast"
        params = {
            "latitude": latitude, "longitude": longitude,
            "current": "temperature_2m,weather_code",
            "daily": "temperature_2m_max,temperature_2m_min",
            "timezone": self.timezone_name(),
            "forecast_days": 1,
        }
        async with httpx.AsyncClient(timeout=8) as client:
            response = await client.get(url, params=params)
            response.raise_for_status()
            payload = response.json()
        current = payload.get("current") or {}
        daily = payload.get("daily") or {}
        code = int(_float(current.get("weather_code"), -1))
        return {
            "fetched_at": time.time(),
            "updated_at": self.now().isoformat(timespec="minutes"),
            "text": WMO_CODES.get(code, ""),
            "temperature": current.get("temperature_2m"),
            "temp_max": (daily.get("temperature_2m_max") or [None])[0],
            "temp_min": (daily.get("temperature_2m_min") or [None])[0],
        }

    def weather_text(self) -> str:
        weather = self.cached_weather()
        parts = [self.location_text(), str(weather.get("text") or "")]
        temperature = weather.get("temperature")
        if temperature is not None:
            parts.append(f"{temperature}℃")
        return " ".join(part for part in parts if part).strip()

    # -- aggregate --------------------------------------------------------
    def env_context(self) -> dict[str, Any]:
        now = self.now()
        weather = self.cached_weather()
        return {
            "timezone": self.timezone_name(),
            "local_time": now.strftime("%Y-%m-%d %H:%M"),
            "location": self.location_text(),
            "weather": str(weather.get("text") or ""),
            "temperature": weather.get("temperature"),
            "holiday_today": self.holiday_on(now.date()),
            "holiday_upcoming": self.upcoming_holiday(7),
        }
