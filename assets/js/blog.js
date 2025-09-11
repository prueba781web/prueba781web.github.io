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
    
    // Page numbers click
    const pageNumbers = document.querySelectorAll('.page-number');
    
    pageNumbers.forEach(page => {
        page.addEventListener('click', function() {
            // Remove active class from all pages
            pageNumbers.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked page
            this.classList.add('active');
            
            // In a real application, this would load the corresponding page
            // For this example, we'll just show a message
            toastMessage.textContent = `Cargando página ${this.textContent}...`;
            toast.classList.add('show');
            
            // Hide toast after 1.5 seconds
            setTimeout(() => {
                toast.classList.remove('show');
            }, 1500);
        });
    });
});