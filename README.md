# **Project name: structio**

> **PAY ATTENTION** : tested only on Windows 10/11 (x64) !

> **SIGNATURE** node\[.exe\] script_file.\[m\]js \<dir-to-scan> \<outdir>
>
> \<dir-to-scan> - directory to start initial scan \[**required**\]
>
> \<root-namespace> - custom root namespace \[\[optional\]\] ; defaults to current working directory (cwd)

**Example**: `node index.mjs sample "."`

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

> WINDOWS USERS : **MUST** suffix node with **.exe**, thus `node.exe` for Node.js standalone runtime to avoid stderr  : "stdout is not a tty" !
