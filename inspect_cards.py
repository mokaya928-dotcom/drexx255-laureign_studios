import glob, re
from collections import Counter

html_files = glob.glob('packages/*.html')
all_classes = Counter()

for f in html_files:
    with open(f, 'r', encoding='utf-8', errors='ignore') as fp:
        html = fp.read()
    classes = re.findall(r'class="([^"]*(?:pkg|package|card|item|grid|tier|plan|pricing)[^"]*)"', html)
    for c in classes:
        for single_class in c.split():
            if any(k in single_class for k in ['pkg', 'package', 'card', 'item', 'grid', 'tier', 'plan']):
                all_classes[single_class] += 1

print("Top classes across ALL html files:")
for c, cnt in all_classes.most_common(40):
    print(f'{cnt:4d}: {c}')

# Let's also check graduation-shoot.html specifically
with open('packages/graduation-shoot.html', 'r', encoding='utf-8', errors='ignore') as fp:
    grad_html = fp.read()
print('\nGraduation shoot packages/cards:')
grad_cards = re.findall(r'<div[^>]+class="([^"]*(?:pkg|package|card|tier)[^"]*)"', grad_html)
print(set(grad_cards))
