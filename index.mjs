import { readdirSync } from 'node:fs';
import { sep, normalize } from 'node:path';
import { EOL } from 'node:os';

// - credits to @https://stackoverflow.com/questions/39217271/how-to-determine-whether-the-directory-is-empty-directory-with-nodejs|by:Russell_Chisholm
/**
 * @param {*} path 
 * @returns 
 */
function isEmpty(path) {
    return (
        readdirSync(path).length === 0
    );
}

/**
* @example
* - `abc${whitespace(1)}def` := 'abc def'
* - `abc${whitespace(2, "_")}def` := 'abc__def'
* - `abc${whitespace(3, "x", "<", ">")}def` := 'abc<x>def'
* @returns {String} prepended [& appended] with placeholder symbol (char)
*/
function whitespace(n, currentValue = "\xa0", prefix = "", suffix = ""){
    return [...Array(n).fill(currentValue)].reduce(
        function(accumulator, currentValue, currentIndex){
            const condition = accumulator + currentValue;
            if (currentIndex === n-1 && suffix.length > 0){
                return condition + suffix;
            }
            return condition;
        },
        prefix
    ); 
}

const s = new Set();
const initPath = process.argv[2] || ".";
const ROOT = process.argv[3] || process.cwd().split(sep).pop();

/**
 * Credits {@link https://stackoverflow.com/questions/5827612/node-js-fs-readdir-recursive-directory-search/66238097#66238097|by:Kabeer+Jaffri}
 * @param {String} initPath - initial "pathspec" (directory) to run against
 * @returns {Array} entries[]
 */
const getDirRecursive = (initPath) => {
    let files = [];
    try {
        const items = readdirSync(initPath, {withFileTypes: true}); /* console.log("items=?", items); */// [PASSING]
        for (const item of items) {
            if (!true); 
            else if ( item.isDirectory() ){
                /* console.log("isDirectory=?", `${item.path}${sep}${item.name}`); */// [PASSING]
                files = [...files, ...getDirRecursive(`${item.path}${sep}${item.name}`)];
                if (!isEmpty( normalize(item.path) )) {
                    /* console.log("isEmptyDirectory=?", `${item.path}${sep}${item.name}`); */// [PASSING]
                    files = [...files, {file: {endpoint: item.name, isEmpty: true}, path: normalize(`${item.path}${sep}${item.name}${sep}`), levels: item.path.split(sep)} ]
                }
            }
            else if (item.isFile()) {
                /* console.log("isFile=?", `${item.path}${sep}${item.name}`); */// [PASSING]
                files = [...files, {file: {endpoint: item.name, isEmpty: false}, path: normalize(`${item.path}${sep}${item.name}`), levels: item.path.split(sep)}];
            }
            else;
        }
        return files;
    } catch (e) {
        throw e;
    }
}

getDirRecursive(initPath).forEach((currentDirentEntry, currentDirentIndex)=>{
    /* console.log(currentDirentEntry); */// [PASSING]
    /* const levels = currentDirentEntry.levels; */// [PASSING]
    const levels = currentDirentEntry.path.split(sep);
    const depth = levels.length;

    /* DEV_NOTE # to control the ROOT level */// [PASSING]
    if (currentDirentIndex === 0){
        process.stdout.write(ROOT);
        process.stdout.write(EOL);
    }

    levels.forEach((_, index)=>{
        const normalizedDirname = `${normalize(levels.slice(0, -1).join(sep))}${sep}`;
            s.add(normalizedDirname + sep)
        const a = Array.from(s)
        /* DEV_NOTE # scans each unique path level with readdirSync and see if it contains any of files, if yes – prints them, also returns each level index that denotes the level of recursion; */// [PASSING]
        if (depth-1 === index && getDirRecursive(initPath).length-1 === currentDirentIndex){
            a.forEach((u)=>{
                process.stdout.write(normalize(u))
                process.stdout.write(EOL)
                readdirSync(normalize(u), {withFileTypes: true}).forEach((each)=>{
                    process.stdout.write(`${whitespace(normalize(u).length)}${each.isDirectory() ? each.name + sep : each.name}`)
                    process.stdout.write(EOL)
                })
            })
        }
    })
})


