import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('packages/graduation-shoot.html', 'r', encoding='utf-8', errors='ignore') as fp:
    html = fp.read()

import re
sections = re.findall(r'<section[^>]*class="([^"]*)"', html)
print('Graduation shoot sections:', sections)

grids = re.findall(r'class="([^"]*grid[^"]*)"', html)
print('Graduation shoot grids:', set(grids))
