with open('packages/css/packages.css', 'r', encoding='utf-8', errors='ignore') as fp:
    lines = fp.readlines()

for i, l in enumerate(lines):
    if 'invoice-modal-overlay' in l and '{' in l:
        print(f'{i+1}: {l.strip()[:100]}')
        for k in range(i+1, min(len(lines), i+15)):
            print(f'  {lines[k].strip()[:100]}')
            if '}' in lines[k]:
                break
        break
