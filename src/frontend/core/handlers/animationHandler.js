
export class AnimationHandler {

    static fadeInFromBottom(card) {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 30);
    }


    static fadeInFromSide(card) {
        setTimeout(() => {
            card.classList.add('fadeInFromSide');
        }, 30);
    }

    
    static fadeOutToBottom(card) {
        card.classList.remove('fadeInFromBottom');
    }


    static fadeOutCard(card) { 
        card.classList.add('fadeOut');
        setTimeout(() => {
            card.remove();
        }, 700);
    }


    static fadeIn(node) {
        setTimeout(() => {
            node.classList.add('fadeIn');
        }, 30);
        
    }


    static fadeOut(node) {
        node.classList.remove('fadeIn');
        setTimeout(() => {
            node.style.display = 'none';
        }, 150);
    }


    static fadeOutBookmarkPatch(node) {
        node.classList.add('fadeOut');

        setTimeout(() => {
            node.style.display = 'none';
            node.classList.remove('fadeOut');
        }, 150);
    }


    static fadeOutContextMenu(node) {
        node.classList.remove('fadeIn');
        setTimeout(() => {
            node.remove();
        }, 100)
    }
}