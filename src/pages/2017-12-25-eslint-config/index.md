---
title: 使用ESLint提高代码质量
date: "2017-12-25T22:22:22.169Z"
path:  "/eslint-config"
tags:
   - javascript
   - web
---

- 格式化JS代码,统一代码风格
- 分析JS代码,提前发现问题,提高代码质量

## 安装ESLint
```bash
# 安装依赖,需要node版本大于4.0,npm版本大于2.0
npm install eslint --save-dev

# 初始化配置文件 
./node_modules/.bin/eslint --init

# 分析JS代码
./node_modules/.bin/eslint yourfile.js
```

## 配置ESLint

- ESLint使用支持多种格式的配置文件,可是以JavaScript,JSON或YAML
- 配置的内容可以写在`.eslintrc.*`文件,也可以写在`package.json`文件内的`eslintConfig`域下面
- 配置文件一般放在工程的根目录,若无法找到将使用`~/`下的
- 可以通过命令行指定配置文件`eslint -c myconfig.json myfiletotest.js`
- 配置文件的应用范围是根目录下的所有文件和文件夹,若子文件夹中有其他的配置文件,会优先使用子文件夹中的
- 配置信息大致分为以下几种:
  1. Environments: 运行环境的信息,每个环境将会自带一些默认的全局变量信息
  2. Globals: 全局变量,运行时可以访问到的变量
  3. Rules: 规则,定义每种规则的报错等级

### 指定解析器选项(Parser Options)

- Parser Options用于指定JavaScript的版本,默认的指定版本是ECMAScript5,通过修改解析器选项可以指定为其他版本
- 支持JSX不等同于支持React,后者有自己的特殊语法,若要支持React可使用插件[eslint-plugin-react](https://github.com/yannickcr/eslint-plugin-react)
- 支持ES6的语法不代表支持新的ES6的全局变量(例如新的类型`Set`).  
  若要支持ES6的语法:`{ "parserOptions": { "ecmaVersion": 6 } }`;
  若要支持ES6的全局变量: `{ "env": { "es6": true } }`,使用这个会自动支持ES6的语法
- 详细配置如下:
  - ecmaVersion - 指定支持哪个版本的JavaScript语法,值为3,5(默认),6,7,8,或者2015(6),2016(7)..
  - sourceType - 是否使用模块,`script`(默认)或者 `module` 
  - ecmaFeatures - 使用哪些附加的功能
    - globalReturn 是否支持在全局域中使用return
    - impliedStrict 是否支持严格模式(当ecmaVersion>=5时生效)
    - jsx 是否支持JSX
    - experimentalObjectRestSpread 是否支持[rest/spread](https://github.com/yannickcr/eslint-plugin-react)语法

例子
```json
{
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true
        }
    },
    "rules": {
        "semi": 2
    }
}
```

### 指定解析器(Parser)
ESLint支持一下几种解析器
- [Espree](https://github.com/eslint/espree) 默认使用
- [Esprima](https://www.npmjs.com/package/esprima)
- [babel-eslint](https://www.npmjs.com/package/babel-eslint) 包装了[Babel](http://babeljs.io/)以适应ESLint

### 指定环境(Environments)
运行环境的信息,每个环境将会自带一些默认的全局变量信息,支持配置以下环境:
- browser - 浏览器环境变量
- node - Node.js的全局变量
- commonjs - CommonJS global variables and CommonJS scoping (use this for browser-only code that uses Browserify/WebPack).
- shared-node-browser - Node.js和Browser同时拥有的变量
- es6 - ECMAScript6的变量,除了modules
- jest - Jest global variables.
- jquery - jQuery的全局变量
- prototypejs - Prototype.js的全局变量
- shelljs - ShellJS的全局变量
- mongo - MongoDB的全局变量

以上环境不是互斥的,可以一次指定多个.环境信息不仅可以在配置文件中指定,也可以在代码文件中指定
```javascript
/* eslint-env node, mocha */
// 上面的注释表示此文件支持Node.js和Mocha两个环境
```
环境信息的配置示例
```json
{
    "env": {
        "browser": true,
        "node": true
    }
}
```

### 指定全局变量
检查规则`Undeclared Variables(no-undef)`会警告使用未声明的变量,指定全局变量可以使得它们通过这个检查,
全局变量也可以在文件头中指定
```javascript
/* global var1, var2 */
```
```javascript
/* global var1:false, var2:false */
```
使用`true`或`false`表示是否支持这个全局变量,配置示例:
```json
{
    "globals": {
        "var1": true,
        "var2": false
    }
}
```

### 配置ESLint插件(Plugins)
ESLint支持使用第三方插件,前提是其已经使用npm安装在本地.
通过字段`plugins`可以声明所有的插件,插件名字中的`eslint-plugin-`可以省略.
配置示例:
```json
{
    "plugins": [
        "plugin1",
        "eslint-plugin-plugin2"
    ]
}
```

### 配置规则(Rule)
ESLint支持许多的检查规则,每种规则都有三种报错等级:
- `off`或`0` - 不使用此规则
- `warn`或`1` - 警告
- `error`或`2` - 报错(返回错误码`1`)

若一个规则有一个额外的配置选项,则可以使用一个数组来配置它,
配置示例:
```json
{
    "rules": {
        "eqeqeq": "off",
        "curly": "error",
        "quotes": ["error", "double"]
    }
}
```

### 扩展(Extend)配置文件
一个配置文件能扩展自其他的基本配置文件,字段`extends`可以包含一个字符串或字符串数组.  
`rules`字段可以更改或者覆盖基本配置文件中的规则
- 派生的rule配置会改变基本配置中的报错等级,但会继承其他可选配置
  - 基本配置 `"eqeqeq": ["error", "allow-null"]`
  - 派生配置 `"eqeqeq": "warn"`
  - 结果 `"eqeqeq": ["warn", "allow-null"]`
- 派生的rule配置可以覆盖可选配置
  - 基本配置 `"quotes": ["error", "single", "avoid-escape"]`
  - 派生配置 `Derived config: "quotes": ["error", "single"]`
  - 结果 `"quotes": ["error", "single"]`

### 忽略文件和目录


## 参考资料
[EsLint官网](https://eslint.org/)