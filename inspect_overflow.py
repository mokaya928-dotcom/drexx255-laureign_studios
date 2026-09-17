import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('packages/css/packages.css', 'r', encoding='utf-8', errors='ignore') as fp:
    lines = fp.readlines()

targets = ['.mount-price-box', '.mount-price-row', '.mount-new-price', '.pkg-card-actions', '.btn-open-package-main', '.btn-card-wa-clean', '.chapter-cards-grid', '.packages-grid']

for i, l in enumerate(lines):
    for t in targets:
        if t in l and '{' in l:
            print(f'Line {i+1}: {l.strip()[:60]}')
            for k in range(i+1, min(len(lines), i+18)):
                if '}' in lines[k]:
                    print(f'  {lines[k].strip()[:60]}')
                    break
                print(f'  {lines[k].strip()[:60]}')
            print('---')
            break
