# TypeScriptLib

TypeScript common lib    ( Laya 、 Fairygui)

Enhance the functionality of native components

### npm使用方式 ###
在package.json 文件中添加命令

```json
{
  "dependencies": {
    "game-lib": "git+ssh://github.com/用户名/仓库名.git#标签版本号或分支名字"
  }
}
```
或查找标签或者发布版本号为1.0.2的commit
```json
{
  "dependencies": {
    "game-lib": "git+ssh://github.com/用户名/仓库名.git#semver:1.0.2"
  }
}
```
更新
添加新的tag 在执行
````
npm update game-lib
````

### 使用gitee仓库 ###


在npm中使用gitee仓库的地址进行安装，例如：
````
{
"dependencies": {
"模板名称": "git+https://gitee.com/用户名/仓库名.git#标签版本号或分支名字"
或ssh
"模板名称": "git+ssh://git@gitee.com:用户名/仓库名.git#semver:标签版本号"
}
````

~~如果您的gitee仓库中包含特定版本的代码，您可以在安装时指定版本号，例如：~~

~~npm install git@gitee.com:bogegit/TypeScriptLib.git#46db9be3~~







### 使用 webp ###

```
const {webp} = require("game-lib")

webp.cwebp('temp/img/a.jpg', 'temp/img/a.jpg.webp', '-q 60')

```


### 使用 Gulp 生成 ###
```js

const gulp = require("gulp")
const {buildLibrary, clean} = require("game-lib")

gulp.task("clean", () => {
    return clean(["dist"])
})

function buildLib(done) {
    buildLibrary({
        src: {
            globs: ["src/**/*.ts"],
        },
        outName: project,
        dist: "./bin",
        namespace: project,
        js: {isMinify: true},
        dts: {
            globalDtsFile: ["./src/define.d.ts", "./src/entity.d.ts"]
        }
    }, function () {
        done()
    })
}
gulp.task('build', gulp.series("clean", buildLib))

```


### 使用 rollup 生成 ###
```js

const gulp = require("gulp")
const {rollupPack, clean} = require("game-lib")

gulp.task("clean", () => {
    return clean(["dist"])
})

function buildLib(done) {
    rollupPack("src/com/Main.ts", "main.min.js", {
        outDir: "./dest",
        minify: true
    })
}
gulp.task('build', gulp.series("clean", buildLib))


```

