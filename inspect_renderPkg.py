import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('packages/js/packages.js', 'r', encoding='utf-8', errors='ignore') as fp:
    lines = fp.readlines()

for i, l in enumerate(lines):
    if 'function renderPackages' in l:
        print(f'renderPackages at line {i+1}')
        for j in range(i, min(len(lines), i+80)):
            print(f'{j+1}: {lines[j].rstrip()}')
        break
