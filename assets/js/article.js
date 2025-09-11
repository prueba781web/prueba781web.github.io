document.addEventListener('DOMContentLoaded', function() {
    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    const toastClose = document.querySelector('.toast-close');
    
    if (newsletterForm && toast && toastMessage) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            
            if (email) {
                // Show success message
                toastMessage.textContent = '¡Gracias por suscribirte a nuestro boletín!';
                toast.classList.add('show');
                
                // Reset form
                this.reset();
                
                // Hide toast after 3 seconds
                setTimeout(() => {
                    toast.classList.remove('show');
                }, 3000);
            }
        });
    }
    
    // Close toast
    if (toastClose) {
        toastClose.addEventListener('click', function() {
            toast.classList.remove('show');
        });
    }
    
    // Comments form
    const commentsForm = document.querySelector('.comments-form form');
    
    if (commentsForm && toast && toastMessage) {
        commentsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show success message
            toastMessage.textContent = '¡Gracias por tu comentario! Estará visible tras ser moderado.';
            toast.classList.add('show');
            
            // Reset form
            this.reset();
            
            // Hide toast after 3 seconds
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        });
    }
    
    // Share buttons
    const shareButtons = document.querySelectorAll('.share-btn');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const url = window.location.href;
            const title = document.title;
            
            if (this.classList.contains('facebook')) {
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
            } else if (this.classList.contains('twitter')) {
                window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, '_blank');
            } else if (this.classList.contains('pinterest')) {
                const image = document.querySelector('.featured-image img').src;
                window.open(`https://pinterest.com/pin/create/button/?url=${url}&media=${image}&description=${title}`, '_blank');
            } else if (this.classList.contains('whatsapp')) {
                window.open(`https://wa.me/?text=${title} ${url}`, '_blank');
            } else if (this.classList.contains('email')) {
                window.location.href = `mailto:?subject=${title}&body=${url}`;
            }
        });
    });
    
    // Reply buttons
    const replyButtons = document.querySelectorAll('.reply-btn');
    
    replyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const commentForm = document.querySelector('.comments-form');
            
            if (commentForm) {
                commentForm.scrollIntoView({ behavior: 'smooth' });
                commentForm.querySelector('textarea').focus();
            }
        });
    });
});