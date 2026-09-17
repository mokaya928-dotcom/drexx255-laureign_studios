import re

with open('packages/css/packages.css', 'r', encoding='utf-8', errors='ignore') as fp:
    css = fp.read()

# Let's find all media queries that have grid-template-columns or column
for m in re.finditer(r'@media\s*([^{]+)\{((?:[^{}]+|\{[^{}]*\})*)\}', css):
    mq_cond = m.group(1).strip()
    mq_body = m.group(2)
    # find rules inside
    for rule in re.finditer(r'([^{}]+)\{([^}]+)\}', mq_body):
        sel = rule.group(1).strip()
        body = rule.group(2).strip()
        if 'grid-template-columns' in body or 'width: 50%' in body:
            print(f'[{mq_cond}] -> {sel} :: {body}')
