function makeIcon(c: HTMLCanvasElement) {
    const w = c.width;
    const h = c.height;
    const ctx = c.getContext('2d');
    if (ctx) {
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(0,0,w,h);    
        ctx.fillStyle = '#0000ff';
        ctx.fillRect(w/4,h/4,w/2,h/2);    
    }    
}

makeIcon(document.getElementById('canvas512') as HTMLCanvasElement);
makeIcon(document.getElementById('canvas192') as HTMLCanvasElement);

// const imageData = canvas512.toDataURL();

// console.log(imageData);

// window.open(imageData);
