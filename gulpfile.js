'use strict'

const gulp = require("gulp")
const minify = require('gulp-minify')
const inject = require("gulp-inject-string")
const ts = require('gulp-typescript')
const concat = require('gulp-concat')
const del = require("del")
const each = require("gulp-each")
const babel = require('gulp-babel')
const fs = require('fs')
const http = require('https')
const zlib = require('zlib')
const AdmZip = require('adm-zip')

const tsProject = ts.createProject('tsconfig.json')
// 需要添加到最前面的类
let beforeTs = ["src/com/core/View.ts", "src/com/core/Proxys.ts", "src/com/core/BaseView.ts", "src/com/utils/ChangeValue.ts", "src/com/utils/UtilsTool.ts"]

gulp.task("clean", () => {
    return del(["bin/**/*.*", "!bin/*.html", "!bin/webp"], {force: true})
})

gulp.task('createTS', () => {
    if (!fs.existsSync("bin/temp")) {
        fs.mkdirSync("bin/temp")
    }
    return gulp.src(beforeTs.concat(["src/**/*.ts", "!**/*.d.ts"]))
        .pipe(each(function (content, file, callback) {
            // console.log(file.history[0])
            let contents = content.split('\n')
            let arr = []
            let newContent = []
            for (let line of contents) {
                // if (line.startsWith("declare namespace ")) {
                //     break
                // } else
                if (line.startsWith("import ")) {
                    if (!line.match(/((\s|})from(\s|"|{))/g) && line.indexOf("=") > -1) {
                        arr.push(line)
                    }
                } else {
                    if (arr.length === 0) {
                        newContent.push(line)
                        continue
                    }
                    for (let i = 0; i < arr.length; i++) {
                        let tar = arr[i].substring(arr[i].indexOf("import ") + 6, arr[i].indexOf("=")).trim()
                        let reg = new RegExp("(?<=\\s|:|\\(|!|<|\\[)" + tar + "(?=\\s+?|\\.|\\[|,|\"|\\(|\\)|;|,|>|$)", "g")
                        if (reg.test(line)) {
                            let endIndex = arr[i].lastIndexOf(".")
                            let newC = arr[i].substring(arr[i].lastIndexOf("=") + 1, endIndex).trim()
                            let value = reg.exec(line)
                            line = line.replace(reg, newC + "." + tar)
                        }
                    }
                    newContent.push(line)
                }
            }
            callback(null, newContent.join("\n"))
        }))
        .pipe(concat("d.ts"))
        // .pipe(inject.replace("export\s+(?=class|enum|interface|const)", ""))
        .pipe(inject.prepend('namespace coreLib {\n'))
        .pipe(inject.append('\n}'))
        .pipe(gulp.dest("bin/temp"))
})

gulp.task('createJs', () => {
    return gulp.src(["bin/temp/d.ts", "libs/**/*", "src/**/*.d.ts"])
        .pipe(tsProject())
        .js
        .pipe(concat("gameCore.js"))
        .pipe(inject.replace('var coreLib;', ''))
        .pipe(inject.prepend('window.coreLib = {};\n'))
        // .pipe(babel({presets: ['@babel/preset-env']}))
        .pipe(minify({ext: {min: ".min.js"}}))
        .pipe(gulp.dest('bin'))
})

gulp.task('createDTs', () => {
    return gulp.src(["bin/temp/d.ts", "libs/**/*", "src/**/*.d.ts"])
        .pipe(tsProject())
        .dts
        .pipe(concat("gameCore.d.ts"))
        .pipe(gulp.dest('bin'))
})

gulp.task('dtsAppend', (cd) => {
    fs.appendFileSync("bin/gameCore.d.ts", "\n\n" + fs.readFileSync("src/com/define.d.ts"))
    return cd()
})

gulp.task('removeTemp', () => {
    return del(["bin/temp/"], {force: true})
})

//完整构建
gulp.task('build', gulp.series("clean", 'createTS', "createJs", "createDTs", "dtsAppend", (cb) => {
    gulp.series("removeTemp")()
    return cb()
}))
// gulp.task('build', gulp.series("clean", 'createTS', "createJs", "createDTs", "dtsAppend", "removeTemp"))


let downloadWebp = "https://storage.googleapis.com/downloads.webmproject.org/releases/webp/libwebp-1.3.0-windows-x64.zip"
const filePath = 'bin/webp' // 下载文件的路径

gulp.task("updateWEBP", (done) => {
    // 创建http请求
    http.get(downloadWebp, (res) => {
        let downloadZip = filePath + "/file.zip"
        // 创建写入文件的流
        const fileWriteStream = fs.createWriteStream(downloadZip)
        // 如果压缩文件被gzip压缩，则创建解压流
        const unzipStream = res.headers['content-encoding'] === 'gzip' ? zlib.createGunzip() : null

        // 将响应流和解压流连接起来
        const responseStream = unzipStream ? res.pipe(unzipStream) : res

        // 将响应流和写入文件的流连接起来
        responseStream.pipe(fileWriteStream)

        // 监听下载完成事件
        fileWriteStream.on('finish', () => {
            console.log('下载完成, 开始解压')
            fs.unlinkSync(filePath + "/bin")
            // 创建AdmZip对象
            const zip = new AdmZip(downloadZip)
            // 解压zip文件到指定文件夹
            zip.extractEntryTo("libwebp-1.3.0-windows-x64/bin/", filePath + "/bin", false)
            fs.unlinkSync(downloadZip)
            // zip.extractAllTo(filePath, true)
            console.log('解压完成')

        })
    }).on('error', (error) => {
        console.error(`下载失败: ${error.message}`)
    })
    done()
})