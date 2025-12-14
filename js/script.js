document.addEventListener('DOMContentLoaded', function() {
    const contentElement = document.getElementById('content');
    const notFoundElement = document.getElementById('not-found');
    
    marked.setOptions({
        highlight: function(code, lang) {
            if (lang && hljs.getLanguage(lang)) {
                try {
                    return hljs.highlight(code, { 
                        language: lang,
                        ignoreIllegals: true 
                    }).value;
                } catch (err) {
                    console.warn(`Highlight.js error for language ${lang}:`, err);
                }
            }
            
            return hljs.highlightAuto(code).value;
        },
        langPrefix: 'hljs language-'
    });
    
    fetch('/README.md')
        .then(response => {
            if (!response.ok) {
                throw new Error('文件不存在');
            }
            return response.text();
        })
        .then(markdown => {
            const html = marked.parse(markdown);
            contentElement.innerHTML = html;
            
            contentElement.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block);
            });
            
            contentElement.classList.remove('hidden');
        })
        .catch(error => {
            console.error('加载失败:', error);
            
            notFoundElement.classList.remove('hidden');
        });
});