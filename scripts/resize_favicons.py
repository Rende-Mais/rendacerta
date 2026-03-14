"""
Script para redimensionar e converter todos os favicons para WebP 45x45px.
- Mantém o nome do arquivo (apenas troca a extensão para .webp)
- Preserva transparência (canvas 45x45 com fundo transparente)
- Remove os arquivos originais após a conversão
"""

from pathlib import Path
from PIL import Image

FAVICONS_DIR = Path(__file__).parent.parent / "favicons"
TARGET_SIZE = (45, 45)
TARGET_FORMAT = "webp"
QUALITY = 90

EXTENSIONS_SUPORTADAS = {".png", ".jpg", ".jpeg", ".gif", ".bmp", ".tiff", ".webp"}


def resize_and_convert(source_path: Path) -> None:
    stem = source_path.stem
    output_path = source_path.parent / f"{stem}.webp"

    with Image.open(source_path) as img:
        # Converte para RGBA para garantir suporte a transparência
        img = img.convert("RGBA")

        # Cria canvas 45x45 transparente e centraliza a imagem redimensionada
        img.thumbnail(TARGET_SIZE, Image.LANCZOS)

        canvas = Image.new("RGBA", TARGET_SIZE, (0, 0, 0, 0))
        offset_x = (TARGET_SIZE[0] - img.width) // 2
        offset_y = (TARGET_SIZE[1] - img.height) // 2
        canvas.paste(img, (offset_x, offset_y), mask=img)

        canvas.save(output_path, format="WEBP", quality=QUALITY, method=6)

    # Remove o arquivo original apenas se for diferente do arquivo de saída
    if source_path != output_path:
        source_path.unlink()

    print(f"  OK: {source_path.name} -> {output_path.name} ({output_path.stat().st_size} bytes)")


def main() -> None:
    if not FAVICONS_DIR.exists():
        print(f"[ERRO] Pasta não encontrada: {FAVICONS_DIR}")
        return

    arquivos = [
        f for f in FAVICONS_DIR.iterdir()
        if f.is_file() and f.suffix.lower() in EXTENSIONS_SUPORTADAS
    ]

    if not arquivos:
        print("[AVISO] Nenhum arquivo de imagem encontrado na pasta favicons.")
        return

    print(f"Processando {len(arquivos)} imagem(ns) em: {FAVICONS_DIR}\n")

    erros = []
    for arquivo in sorted(arquivos):
        try:
            resize_and_convert(arquivo)
        except Exception as e:
            erros.append((arquivo.name, str(e)))
            print(f"  ERRO: {arquivo.name} -> {e}")

    print(f"\nConcluído: {len(arquivos) - len(erros)} convertido(s), {len(erros)} erro(s).")


if __name__ == "__main__":
    main()
