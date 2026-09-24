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

    def tick(self, seconds: float) -> None:
        """Update mental energy based on time elapsed."""
        if self.state.last_tick is None:
            self.state.last_tick = datetime.now()
            return

        now = datetime.now()
        elapsed = (now - self.state.last_tick).total_seconds()
        self.state.last_tick = now

        if self.state.is_sleeping:
            # Recover energy while sleeping
            recovery = (elapsed / 3600) * self.SLEEP_RECOVERY_PER_HOUR
            self.state.mental_energy = min(self.MAX_ENERGY, self.state.mental_energy + recovery)

            # Check if fully rested
            if self.state.mental_energy >= self.MAX_ENERGY:
                self.state.is_sleeping = False
                self.state.sleep_start = None
        else:
            # Drain energy while awake
            drain = (elapsed / 3600) * self.BASE_DRAIN_PER_HOUR
            self.state.mental_energy = max(0, self.state.mental_energy - drain)

            # Check if should sleep
            if self.state.mental_energy <= self.SLEEP_THRESHOLD:
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
        return self.state.mental_energy <= self.SLEEP_THRESHOLD and not self.state.is_sleeping

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
        }

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
            self.state.mental_energy = data.get("mental_energy", 100.0)
            self.state.is_sleeping = data.get("is_sleeping", False)
            self.state.wake_count_today = data.get("wake_count_today", 0)
        except FileNotFoundError:
            pass
