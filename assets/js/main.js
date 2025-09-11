document.addEventListener('DOMContentLoaded', function() {
    // Toggle search bar
    const searchToggle = document.querySelector('.search-toggle');
    const searchExpanded = document.querySelector('.search-expanded');
    
    if (searchToggle && searchExpanded) {
        searchToggle.addEventListener('click', function() {
            searchExpanded.classList.toggle('active');
            if (searchExpanded.classList.contains('active')) {
                searchExpanded.querySelector('input').focus();
            }
        });
    }
    
    // Filter books
    const filterBtns = document.querySelectorAll('.filter-btn');
    const bookCards = document.querySelectorAll('.book-card');
    
    if (filterBtns.length > 0 && bookCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Filter books
                const filter = this.getAttribute('data-filter');
                
                bookCards.forEach(card => {
                    if (filter === 'all' || card.getAttribute('data-category') === filter) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // Save book functionality
    const saveBookBtns = document.querySelectorAll('.save-book');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    const toastClose = document.querySelector('.toast-close');
    
    if (saveBookBtns.length > 0 && toast && toastMessage) {
        saveBookBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Toggle saved state
                this.classList.toggle('saved');
                
                // Update icon
                const icon = this.querySelector('i');
                if (this.classList.contains('saved')) {
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    toastMessage.textContent = 'Libro guardado correctamente';
                } else {
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                    toastMessage.textContent = 'Libro eliminado de guardados';
                }
                
                // Show toast
                toast.classList.add('show');
                
                // Hide toast after 3 seconds
                setTimeout(() => {
                    toast.classList.remove('show');
                }, 3000);
            });
        });
    }
    
    // Close toast
    if (toastClose) {
        toastClose.addEventListener('click', function() {
            toast.classList.remove('show');
        });
    }
    
    // Back to top button
    const backToTopBtn = document.querySelector('.back-to-top');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        
        backToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
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
    
    // Add animation on scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.step-card, .testimonial-card, .book-card, .blog-card');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Set initial styles for animation
    const animatedElements = document.querySelectorAll('.step-card, .testimonial-card, .book-card, .blog-card');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Run animation on load and scroll
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
});