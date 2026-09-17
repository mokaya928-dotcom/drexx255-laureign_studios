import subprocess, os

edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'

# Let's create a temporary html with a small script to scroll down
temp_js = """
window.addEventListener('load', () => {
    const el = document.querySelector('.detailed-packages-sec');
    if (el) el.scrollIntoView();
});
"""

grad_html = os.path.abspath('packages/graduation-shoot.html')
grad_url = f'file:///{grad_html.replace(os.sep, "/")}'
grad_tiers_png = os.path.abspath('grad_tiers_mobile.png')

# We can take a screenshot of full page or specific element using puppeteer/edge or scroll
# Let's run edge with window size 390x2400 and scroll to detailed-packages-sec
# Or write a small script that scrolls before screenshot
script = f"""
const {{ execSync }} = require('child_process');
// start local server or just open file
"""
