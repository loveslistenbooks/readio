"""Regenerate the website's optimized images from the supplied App Store artwork.
Run with Python + Pillow. Source artwork is left unchanged.
"""
from pathlib import Path
from PIL import Image

SITE = Path(__file__).resolve().parents[1]
ROOT = SITE.parent
names = ['listening', 'voices', 'import', 'reader', 'bookshelf', 'statistics', 'ai']
for language, source in [('zh', 'AppStore_1206x2622'), ('en', 'AppStore_EN_1206x2622')]:
    destination = SITE / 'assets' / language
    destination.mkdir(parents=True, exist_ok=True)
    for name, path in zip(names, sorted((ROOT / '听书商店图' / source).glob('*.png')), strict=True):
        image = Image.open(path).convert('RGB')
        poster = image.copy()
        poster.thumbnail((900, 1957), Image.Resampling.LANCZOS)
        poster.save(destination / f'{name}-poster.webp', quality=85, method=6)
        # The device begins at the same position in all 14 supplied posters.
        screen = image.crop((110, 502, 1096, 2618))
        screen.thumbnail((640, 1374), Image.Resampling.LANCZOS)
        screen.save(destination / f'{name}.webp', quality=87, method=6)
icon = Image.open(ROOT / 'lovelistenbooks/Assets.xcassets/AppIcon.appiconset/1024.png').convert('RGB')
icon.resize((192, 192), Image.Resampling.LANCZOS).save(SITE / 'assets/app-icon.png')
icon.resize((32, 32), Image.Resampling.LANCZOS).save(SITE / 'assets/favicon.png')
icon.resize((180, 180), Image.Resampling.LANCZOS).save(SITE / 'assets/apple-touch-icon.png')
print('Prepared 28 WebP images and 3 app icons.')
