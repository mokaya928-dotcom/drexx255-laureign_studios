with open('packages/js/packages-data.js', 'r', encoding='utf-8', errors='ignore') as fp:
    lines = fp.readlines()

for i, l in enumerate(lines):
    if 'PACKAGES_DATA' in l:
        print(f'Line {i+1}: {l.rstrip()[:100]}')
        for j in range(i, min(len(lines), i+30)):
            print(f'{j+1}: {lines[j].rstrip()}')
        break
