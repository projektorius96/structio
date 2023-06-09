const { log } = require('node:console');
const { readdirSync, read } = require('node:fs');
const { EOL } = require('node:os');
const { sep, normalize } = require("node:path");
const s = new Set();

// - credits to @https://stackoverflow.com/questions/39217271/how-to-determine-whether-the-directory-is-empty-directory-with-nodejs|by:Russell_Chisholm
function isEmpty(path) {
    return readdirSync(path).length === 0; /* most of the times should return false i.e. notEmpty */
}

/* // USAGE:
> the following shows how to eliminate whitespace within function call (at runtime)
    * `abc${whitespace(0)}def`  := 'abcdef'
    * `abc${whitespace(4, "")}def`  := 'abcdef'
    * `abc${whitespace(0, "", " ")}def` := 'abc def'
    * `abc${whitespace(6)}def` := 'abc      def'
    * `abc${whitespace(2, ...[], " ")}def` || `abc${whitespace(2, undefined, "")}def` := 'abc  def'
    * `abc${whitespace(8, "_")}def` := 'abc________def'
*/
function whitespace(n, currentValue = "\xa0", init = ""){
    // return [...Array(n).fill(currentValue)].map((value, index)=>{
    //     let acc = "";
    //     acc += value;
    //     if (index === n-1){
    //         return str;
    //     }
    // })

    // instead optimise the returning code by leveraging built-in reducer pattern
    return [...Array(n).fill(currentValue)].reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        init
    );
}

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
                    files = [...files, {file: item.name, path: normalize(`${item.path}${sep}${item.name}${sep}`), levels: item.path.split(sep)} ]
                }
            }
            else if (item.isFile()) {
                /* console.log("isFile=?", `${item.path}${sep}${item.name}`); */
                files = [...files, {file: item.name, path: normalize(`${item.path}${sep}${item.name}`), levels: item.path.split(sep)}];
            }
            else;
        }
        return files;
    } catch (e) {
        return e;
    }
}

    getDirRecursive(initPath).forEach((currentDirentEntry, currentDirentIndex)=>{
        /* console.log(currentDirentEntry); */
        /* const levels = currentDirentEntry.levels; */
        const levels = currentDirentEntry.path.split(sep);
        const depth = levels.length;
        const relativePath = "."; // @https://learn.microsoft.com/en-gb/windows/win32/fileio/naming-a-file?redirectedfrom=MSDN#naming-conventions
        const filename = currentDirentEntry.file;
        if (currentDirentIndex === 0 /* to control root level print */){
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
                    console.log( 
                        normalize(u)
                    );
                    // - e.g. bubble sort @https://stackoverflow.com/questions/10630766/how-to-sort-an-array-based-on-the-length-of-each-element
                    (readdirSync(normalize(u))/* .sort() */).forEach((each)=>{
                        // DEV_NOTE # each could be regexed by convention e.g. if no .format then it's a directory
                        console.log(`${whitespace(normalize(u).length, "_")}${each}`);
                    })
                })
            }
        })
    })


