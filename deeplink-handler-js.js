/**
 * DeepLink Handler para OnlyFans
 * Versión: 1.0
 * Descripción: Maneja la apertura de enlaces en navegadores externos desde apps
 */

class DeepLinkHandler {
    constructor(targetUrl) {
        this.url = targetUrl;
        this.userAgent = navigator.userAgent || navigator.vendor || window.opera;
        this.detectDevice();
    }

    detectDevice() {
        this.isIOS = /iPad|iPhone|iPod/.test(this.userAgent) && !window.MSStream;
        this.isAndroid = /android/i.test(this.userAgent);
        this.isInstagram = /Instagram/.test(this.userAgent);
        this.isFacebook = /FBAN|FBAV/.test(this.userAgent);
        this.isTikTok = /TikTok/.test(this.userAgent);
        this.isTwitter = /Twitter/.test(this.userAgent);
        this.isSnapchat = /Snapchat/.test(this.userAgent);
        this.isInAppBrowser = this.isInstagram || this.isFacebook || this.isTikTok || this.isTwitter || this.isSnapchat;
    }

    open() {
        if (this.isIOS) {
            this.openIOS();
        } else if (this.isAndroid) {
            this.openAndroid();
        } else {
            this.openDesktop();
        }
    }

    openIOS() {
        if (this.isInAppBrowser) {
            // Método 1: Redirección directa
            window.location.href = this.url;
            
            // Método 2: Usando location.replace
            setTimeout(() => {
                window.location.replace(this.url);
            }, 250);
            
            // Método 3: Crear enlace y hacer click
            setTimeout(() => {
                this.createAndClickLink();
            }, 500);
        } else {
            // Safari normal
            window.open(this.url, '_blank');
        }
    }

    openAndroid() {
        if (this.isInAppBrowser) {
            // Método 1: Intent para Chrome
            this.tryAndroidIntent();
            
            // Método 2: Enlace directo
            setTimeout(() => {
                this.createAndClickLink();
            }, 300);
            
            // Método 3: Redirección forzada
            setTimeout(() => {
                window.top.location.href = this.url;
            }, 600);
        } else {
            // Navegador normal Android
            this.createAndClickLink();
        }
    }

    openDesktop() {
        window.open(this.url, '_blank');
    }

    tryAndroidIntent() {
        // Intent mejorado para Android
        const intent = `intent:${this.url}#Intent;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=com.android.chrome;scheme=https;S.browser_fallback_url=${this.url};end`;
        
        try {
            window.location.href = intent;
        } catch (e) {
            console.error('Intent failed:', e);
        }
    }

    createAndClickLink() {
        const link = document.createElement('a');
        link.href = this.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.style.display = 'none';
        
        // Agregar al DOM
        document.body.appendChild(link);
        
        // Simular click
        const clickEvent = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
        });
        link.dispatchEvent(clickEvent);
        
        // Limpiar
        setTimeout(() => {
            document.body.removeChild(link);
        }, 100);
    }

    // Método alternativo usando form submit
    tryFormSubmit() {
        const form = document.createElement('form');
        form.method = 'GET';
        form.action = this.url;
        form.target = '_blank';
        form.style.display = 'none';
        
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    }
}

// Función global para usar en el HTML
function openOnlyFansExternal(event) {
    if (event) event.preventDefault();
    
    const handler = new DeepLinkHandler('https://onlyfans.com/natashasammy/c97');
    handler.open();
    
    // Fallback adicional
    setTimeout(() => {
        if (document.hasFocus()) {
            // Si todavía estamos en la página, mostrar instrucciones
            showInstructions();
        }
    }, 2000);
}

// Mostrar instrucciones si falla todo
function showInstructions() {
    const existing = document.getElementById('deeplink-instructions');
    if (existing) return;
    
    const instructions = document.createElement('div');
    instructions.id = 'deeplink-instructions';
    instructions.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 20px;
        border-radius: 15px;
        font-size: 16px;
        z-index: 99999;
        text-align: center;
        max-width: 300px;
        box-shadow: 0 0 20px rgba(255, 0, 153, 0.5);
    `;
    
    instructions.innerHTML = `
        <h3 style="margin: 0 0 10px 0; color: #ff0099;">Can't open automatically?</h3>
        <p style="margin: 10px 0;">Tap the menu (⋮ or ⋯) and select:</p>
        <p style="font-weight: bold; color: #ff0099;">"Open in Browser" / "Abrir en navegador"</p>
        <button onclick="document.body.removeChild(document.getElementById('deeplink-instructions'))" 
                style="margin-top: 15px; padding: 10px 20px; background: #ff0099; color: white; border: none; border-radius: 20px; cursor: pointer;">
            OK
        </button>
    `;
    
    document.body.appendChild(instructions);
}

// Exportar para uso modular si es necesario
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DeepLinkHandler;
}