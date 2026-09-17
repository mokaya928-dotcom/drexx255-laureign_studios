import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('packages/graduation-shoot.html', 'r', encoding='utf-8', errors='ignore') as fp:
    lines = fp.readlines()

for i, l in enumerate(lines):
    if 'detail-card-grid' in l:
        print(f'detail-card-grid at {i+1}:')
        for j in range(i, min(len(lines), i+80)):
            print(f'{j+1}: {lines[j].rstrip()}')
        break
