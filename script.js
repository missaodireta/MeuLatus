document.addEventListener("DOMContentLoaded", function() {
    const canvas = new fabric.Canvas('canvas', {
        width: 800,
        height: 800,
        backgroundColor: '#000',
        preserveObjectStacking: true
    });

    // TRAVA GLOBAL: Impede redimensionamento e rotação de qualquer objeto
    fabric.Object.prototype.set({
        hasControls: false,
        hasBorders: true,
        lockScalingX: true,
        lockScalingY: true,
        lockRotation: true,
        lockSkewingX: true,
        lockSkewingY: true,
        borderColor: '#00d2ff',
        borderScaleFactor: 2,
        originX: 'center',
        originY: 'center'
    });

    let watermarkObj = null;

    // 1. Carregar Background
    fabric.Image.fromURL('assets/background.png', function(img) {
        if (img) {
            canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
                scaleX: 800 / img.width,
                scaleY: 800 / img.height,
                selectable: false,
                evented: false,
                originX: 'left',
                originY: 'top'
            });
        }
    }, { crossOrigin: 'anonymous' });

    // 2. Pré-carregar Marca d'Água (Invisível e Centralizada)
    fabric.Image.fromURL('meulatus-logo.png', function(img) {
        if (img) {
            watermarkObj = img;
            watermarkObj.set({
                scaleX: 0.25, 
                scaleY: 0.25,
                opacity: 0, 
                left: 400,
                top: 400,
                selectable: false,
                evented: false
            });
            canvas.add(watermarkObj);
        }
    }, { crossOrigin: 'anonymous' });

    // 3. Gerar Deck de Partidos
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
                fImg.set({ 
                    left: 400, 
                    top: 400 
                });
                canvas.add(fImg);
                ativos.add(n);
                thumb.style.opacity = "0.2";
                
                // Garante que a marca d'água (mesmo invisível) fique sempre no topo
                if(watermarkObj) watermarkObj.bringToFront(); 
                
                canvas.renderAll();
            }, { crossOrigin: 'anonymous' });
        };
        thumb.onerror = () => thumb.remove();
        deck.appendChild(thumb);
    });

    // 4. Botão Salvar (Ativa marca d'água no centro)
    document.getElementById('btn-save').onclick = () => {
        canvas.discardActiveObject();
        
        if (watermarkObj) {
            watermarkObj.set('opacity', 0.2); // Opacidade sutil para o centro
            watermarkObj.bringToFront();
        }
        
        canvas.renderAll();

        setTimeout(() => {
            try {
                const dataURL = canvas.toDataURL({ 
                    format: 'png', 
                    quality: 1,
                    multiplier: 1 
                });
                const link = document.createElement('a');
                link.href = dataURL;
                link.download = `meulatus_espectro_${Date.now()}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (err) {
                alert("Erro ao salvar. Use o Live Server.");
            } finally {
                if (watermarkObj) {
                    watermarkObj.set('opacity', 0); // Volta a ficar invisível
                    canvas.renderAll();
                }
            }
        }, 150);
    };

    // 5. Botão Limpar (Mantém a marca d'água)
    document.getElementById('btn-clear').onclick = () => {
        canvas.getObjects().forEach(obj => { 
            if(obj !== canvas.backgroundImage && obj !== watermarkObj) canvas.remove(obj); 
        });
        ativos.clear();
        document.querySelectorAll('.party-thumb').forEach(t => t.style.opacity = "1");
        canvas.renderAll();
    };
});