---
title: 置顶按钮的实现
date: "2017-11-21T22:22:22.169Z"
path:  "/back-to-top-button"
tags:
   - web
   - javascript
---


置顶按钮是大部分网站都会有的一个功能，尤其是阅读型网站（如知乎，微博）。
当网页长度过长，用户在浏览到网页底部的时候想返回顶端，此时置顶按钮可以帮助用户快速
到达顶端，而不是通过多次滚动滑轮或者是手动调整滚动条。  

Github上有许多关于置顶按钮的前端类库，但是为了这么小的一个功能，特意去引入一个类库
感觉有点没必要，于是准备自己实现一个。

## 按钮的样式
本网站的前端样式很多是参考了知乎的主页，知乎的置顶按钮长得也比较讨喜，
于是参考其CSS在界面上先实现出来，基本的特点就是固定位置，位于页面底部。
```css
.corner-container {
 position: fixed;
 bottom: 12px;
 right: 12px;
}
```

## 获取滚动条的位置
由于Webkit对于滚动条的位置没有按照标准处理,所以需要自己实现一个函数获得正确的`scrollingElement`
在参考了以下[文章](https://imququ.com/post/document-scrollingelement-in-chrome.html)之后,
使用以下语句获得`scrollTarget`,以下代码在chrome,edge和IE11下均能正常工作. 
```javascript
var scrollTarget = document.scrollingElement || document.documentElement
```
获得了正确的`scrollTarget`之后,通过`scrollTarget.scrollTop`可以获取滚动条的偏移位置,
而对其的直接赋值则可以修改滚动条的位置



## 什么时候显示置顶按钮
置顶按钮不是时刻都要显示的，若当前显示的页面已经是网页的顶端，那么点击置顶按钮是没有意义的，
所以需要将其隐藏. 对于**网页顶端**,我倾向于这样定义: 若用户通过转动一圈鼠标滚轮可以到达
网页顶部,那么这个位置可被认定为网页顶端.   
在代码中,可以通过一个`offset`常量来定义:
```javascript
  this.offsetTop = 150;
  onScroll = () => {
    this.setState({show: this.scrollTarget.scrollTop > this.offsetTop});
  };
```
实现效果:
- 滚动条移动时刷新置顶按钮的状态
- 若当前页面不在网页顶端,才显示置顶按钮


## 滚动条运动: 步长固定
在拿到`scrollingElement`之后,通过`scrollTarget.scrollTop = 0`可以直接让页面跳到顶端,
但是这样的变化感觉有点突兀.参照知乎的设计,页面是平稳地滚动到顶端,有类似于动画的效果.
此效果可以用`setTimeout`实现,代码如下:
```javascript
  onClick = () => {
    this.scrollUp(100);
  };

  scrollUp = (size = 100) => {
    let nextScrollTop = this.scrollTarget.scrollTop - size;
    this.scrollTarget.scrollTop = nextScrollTop > 0 ? nextScrollTop : 0;
    if (this.scrollTarget.scrollTop > 0) {
      setTimeout(this.scrollUp, 1000 / 60);
    }
  };
```
实现效果
- 自定义运动步长: 每次向上滚动一定距离
- 刷新频率固定: 一秒钟向上滚动60次

## 滚动条运动: 总时间固定
上面实现的滚动条定长运动基本完成了置顶按钮的功能,但是有一个小缺陷,当需要滚动的距离很长时,
置顶操作需要花费较长的时间. 如果简单地增大步长,则在滚动距离较小的时候失去了动画效果.
经过一番实验,发现其实需要实现的是一个*总时间固定*的动画效果,代码如下:
```javascript
  onClick = () => {
    this.scrollUpBaseTime(100, 60);
  };

  scrollUpBaseTime = (ms, refreshRate) => {
    let stepSize = this.scrollTarget.scrollTop / refreshRate;
    this.scrollUp(stepSize, ms / refreshRate);
  };

  scrollUp = (size, ms) => {
    let nextScrollTop = this.scrollTarget.scrollTop - size;
    this.scrollTarget.scrollTop = nextScrollTop > 0 ? nextScrollTop : 0;
    if (this.scrollTarget.scrollTop > 0) {
      setTimeout(this.scrollUp, ms, size, ms);
    }
  };
```
实现效果
- 自定义刷新频率
- 自定义总的运动时间

