const msg = "HELLO";
console.log(msg);

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
    let fileHandle;
    bTest.addEventListener('click', async () => {
        //   [fileHandle] = await window.showOpenFilePicker();
        dirHandle = await window.showDirectoryPicker();
        // Do something with the file handle.
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

fileTest();
