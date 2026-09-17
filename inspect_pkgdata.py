import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('packages/js/packages-data.js', 'r', encoding='utf-8', errors='ignore') as fp:
    lines = fp.readlines()

for i in range(min(50, len(lines))):
    print(lines[i].rstrip())
