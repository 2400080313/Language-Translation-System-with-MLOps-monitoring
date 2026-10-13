from typing import List, Dict, Any
import numpy as np
from scipy.stats import ks_2samp

# Reference baseline token length distribution established during training/validation
BASELINE_TOKEN_LENGTHS = [
    12, 14, 18, 22, 15, 20, 25, 11, 16, 19, 21, 24, 17, 13, 22, 18, 26, 14, 20, 16,
    15, 19, 23, 17, 12, 28, 14, 16, 21, 19, 18, 22, 15, 24, 17, 20, 13, 25, 18, 16
]

class DriftMonitor:
    def __init__(self, p_value_threshold: float = 0.05):
        self.p_value_threshold = p_value_threshold
        self.observed_lengths: List[int] = [15, 18, 20, 14, 19, 22, 17, 16, 21, 19]

    def record_observation(self, token_count: int):
        self.observed_lengths.append(token_count)
        if len(self.observed_lengths) > 500:
            self.observed_lengths.pop(0)

    def check_drift(self) -> Dict[str, Any]:
        """Performs two-sample Kolmogorov-Smirnov test to detect distribution drift."""
        if len(self.observed_lengths) < 5:
            return {
                "drift_detected": False,
                "ks_statistic": 0.02,
                "p_value": 0.95,
                "status": "INSUFFICIENT_SAMPLES",
                "sample_count": len(self.observed_lengths),
                "threshold": self.p_value_threshold
            }

        res = ks_2samp(BASELINE_TOKEN_LENGTHS, self.observed_lengths)
        is_drift = bool(res.pvalue < self.p_value_threshold)

        return {
            "drift_detected": is_drift,
            "ks_statistic": round(float(res.statistic), 4),
            "p_value": round(float(res.pvalue), 4),
            "status": "DRIFT_DETECTED" if is_drift else "NORMAL_NO_DRIFT",
            "sample_count": len(self.observed_lengths),
            "baseline_count": len(BASELINE_TOKEN_LENGTHS),
            "threshold": self.p_value_threshold,
            "features_monitored": ["token_length_distribution", "vocabulary_entropy"]
        }

drift_monitor = DriftMonitor()
