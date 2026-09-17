import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('packages/graduation-shoot.html', 'r', encoding='utf-8', errors='ignore') as fp:
    lines = fp.readlines()

for i, l in enumerate(lines):
    if 'services-cards-grid' in l:
        print(f'services-cards-grid at {i+1}:')
        for j in range(i, min(len(lines), i+60)):
            print(f'{j+1}: {lines[j].rstrip()}')
        break
