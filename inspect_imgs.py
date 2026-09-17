import re

with open('packages/js/packages-data.js', 'r', encoding='utf-8', errors='ignore') as fp:
    content = fp.read()

images = re.findall(r'image:\s*["\']([^"\']+)["\']', content)
print(f'Total packages: {len(images)}')
for img in images[:10]:
    print(' ', img)
