import re

with open('packages/css/packages.css', 'r', encoding='utf-8', errors='ignore') as fp:
    css = fp.read()

classes = ['detail-card-grid', 'detail-pkg-card', 'services-cards-grid', 'service-out-card', 'mounts-cards-grid', 'extra-rates-grid', 'extra-rate-card', 'chapter-cards-grid', 'packages-grid']

for c in classes:
    # search rules for this class
    matches = re.findall(r'([^{}]*' + re.escape(c) + r'[^{}]*\{[^}]*\})', css)
    print(f'=== Class: {c} (found {len(matches)} rules) ===')
    for m in matches[-4:]: # print the last 4 rules (usually the media queries)
        clean_m = ' '.join(m.split())
        print(' ', clean_m[:120])
