import re

with open('packages/js/packages.js', 'r', encoding='utf-8', errors='ignore') as fp:
    js = fp.read()

print('Length of packages.js:', len(js))
# Search for card markup in packages.js
matches = re.findall(r'<div class="([^"]*card[^"]*)"', js)
print('Card classes in packages.js:', set(matches))

# Let's find where card HTML is constructed
for m in re.finditer(r'function\s+(\w+Card|\w+Render|\w+Html|render\w+)', js):
    print('Function:', m.group(0))
