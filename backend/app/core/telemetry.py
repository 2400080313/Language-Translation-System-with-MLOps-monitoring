from prometheus_client import Counter, Histogram, Gauge

# Prometheus Metric Instruments
TRANSLATION_REQUESTS_TOTAL = Counter(
    "translation_requests_total",
    "Total count of translation requests handled by the service",
    ["status", "source_lang", "target_lang", "model"]
)

TRANSLATION_LATENCY_SECONDS = Histogram(
    "translation_latency_seconds",
    "End-to-end inference latency in seconds",
    ["model", "source_lang", "target_lang"],
    buckets=[0.05, 0.1, 0.2, 0.35, 0.5, 0.75, 1.0, 2.5, 5.0]
)

MODEL_BLEU_SCORE = Gauge(
    "model_bleu_score",
    "BLEU benchmark evaluation score of the active translation model",
    ["model", "version"]
)

MODEL_CHRF_SCORE = Gauge(
    "model_chrf_score",
    "chrF benchmark evaluation score of the active translation model",
    ["model", "version"]
)

DATA_DRIFT_P_VALUE = Gauge(
    "data_drift_p_value",
    "Two-sample Kolmogorov-Smirnov p-value for token length data drift"
)

# Initialize default values
MODEL_BLEU_SCORE.labels(model="M2M100-Indic-v2.1", version="v2.1").set(38.6)
MODEL_CHRF_SCORE.labels(model="M2M100-Indic-v2.1", version="v2.1").set(61.2)
DATA_DRIFT_P_VALUE.set(0.884)
