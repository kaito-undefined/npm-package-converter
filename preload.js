const { contextBridge, ipcRenderer } = require('electron');
const defaultText = '⚡ Bu Paketi Kaydet';

window.addEventListener('DOMContentLoaded', () => {
  const buton = document.createElement('button');
  buton.innerText = defaultText;
  
  Object.assign(buton.style, {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: '999999',
    backgroundColor: '#1DA1F2',
    color: '#white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '25px',
    cursor: 'pointer',
    fontWeight: 'bold',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    transition: 'transform 0.2s'
  });

  buton.onmouseover = () => buton.style.transform = 'scale(1.05)';
  buton.onmouseout = () => buton.style.transform = 'scale(1)';

  buton.addEventListener('click', () => {
    ipcRenderer.send('save-url', window.location.href);
    
    buton.innerText = '✅ Kaydedildi!';
    setTimeout(() => buton.innerText = defaultText, 2000);
  });

  document.body.appendChild(buton);
});
