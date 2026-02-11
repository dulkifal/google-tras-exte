// Google Translate Customizer - Robust Copy Button Mover

const CONFIG = {
    copyButtonSelectors: [
        'button[aria-label="Copy translation"]',
        'button[aria-label="Nusxalash"]', // Uzbek? Just valid aria-label examples
        'div[role="button"][aria-label="Copy translation"]',
        'button[data-tooltip="Copy translation"]',
        // Generic fallback: look for button with copy icon SVG path if needed, 
        // but let's stick to aria-labels and structure for now.
        '.VfPpkd-Bz112c-LgbsSe[aria-label="Copy translation"]'
    ],
    targetContainerSelectors: [
        '.lRu31', // Specific top bar class found
        '.KkbLmb', // Main card class
        '.usGWQd'
    ]
};

function getCopyButton() {
    for (const selector of CONFIG.copyButtonSelectors) {
        const btn = document.querySelector(selector);
        if (btn) return btn;
    }
    // Fallback: iterate all buttons and check aria-label includes "Copy"
    const buttons = document.querySelectorAll('button, div[role="button"]');
    for (const btn of buttons) {
        const label = btn.getAttribute('aria-label');
        if (label && (label.includes('Copy') || label.includes('copy'))) {
            return btn;
        }
    }
    return null;
}

function getTargetContainer() {
    for (const selector of CONFIG.targetContainerSelectors) {
        const container = document.querySelector(selector);
        if (container) return container;
    }
    // Fallback: try to find the Arabic text and go up
    const arabicText = document.querySelector('span[lang="ar"]');
    if (arabicText) {
        // usually the text is in a container, which is in the card. 
        // We want the top of that card.
        // text -> ... -> card
        let parent = arabicText.parentElement;
        while (parent) {
            if (parent.classList.contains('lRu31') || parent.classList.contains('KkbLmb')) {
                return parent;
            }
            parent = parent.parentElement;
            if (!parent || parent.tagName === 'BODY') break;
        }
    }
    return null;
}

function getArabicTextContent() {
    const arabicTextElement = document.querySelector('span[lang="ar"]');
    if (arabicTextElement) return arabicTextElement.innerText;
    
    // Fallback to finding the largest text block in the container
    const targetContainer = getTargetContainer();
    if (targetContainer) {
       // logic to extract text... simplification:
       return targetContainer.innerText;
    }
    return '';
}

function moveCopyIcon() {
    if (document.querySelector('.custom-copy-btn-moved')) return; // Already moved

    const copyButton = getCopyButton();
    const targetContainer = getTargetContainer();

    if (copyButton && targetContainer) {
        console.log('GT-Customizer: Found copy button and target container', copyButton, targetContainer);
        
        // Create wrapper
        const newContainer = document.createElement('div');
        newContainer.className = 'custom-copy-btn-moved';
        newContainer.style.position = 'absolute';
        newContainer.style.top = '10px';
        newContainer.style.left = '15px'; 
        newContainer.style.zIndex = '1000';
        
        const newBtn = document.createElement('button');
        newBtn.innerText = 'Copy'; // Or an icon
        newBtn.style.cursor = 'pointer';
        newBtn.style.background = 'transparent';
        newBtn.style.border = '1px solid #ccc';
        newBtn.style.borderRadius = '4px';
        newBtn.style.padding = '5px 10px';
        newBtn.style.fontSize = '12px';
        newBtn.style.fontWeight = 'bold';
        newBtn.style.color = '#5f6368';
        
        // Try to clone the icon from the original if possible
        const originalIcon = copyButton.querySelector('i') || copyButton.querySelector('svg');
        if (originalIcon) {
            newBtn.innerHTML = '';
            newBtn.appendChild(originalIcon.cloneNode(true));
            newBtn.style.border = 'none';
        }

        newBtn.onclick = async (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('GT-Customizer: Clicking custom copy button');
            
            // Get the text to copy
            let textToCopy = '';
            const arabicElement = document.querySelector('span[lang="ar"]');
            
            if (arabicElement) {
                textToCopy = arabicElement.innerText;
            } else {
                // Try grabbing from the container text, cleaning up generic UI text if any
                // This is a risk if we grab "Listen" / "Share" text, but usually the translation is the main content.
                // Better to rely on the 'lang="ar"' selector which is specific to translation.
                // If user selected output language as Arabic, Google wraps it in lang="ar".
                // If it's another language, this logic fails, but user asked specifically for Arabic extension.
                
                // Fallback: try standard result selector
                const resultText = document.querySelector('.ryNqvb') || document.querySelector('.HwtS9c'); 
                if (resultText) textToCopy = resultText.innerText;
            }

            if (!textToCopy) {
                console.warn('GT-Customizer: Could not find text to copy, falling back to original button click');
                copyButton.click();
                return;
            }

            // Construct HTML for clipboard
            // Microsoft Word and other rich text editors respect HTML on clipboard.
            // Construct HTML for clipboard with MS Word specific styles
            // We use specific mso- tags to force the font in Word
            const htmlContent = `
                <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
                <head>
                    <meta charset='utf-8'>
                </head>
                <body>
                    <!-- Use mso-bidi-font-family for Arabic script -->
                    <span lang="AR-SA" dir="rtl" style="font-family: 'Sakkal Majalla Custom', 'Sakkal Majalla', sans-serif; mso-ascii-font-family: 'Sakkal Majalla'; mso-hansi-font-family: 'Sakkal Majalla'; mso-bidi-font-family: 'Sakkal Majalla'; font-size: 14.0pt; color: black;">
                        ${textToCopy}
                    </span>
                </body>
                </html>`;
            
            try {
                const blobHtml = new Blob([htmlContent], { type: 'text/html' });
                const blobText = new Blob([textToCopy], { type: 'text/plain' });
                const data = [new ClipboardItem({
                    'text/html': blobHtml,
                    'text/plain': blobText
                })];
                
                await navigator.clipboard.write(data);
                console.log('GT-Customizer: Copied to clipboard with font style');
                
                // Visual feedback
                const originalContent = newBtn.innerHTML;
                newBtn.innerHTML = '✓'; // Simple checkmark or color change
                newBtn.style.color = 'green';
                setTimeout(() => {
                    newBtn.innerHTML = originalContent;
                    newBtn.style.color = '#5f6368';
                    // Re-append icon if we lost it, but innerHTML restore should handle it if simple string. 
                    // Since we used appendChild for icon, innerHTML might be the SVG string. which is fine.
                    if (originalIcon && newBtn.children.length === 0 && !newBtn.innerText) {
                         newBtn.appendChild(originalIcon.cloneNode(true));
                    }
                }, 1000);

            } catch (err) {
                console.error('GT-Customizer: Clipboard write failed', err);
                // Fallback to original button
                copyButton.click();
            }
        };

        newContainer.appendChild(newBtn);
        
        targetContainer.style.position = 'relative'; 
        targetContainer.appendChild(newContainer);
    }
}

// Polling
setInterval(moveCopyIcon, 1000);

// Observer as backup
const observer = new MutationObserver((mutations) => {
    moveCopyIcon();
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});
