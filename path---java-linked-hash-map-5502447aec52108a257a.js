webpackJsonp([0x56647d20cc258000],{"./node_modules/json-loader/index.js!./.cache/json/java-linked-hash-map.json":function(a,n){a.exports={data:{site:{siteMetadata:{title:"Note Site",author:"stone"}},markdownRemark:{id:"/home/peng/develop/workspace/stone-site/src/pages/2017-11-08-java-linked-hash-map/index.md absPath of file >>> MarkdownRemark",html:'<h1 id="java-linkedhashmap"><a href="#java-linkedhashmap" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Java LinkedHashMap</h1>\n<ul>\n<li>HashMap 的直接子类</li>\n<li>在 HashMap 的基础上，采用双向链表将所有的 entry 链接起来</li>\n<li>能保证迭代顺序与插入顺序相同</li>\n<li>未实现同步（不是线程安全）</li>\n<li>*</li>\n</ul>\n<div class="gatsby-highlight">\n      <pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">LinkedHashMap</span><span class="token operator">&lt;</span>K<span class="token punctuation">,</span>V<span class="token operator">></span>\n    <span class="token keyword">extends</span> <span class="token class-name">HashMap</span><span class="token operator">&lt;</span>K<span class="token punctuation">,</span>V<span class="token operator">></span>\n    <span class="token keyword">implements</span> <span class="token class-name">Map</span><span class="token operator">&lt;</span>K<span class="token punctuation">,</span>V<span class="token operator">></span>\n<span class="token punctuation">{</span>\n    <span class="token comment" spellcheck="true">/**\n     * The head (eldest) of the doubly linked list.\n     * -- 双向链表的表头元素\n     */</span>\n    <span class="token keyword">transient</span> LinkedHashMap<span class="token punctuation">.</span>Entry<span class="token operator">&lt;</span>K<span class="token punctuation">,</span>V<span class="token operator">></span> head<span class="token punctuation">;</span>\n\n    <span class="token comment" spellcheck="true">/**\n     * The tail (youngest) of the doubly linked list.\n     * -- 双向链表的表尾元素\n     */</span>\n    <span class="token keyword">transient</span> LinkedHashMap<span class="token punctuation">.</span>Entry<span class="token operator">&lt;</span>K<span class="token punctuation">,</span>V<span class="token operator">></span> tail<span class="token punctuation">;</span>\n\n    <span class="token comment" spellcheck="true">/**\n     * The iteration ordering method for this linked hash map: &lt;tt>true&lt;/tt>\n     * for access-order, &lt;tt>false&lt;/tt> for insertion-order.\n     * -- true　按照访问顺序排序　false 按照插入顺序排序（默认）\n     * @serial\n     */</span>\n    <span class="token keyword">final</span> <span class="token keyword">boolean</span> accessOrder<span class="token punctuation">;</span>\n\n    <span class="token comment" spellcheck="true">// -- HashMap.Node的直接子类，新增了两个域用于实现双向链表</span>\n    <span class="token keyword">static</span> <span class="token keyword">class</span> <span class="token class-name">Entry</span><span class="token operator">&lt;</span>K<span class="token punctuation">,</span>V<span class="token operator">></span> <span class="token keyword">extends</span> <span class="token class-name">HashMap<span class="token punctuation">.</span>Node</span><span class="token operator">&lt;</span>K<span class="token punctuation">,</span>V<span class="token operator">></span> <span class="token punctuation">{</span>ii\n        Entry<span class="token operator">&lt;</span>K<span class="token punctuation">,</span>V<span class="token operator">></span> before<span class="token punctuation">,</span> after<span class="token punctuation">;</span>\n        <span class="token function">Entry</span><span class="token punctuation">(</span><span class="token keyword">int</span> hash<span class="token punctuation">,</span> K key<span class="token punctuation">,</span> V value<span class="token punctuation">,</span> Node<span class="token operator">&lt;</span>K<span class="token punctuation">,</span>V<span class="token operator">></span> next<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n            <span class="token keyword">super</span><span class="token punctuation">(</span>hash<span class="token punctuation">,</span> key<span class="token punctuation">,</span> value<span class="token punctuation">,</span> next<span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>',tableOfContents:'<ul>\n<li><a href="#java-linkedhashmap">Java LinkedHashMap</a></li>\n</ul>',frontmatter:{title:"Java LinkedHashMap",date:"November 08, 2017",tags:["java","java collection framework"]}}},pathContext:{path:"/java-linked-hash-map"}}}});
//# sourceMappingURL=path---java-linked-hash-map-5502447aec52108a257a.js.map