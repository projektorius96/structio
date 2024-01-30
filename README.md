# **Project name: structio**

> **SIGNATURE** node\[.exe\] script_file.\[m\]js \<dir-to-scan> \<outdir>, whereas each \<argv> is as follows:
>
> \<dir-to-scan> : directory to scan
>
> \<root-namespace default=structio> : the directory to output the \<dir-to-scan> under

**Example**: `node index.mjs folder-to-scan "."`

```diff
.
sample\
       .gitignore
       intermediate\
       shoes.txt
sample\intermediate\
                    body.txt
                    head\
sample\intermediate\head\
                         helmet.txt
```

---

### **FAQ**

> WINDOWS USERS : MUST suffix node with .exe, thus `node.exe` for Node.js standalone runtime to avoid stderr output as follows : "stdout is not a tty";
