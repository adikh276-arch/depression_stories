async function loadTranslations(lang) {
    try {
        const res = await fetch(`/i18n/locales/${lang}.json`);
        const translations = await res.json();
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[key]) {
                el.innerHTML = translations[key];
            }
        });
        
        // Handle JS stories array specifically if present
        if (window.stories && document.getElementById('cardsContainer')) {
            // Re-render strings dynamically from translations inside JS if necessary
            // In a better setup, the JS would fetch the translations before rendering
            // We just trigger render if defined
            if (typeof renderCards === 'function') {
                // Not ideal, but we can't completely replace deep properties without specific keys.
                // We'll leave JS stories mostly intact unless customized. 
                renderCards(); 
            }
        }
    } catch(e) { console.error('Failed to load language', lang); }
}

function changeLang(lang) {
    localStorage.setItem('language', lang);
    location.reload();
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