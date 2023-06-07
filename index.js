const { readdirSync} = require('node:fs');
const { EOL } = require('node:os');
const { sep } = require("node:path");

const initPath = process.argv[2] || "."; // USAGE # node script_file starting_position_to_scan_at root_namespace__default=cwd e.g. node index.js ./ .
const ROOT = process.argv[3] || process.cwd().split(sep).pop();
// - credits to @https://stackoverflow.com/questions/5827612/node-js-fs-readdir-recursive-directory-search/66238097#66238097|by:Kabeer+Jaffri
const getDirRecursive = (initPath) => {
    let files = [];
    try {
        const items = readdirSync(initPath, {withFileTypes: true}); /* console.log("items=?", items); */
        for (const item of items) {
            if (false){
                /* ... */
            }
            else if ( item.isDirectory() ){
                /* console.log("isDirectory=?", `${item.path}${sep}${item.name}`); */
                files = [...files, ...getDirRecursive(`${item.path}${sep}${item.name}`)];
            }
            else if (item.isFile()) {
                /* console.log("isFile=?", `${item.path}${sep}${item.name}`); */
                files = [...files, {file: item.name, path: `${item.path}${sep}${item.name}`, levels: item.path.split(sep)}];
            }
            else {
                /* ... */
            }

        }
        return files;
    } catch (e) {
        return e;
    }
}
    console.log( getDirRecursive(initPath))
    getDirRecursive(initPath).forEach((entry, index)=>{
        /* console.log(entry); */
        const depth = entry.levels.length;
        const filename = entry.file;
        if (index === 0){
            process.stdout.write(ROOT);
            process.stdout.write(EOL);
            process.stdout.write(sep + entry.levels.slice(1, entry.levels.length).join(sep) /* + "\r\n\t" */ + filename);
            process.stdout.write(EOL);
        }
        if (index > 0 /* === isDirectory */){
            if (depth === 1) {
                process.stdout.write(sep + entry.levels.slice(1, entry.levels.length).join(sep) /* + "\r\n\t" */ + filename);
                process.stdout.write(EOL);
            }
            else {
                process.stdout.write(sep + entry.levels.slice(1, entry.levels.length).join(sep) + sep /* + "\r\n\t" */ + filename);
                process.stdout.write(EOL);
            }
        }
        // entry.levels.forEach((pathspec, currentDepth)=>{
        //     console.log("pathspec", entry.levels);
        //     if (false){/* ... */}
        //     else if (depth === 1 /* === isFile */) {
        //         process.stdout.write(`depth:===${currentDepth}===${pathspec}` + filename);
        //         process.stdout.write(EOL);
        //     }
        //     else if (depth > 1 /* === isDirectory */) {
        //         process.stdout.write(`depth:===${currentDepth}===${pathspec}`);
        //         process.stdout.write(EOL);
        //     }
        //     else {/* ... */}
        // })
    })


