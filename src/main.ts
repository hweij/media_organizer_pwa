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
                showImageFile(imgHandle);    
            }
            // // Try to display an image
            // const imgHandle = await dirHandle.getFileHandle('test.jpg');
            // showImageFile(imgHandle);
        }
    });

}

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

fileTest();
