import subprocess, os

edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'

# Let's inspect overflow with a script inside the page
detect_overflow_script = """
<!DOCTYPE html>
<html>
<body>
<script>
window.addEventListener('load', () => {
    const docWidth = document.documentElement.offsetWidth;
    const overflowing = [];
    document.querySelectorAll('*').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.right > docWidth + 1) {
            overflowing.push({
                tag: el.tagName,
                class: el.className,
                id: el.id,
                right: rect.right,
                width: rect.width
            });
        }
    });
    console.log('DOC_WIDTH: ' + docWidth);
    console.log('OVERFLOW_COUNT: ' + overflowing.length);
    overflowing.slice(0, 15).forEach(o => {
        console.log('OVERFLOW: ' + JSON.stringify(o));
    });
});
</script>
"""
