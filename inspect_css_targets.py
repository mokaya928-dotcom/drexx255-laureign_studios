import re

with open('packages/css/packages.css', 'r', encoding='utf-8', errors='ignore') as fp:
    lines = fp.readlines()

targets = ['chapter-cards-grid', 'packages-grid', 'detail-card-grid', 'services-cards-grid', 'pkg-card', 'mount-card', 'detail-pkg-card', 'service-out-card', 'mount-preview-frame']

for i, l in enumerate(lines):
    for t in targets:
        if t in l and '{' in l:
            print(f'Line {i+1}: matched {t}: {l.strip()[:100]}')
            break
