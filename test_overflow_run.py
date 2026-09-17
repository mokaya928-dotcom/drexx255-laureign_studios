import subprocess, os

test_html_content = """
<!DOCTYPE html>
<html>
<head>
<script>
window.addEventListener('DOMContentLoaded', () => {
    // After everything loads, find overflowing elements
    setTimeout(() => {
        const docW = document.documentElement.clientWidth;
        const all = document.querySelectorAll('*');
        const over = [];
        all.forEach(el => {
            const r = el.getBoundingClientRect();
            if (r.right > docW + 2) {
                over.push({
                    tag: el.tagName,
                    id: el.id,
                    cls: (el.className || '').toString().slice(0, 50),
                    right: Math.round(r.right),
                    width: Math.round(r.width),
                    parentCls: (el.parentElement ? el.parentElement.className : '').toString().slice(0, 50)
                });
            }
        });
        console.log('CLIENT_WIDTH=' + docW);
        console.log('TOTAL_OVERFLOWING=' + over.length);
        over.sort((a,b) => b.right - a.right);
        over.slice(0, 20).forEach(o => {
            console.log('OVER:' + JSON.stringify(o));
        });
    }, 1500);
});
</script>
"""

# Let's inject this into a copy of index.html and run Edge
with open('packages/index.html', 'r', encoding='utf-8', errors='ignore') as fp:
    idx_content = fp.read()

test_idx = idx_content.replace('<head>', '<head>' + test_html_content)
with open('packages/test_overflow.html', 'w', encoding='utf-8') as fp:
    fp.write(test_idx)

edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
cmd = [
    edge_path,
    '--headless',
    '--disable-gpu',
    '--window-size=390,844',
    '--enable-logging=stderr',
    '--v=1',
    'file:///' + os.path.abspath('packages/test_overflow.html').replace(os.sep, '/')
]
res = subprocess.run(cmd, capture_output=True, text=True, timeout=10)
print('STDOUT:')
for l in res.stdout.split('\n'):
    if 'OVER' in l or 'CLIENT_WIDTH' in l or 'console-message' in l:
        print(l)
print('STDERR:')
for l in res.stderr.split('\n'):
    if 'OVER' in l or 'CLIENT_WIDTH' in l or 'console-message' in l:
        print(l)
