import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('packages/js/packages.js', 'r', encoding='utf-8', errors='ignore') as fp:
    lines = fp.readlines()

for j in range(725, min(len(lines), 850)):
    print(f'{j+1}: {lines[j].rstrip()}')
