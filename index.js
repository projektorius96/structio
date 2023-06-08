const { log } = require('node:console');
const { readdirSync } = require('node:fs');
const { EOL } = require('node:os');
const { sep, normalize } = require("node:path");

function isEmpty(path) {
    return readdirSync(path).length === 0; /* most of the times should return false i.e. notEmpty */
}

const initPath = process.argv[2] || "."; // USAGE # node script_file starting_position_to_scan_at root_namespace__default=cwd e.g. node index.js ./ .
const ROOT = process.argv[3] || process.cwd().split(sep).pop();
// - credits to @https://stackoverflow.com/questions/5827612/node-js-fs-readdir-recursive-directory-search/66238097#66238097|by:Kabeer+Jaffri
const getDirRecursive = (initPath) => {
    let files = [];
    try {
        const items = readdirSync(initPath, {withFileTypes: true}); /* console.log("items=?", items); */
        for (const item of items) {
            if (!true); 
            else if ( item.isDirectory() ){
                /* console.log("isDirectory=?", `${item.path}${sep}${item.name}`); */
                files = [...files, ...getDirRecursive(`${item.path}${sep}${item.name}`)];
                // if (!isEmpty(normalize(item.path))) {
                //     files = [...files, {file: item.name, path: normalize(`${item.path}${sep}${item.name}`), levels: item.path.split(sep)/* , noFiles: item.path.split(sep) */} ]
                // }
            }
            else if (item.isFile()) {
                /* console.log("isFile=?", `${item.path}${sep}${item.name}`); */
                files = [...files, {file: item.name, path: normalize(`${item.path}${sep}${item.name}`), levels: item.path.split(sep)/* , noFiles: [] */}];
            }
            else;
        }
        return files;
    } catch (e) {
        return e;
    }
}

    getDirRecursive(initPath).forEach((currentDirentEntry, currentDirentIndex)=>{
        console.log(currentDirentEntry);
        const depth = currentDirentEntry.levels.length;
        const filename = currentDirentEntry.file;
        if (currentDirentIndex === 0 /* to control root level print */){
            process.stdout.write(ROOT);
            process.stdout.write(EOL);
        }
        // switch drawback is that depth must be know ahead of time (script must be modified to meet the needs)
        switch(depth){
            // later we would use depth as multiplier for multiple tabs to avoid semi-automatic switch statement, now leaving as is for debugging purposes:
            case 1:
                process.stdout.write(filename)
                process.stdout.write(EOL)
            break;
            case 2:
                process.stdout.write(`${currentDirentEntry.levels.slice(1, currentDirentEntry.levels.length).join(sep) + sep + filename}`)
                process.stdout.write(EOL)
            break;
            case 3:
                process.stdout.write(`\t${currentDirentEntry.levels.slice(1, currentDirentEntry.levels.length).join(sep) + sep + filename}`)
                process.stdout.write(EOL)
            break;
            DEFAULT:;
        }
    })


