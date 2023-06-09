# **structio** : zero-deps recursive project layout printer [production-not-ready!]

> **PREREQUISITES** : <br>
It considers that script is run from package level i.e. the directory containing package.json

> Run a process to print to stdout <br>
**USAGE** # node script_file starting_position_to_scan_at root_namespace__default=cwd e.g. node index.js ./ . 
<br>
`node index.js ./pseudo_root .\\structio`

> Redirect so to save to file
> NOTE: Windows users MUST suffix .exe for node standalone runtime to avoid stderr as "stdout is not a tty"
<br>
`node.exe index.js ./pseudo_root .\\structio >> file_name_to_save_stdout_to.txt `

<br>

Cheers !