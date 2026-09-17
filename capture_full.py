import subprocess, os

edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'

# 1. Graduation shoot full tiers
grad_html = os.path.abspath('packages/graduation-shoot.html')
grad_url = f'file:///{grad_html.replace(os.sep, "/")}'
grad_full_png = os.path.abspath('grad_full_mobile.png')

cmd1 = [
    edge_path,
    '--headless',
    '--disable-gpu',
    '--hide-scrollbars',
    '--window-size=390,4500',
    f'--screenshot={grad_full_png}',
    grad_url
]
subprocess.run(cmd1, capture_output=True)
print('Grad full exists:', os.path.exists(grad_full_png))

# 2. Index page
index_html = os.path.abspath('packages/index.html')
index_url = f'file:///{index_html.replace(os.sep, "/")}'
index_full_png = os.path.abspath('index_full_mobile.png')

cmd2 = [
    edge_path,
    '--headless',
    '--disable-gpu',
    '--hide-scrollbars',
    '--window-size=390,4500',
    f'--screenshot={index_full_png}',
    index_url
]
subprocess.run(cmd2, capture_output=True)
print('Index full exists:', os.path.exists(index_full_png))
