# TypeScriptLib

TypeScript common lib    ( Laya 、 Fairygui)


### npm使用方式 ###
在package.json 文件中添加命令

```json
{
  "dependencies": {
    "gameLib": "git+ssh://github.com/用户名/仓库名.git#37d5336"
  }
}
```


```json
{
  "dependencies": {
    "gameLib": "git+ssh://github.com/用户名/仓库名.git#semver:1.0.2"
  }
}
```




可以使用以下命令安装全局 github url 指定版本模板：
```npm
npm install -g github:username/repo-name#tag
```
其中，username为Github用户名，repo-name为仓库名称，tag为标签名称。

例如，安装全局的TypeScriptLib模板的1.0.3版本可以使用以下命令：

````npm
npm install -g github:用户名/仓库名#semver:1.0.3
````

这样就可以在任何地方使用TypeScriptLib模板的1.0.3版本创建项目了。


### 使用gitee仓库 ###


在npm中使用gitee仓库的地址进行安装，例如：
````
{
"dependencies": {
"模板名称": "git+https://gitee.com/用户名/仓库名.git#标签版本号"
或ssh
"模板名称": "git+ssh://git@gitee.com:用户名/仓库名.git#semver:标签版本号"
}
````

````npm
npm install username/repository
````
其中，"username"是gitee账号的用户名，"repository"是仓库的名称。

如果您的gitee仓库中包含特定版本的代码，您可以在安装时指定版本号，例如：

````npm
npm install username/repository#版本号
````
其中，"版本号"是您想要安装的代码版本号。