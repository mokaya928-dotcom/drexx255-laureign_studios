import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('packages/css/packages.css', 'r', encoding='utf-8', errors='ignore') as fp:
    lines = fp.readlines()

for i, l in enumerate(lines):
    if 'grid-template-columns' in l:
        print(f'{i+1:5d}: {l.strip()[:100]}')
