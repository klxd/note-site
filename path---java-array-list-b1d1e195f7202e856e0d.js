webpackJsonp([0x52fc2ee0b5908c00],{"./node_modules/json-loader/index.js!./.cache/json/java-array-list.json":function(n,s){n.exports={data:{site:{siteMetadata:{title:"Note Site",author:"stone"}},markdownRemark:{id:"/home/peng/develop/workspace/stone-site/src/pages/2017-11-02-java-arraylist/index.md absPath of file >>> MarkdownRemark",html:'<p>Java 中最常用的数据结构之一</p>\n<ul>\n<li>元素的存放顺序与<code>add</code>的顺序相同</li>\n<li>允许放入<code>null</code>元素</li>\n<li>未实现同步（不是线程安全）</li>\n<li>底层实现是一个 array 数组</li>\n</ul>\n<h2 id="add"><a href="#add" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>add</h2>\n<div class="gatsby-highlight">\n      <pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">boolean</span> <span class="token function">add</span><span class="token punctuation">(</span>E e<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token function">ensureCapacityInternal</span><span class="token punctuation">(</span>size <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  <span class="token comment" spellcheck="true">// Increments modCount!!</span>\n    elementData<span class="token punctuation">[</span>size<span class="token operator">++</span><span class="token punctuation">]</span> <span class="token operator">=</span> e<span class="token punctuation">;</span>\n    <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">add</span><span class="token punctuation">(</span><span class="token keyword">int</span> index<span class="token punctuation">,</span> E element<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token function">rangeCheckForAdd</span><span class="token punctuation">(</span>index<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token comment" spellcheck="true">// 确保容量足够</span>\n    <span class="token function">ensureCapacityInternal</span><span class="token punctuation">(</span>size <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  <span class="token comment" spellcheck="true">// Increments modCount!!</span>\n    <span class="token comment" spellcheck="true">// native函数,将index之后的元素右移一位</span>\n    System<span class="token punctuation">.</span><span class="token function">arraycopy</span><span class="token punctuation">(</span>elementData<span class="token punctuation">,</span> index<span class="token punctuation">,</span> elementData<span class="token punctuation">,</span> index <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">,</span>\n                     size <span class="token operator">-</span> index<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token comment" spellcheck="true">// 插入新元素</span>\n    elementData<span class="token punctuation">[</span>index<span class="token punctuation">]</span> <span class="token operator">=</span> element<span class="token punctuation">;</span>\n    size<span class="token operator">++</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<ul>\n<li>ArrayList 是在 add 之前扩容</li>\n<li>允许放入空元素</li>\n</ul>\n<h2 id="remove"><a href="#remove" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>remove</h2>\n<div class="gatsby-highlight">\n      <pre class="language-java"><code><span class="token keyword">public</span> E <span class="token function">remove</span><span class="token punctuation">(</span><span class="token keyword">int</span> index<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token function">rangeCheck</span><span class="token punctuation">(</span>index<span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n    modCount<span class="token operator">++</span><span class="token punctuation">;</span>\n    E oldValue <span class="token operator">=</span> <span class="token function">elementData</span><span class="token punctuation">(</span>index<span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n    <span class="token keyword">int</span> numMoved <span class="token operator">=</span> size <span class="token operator">-</span> index <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">;</span>\n    <span class="token comment" spellcheck="true">// -- 如果不是删除最后一位,则将index右边的所有元素左移一位</span>\n    <span class="token keyword">if</span> <span class="token punctuation">(</span>numMoved <span class="token operator">></span> <span class="token number">0</span><span class="token punctuation">)</span>\n        System<span class="token punctuation">.</span><span class="token function">arraycopy</span><span class="token punctuation">(</span>elementData<span class="token punctuation">,</span> index<span class="token operator">+</span><span class="token number">1</span><span class="token punctuation">,</span> elementData<span class="token punctuation">,</span> index<span class="token punctuation">,</span>\n                         numMoved<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    elementData<span class="token punctuation">[</span><span class="token operator">--</span>size<span class="token punctuation">]</span> <span class="token operator">=</span> null<span class="token punctuation">;</span> <span class="token comment" spellcheck="true">// clear to let GC do its work</span>\n\n    <span class="token keyword">return</span> oldValue<span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<div class="gatsby-highlight">\n      <pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">boolean</span> <span class="token function">remove</span><span class="token punctuation">(</span>Object o<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">if</span> <span class="token punctuation">(</span>o <span class="token operator">==</span> null<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> index <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> index <span class="token operator">&lt;</span> size<span class="token punctuation">;</span> index<span class="token operator">++</span><span class="token punctuation">)</span>\n            <span class="token keyword">if</span> <span class="token punctuation">(</span>elementData<span class="token punctuation">[</span>index<span class="token punctuation">]</span> <span class="token operator">==</span> null<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n                <span class="token function">fastRemove</span><span class="token punctuation">(</span>index<span class="token punctuation">)</span><span class="token punctuation">;</span>\n                <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span>\n            <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>\n        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> index <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> index <span class="token operator">&lt;</span> size<span class="token punctuation">;</span> index<span class="token operator">++</span><span class="token punctuation">)</span>\n            <span class="token keyword">if</span> <span class="token punctuation">(</span>o<span class="token punctuation">.</span><span class="token function">equals</span><span class="token punctuation">(</span>elementData<span class="token punctuation">[</span>index<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n                <span class="token function">fastRemove</span><span class="token punctuation">(</span>index<span class="token punctuation">)</span><span class="token punctuation">;</span>\n                <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span>\n            <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n    <span class="token keyword">return</span> <span class="token boolean">false</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n<span class="token comment" spellcheck="true">/*\n * 此函数与public E remove(int index)功能相同,不过省略了下标检查和返回值\n */</span>\n<span class="token keyword">private</span> <span class="token keyword">void</span> <span class="token function">fastRemove</span><span class="token punctuation">(</span><span class="token keyword">int</span> index<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    modCount<span class="token operator">++</span><span class="token punctuation">;</span>\n    <span class="token keyword">int</span> numMoved <span class="token operator">=</span> size <span class="token operator">-</span> index <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">;</span>\n    <span class="token keyword">if</span> <span class="token punctuation">(</span>numMoved <span class="token operator">></span> <span class="token number">0</span><span class="token punctuation">)</span>\n        System<span class="token punctuation">.</span><span class="token function">arraycopy</span><span class="token punctuation">(</span>elementData<span class="token punctuation">,</span> index<span class="token operator">+</span><span class="token number">1</span><span class="token punctuation">,</span> elementData<span class="token punctuation">,</span> index<span class="token punctuation">,</span>\n                         numMoved<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    elementData<span class="token punctuation">[</span><span class="token operator">--</span>size<span class="token punctuation">]</span> <span class="token operator">=</span> null<span class="token punctuation">;</span> <span class="token comment" spellcheck="true">// clear to let GC do its work</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<ul>\n<li>仅会删除 object 第一次出现的位置</li>\n<li>可以传入 null,表示删除第一个 null 的位置</li>\n<li>返回<code>true/false</code>表示是否有执行删除</li>\n</ul>\n<h2 id="void-growint-mincapacity"><a href="#void-growint-mincapacity" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>void grow(int minCapacity)</h2>\n<div class="gatsby-highlight">\n      <pre class="language-java"><code><span class="token keyword">private</span> <span class="token keyword">void</span> <span class="token function">grow</span><span class="token punctuation">(</span><span class="token keyword">int</span> minCapacity<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">int</span> oldCapacity <span class="token operator">=</span> elementData<span class="token punctuation">.</span>length<span class="token punctuation">;</span>\n    <span class="token keyword">int</span> newCapacity <span class="token operator">=</span> oldCapacity <span class="token operator">+</span> <span class="token punctuation">(</span>oldCapacity <span class="token operator">>></span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment" spellcheck="true">//原来的1.5倍</span>\n    <span class="token keyword">if</span> <span class="token punctuation">(</span>newCapacity <span class="token operator">-</span> minCapacity <span class="token operator">&lt;</span> <span class="token number">0</span><span class="token punctuation">)</span>\n        newCapacity <span class="token operator">=</span> minCapacity<span class="token punctuation">;</span>\n    <span class="token comment" spellcheck="true">// 确保不会数值溢出,若newCapacity过大则设置为Integer.MAX_VALUE</span>\n    <span class="token keyword">if</span> <span class="token punctuation">(</span>newCapacity <span class="token operator">-</span> MAX_ARRAY_SIZE <span class="token operator">></span> <span class="token number">0</span><span class="token punctuation">)</span>\n        newCapacity <span class="token operator">=</span> <span class="token function">hugeCapacity</span><span class="token punctuation">(</span>minCapacity<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    elementData <span class="token operator">=</span> Arrays<span class="token punctuation">.</span><span class="token function">copyOf</span><span class="token punctuation">(</span>elementData<span class="token punctuation">,</span> newCapacity<span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment" spellcheck="true">//扩展空间并复制</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<ul>\n<li>由于 java 中的数组无法自动扩容，所以当 ArrayList 中的容量<code>capacity</code>不足时，会调用<code>grow</code>函数进行扩容。</li>\n<li>数组默认扩容为原容量的 1.5 倍</li>\n</ul>\n<h2 id="public-void-trimtosize"><a href="#public-void-trimtosize" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>public void trimToSize()</h2>\n<div class="gatsby-highlight">\n      <pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">trimToSize</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    modCount<span class="token operator">++</span><span class="token punctuation">;</span>\n    <span class="token comment" spellcheck="true">// 若底层数组有空闲位置,将数组中的内容复制到一个新的底层数组</span>\n    <span class="token keyword">if</span> <span class="token punctuation">(</span>size <span class="token operator">&lt;</span> elementData<span class="token punctuation">.</span>length<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        elementData <span class="token operator">=</span> <span class="token punctuation">(</span>size <span class="token operator">==</span> <span class="token number">0</span><span class="token punctuation">)</span>\n          <span class="token operator">?</span> EMPTY_ELEMENTDATA\n          <span class="token operator">:</span> Arrays<span class="token punctuation">.</span><span class="token function">copyOf</span><span class="token punctuation">(</span>elementData<span class="token punctuation">,</span> size<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<ul>\n<li>ArrayList 扩容之后,调用 remove 函数并不会使容量自动缩小,通过调用此函数可以将容量缩小,使得底层容器没有空闲空间</li>\n</ul>\n<h2 id="object-clone"><a href="#object-clone" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Object clone()</h2>\n<div class="gatsby-highlight">\n      <pre class="language-java"><code><span class="token comment" spellcheck="true">/**\n * Returns a shallow copy of this &lt;tt>ArrayList&lt;/tt> instance.  (The\n * elements themselves are not copied.)\n *\n * @return a clone of this &lt;tt>ArrayList&lt;/tt> instance\n */</span>\n<span class="token keyword">public</span> Object <span class="token function">clone</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">try</span> <span class="token punctuation">{</span>\n        ArrayList<span class="token operator">&lt;</span><span class="token operator">?</span><span class="token operator">></span> v <span class="token operator">=</span> <span class="token punctuation">(</span>ArrayList<span class="token operator">&lt;</span><span class="token operator">?</span><span class="token operator">></span><span class="token punctuation">)</span> <span class="token keyword">super</span><span class="token punctuation">.</span><span class="token function">clone</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        v<span class="token punctuation">.</span>elementData <span class="token operator">=</span> Arrays<span class="token punctuation">.</span><span class="token function">copyOf</span><span class="token punctuation">(</span>elementData<span class="token punctuation">,</span> size<span class="token punctuation">)</span><span class="token punctuation">;</span>\n        v<span class="token punctuation">.</span>modCount <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>\n        <span class="token keyword">return</span> v<span class="token punctuation">;</span>\n    <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">CloneNotSupportedException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token comment" spellcheck="true">// this shouldn\'t happen, since we are Cloneable</span>\n        <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">InternalError</span><span class="token punctuation">(</span>e<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<ul>\n<li>返回当前 ArrayList 的一个浅拷贝</li>\n</ul>\n<h2 id="sublist"><a href="#sublist" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>SubList</h2>\n<div class="gatsby-highlight">\n      <pre class="language-java"><code><span class="token keyword">public</span> List<span class="token operator">&lt;</span>E<span class="token operator">></span> <span class="token function">subList</span><span class="token punctuation">(</span><span class="token keyword">int</span> fromIndex<span class="token punctuation">,</span> <span class="token keyword">int</span> toIndex<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token function">subListRangeCheck</span><span class="token punctuation">(</span>fromIndex<span class="token punctuation">,</span> toIndex<span class="token punctuation">,</span> size<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">SubList</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> fromIndex<span class="token punctuation">,</span> toIndex<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">private</span> <span class="token keyword">class</span> <span class="token class-name">SubList</span> <span class="token keyword">extends</span> <span class="token class-name">AbstractList</span><span class="token operator">&lt;</span>E<span class="token operator">></span> <span class="token keyword">implements</span> <span class="token class-name">RandomAccess</span> <span class="token punctuation">{</span>\n    <span class="token keyword">private</span> <span class="token keyword">final</span> AbstractList<span class="token operator">&lt;</span>E<span class="token operator">></span> parent<span class="token punctuation">;</span>\n    <span class="token keyword">private</span> <span class="token keyword">final</span> <span class="token keyword">int</span> parentOffset<span class="token punctuation">;</span>\n    <span class="token keyword">private</span> <span class="token keyword">final</span> <span class="token keyword">int</span> offset<span class="token punctuation">;</span>\n    <span class="token keyword">int</span> size<span class="token punctuation">;</span>\n\n    <span class="token function">SubList</span><span class="token punctuation">(</span>AbstractList<span class="token operator">&lt;</span>E<span class="token operator">></span> parent<span class="token punctuation">,</span>\n            <span class="token keyword">int</span> offset<span class="token punctuation">,</span> <span class="token keyword">int</span> fromIndex<span class="token punctuation">,</span> <span class="token keyword">int</span> toIndex<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword">this</span><span class="token punctuation">.</span>parent <span class="token operator">=</span> parent<span class="token punctuation">;</span>\n        <span class="token keyword">this</span><span class="token punctuation">.</span>parentOffset <span class="token operator">=</span> fromIndex<span class="token punctuation">;</span>\n        <span class="token keyword">this</span><span class="token punctuation">.</span>offset <span class="token operator">=</span> offset <span class="token operator">+</span> fromIndex<span class="token punctuation">;</span>\n        <span class="token keyword">this</span><span class="token punctuation">.</span>size <span class="token operator">=</span> toIndex <span class="token operator">-</span> fromIndex<span class="token punctuation">;</span>\n        <span class="token keyword">this</span><span class="token punctuation">.</span>modCount <span class="token operator">=</span> ArrayList<span class="token punctuation">.</span><span class="token keyword">this</span><span class="token punctuation">.</span>modCount<span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n\n    <span class="token keyword">public</span> E <span class="token function">set</span><span class="token punctuation">(</span><span class="token keyword">int</span> index<span class="token punctuation">,</span> E e<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token function">rangeCheck</span><span class="token punctuation">(</span>index<span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token function">checkForComodification</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        E oldValue <span class="token operator">=</span> ArrayList<span class="token punctuation">.</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">elementData</span><span class="token punctuation">(</span>offset <span class="token operator">+</span> index<span class="token punctuation">)</span><span class="token punctuation">;</span>\n        ArrayList<span class="token punctuation">.</span><span class="token keyword">this</span><span class="token punctuation">.</span>elementData<span class="token punctuation">[</span>offset <span class="token operator">+</span> index<span class="token punctuation">]</span> <span class="token operator">=</span> e<span class="token punctuation">;</span>\n        <span class="token keyword">return</span> oldValue<span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n\n    <span class="token keyword">public</span> E <span class="token function">get</span><span class="token punctuation">(</span><span class="token keyword">int</span> index<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token function">rangeCheck</span><span class="token punctuation">(</span>index<span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token function">checkForComodification</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token keyword">return</span> ArrayList<span class="token punctuation">.</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">elementData</span><span class="token punctuation">(</span>offset <span class="token operator">+</span> index<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n\n    <span class="token keyword">public</span> <span class="token keyword">int</span> <span class="token function">size</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token function">checkForComodification</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span>size<span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n\n    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">add</span><span class="token punctuation">(</span><span class="token keyword">int</span> index<span class="token punctuation">,</span> E e<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token function">rangeCheckForAdd</span><span class="token punctuation">(</span>index<span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token function">checkForComodification</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        parent<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>parentOffset <span class="token operator">+</span> index<span class="token punctuation">,</span> e<span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token keyword">this</span><span class="token punctuation">.</span>modCount <span class="token operator">=</span> parent<span class="token punctuation">.</span>modCount<span class="token punctuation">;</span>\n        <span class="token keyword">this</span><span class="token punctuation">.</span>size<span class="token operator">++</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n\n    <span class="token keyword">public</span> E <span class="token function">remove</span><span class="token punctuation">(</span><span class="token keyword">int</span> index<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token function">rangeCheck</span><span class="token punctuation">(</span>index<span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token function">checkForComodification</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        E result <span class="token operator">=</span> parent<span class="token punctuation">.</span><span class="token function">remove</span><span class="token punctuation">(</span>parentOffset <span class="token operator">+</span> index<span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token keyword">this</span><span class="token punctuation">.</span>modCount <span class="token operator">=</span> parent<span class="token punctuation">.</span>modCount<span class="token punctuation">;</span>\n        <span class="token keyword">this</span><span class="token punctuation">.</span>size<span class="token operator">--</span><span class="token punctuation">;</span>\n        <span class="token keyword">return</span> result<span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n    <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<ul>\n<li>返回的 SubList 仅仅是原来 ArrayList 的一个视图,并没有做任何数据拷贝</li>\n<li>对 SubList 的各种修改会被映射到原来的 ArrayList 上面</li>\n</ul>',
tableOfContents:'<ul>\n<li><a href="#add">add</a></li>\n<li><a href="#remove">remove</a></li>\n<li><a href="#void-growint-mincapacity">void grow(int minCapacity)</a></li>\n<li><a href="#public-void-trimtosize">public void trimToSize()</a></li>\n<li><a href="#object-clone">Object clone()</a></li>\n<li><a href="#sublist">SubList</a></li>\n</ul>',frontmatter:{title:"Java ArrayList",date:"September 12, 2017",tags:["java","java collection framework"]}}},pathContext:{path:"/java-array-list"}}}});
//# sourceMappingURL=path---java-array-list-b1d1e195f7202e856e0d.js.map