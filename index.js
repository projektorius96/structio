const { log } = require('node:console');
const { readdirSync } = require('node:fs');
const { EOL } = require('node:os');
const { sep, normalize } = require("node:path");

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
        const normalizedPath = currentDirentEntry.path;
        const filename = currentDirentEntry.file;
        if (currentDirentIndex === 0 /* to control root level print */){
            process.stdout.write(ROOT);
            process.stdout.write(EOL);
        }
        levels.forEach((value, index)=>{
            console.log(whitespace(1+index, "|"));
            if (depth-1 === index){
                // if (value === ""){
                //     process.stdout.write(whitespace(index))
                // }
                process.stdout.write(`${relativePath}${sep}${normalizedPath}`);
                process.stdout.write(EOL);
            }
        })
    })


