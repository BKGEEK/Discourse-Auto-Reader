// @name         Discourse 自动阅读帖子 V1
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Discourse 自动阅读帖子，模拟真实用户行为（防止出BUG）
// @author       GPT-5 Mike Leone
// @match        https://www.nodeloc.com/
// @match        https://www.nodeloc.com/t/topic/*
// @grant        GM_setValue
// @grant        GM_getValue

(function () {
    'use strict';

    const ENABLED_KEY = 'nodelocAutoReaderEnabled';
    const READ_KEY = 'nodelocReadPosts';

    function randomDelay(min = 2000, max = 5000) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function simulateMouseMove() {
        const evt = new MouseEvent('mousemove', {
            clientX: Math.floor(Math.random() * window.innerWidth),
            clientY: Math.floor(Math.random() * window.innerHeight),
            bubbles: true
        });
        document.dispatchEvent(evt);
    }

    function scrollToBottom(duration = 5000) {
        const start = window.scrollY;
        const end = document.body.scrollHeight;
        const distance = end - start;
        const steps = Math.floor(duration / 50);
        let currentStep = 0;

        const interval = setInterval(() => {
            const progress = currentStep / steps;
            const scrollY = start + distance * progress;
            window.scrollTo(0, scrollY);
            simulateMouseMove();
            currentStep++;
            if (currentStep >= steps) {
                clearInterval(interval);
            }
        }, 50);
    }

    async function scrollUntilPostsLoaded(maxScrolls = 10, interval = 1000) {
        for (let i = 0; i < maxScrolls; i++) {
            window.scrollTo(0, document.body.scrollHeight);
            simulateMouseMove();
            await new Promise(resolve => setTimeout(resolve, interval));

            const links = Array.from(document.querySelectorAll('a.title.raw-topic-link')).filter(link => {
                const href = link.getAttribute('href');
                const isTopic = href && /^\/t\/topic\/\d+/.test(href);
                const color = window.getComputedStyle(link).color;
                const isUnvisited = color !== 'rgb(145, 145, 145)';
                return isTopic && isUnvisited;
            });

            const unread = links.map(link => new URL(link.href, location.origin).href)
                                .filter(href => !readPosts.has(href));

            if (unread.length > 0) {
                return unread[0];
            }
        }
        return null;
    }

    function addToggleButton() {
        const btn = document.createElement('button');
        const isEnabled = GM_getValue(ENABLED_KEY, false);
        btn.innerText = isEnabled ? '🟢 自动阅读启用中' : '⚪ 自动阅读已关闭';
        btn.style.position = 'fixed';
        btn.style.bottom = '20px';
        btn.style.right = '20px';
        btn.style.zIndex = '9999';
        btn.style.padding = '10px 15px';
        btn.style.backgroundColor = '#007bff';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.borderRadius = '5px';
        btn.style.cursor = 'pointer';
        btn.onclick = () => {
            const current = GM_getValue(ENABLED_KEY, false);
            GM_setValue(ENABLED_KEY, !current);
            btn.innerText = !current ? '🟢 自动阅读启用中' : '⚪ 自动阅读已关闭';
            location.reload();
        };
        document.body.appendChild(btn);
    }

    addToggleButton();

    const isEnabled = GM_getValue(ENABLED_KEY, false);
    if (!isEnabled) return;

    const readPosts = new Set(JSON.parse(GM_getValue(READ_KEY, '[]')));

    // 🏠 首页逻辑：寻找未读帖子（支持懒加载）
    if (location.pathname === '/') {
        scrollUntilPostsLoaded().then(nextPost => {
            if (nextPost) {
                readPosts.add(nextPost);
                GM_setValue(READ_KEY, JSON.stringify(Array.from(readPosts)));
                const delay = randomDelay();
                console.log(`⏳ 等待 ${delay}ms 后跳转到帖子`);
                setTimeout(() => {
                    simulateMouseMove();
                    window.location.href = nextPost;
                }, delay);
            } else {
                console.log('✅ 所有帖子已阅读完毕或加载失败');
            }
        });
    }

    // 📄 帖子页逻辑：滚动到底 + 停顿 + 返回
    if (location.pathname.startsWith('/t/topic/')) {
        scrollToBottom(5000); // 模拟滚动到底部
        const delay = randomDelay();
        setTimeout(() => {
            simulateMouseMove();
            window.location.href = 'https://www.nodeloc.com/';
        }, 5000 + delay);
    }
})();
