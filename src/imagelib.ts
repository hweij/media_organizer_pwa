// import * as fs from 'fs';
// import * as path from 'path';

// const cwd = process.cwd();

// type FileType = 'jpg' | 'png' | 'gif' | 'other' | '';
// type MediaInfo = { name: string, type: FileType, size: number, group: string, tags: string[] };

// const typeMap: { [id: string]: FileType } = {
//     'jpg': 'jpg',
//     'jpeg': 'jpg',
//     'png': 'png',
//     'gif': 'gif'
// }

// function getFileType(fname: string) {
//     const index = fname.lastIndexOf('.');
//     if (index > 0) {
//         return typeMap[fname.substring(index + 1).toLowerCase()];
//     }
// }

// // list all files in the directory
// async function readFromDirectory(imagePath: string) {
//     const res: MediaInfo[] = [];
//     const files = await fs.promises.readdir(imagePath);
//     for (const file of files) {
//         const fullPath = path.join(imagePath,file);
//         const stat = await fs.promises.stat(fullPath);
//         const isDir = stat.isDirectory();
//         const imgType = (getFileType(file) || 'other');
//         console.log(`file: ${fullPath} - ${isDir ? 'DIR' : stat.size + ' ' + imgType}`);
//         if (!isDir) {
//             res.push({ name: file, size: stat.size, type: imgType, group: '', tags: [] });
//         }
//     };
//     return res;
// }

// async function readFromMediaFile(imagePath: string) {
//     const txt = await fs.promises.readFile(path.join(imagePath, 'media.json'), { encoding: 'utf8' });
//     const jso = JSON.parse(txt);
//     const res: MediaInfo[] = [];
//     for (let f of jso.files) {
//         res.push({ name: f.name, type: f.type, size: f.size, group: f.group, tags: f.tags });
//     }
//     return res;
// }

// function getMediaInfo(mediaData: MediaInfo[], fname: string) {
//     const entry = mediaData.find(md => md.name === fname);
//     return entry;
// }

// function tagMatchAll(reqTags: string[], tags: string[]) {
//     if (tags) {
//         for (let t of reqTags) {
//             if (tags.indexOf(t) < 0) {
//                 return false;
//             }
//         }
//         return true;
//     }
//     return false;
// }

// function filter(mediaInfo: MediaInfo[], filter: MediaInfo) {
//     const res: MediaInfo[] = [];

//     for (let e of mediaInfo) {
//         const match =
//             (!filter.name || (filter.name === e.name)) &&
//             (!filter.size || (filter.size === e.size)) &&
//             (!filter.group || (filter.group === e.group)) &&
//             (!filter.tags.length || tagMatchAll(filter.tags, e.tags)) 
//         if (match) {
//             res.push(e);
//         }
//     }
//     return res;
// }

// function findDuplicates(imageDir: string, mediaData: MediaInfo[]) {
//     // For now: just compare size. If that matches, check file content
//     const dupes: MediaInfo[] = [];
//     for (let i=0; i<mediaData.length - 1; i++) {
//         for (let j=i+1; j< mediaData.length; j++) {
//             const m1 = mediaData[i];
//             const m2 = mediaData[j];
//             if (m1.size === m2.size) {
//                 // Same size, see if the content also matches
//                 var buf1 = fs.readFileSync(path.join(imageDir, m1.name));
//                 var buf2 = fs.readFileSync(path.join(imageDir, m2.name));
//                 if (buf1.equals(buf2)) {
//                     dupes.push(m1, m2);
//                 }
//             }
//         }
//     }
//     return dupes;
// }

// async function test() {
//     const imagePath = process.argv[2] || cwd;

//     console.log('Listing for path ' + imagePath);
    
//     const actualData = await readFromDirectory(imagePath);
//     const mediaData = await readFromMediaFile(imagePath);

//     console.log("DATA FROM DIR");
//     console.log(JSON.stringify(actualData, null, 2));
//     console.log("DATA FROM MEDIA FILE");
//     console.log(JSON.stringify(mediaData, null, 2));

//     // TEST: get data from file
//     const info = getMediaInfo(mediaData, '55085f7ef3223c2ab8d2aed73abf764b.jpeg');
//     console.log('INFO');
//     console.log(info);

//     // TEST: filter
// //  const filtered = filter(actualData, { name: '', size: 150020, group: '', type: '' })
// //  const filtered = filter(mediaData, { name: '', size: 0, group: '2girls001', type: '', tags: [] })
//     const filtered = filter(mediaData, { name: '', size: 0, group: '', type: '', tags: ['3d', 'drawing'] })
//     console.log('FILTER (' + filtered.length + ')');
//     console.log(filtered);

//     // Test: duplicates
//     const dupes = findDuplicates(imagePath, mediaData);
//     console.log('DUPES x 2 (' + dupes.length + ')');
//     console.log(dupes);
// }

// test();