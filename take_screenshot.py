import subprocess, os

edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'

# 1. Graduation shoot mobile screenshot
grad_html = os.path.abspath('packages/graduation-shoot.html')
grad_url = f'file:///{grad_html.replace(os.sep, "/")}'
grad_png = os.path.abspath('grad_mobile.png')

cmd1 = [
    edge_path,
    '--headless',
    '--disable-gpu',
    '--hide-scrollbars',
    '--window-size=390,2000',
    f'--screenshot={grad_png}',
    grad_url
]
subprocess.run(cmd1, capture_output=True)
print('Grad exists:', os.path.exists(grad_png))

# 2. Main index with anchor #studio
index_html = os.path.abspath('packages/index.html')
index_url = f'file:///{index_html.replace(os.sep, "/")}#studio'
index_png = os.path.abspath('index_studio_mobile.png')

cmd2 = [
    edge_path,
    '--headless',
    '--disable-gpu',
    '--hide-scrollbars',
    '--window-size=390,2400',
    f'--screenshot={index_png}',
    index_url
]
subprocess.run(cmd2, capture_output=True)
print('Index studio exists:', os.path.exists(index_png))

# 3. Intermediate screen width (e.g. 700px or 768px or 800px)
index_tablet_png = os.path.abspath('index_tablet.png')
cmd3 = [
    edge_path,
    '--headless',
    '--disable-gpu',
    '--hide-scrollbars',
    '--window-size=768,2400',
    f'--screenshot={index_tablet_png}',
    index_url
]
subprocess.run(cmd3, capture_output=True)
print('Tablet exists:', os.path.exists(index_tablet_png))
