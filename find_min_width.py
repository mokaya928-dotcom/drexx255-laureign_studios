import re

with open('packages/css/packages.css', 'r', encoding='utf-8', errors='ignore') as fp:
    lines = fp.readlines()

for i, l in enumerate(lines):
    if 'min-width' in l and 'px' in l:
        # extract px value
        m = re.search(r'min-width:\s*(\d+)px', l)
        if m and int(m.group(1)) > 350:
            print(f'Line {i+1}: min-width {m.group(1)}px: {l.strip()[:80]}')
