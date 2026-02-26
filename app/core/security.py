"""
Placeholder for API key / JWT security middleware.
Extend this module to add authentication as needed.
"""
from fastapi import HTTPException, Security, status
from fastapi.security.api_key import APIKeyHeader

API_KEY_NAME = "X-API-Key"
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)


async def verify_api_key(api_key: str = Security(api_key_header)) -> str:
    """
    Simple API key verification.
    Set VALID_API_KEYS in your environment / config as a comma-separated list.
    """
    from app.core.config import get_settings
    settings = get_settings()

    valid_keys: list[str] = getattr(settings, "VALID_API_KEYS", "").split(",")
    valid_keys = [k.strip() for k in valid_keys if k.strip()]

    # If no keys are configured, skip auth (dev mode)
    if not valid_keys:
        return ""

    if api_key not in valid_keys:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid or missing API key.",
        )
    return api_key
