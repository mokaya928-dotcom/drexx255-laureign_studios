import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('packages/css/packages.css', 'r', encoding='utf-8', errors='ignore') as fp:
    lines = fp.readlines()

for i, l in enumerate(lines):
    if 'reel-box-action-row' in l:
        print(f'{i+1}: {l.rstrip()}')
        for k in range(i+1, min(len(lines), i+15)):
            if '}' in lines[k]:
                print(f'{k+1}: {lines[k].rstrip()}')
                break
            print(f'{k+1}: {lines[k].rstrip()}')
        print('---')
