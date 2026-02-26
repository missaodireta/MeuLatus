document.addEventListener("DOMContentLoaded", function() {
    const canvas = new fabric.Canvas('canvas', {
        width: 800,
        height: 800,
        backgroundColor: '#000',
        enableRetinaScaling: true
    });

    const lock = {
        hasControls: false,
        lockScalingX: true,
        lockScalingY: true,
        lockRotation: true
    };

    fabric.Image.fromURL('assets/background.png', function(img) {
        if (img) {
            canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
                scaleX: 800 / img.width,
                scaleY: 800 / img.height
            });
        }
    }, { crossOrigin: 'anonymous' });

    const numeros = ["10", "11", "12", "13", "14", "15", "16", "18", "19", "20", "21", "22", "23", "25", "27", "28", "29", "30", "33", "35", "36", "40", "43", "44", "45", "50", "51", "55", "65", "70", "77", "80"];
    const ativos = new Set();

    const deck = document.getElementById('deck');
    numeros.forEach(n => {
        const imgPath = `assets/${n}-clean - Copia.png`;
        const thumb = document.createElement('img');
        thumb.src = imgPath;
        thumb.className = 'party-thumb';

        thumb.onclick = () => {
            if (ativos.has(n)) return;
            fabric.Image.fromURL(imgPath, (fImg) => {
                if (!fImg) return;
                fImg.scaleToWidth(70);
                fImg.set({ left: 400, top: 400, originX: 'center', originY: 'center', ...lock });
                canvas.add(fImg);
                ativos.add(n);
                thumb.style.opacity = "0.2";
                canvas.renderAll();
            }, { crossOrigin: 'anonymous' });
        };
        thumb.onerror = () => thumb.remove();
        deck.appendChild(thumb);
    });

    document.getElementById('btn-save').onclick = () => {
        canvas.discardActiveObject().renderAll();
        
        setTimeout(() => {
            const dataURL = canvas.toDataURL({ format: 'png', quality: 1 });
            const link = document.createElement('a');
            link.href = dataURL;
            link.download = `meulatus${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }, 150);
    };

    document.getElementById('btn-clear').onclick = () => {
        canvas.getObjects().forEach(obj => { if(obj !== canvas.backgroundImage) canvas.remove(obj); });
        ativos.clear();
        document.querySelectorAll('.party-thumb').forEach(t => t.style.opacity = "1");
        canvas.renderAll();
    };
});