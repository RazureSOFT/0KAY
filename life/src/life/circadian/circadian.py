"""Circadian rhythm system for L.I.F.E - Mental energy and sleep/wake cycles."""

from dataclasses import dataclass
from datetime import datetime, timedelta
import json


@dataclass
class CircadianState:
    """Mental energy and circadian state."""
    mental_energy: float = 100.0  # 0-100
    is_sleeping: bool = False
    sleep_start: datetime | None = None
    last_tick: datetime = None
    wake_count_today: int = 0

    def __post_init__(self):
        if self.last_tick is None:
            self.last_tick = datetime.now()


class CircadianSystem:
    """Manages mental energy and sleep/wake cycles."""

    # Energy drain rates
    BASE_DRAIN_PER_HOUR = 2.0
    TASK_DRAIN_MULTIPLIER = 1.5
    SLEEP_RECOVERY_PER_HOUR = 25.0

    # Thresholds
    DROWSY_THRESHOLD = 50.0
    SLEEP_THRESHOLD = 20.0
    MAX_ENERGY = 100.0

    def __init__(self, state: CircadianState | None = None):
        self.state = state or CircadianState()
        self.activity_days = {}
        self.sleep_hour = 23
        self.wake_hour = 7
        self.last_interaction = None
        self._wake_day = datetime.now().date().isoformat()

    def observe_interaction(self, now=None):
        """Learn a quiet eight-hour window; one hourly sample per day, bounded drift."""
        now = now or datetime.now()
        day = now.date().isoformat()
        hours = self.activity_days.setdefault(day, [])
        if now.hour not in hours:
            hours.append(now.hour)
        cutoff = (now - timedelta(days=28)).date().isoformat()
        self.activity_days = {key: value for key, value in self.activity_days.items() if key >= cutoff}
        self.last_interaction = now
        if len(self.activity_days) >= 3 and getattr(self, '_learned_day', '') != day:
            counts = [sum(hour in values for values in self.activity_days.values()) for hour in range(24)]
            target = min(range(20, 28), key=lambda start: (sum(counts[(start+i)%24] for i in range(8)), abs(start-23))) % 24
            delta = (target-self.sleep_hour+12)%24-12
            self.sleep_hour = (self.sleep_hour + max(-1, min(1, delta))) % 24
            self.wake_hour = (self.sleep_hour+8)%24
            self._learned_day = day

    def in_sleep_window(self, now=None):
        now = now or datetime.now()
        return (now.hour-self.sleep_hour)%24 < 8

    def tick(self, seconds: float) -> None:
        """Update mental energy based on time elapsed."""
        if self.state.last_tick is None:
            self.state.last_tick = datetime.now()
            return

        now = datetime.now()
        elapsed = max(0, (now - self.state.last_tick).total_seconds())
        self.state.last_tick = now
        if self._wake_day != now.date().isoformat():
            self.state.wake_count_today = 0
            self._wake_day = now.date().isoformat()

        if self.state.is_sleeping:
            # Recover energy while sleeping
            recovery = (elapsed / 3600) * self.SLEEP_RECOVERY_PER_HOUR
            self.state.mental_energy = min(self.MAX_ENERGY, self.state.mental_energy + recovery)

            # Check if fully rested
            if not self.in_sleep_window(now) and self.state.mental_energy >= self.DROWSY_THRESHOLD:
                self.state.is_sleeping = False
                self.state.sleep_start = None
        else:
            # Drain energy while awake
            drain = (elapsed / 3600) * self.BASE_DRAIN_PER_HOUR
            self.state.mental_energy = max(0, self.state.mental_energy - drain)

            # Check if should sleep
            idle = self.last_interaction is None or (now-self.last_interaction).total_seconds() > 1800
            if self.state.mental_energy <= self.SLEEP_THRESHOLD or (self.in_sleep_window(now) and idle):
                self.start_sleep()

    def start_sleep(self) -> None:
        """Enter sleep state."""
        self.state.is_sleeping = True
        self.state.sleep_start = datetime.now()

    def force_wake(self) -> bool:
        """Force wake from sleep. Returns True if was sleeping."""
        if self.state.is_sleeping:
            self.state.is_sleeping = False
            self.state.sleep_start = None
            self.state.wake_count_today += 1
            # Forced wake leaves residual fatigue + tracks dissatisfaction window
            self.state.mental_energy = max(0.0, self.state.mental_energy - 5.0)
            self._last_forced_wake_at = datetime.now()
            return True
        return False

    def was_forced_wake_recently(self, minutes: float = 30.0) -> bool:
        """True if force_wake happened within the last N minutes (dissatisfaction window)."""
        ts = getattr(self, "_last_forced_wake_at", None)
        if not ts:
            return False
        return (datetime.now() - ts).total_seconds() <= minutes * 60

    def dissatisfaction_level(self) -> float:
        """0..1 irritation pressure after forced wake / low energy."""
        level = 0.0
        if self.was_forced_wake_recently():
            level += 0.6
        if self.state.mental_energy < self.DROWSY_THRESHOLD:
            level += 0.2
        if self.state.mental_energy < self.SLEEP_THRESHOLD:
            level += 0.2
        return min(1.0, level)

    def task_completed(self, duration_seconds: float) -> None:
        """Apply extra drain from Agent task."""
        drain = (duration_seconds / 3600) * self.BASE_DRAIN_PER_HOUR * self.TASK_DRAIN_MULTIPLIER
        self.state.mental_energy = max(0, self.state.mental_energy - drain)

    def is_drowsy(self) -> bool:
        """Check if mental energy is below drowsy threshold."""
        return self.state.mental_energy < self.DROWSY_THRESHOLD

    def should_auto_sleep(self) -> bool:
        """Check if should automatically sleep."""
        idle = self.last_interaction is None or (datetime.now()-self.last_interaction).total_seconds() > 1800
        return not self.state.is_sleeping and (self.state.mental_energy <= self.SLEEP_THRESHOLD or (self.in_sleep_window() and idle))

    def get_response_delay(self) -> float:
        """Get response delay multiplier based on energy."""
        if self.state.mental_energy < 20:
            return 3.0  # Very slow when exhausted
        elif self.state.mental_energy < 50:
            return 2.0  # Slower when drowsy
        return 1.0  # Normal speed

    def get_prompt_context(self) -> str:
        """Get circadian state as prompt context."""
        if self.state.is_sleeping:
            return "You are currently sleeping. If woken forcibly, express irritation."
        elif self.state.mental_energy < 20:
            return "You are exhausted. Your responses are very brief and slow."
        elif self.state.mental_energy < 50:
            return "You are drowsy. Your responses are shorter than usual."
        else:
            return "You are alert and awake."

    def to_dict(self) -> dict:
        return {
            "mental_energy": round(self.state.mental_energy, 1),
            "is_sleeping": self.state.is_sleeping,
            "wake_count_today": self.state.wake_count_today,
            "sleep_hour": self.sleep_hour,
            "wake_hour": self.wake_hour,
            "observed_days": len(self.activity_days),
            "activity_days": self.activity_days,
            "learned_day": getattr(self, '_learned_day', ''),
            "last_tick": self.state.last_tick.isoformat(),
            "last_interaction": self.last_interaction.isoformat() if self.last_interaction else None,
            "sleep_start": self.state.sleep_start.isoformat() if self.state.sleep_start else None,
            "wake_day": self._wake_day,
        }

    def restore(self, data):
        self.state.mental_energy = float(data.get('mental_energy', 100))
        self.state.is_sleeping = bool(data.get('is_sleeping', False))
        self.state.wake_count_today = int(data.get('wake_count_today', 0))
        self.sleep_hour = int(data.get('sleep_hour', 23)) % 24
        self.wake_hour = (self.sleep_hour+8)%24
        self.activity_days = data.get('activity_days', {})
        self._learned_day = data.get('learned_day', '')
        self._wake_day = data.get('wake_day', datetime.now().date().isoformat())
        for key in ('last_tick', 'sleep_start'):
            if data.get(key): setattr(self.state, key, datetime.fromisoformat(data[key]))
        if data.get('last_interaction'): self.last_interaction = datetime.fromisoformat(data['last_interaction'])

    def save(self, path: str) -> None:
        """Save state to file."""
        data = self.to_dict()
        with open(path, "w") as f:
            json.dump(data, f, indent=2)

    def load(self, path: str) -> None:
        """Load state from file."""
        try:
            with open(path, "r") as f:
                data = json.load(f)
            self.restore(data)
        except FileNotFoundError:
            pass
