window.addEventListener('load', () => {
    //    registerSW();
});

// Register the Service Worker
async function registerSW() {
    if ('serviceWorker' in navigator) {
        try {
            await navigator
                .serviceWorker
                .register('sw.js');
        }
        catch (e) {
            console.log('SW registration failed');
        }
    }
}

let dirHandle: FileSystemDirectoryHandle;

async function fileTest() {
    const bTest = document.getElementById('bTest') as HTMLButtonElement;
    bTest.addEventListener('click', async () => {
        //   [fileHandle] = await window.showOpenFilePicker();
        dirHandle = await window.showDirectoryPicker();

        const entries = dirHandle.entries();
        for await (const [key, value] of entries) {
            const name = value.name;    
            console.log(name);
            const lc = name.toLowerCase();
            if (lc.endsWith('jpeg') || lc.endsWith('jpg') || lc.endsWith('png')) {
                const imgHandle = await dirHandle.getFileHandle(name);
                // showImageFile(imgHandle);    
                processImageFile(imgHandle);
            }
            // // Try to display an image
            // const imgHandle = await dirHandle.getFileHandle('test.jpg');
            // showImageFile(imgHandle);
        }
    });

}

(document.getElementById('bDiff') as HTMLButtonElement).onclick = showDifferences;

const bPermissions = document.getElementById('bPermissions') as HTMLButtonElement;
bPermissions.onclick = async () => {
//    if ((await dirHandle.requestPermission({ mode: 'readwrite' })) === 'granted') {
    if (await verifyPermission(dirHandle, true)) {
        console.log('readWrite granted');
        const fhandle = await dirHandle.getFileHandle('newfile.txt', { create: true });
        const f = await fhandle.createWritable();
        const w = await f.write("TEST TEST");
        f.close();
    }
}

async function verifyPermission(fileHandle: FileSystemHandle, readWrite: boolean) {
    const options = {} as FileSystemHandlePermissionDescriptor;
    if (readWrite) {
        options.mode = 'readwrite';
    }
    // Check if permission was already granted. If so, return true.
    if ((await fileHandle.queryPermission(options)) === 'granted') {
        return true;
    }
    // Request permission. If the user grants permission, return true.
    if ((await fileHandle.requestPermission(options)) === 'granted') {
        return true;
    }
    // The user didn't grant permission, so return false.
    return false;
}

async function showImageFile(imgFile: FileSystemFileHandle) {
    const fileData = await imgFile.getFile();
    const src = URL.createObjectURL(fileData);
    const divImages = document.getElementById("divImages");
    const img = document.createElement("img");
    img.width = 100;
    img.height = 100;
    img.src = src;
    img.onclick = () => {
        const imgEnlarged = document.getElementById("img") as HTMLImageElement;
        imgEnlarged.src = src;
    }
    divImages?.appendChild(img);
}

type ImageProfile = {
    name: string;
    thumbData: Uint8ClampedArray;
}
const THUMB_SIZE = 64;
const gsThumbData: ImageProfile[] = [];
async function processImageFile(imgFile: FileSystemFileHandle) {
    const fileData = await imgFile.getFile();
    const src = URL.createObjectURL(fileData);
    const img = new Image();
    img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = THUMB_SIZE;
        canvas.height = THUMB_SIZE;
        const divImages = document.getElementById("divImages");
        divImages?.appendChild(canvas);
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, THUMB_SIZE, THUMB_SIZE);
            const imageData = ctx.getImageData(0, 0, THUMB_SIZE, THUMB_SIZE).data;
            // Convert tograyscale float
            const n = THUMB_SIZE * THUMB_SIZE;
            const grayscale = new Uint8ClampedArray(n);
            let rgbIndex = 0;
            for (let i=0; i<n; i++) {
                grayscale[i] = (imageData[rgbIndex] * 0.299) + (imageData[rgbIndex+1] * 0.587) + (imageData[rgbIndex+2] * 0.114);
                rgbIndex += 4;               
            }
            // TEST TEST: show the grayscale image
            {
                const rgb = new Uint8ClampedArray(n*4);
                for (let i=0; i<n; i++) {
                    rgb[i*4] = grayscale[i];
                    rgb[i*4 + 1] = grayscale[i];
                    rgb[i*4 + 2] = grayscale[i];
                    rgb[i*4 + 3] = 0xff;
                }
                gsThumbData.push({ name: imgFile.name, thumbData: rgb });
                const rgbData = new ImageData(rgb, THUMB_SIZE, THUMB_SIZE);
                const gsCanvas = document.createElement('canvas');
                divImages?.appendChild(gsCanvas);
                gsCanvas.width = THUMB_SIZE;
                gsCanvas.height = THUMB_SIZE;
                const gsCtx = gsCanvas.getContext('2d');
                gsCtx?.putImageData(rgbData, 0, 0);
            }
            // canvas.onclick = () => {
            //     const imgEnlarged = document.getElementById("img") as HTMLImageElement;
            //     imgEnlarged.src = src;
            // }
        }    
    }
    img.src = src;
}

/*

// Create a promise for image loading
addImageProcess(src){
  return new Promise((resolve, reject) => {
    let img = new Image()
    img.onload = () => resolve(img.height)
    img.onerror = reject
    img.src = src
  })
}

*/

function showDifferences() {
    const n = THUMB_SIZE * THUMB_SIZE;
    for (let i=0; i<gsThumbData.length-1; i++) {
        for (let j=i+1; j< gsThumbData.length; j++) {
            const td1 = gsThumbData[i].thumbData;
            const td2 = gsThumbData[j].thumbData;
            let res = 0;
            for (let bi=0; bi<n; bi++) {
                res += Math.abs(td1[bi] - td2[bi]);
            }
//            console.log(`${i}:${gsThumbData[i].name} ${j}:${gsThumbData[j].name} ${(res / (n * 256)).toFixed(4)}`);
            console.log(`${(res / (n * 256)).toFixed(4)} ${i} ${j}`);
        }
    }
}

fileTest();
