import os
import httpx
from pathlib import Path

SUPABASE_URL = "https://fdqmuoxqjxqurdnpxedf.supabase.co"
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", "SUA_CHAVE_SERVICE_ROLE_AQUI")

if SUPABASE_SERVICE_KEY == "SUA_CHAVE_SERVICE_ROLE_AQUI":
    print("ERRO: Configure a varivel de ambiente SUPABASE_SERVICE_KEY antes de rodar este script.")
    exit(1)

# TODO: Add upload logic using python-httpx...
