async function loadTranslations(lang) {
    try {
        // use relative path so localhost file:// works
        const res = await fetch(`./i18n/locales/${lang}.json`);
        const translations = await res.json();
        
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[key]) {
                el.innerHTML = translations[key];
            }
        });
        
        // Translate JS stories
        if (typeof stories !== 'undefined' && Array.isArray(stories)) {
            for (let i = 0; i < stories.length; i++) {
                if (translations[`story_${i}_identity`]) stories[i].identity = translations[`story_${i}_identity`];
                if (translations[`story_${i}_quote`]) stories[i].quote = translations[`story_${i}_quote`];
                if (translations[`story_${i}_highlight`]) stories[i].highlight = translations[`story_${i}_highlight`];
                if (translations[`story_${i}_takeaway`]) stories[i].takeaway = translations[`story_${i}_takeaway`];
                if (stories[i].story && Array.isArray(stories[i].story)) {
                    for (let j = 0; j < stories[i].story.length; j++) {
                        if (translations[`story_${i}_p_${j}`]) {
                            stories[i].story[j] = translations[`story_${i}_p_${j}`];
                        }
                    }
                }
            }
            if (typeof renderCards === 'function') {
                renderCards(); 
                // Quick hack: if detail view is open, just force user to go back to avoid maintaining state
                const detail = document.getElementById('story-detail');
                if (detail && detail.style.display === 'block') {
                    if (typeof showStories === 'function') showStories();
                }
            }
        }
    } catch(e) { console.error('Failed to load language', lang); }
}

function changeLang(lang) {
    localStorage.setItem('language', lang);
    const url = new URL(window.location);
    url.searchParams.set('lang', lang);
    window.history.pushState({}, '', url);
    loadTranslations(lang);
}

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const lang = urlParams.get('lang') || localStorage.getItem('language') || 'en';
    const selector = document.getElementById('lang-selector');
    if (selector) selector.value = lang;
    if (lang !== 'en') {
        loadTranslations(lang);
    }
});