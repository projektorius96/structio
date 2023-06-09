const { readdirSync } = require('node:fs');
const { EOL } = require('node:os');
const { sep, normalize } = require("node:path");

// - credits to @https://stackoverflow.com/questions/39217271/how-to-determine-whether-the-directory-is-empty-directory-with-nodejs|by:Russell_Chisholm
function isEmpty(path) {
    return readdirSync(path).length === 0; /* most of the times should return false i.e. notEmpty */
}

/**
@description 

    ### USAGE the following shows how to eliminate whitespace within function call (at runtime)

    * `abc${whitespace(0)}def`  := 'abcdef'
    * `abc${whitespace(4, "")}def`  := 'abcdef'
    * `abc${whitespace(0, "", " ")}def` := 'abc def'
    * `abc${whitespace(6)}def` := 'abc      def'
    * `abc${whitespace(2, ...[], " ")}def` || `abc${whitespace(2, undefined, "")}def` := 'abc  def'
    * `abc${whitespace(8, "_")}def` := 'abc________def'
*/
function whitespace(n, currentValue = "\xa0", init = ""){

    // instead optimise the returning code by leveraging built-in reducer pattern
    return [...Array(n).fill(currentValue)].reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        init
    );
}

/**
 * ...
 */
// function cursorPosDeterm(arr){
//     let len = arr.reduce((acc, current)=>(acc + current));
//     return len.length;
// }


const initPath = process.argv[2] || ".";
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
                if (!isEmpty( normalize(item.path) )) {
                    /* console.log("isEmptyDirectory=?", `${item.path}${sep}${item.name}`); */
                    files = [...files, {file: {endpoint: item.name, isEmpty: true}, path: normalize(`${item.path}${sep}${item.name}${sep}`), levels: item.path.split(sep)} ]
                }
            }
            else if (item.isFile()) {
                /* console.log("isFile=?", `${item.path}${sep}${item.name}`); */
                files = [...files, {file: {endpoint: item.name, isEmpty: false}, path: normalize(`${item.path}${sep}${item.name}`), levels: item.path.split(sep)}];
            }
            else;
        }
        return files;
    } catch (e) {
        return e;
    }
}
    const s = new Set();
    getDirRecursive(initPath).forEach((currentDirentEntry, currentDirentIndex)=>{
        /* console.log(currentDirentEntry); */
        /* const levels = currentDirentEntry.levels; */
        const levels = currentDirentEntry.path.split(sep);
        const depth = levels.length;
        /* const relativePath = ".";  *///@https://learn.microsoft.com/en-gb/windows/win32/fileio/naming-a-file?redirectedfrom=MSDN#naming-conventions
        if (currentDirentIndex === 0 /* to control root level  */){
            process.stdout.write(ROOT);
            process.stdout.write(EOL);
        }
        levels.forEach((value, index)=>{
            const normalizedDirname = `${normalize(levels.slice(0, -1).join(sep))}${sep}`;
            s.add(normalizedDirname + sep)
            const a = Array.from(s)
            if (depth-1 === index && getDirRecursive(initPath).length-1 === currentDirentIndex){
                /* console.log(a); */ // DEV_NOTE # scan each unique path level with readdirSync and see if it contains any of files, if so print them, also each level index will denote level
                a.forEach((u)=>{
                    process.stdout.write(normalize(u))
                    process.stdout.write(EOL)
                    readdirSync(normalize(u), {withFileTypes: true}).forEach((each)=>{
                        /* process.stdout.write(`${whitespace(normalize(u).length)}${each.file.isEmpty ? each.file.endpoint + sep : each.file.endpoint}`) */// line^1
                        /* process.stdout.write(EOL) */
                        process.stdout.write(`${whitespace(normalize(u).length)}${each.isDirectory() ? each.name + sep : each.name}`)
                        process.stdout.write(EOL)
                    })
                })

            }
        })
    })


