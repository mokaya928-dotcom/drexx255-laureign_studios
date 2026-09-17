import os, glob
from PIL import Image

image_files = glob.glob('packages/samples/**/*.jpg', recursive=True) + glob.glob('packages/samples/**/*.png', recursive=True)
print(f'Found {len(image_files)} sample images')

for img_path in image_files[:15]:
    try:
        with Image.open(img_path) as im:
            w, h = im.size
            ratio = w / h
            print(f'{os.path.basename(img_path):30s}: {w}x{h} (ratio: {ratio:.2f})')
    except Exception as e:
        print(f'{img_path}: {e}')
