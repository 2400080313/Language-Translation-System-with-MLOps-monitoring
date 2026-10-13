import pytest

def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "service" in data

def test_ready_check(client):
    response = client.get("/ready")
    assert response.status_code == 200
    assert response.json()["ready"] is True

def test_prometheus_metrics(client):
    response = client.get("/metrics")
    assert response.status_code == 200
    assert "translation_requests_total" in response.text

def test_user_login_admin(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@translateml.edu", "password": "AdminSecret2026!"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["role"] == "admin"

def test_translation_en_to_hi(client):
    response = client.post(
        "/api/v1/translate",
        json={
            "text": "Machine learning models require continuous monitoring in production.",
            "source_lang": "en",
            "target_lang": "hi"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "मशीन लर्निंग मॉडल" in data["translated_text"]
    assert data["latency_ms"] > 0
    assert data["bleu_score"] is not None

def test_translation_en_to_te(client):
    response = client.post(
        "/api/v1/translate",
        json={
            "text": "Machine learning models require continuous monitoring in production.",
            "source_lang": "en",
            "target_lang": "te"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "మెషిన్ లెర్నింగ్" in data["translated_text"]

def test_translation_en_to_ta(client):
    response = client.post(
        "/api/v1/translate",
        json={
            "text": "Machine learning models require continuous monitoring in production.",
            "source_lang": "en",
            "target_lang": "ta"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "இயந்திர கற்றல்" in data["translated_text"]

def test_unsupported_language_pair_rejection(client):
    # Identical languages
    response = client.post(
        "/api/v1/translate",
        json={
            "text": "Hello world",
            "source_lang": "en",
            "target_lang": "en"
        }
    )
    assert response.status_code == 400
    assert "identical" in response.json()["detail"].lower()

def test_drift_monitoring_endpoint(client):
    response = client.get("/api/v1/metrics/drift")
    assert response.status_code == 200
    data = response.json()
    assert "drift_detected" in data
    assert "p_value" in data

def test_rbac_admin_protection(client):
    # Login as standard user
    login_res = client.post(
        "/api/v1/auth/login",
        json={"email": "researcher@translateml.edu", "password": "UserSecret2026!"}
    )
    assert login_res.status_code == 200
    user_token = login_res.json()["access_token"]

    # Try accessing admin endpoint
    res = client.get(
        "/api/v1/users",
        headers={"Authorization": f"Bearer {user_token}"}
    )
    assert res.status_code == 403
