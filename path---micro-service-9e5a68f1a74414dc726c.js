webpackJsonp([0xb6b864107df80800],{"./node_modules/json-loader/index.js!./.cache/json/micro-service.json":function(i,e){i.exports={data:{site:{siteMetadata:{title:"Note Site",author:"stone"}},markdownRemark:{id:"/home/peng/develop/workspace/stone-site/src/pages/2017-12-13-micro-service/index.md absPath of file >>> MarkdownRemark",html:'<h3 id="microservices-起源"><a href="#microservices-%E8%B5%B7%E6%BA%90" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Microservices 起源</h3>\n<p>2014 年,James 和 Martin 合作发表了一篇名为<a href="https://martinfowler.com/articles/microservices.html">Microservices</a>\n的文章,详细探讨了当时正流行起来的一种服务架构模式—microservice,并出以下定义:</p>\n<blockquote>\n<p>In short, the microservice architectural style is an approach to\ndeveloping a single application as a suite of small services,\neach running in its own process and communicating with lightweight\nmechanisms, often an HTTP resource API</p>\n</blockquote>\n<p>经过这几年的发展,微服务已经称为架构模式中最火热的名词之一,很多公司已经在实践了</p>\n<h3 id="整体式架构monolithic-architecture"><a href="#%E6%95%B4%E4%BD%93%E5%BC%8F%E6%9E%B6%E6%9E%84monolithic-architecture" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>整体式架构(Monolithic Architecture)</h3>\n<p>传统的 Web 应用通常分为以下三个部分:</p>\n<ol>\n<li>客户端界面: 包含 HTML 页面和在用户的浏览器运行的 JavaScript</li>\n<li>服务器: 用于接受客户端请求,执行业务逻辑,与数据库交互,返回合适的 HTML 到客户端</li>\n<li>数据库: 用于持久化数据,通常是关系型数据库</li>\n</ol>\n<p>在整体式架构中,服务器部分是一个整体,有以下特点:</p>\n<ol>\n<li>一个请求的所有工作都在服务器的单一进程中执行</li>\n<li>业务的划分主要通过语言内部的支持:包(package),类(class),方法(function)</li>\n<li>只能水平扩展:运行多个服务器,用 load-balancer 分发请求</li>\n</ol>\n<p>整体式架构适合于小型系统,但是当用户数量上升和业务逻辑复杂化了之后,它的缺点也比较明显:</p>\n<ol>\n<li>难以部署,任何一个小改动都需要重新部署所有服务器</li>\n<li>难以合作开发,没有模块化的概念,代码容易耦合,任何改动都容易影响到其他逻辑</li>\n<li>难以扩展,出现性能瓶颈之后只能水平扩展,但是 DB 的问题无法解决</li>\n</ol>\n<p>\n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; "\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 61.1764705882353%;position: relative; width: 100%; bottom: 0; left: 0; background-image: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAMCAYAAABiDJ37AAAACXBIWXMAAAsTAAALEwEAmpwYAAACqUlEQVQoz3WSb0gTcRjHzwytKLLMCqmsKAIJ3Jt8EVIUUdCb3vdGehEEmkVif9QYipYmaUwlEypN57ntPHUbc3O7c7fb3f7dmi49zWtuMweC4IsgFoU8/W5eJBc98OH3/O6+v+89v+c5DMOwnYi9iD3KulvO37fUHl91u8dWZjgTthm5ikYNluAsBt46XPnOPWjDFJPDCvmIQsQBo67p7FpUAlPE+0MxzEOcQBQpmj9ncpJRX0OYsvYGQ1N92P+C0DUWJPwhbXjaW6882q5UmYPYptYnKf4bZ8avyfkORIFcFeIg4pDSBnVkI/Ypt8hXzsjrfrV+V21FueaV9v5FmbJzJcdMr5tLqKFOjeVtm0ZTfDpb0cmH8p5W3SptfVJxubnmzpWTRwuPvKyvKpO1Iz3PNeh9VkYpusm1VMAMknccnHrd468fXSDvYywJN65eyN/y8Zw5l2FD9Fjgk30QDN3NlQQ1AIvMKMw4cFBagmESM7me/ByHWcENLNFTv+oPwsJKChJ+m9owN4Y0ks8Bi/wEjPW+uCfOsJAQaBCZsb+G4iS5zjEWkIJ2mBrufrRoISEoshDnzRvXL53P22roCvlg3uOAyDgJeGdTBRONgOiwwrSd/JUZWGlJcZb9Q8dDZKS19bVrUT9PybkM3tlYpRpM1kCHVku+aWkzdje1Vt++eYboedYq74d0jQ2Z6bfV3S1KBpyQ8qEK2VGg8K66uJ+CZX4cog59UmWYm+AtEAtSINFGGEVXXqY5cLAmYCjD5pV1DQ+KUl4W/PEYLAXsmR6usCFglhZApI3/GH4JeUDi7bDATWZ6KIQ5iPisEKJNm4ZyhfM2AsKCC+Zo4ieNd1VHzSMghJ0gWPtn1YbckD4tTBBpj77ve3+7tjwQ8KQpJ552mfvX5J//N2rReXPCwGFcAAAAAElFTkSuQmCC\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="sketch"\n        title=""\n        src="/static/4b5916740b8761bc5ceec516ee4fb484-a408b.png"\n        srcset="/static/4b5916740b8761bc5ceec516ee4fb484-4eabf.png 148w,\n/static/4b5916740b8761bc5ceec516ee4fb484-5a375.png 295w,\n/static/4b5916740b8761bc5ceec516ee4fb484-a408b.png 590w,\n/static/4b5916740b8761bc5ceec516ee4fb484-94207.png 850w"\n        sizes="(max-width: 590px) 100vw, 590px"\n      />\n    </span>\n  </span>\n  </p>\n<h3 id="面向服务架构service-oriented-architecture-soa"><a href="#%E9%9D%A2%E5%90%91%E6%9C%8D%E5%8A%A1%E6%9E%B6%E6%9E%84service-oriented-architecture-soa" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>面向服务架构(Service-Oriented Architecture, SOA)</h3>\n<p>微服务刚兴起的时候,许多人都觉得这只是 SOA 的另一个名字.SOA 概念的形成时间要比 Microservices 早十年左右,\nMartin(还是那个人)在 2005 年发表过一篇<a href="https://martinfowler.com/bliki/ServiceOrientedAmbiguity.html">文章</a>\n对其进行阐述.\n支撑 SOA 的关键是其消息传输架构—企业服务总线(ESB,Enterprise Service Bus),它是对多样系统中的服务调用者和服务提供者的解耦.</p>\n<blockquote>\n<p>ESB 是传统中间件技术与 XML、Web 服务等技术相互结合的产物，用于实现企业应用不同消息和信息的准确、高效和安全传递.同时它还可以消除不同应用之间的技术差异，让不同的应用服务器协调运作，实现了不同服务之间的通信与整合</p>\n</blockquote>\n<p>ESB 的基本功能</p>\n<ol>\n<li>服务的 MetaData 管理:在总线范畴内对服务的注册命名及寻址进行管理</li>\n<li>传输服务:确保通过企业总线互连的业务流程间的消息的正确交付,还包括基于内容的路由功能</li>\n<li>中介:提供位置透明的路由和定位服务,提供多种消息传递形式,支持广泛使用的传输协议</li>\n<li>多服务集成方式:如 JCA,Web 服务,Messaging,Adapter 等</li>\n<li>服务和事件管理支持:调用服务的记录、测量和监控数据;提供事件检测、触发和分布功能</li>\n</ol>\n<h3 id="微服务架构microservices"><a href="#%E5%BE%AE%E6%9C%8D%E5%8A%A1%E6%9E%B6%E6%9E%84microservices" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>微服务架构(Microservices)</h3>\n<blockquote>\n<p>定义:一个微服务一般完成某个特定的功能，比如订单管理、客户管理等.每个微服务都是一个微型应用,包括商业逻辑和各种接口.有的微服务通过暴露\nAPI 被别的微服务或者应用客户端所用;有的微服务则通过网页 UI 实现.在运行时,每个实例通常是一个云虚拟机或者 Docker 容器。</p>\n</blockquote>\n<p>优点:</p>\n<ol>\n<li>通过分解单体应用为多个服务,解决了<strong>复杂度</strong>的问题</li>\n<li>每个微服务可由专门的团队来<strong>开发</strong>,相对独立和自由</li>\n<li>每个微服务可以独立<strong>部署</strong>,不再需要协调其他服务部署对本服务的影响</li>\n<li>每个微服务可以独立<strong>扩展</strong>,可以根据每个服务的规模来部署满足需求的实例</li>\n</ol>\n<p>缺点:</p>\n<ol>\n<li>微服务应用是分布式系统,开发者需要使用 RPC 或者消息传递系统来完成<strong>进程间的通讯</strong></li>\n<li>必须使用分布式数据库,由于当前 NoSQL 数据库和消息中间件不知道分布式事务,不得不使用<strong>最终一致性</strong></li>\n<li>开发测试的时候需要启动多个服务微服务</li>\n</ol>\n<p>\n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; "\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 74.89481065918653%;position: relative; width: 100%; bottom: 0; left: 0; background-image: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAPCAYAAADkmO9VAAAACXBIWXMAAC4jAAAuIwF4pT92AAABh0lEQVQ4y2NgwAP47iZx8lyO1ea7m6iBE99JNBL4V8DMQAiADANiA4ZaEyFcagT+F7EADfXhe5jMg9uge0mWQCwLNgwE8BjIdzvRFOhCGfwG3k0yAip05nuUwgfCbMs95GFsFHwvyUjwfykLUK0MIRdq891PkoJhjo2+KHw4vp2oA3UlAQNvJ2qiCODwMihCcBnIRG0DZYHYHIhFKDXQcru3MINsjKq6TKSKs0yUqrNqhaElMNZQDawxVmdoMOUlZCC7BJes1U5vZQbrvb4iQJMVrHZ4K1rt8pFEcWGTGStDlbEBQ52JJJAWRsacu4MsQDTH9gAjZmspZY1GE3Pf76mMuCPlcTwj0CAx3MkrUUPkfzcjz8FQC6lgJXugg4Twx3KtiQT+nATMdveTDDhU+NUtNnko4k82VcbiDAcCGPEaeDvRl3Oqk5x2l4Up3jzMfShUmudMlD7IYN5rcVrIGCQGx3cSPYG0N8FCQSlPV1g2Ts1KIUPLXDZWzYlLgVcVJAzE0gxEAAArGaitBst39gAAAABJRU5ErkJggg==\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="Richardson microservices part1 3 scale cube"\n        title=""\n        src="/static/00f28f14928d297bf3d110cf60d4afce-a408b.png"\n        srcset="/static/00f28f14928d297bf3d110cf60d4afce-4eabf.png 148w,\n/static/00f28f14928d297bf3d110cf60d4afce-5a375.png 295w,\n/static/00f28f14928d297bf3d110cf60d4afce-a408b.png 590w,\n/static/00f28f14928d297bf3d110cf60d4afce-0898a.png 713w"\n        sizes="(max-width: 590px) 100vw, 590px"\n      />\n    </span>\n  </span>\n  \nScale Cube 的 3D 模型,来自《The Art of Scalability》一书,</p>\n<h4 id="使用-api-网关api-gateway构建微服务"><a href="#%E4%BD%BF%E7%94%A8-api-%E7%BD%91%E5%85%B3api-gateway%E6%9E%84%E5%BB%BA%E5%BE%AE%E6%9C%8D%E5%8A%A1" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>使用 API 网关(API Gateway)构建微服务</h4>\n<p>使用微服务架构之后,客户端需要与多个微服务进行通讯,如果是客户端与微服务模块间点对点直接通讯,可能会产生以下问题,</p>\n<ol>\n<li>客户端需求和每个微服务暴露的细粒度 API 不匹配</li>\n<li>可能有部分服务使用的协议对 Web 不友好,比如二进制 RPC 或者 AMQP 等</li>\n<li>使得微服务难以重构,比如服务拆分或者服务组合的场景为了解决以上问题,需要引入 API 网关的概念,API 网关相当与一个轻量级的<strong>服务总线</strong></li>\n</ol>\n<blockquote>\n<p>API 网关负责服务请求路由、组合及协议转换。客户端的所有请求都首先经过 API 网关，然后由它将请求路由到合适的微服务。\nAPI 网关经常会通过调用多个微服务并合并结果来处理一个请求。它可以在 web 协议（如 HTTP 与 WebSocket）与内部使用的非 web 友好协议之间转换。</p>\n</blockquote>\n<ul>\n<li>优点:封装了服务端的内部结构,客户端只需要与网关交互,而不必调用特定的微服务</li>\n<li>缺点:需要单独开发和维护这个组件,可能成为开发或运维的瓶颈.使用微服务架构的期望是去中心化和全分布式,但是 API 会成为一个中心点或者瓶颈点</li>\n</ul>\n<p>如何实现 API 网关:</p>\n<ol>\n<li>注重性能和可扩展性,将其构建在一个支持异步,IO 非阻塞的平台是合理的.</li>\n<li>使用响应式编程模型,避免进入回调地狱,使用 Scala 中的 Future、Java 8 中的 CompletableFuture 是明智的选择</li>\n<li>\n<p>服务调用,必须有支持进程间的通信,通常有两个选择:</p>\n<ul>\n<li>异步的,基于消息传递的机制</li>\n<li>HTTP 或 Thrift 那样的同步机制</li>\n</ul>\n</li>\n<li>服务发现,API 网关需要知道每个与其通信的微服务的位置,由于微服务的 IP 和端口是动态分配的,需要一个系统的服务发现机制</li>\n<li>处理局部失败,API 网关不可能无限期地等待下游服务阻塞,需要根据特定场景处理失败</li>\n</ol>\n<h4 id="微服务架构中的进程间通信"><a href="#%E5%BE%AE%E6%9C%8D%E5%8A%A1%E6%9E%B6%E6%9E%84%E4%B8%AD%E7%9A%84%E8%BF%9B%E7%A8%8B%E9%97%B4%E9%80%9A%E4%BF%A1" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>微服务架构中的进程间通信</h4>\n<blockquote>\n<p>进程间通信(IPC，Inter-Process Communication)，指至少两个进程或线程间传送数据或信号的一些技术或方法</p>\n</blockquote>\n<p>现在有很多不同的 IPC 技术,服务间通信可以使用同步的请求/响应模式,比如基于 HTTP 的 REST 或者 Thrift.\n另外,也可以选择异步的、基于消息的通信模式,比如 AMQP 或者 STOMP</p>\n<h5 id="基于请求响应的同步-ipc"><a href="#%E5%9F%BA%E4%BA%8E%E8%AF%B7%E6%B1%82%E5%93%8D%E5%BA%94%E7%9A%84%E5%90%8C%E6%AD%A5-ipc" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>基于请求/响应的同步 IPC</h5>\n<p><strong>REST</strong>: REST 基于 HTTP 协议，其核心概念是资源典型地代表单一业务对象或者一组业务对象，业务对象包括“消费者”或“产品”.\nREST 使用 HTTP 协议来控制资源，通过 URL 实现,常用的框架有 RAML 和 Swagger.使用基于 HTTP 的协议的有以下优点和缺点:</p>\n<ul>\n<li>\n<p>优点:</p>\n<ol>\n<li>HTTP 非常简单并且大家都很熟悉</li>\n<li>可以使用浏览器扩展(比如 Postman)或者 curl 之类的命令行来测试 API</li>\n<li>内置支持请求/响应模式的通信</li>\n<li>HTTP 对防火墙友好</li>\n<li>不需要中间代理，简化了系统架构</li>\n</ol>\n</li>\n<li>\n<p>缺点:</p>\n<ol>\n<li>只支持请求/响应模式交互。尽管可以使用 HTTP 通知，但是服务端必须一直发送 HTTP 响应。</li>\n<li>由于客户端和服务端直接通信（没有代理或者缓冲机制），在交互期间必须都保持在线。</li>\n<li>客户端必须知道每个服务实例的 URL。如前篇文章“API 网关”所述，这也是个烦人的问题。客户端必须使用服务实例发现机制。</li>\n</ol>\n</li>\n</ul>\n<p><strong>Thrift</strong>:\nApache Thrift 是一个 REST 的替代品,实现了多语言 RPC 客户端和服务端调用.\nThrift 提供了一个 C 风格的 IDL(Interactive Data Language)定义 API.\n通过 Thrift 编译器能够生成客户端存根和服务端框架.编译器可以生成多种语言的代码,\n包括 C++、Java、Python、PHP、Ruby、Erlang 和 Node.js。</p>\n<h5 id="基于消息的异步-ipc"><a href="#%E5%9F%BA%E4%BA%8E%E6%B6%88%E6%81%AF%E7%9A%84%E5%BC%82%E6%AD%A5-ipc" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>基于消息的异步 IPC</h5>\n<p>使用消息模式的时候,进程之间通过异步交换消息消息的方式通信.\n客户端通过向服务端发送消息提交请求,如果服务端需要回复,则会发送另一条独立的消息给客户端.\n由于异步通信,客户端不会因为等待而阻塞,相反会认为响应不会被立即收到.</p>\n<p>当下有大量的开源消息系统可用,如 RabbitMQ、Apache Kafka、Apache ActiveMQ 等.\n宏观上,它们都支持一些消息和渠道格式,并且努力提升可靠性、高性能和可扩展性.然而,细节上它们的消息模型却大相径庭.\n使用消息机制有它的优缺点:\n优点:</p>\n<ol>\n<li>解耦客户端和服务端,客户端不需要一个发现机制来确定服务实例的位置</li>\n<li>消息缓冲,只要消息被写入消息中间件,就算有微服务出现宕机无法及时消费,也不会丢失缺点</li>\n<li>额外的操作复杂性,消息系统需要单独安装配置和部署</li>\n<li>实现的额外复杂性,开发人员需要额外实现生产者/消费者代码</li>\n</ol>\n<h4 id="服务发现的可行方案"><a href="#%E6%9C%8D%E5%8A%A1%E5%8F%91%E7%8E%B0%E7%9A%84%E5%8F%AF%E8%A1%8C%E6%96%B9%E6%A1%88" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>服务发现的可行方案</h4>\n<h5 id="客户端发现模式"><a href="#%E5%AE%A2%E6%88%B7%E7%AB%AF%E5%8F%91%E7%8E%B0%E6%A8%A1%E5%BC%8F" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>客户端发现模式</h5>\n<p>使用客户端发现模式时,客户端决定相应服务实例的网络位置,并且对请求实现负载均衡.\n客户端查询服务注册表,后者是一个可用服务实例的数据库.然后使用负载均衡算法从中选择一个实例,并发出请求.\n\n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; "\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 94.43359374999999%;position: relative; width: 100%; bottom: 0; left: 0; background-image: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAATCAYAAACQjC21AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAC60lEQVQ4y5VUTY/SUBTlX7hR/4n+EbduTVwajasxxsQYJzEax/gRo4krk1kYTTTjGDIME3VkhDDAAC200A8ohddvXkuPfW+klIBGL7mUvJeee+85h5vDf0YUR2mGS79Dfp/7V6AgCOB5HohFEEURP/MiL71ngHEcI+dHPt5q73CzeQefjC+YxTN+wSL7pJTC9304novS0RHyzQKunWzgfucx1EDnXXLAnq9g19zDbXETP6wyVKqnVbOA8wxnISRVRlWr42n/NT4n70p+fwEoehI6Rgf7jQK6ehc/j8toNlswDGOl0zmHNKKoWyco1PbQUptou50Fh27Cg2h30Bq3ISbAlUoF+XwehFgrHbJglAiCgOJhEQ25gbYlgmGwQqkoXsLjiI5hWiYkSUKpVILrumvFIZGFntKHKIhwbAfT2TTtfEllO3RApxSTyQTD4RC2a/PK8yQ2gTJSMRgPYNkWHMdBlTRAQitVmQPOx7FC+5T0MOS2oCHl1VkGswCKrUIhKroTGX1VQV1sYEO4h63ey1TlFcB1wThjHTqRCxpTmOEEujFAtVvDo+Nn2Jbeo+kKfwbk5McLszIwxnHWSsE0gEA6qEk1KOM+er66PDILKxkrG8xvDMyPls+DhAKTjFGsHkBUBMiuzHlcEiWemhhbdUSejDgxaeD1+YhzBaczyselSRfsfGAOUTosQVO1FCg1Nn+h9QTawWVo+1dAvl7FoHwDE0r4GAyMgZDAwtibwPJt/p9mtuo5Cr87pScD6O5chPwkh293c6g9yGG8fYb70kmsNF8AvueDTAiGIwOapqHb6+Kh/BwfhjucmjArile8BOnNWdRenEfr1TnYOxf4uNlFkaqefFRdRUWs4nrtFjaFLVTt+mJk9hWZR4i0j5glyZ62vgt9OuTKM4UZ8DxpIpYf+GiN2ig3yxgY+m+VM4B/C5pwyICzyRbH98Yh2r0WmnaySKi5CrhuVa0rxqjQDA2FQgGtTjv133zkX6Dao1JBvulJAAAAAElFTkSuQmCC\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="Richardson microservices part4 2 client side pattern 1024x967"\n        title=""\n        src="/static/8392bc3a32d1b371ba7ef61963c6f9e6-a408b.png"\n        srcset="/static/8392bc3a32d1b371ba7ef61963c6f9e6-4eabf.png 148w,\n/static/8392bc3a32d1b371ba7ef61963c6f9e6-5a375.png 295w,\n/static/8392bc3a32d1b371ba7ef61963c6f9e6-a408b.png 590w,\n/static/8392bc3a32d1b371ba7ef61963c6f9e6-9a0cc.png 885w,\n/static/8392bc3a32d1b371ba7ef61963c6f9e6-c7d94.png 1024w"\n        sizes="(max-width: 590px) 100vw, 590px"\n      />\n    </span>\n  </span>\n  </p>\n<h5 id="服务端发现模式"><a href="#%E6%9C%8D%E5%8A%A1%E7%AB%AF%E5%8F%91%E7%8E%B0%E6%A8%A1%E5%BC%8F" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>服务端发现模式</h5>\n<p>\n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; "\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 61.62109375%;position: relative; width: 100%; bottom: 0; left: 0; background-image: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAMCAYAAABiDJ37AAAACXBIWXMAAAsTAAALEwEAmpwYAAABnElEQVQoz41TXS8DQRQVHkj8GX9A4n/4K0g8SyReeJNI8CqR8CJIhfAk2m0VrZZ2u+1+dndn9vvj2JmqoqU9yc3NzJw59869d6bwDWma4jf+24vTGEmacIs//dS4y6MQhiEoIZA6Em7EO+yKhzAji4tywWdaxZF8AhLRH+KRfIGoc575HNsYCux4DkpKGbnmNbTAGGT4YAg4qp2g6bUgdxU0Og2YoQl1fxr3W3OQD+bhxu7QCzRDR76cx5v1np17A0HRbaFG6rAj8iMLX1iFX1gBFdb4ml0SngRIahvEI7BcC57vgYSUnw/VcBQYsWPIoHRQDjsg0KiOd7WBs5dLrFc3oATq5IIssz6c2OHd5c2JQjy2y6jLNaiBNpkgA81EGJk1jfl+EN3WUSgUINvKZE9OaB3m2RLqx4tQbpfRVESISgu2T0CysaGuAzurpehJPf64OYzNIqS9GTxuz0I7XeBN85Pgi2fZFi6qV9h820Hbl8cLsnWaxD3LyP3fwUaImRO4qCqvqLQr0MPu5DX8C5Zjo1gqwnC6/JewYB8tLpgJKZvozwAAAABJRU5ErkJggg==\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="Richardson microservices part4 3 server side pattern"\n        title=""\n        src="/static/33e06308b1a4383e1e1ce8fd91b55c2b-a408b.png"\n        srcset="/static/33e06308b1a4383e1e1ce8fd91b55c2b-4eabf.png 148w,\n/static/33e06308b1a4383e1e1ce8fd91b55c2b-5a375.png 295w,\n/static/33e06308b1a4383e1e1ce8fd91b55c2b-a408b.png 590w,\n/static/33e06308b1a4383e1e1ce8fd91b55c2b-9a0cc.png 885w,\n/static/33e06308b1a4383e1e1ce8fd91b55c2b-c7d94.png 1024w"\n        sizes="(max-width: 590px) 100vw, 590px"\n      />\n    </span>\n  </span>\n  \n客户端通过负载均衡器向某个服务提出请求,负载均衡器查询服务注册表,并将请求转发到可用的服务实例.\n如同客户端发现,服务实例在服务注册表中注册或注销.</p>\n<p>AWS Elastic Load Balancer(ELB)是服务端发现路由的例子,ELB 通常均衡来自互联网的外部流量,\n也可用来负载均衡 VPC(Virtual private cloud）)的内部流量.\n客户端使用 DNS 通过 ELB 发出请求(HTTP 或 TCP),ELB 在已注册的 EC2 实例或 ECS 容器之间负载均衡.\n这里并没有单独的服务注册表,相反,EC2 实例和 ECS 容器注册在 ELB。</p>\n<p>HTTP 服务器与类似 NGINX PLUS 和 NGINX 这样的负载均衡起也能用作服务端的发现均衡器</p>\n<h5 id="服务注册表"><a href="#%E6%9C%8D%E5%8A%A1%E6%B3%A8%E5%86%8C%E8%A1%A8" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>服务注册表</h5>\n<p>服务注册表是服务发现的核心部分,是包含服务实例的网络地址的<strong>数据库</strong>,服务注册表需要高可用而且随时更新.\n客户端能够缓存从服务注册表中获取的网络地址,然而这些信息最终会过时,客户端也就无法发现服务实例.\n因此,服务注册表会包含若干服务端,使用复制协议保持一致性.</p>\n<h5 id="服务注册的方式"><a href="#%E6%9C%8D%E5%8A%A1%E6%B3%A8%E5%86%8C%E7%9A%84%E6%96%B9%E5%BC%8F" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>服务注册的方式</h5>\n<ul>\n<li>自注册方式:\n服务实例自己负责在服务注册表中注册和注销,如果需要的话,服务实例也要定时发送心跳来保证注册信息不会过时.\n它的优点是相对简单,缺点是把服务实例和服务注册表耦合,必须在每种编程语言和框架内实现注册代码</li>\n<li>第三方注册模式服务实例不需要向服务注册表注册,而是通过<strong>服务注册器</strong>(registrar)来处理.\n服务注册器会通过查询部署环境或订阅事件的方式来跟踪运行实例的更改.\n它的优点是服务和服务注册解耦合,缺点是除非服务注册器内置于部署环境,否则自己需要配置和管理这个组件.</li>\n</ul>\n<p>参考资料</p>\n<ol>\n<li><a href="http://www.jianshu.com/p/546ef242b6a3">基于微服务的软件架构模式</a></li>\n<li><a href="https://zato.io/docs/intro/esb-soa-cn.html#id1">ESB 和 SOA 到底是什么</a></li>\n<li><a href="http://blog.daocloud.io/microservices-1/">微服务架构概念解析</a></li>\n<li><a href="http://blog.daocloud.io/microservices-2/">构建微服务架构：使用 API Gateway</a></li>\n<li><a href="http://blog.daocloud.io/microservices-3/">微服务架构中的进程间通信</a></li>\n<li><a href="http://blog.daocloud.io/microservices-4/">服务发现的可行方案以及实践案例</a></li>\n<li><a href="https://www.ibm.com/developerworks/community/blogs/3302cc3b-074e-44da-90b1-5055f1dc0d9c/entry/%E8%A7%A3%E6%9E%90%E5%BE%AE%E6%9C%8D%E5%8A%A1%E6%9E%B6%E6%9E%84_%E4%B8%80_%E4%BB%80%E4%B9%88%E6%98%AF%E5%BE%AE%E6%9C%8D%E5%8A%A1?lang=en">什么是微服务</a></li>\n</ol>',tableOfContents:'<ul>\n<li><a href="#microservices-%E8%B5%B7%E6%BA%90">Microservices 起源</a></li>\n<li><a href="#%E6%95%B4%E4%BD%93%E5%BC%8F%E6%9E%B6%E6%9E%84monolithic-architecture">整体式架构(Monolithic Architecture)</a></li>\n<li><a href="#%E9%9D%A2%E5%90%91%E6%9C%8D%E5%8A%A1%E6%9E%B6%E6%9E%84service-oriented-architecture-soa">面向服务架构(Service-Oriented Architecture, SOA)</a></li>\n<li>\n<p><a href="#%E5%BE%AE%E6%9C%8D%E5%8A%A1%E6%9E%B6%E6%9E%84microservices">微服务架构(Microservices)</a></p>\n<ul>\n<li><a href="#%E4%BD%BF%E7%94%A8-api-%E7%BD%91%E5%85%B3api-gateway%E6%9E%84%E5%BB%BA%E5%BE%AE%E6%9C%8D%E5%8A%A1">使用 API 网关(API Gateway)构建微服务</a></li>\n<li>\n<p><a href="#%E5%BE%AE%E6%9C%8D%E5%8A%A1%E6%9E%B6%E6%9E%84%E4%B8%AD%E7%9A%84%E8%BF%9B%E7%A8%8B%E9%97%B4%E9%80%9A%E4%BF%A1">微服务架构中的进程间通信</a></p>\n<ul>\n<li><a href="#%E5%9F%BA%E4%BA%8E%E8%AF%B7%E6%B1%82%E5%93%8D%E5%BA%94%E7%9A%84%E5%90%8C%E6%AD%A5-ipc">基于请求/响应的同步 IPC</a></li>\n<li><a href="#%E5%9F%BA%E4%BA%8E%E6%B6%88%E6%81%AF%E7%9A%84%E5%BC%82%E6%AD%A5-ipc">基于消息的异步 IPC</a></li>\n</ul>\n</li>\n<li>\n<p><a href="#%E6%9C%8D%E5%8A%A1%E5%8F%91%E7%8E%B0%E7%9A%84%E5%8F%AF%E8%A1%8C%E6%96%B9%E6%A1%88">服务发现的可行方案</a></p>\n<ul>\n<li><a href="#%E5%AE%A2%E6%88%B7%E7%AB%AF%E5%8F%91%E7%8E%B0%E6%A8%A1%E5%BC%8F">客户端发现模式</a></li>\n<li><a href="#%E6%9C%8D%E5%8A%A1%E7%AB%AF%E5%8F%91%E7%8E%B0%E6%A8%A1%E5%BC%8F">服务端发现模式</a></li>\n<li><a href="#%E6%9C%8D%E5%8A%A1%E6%B3%A8%E5%86%8C%E8%A1%A8">服务注册表</a></li>\n<li><a href="#%E6%9C%8D%E5%8A%A1%E6%B3%A8%E5%86%8C%E7%9A%84%E6%96%B9%E5%BC%8F">服务注册的方式</a></li>\n</ul>\n</li>\n</ul>\n</li>\n</ul>',frontmatter:{title:"什么是Microservices",date:"December 13, 2017",tags:["architecture"]}}},pathContext:{path:"/micro-service"}}}});
//# sourceMappingURL=path---micro-service-9e5a68f1a74414dc726c.js.map