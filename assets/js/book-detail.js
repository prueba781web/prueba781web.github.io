document.addEventListener('DOMContentLoaded', function() {
    // URL del endpoint de Google Apps Script
    const API_URL = 'https://script.google.com/macros/s/AKfycbwMfCM8qv2HEvVz2L6RQosjYVqnufT5JtBBPraZy2LQLd46V9onyx7xzUVAKuI3KPbRUg/exec'; // Reemplazar con la URL real
    
    // Elementos del DOM
    const bookDetailContainer = document.getElementById('book-detail-container');
    const relatedBooksContainer = document.getElementById('related-books-container');
    
    // Obtener ID del libro de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id');
    
    // Variables de estado
    let books = [];
    let currentBook = null;
    
    // Cargar libros desde la API
    async function loadBooks() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error('Error al cargar los libros');
            }
            books = await response.json();
            
            // Buscar el libro actual
            currentBook = books.find(book => book.id == bookId);
            
            if (currentBook) {
                renderBookDetail();
                renderRelatedBooks();
            } else {
                bookDetailContainer.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>No se encontró el libro solicitado.</p>
                        <a href="index.html" class="btn btn-primary">Volver al catálogo</a>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error:', error);
            bookDetailContainer.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>No se pudo cargar la información del libro. Inténtalo de nuevo más tarde.</p>
                </div>
            `;
        }
    }
    
    // Renderizar detalle del libro
    function renderBookDetail() {
        bookDetailContainer.innerHTML = `
            <div class="book-detail">
                <div class="book-image-container">
                    <img src="${currentBook.image || '../assets/img/libros/default.jpg'}" alt="${currentBook.title}" class="book-image">
                    <span class="book-status ${getStatusClass(currentBook.status)}">${getStatusText(currentBook.status)}</span>
                </div>
                <div class="book-info">
                    <h1>${currentBook.title}</h1>
                    <div class="book-meta">
                        <div class="meta-item">
                            <i class="fas fa-user"></i>
                            <span>${currentBook.author}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-tag"></i>
                            <span>${currentBook.category || 'General'}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-calendar"></i>
                            <span>${currentBook.year || 'Desconocido'}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-building"></i>
                            <span>${currentBook.publisher || 'Desconocido'}</span>
                        </div>
                    </div>
                    <div class="book-price">${currentBook.price ? `${currentBook.price} €` : 'Consultar'}</div>
                    <div class="book-description">
                        <h3>Descripción</h3>
                        <p>${currentBook.description || 'No hay descripción disponible para este libro.'}</p>
                    </div>
                    <div class="book-actions">
                        <button class="btn btn-primary btn-large">
                            <i class="fas fa-shopping-cart"></i> Solicitar libro
                        </button>
                        <button class="btn btn-outline save-book" data-id="${currentBook.id}">
                            <i class="far fa-bookmark"></i> Guardar
                        </button>
                        <a href="index.html" class="btn btn-secondary">
                            <i class="fas fa-arrow-left"></i> Volver al catálogo
                        </a>
                    </div>
                </div>
            </div>
        `;
        
        // Configurar evento para el botón de guardar
        setupSaveButton();
    }
    
    // Renderizar libros relacionados
    function renderRelatedBooks() {
        // Obtener libros de la misma categoría
        const relatedBooks = books
            .filter(book => book.category === currentBook.category && book.id != currentBook.id)
            .slice(0, 4);
        
        // Limpiar contenedor
        relatedBooksContainer.innerHTML = '';
        
        // Si no hay libros relacionados
        if (relatedBooks.length === 0) {
            relatedBooksContainer.innerHTML = `
                <p>No hay libros relacionados disponibles.</p>
            `;
            return;
        }
        
        // Crear tarjetas de libros relacionados
        relatedBooks.forEach(book => {
            const bookCard = createRelatedBookCard(book);
            relatedBooksContainer.appendChild(bookCard);
        });
    }
    
    // Crear tarjeta de libro relacionado
    function createRelatedBookCard(book) {
        const card = document.createElement('div');
        card.className = 'related-book-card';
        
        card.innerHTML = `
            <div class="related-book-image">
                <img src="${book.image || '../assets/img/libros/default.jpg'}" alt="${book.title}">
            </div>
            <div class="related-book-info">
                <h3>${book.title}</h3>
                <p class="author">${book.author}</p>
                <p class="price">${book.price ? `${book.price} €` : 'Consultar'}</p>
                <a href="book.html?id=${book.id}" class="btn btn-secondary btn-sm">Ver detalles</a>
            </div>
        `;
        
        return card;
    }
    
    // Configurar botón de guardar
    function setupSaveButton() {
        const saveButton = document.querySelector('.save-book');
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toast-message');
        const toastClose = document.querySelector('.toast-close');
        
        if (saveButton) {
            saveButton.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Toggle saved state
                this.classList.toggle('saved');
                
                // Update icon and text
                const icon = this.querySelector('i');
                if (this.classList.contains('saved')) {
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    this.innerHTML = '<i class="fas fa-bookmark"></i> Guardado';
                    toastMessage.textContent = 'Libro guardado correctamente';
                } else {
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                    this.innerHTML = '<i class="far fa-bookmark"></i> Guardar';
                    toastMessage.textContent = 'Libro eliminado de guardados';
                }
                
                // Show toast
                toast.classList.add('show');
                
                // Hide toast after 3 seconds
                setTimeout(() => {
                    toast.classList.remove('show');
                }, 3000);
            });
        }
        
        // Close toast
        if (toastClose) {
            toastClose.addEventListener('click', function() {
                toast.classList.remove('show');
            });
        }
    }
    
    // Obtener clase CSS según el estado
    function getStatusClass(status) {
        switch (status) {
            case 'available': return 'status-available';
            case 'reserved': return 'status-reserved';
            case 'sold': return 'status-sold';
            default: return 'status-available';
        }
    }
    
    // Obtener texto según el estado
    function getStatusText(status) {
        switch (status) {
            case 'available': return 'Disponible';
            case 'reserved': return 'Reservado';
            case 'sold': return 'Vendido';
            default: return 'Disponible';
        }
    }
    
    // Cargar libros al iniciar
    if (bookId) {
        loadBooks();
    } else {
        bookDetailContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>No se especificó un libro.</p>
                <a href="index.html" class="btn btn-primary">Volver al catálogo</a>
            </div>
        `;
    }
});