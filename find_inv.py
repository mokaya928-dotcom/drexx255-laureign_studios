import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('packages/index.html', 'r', encoding='utf-8', errors='ignore') as fp:
    lines = fp.readlines()

for i, l in enumerate(lines):
    if 'invoice-printable-sheet' in l or 'id="invoiceModal"' in l:
        print(f'{i+1}: {l.strip()[:100]}')
        for k in range(max(0, i-2), min(len(lines), i+15)):
            print(f'  {k+1}: {lines[k].strip()[:100]}')
        break
