with open('packages/css/packages.css', 'r', encoding='utf-8', errors='ignore') as fp:
    lines = fp.readlines()

for i, l in enumerate(lines):
    if 'pkg-card-actions' in l:
        print(f'{i+1}: {l.rstrip()}')
