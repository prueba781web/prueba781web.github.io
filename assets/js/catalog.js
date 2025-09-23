document.addEventListener('DOMContentLoaded', function() {
    // URL del endpoint de Google Apps Script
    const API_URL = 'https://script.google.com/macros/s/AKfycbwMfCM8qv2HEvVz2L6RQosjYVqnufT5JtBBPraZy2LQLd46V9onyx7xzUVAKuI3KPbRUg/exec'; // Reemplazar con la URL real
    
    // Elementos del DOM
    const booksContainer = document.getElementById('books-container');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const categoryFilter = document.getElementById('category-filter');
    const sortFilter = document.getElementById('sort-filter');
    const paginationContainer = document.getElementById('pagination');
    
    // Variables de estado
    let books = [];
    let filteredBooks = [];
    let currentPage = 1;
    const booksPerPage = 12;
    
    // Cargar libros desde la API
    async function loadBooks() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error('Error al cargar los libros');
            }
            books = await response.json();
            filteredBooks = [...books];
            renderBooks();
            setupPagination();
        } catch (error) {
            console.error('Error:', error);
            booksContainer.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>No se pudieron cargar los libros. Inténtalo de nuevo más tarde.</p>
                </div>
            `;
        }
    }
    
    // Renderizar libros
    function renderBooks() {
        // Calcular índices para paginación
        const startIndex = (currentPage - 1) * booksPerPage;
        const endIndex = startIndex + booksPerPage;
        const booksToShow = filteredBooks.slice(startIndex, endIndex);
        
        // Limpiar contenedor
        booksContainer.innerHTML = '';
        
        // Si no hay libros
        if (booksToShow.length === 0) {
            booksContainer.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <p>No se encontraron libros que coincidan con tu búsqueda.</p>
                </div>
            `;
            return;
        }
        
        // Crear tarjetas de libros
        booksToShow.forEach(book => {
            const bookCard = createBookCard(book);
            booksContainer.appendChild(bookCard);
        });
        
        // Configurar eventos para los botones de guardar
        setupSaveButtons();
    }
    
    // Crear tarjeta de libro
    function createBookCard(book) {
        const card = document.createElement('div');
        card.className = 'book-card';
        card.setAttribute('data-category', book.category || 'all');
        
        card.innerHTML = `
            <div class="book-image">
                <img src="${book.image || '../assets/img/libros/default.jpg'}" alt="${book.title}">
                <div class="book-actions">
                    <button class="save-book" data-id="${book.id}" aria-label="Guardar libro">
                        <i class="far fa-bookmark"></i>
                    </button>
                </div>
            </div>
            <div class="book-info">
                <h3>${book.title}</h3>
                <p class="author">${book.author}</p>
                <p class="price">${book.price ? `${book.price} €` : 'Consultar'}</p>
                <a href="book.html?id=${book.id}" class="btn btn-secondary">
                    Ver detalles
                </a>
            </div>
        `;
        
        return card;
    }
    
    // Configurar botones de guardar
    function setupSaveButtons() {
        const saveButtons = document.querySelectorAll('.save-book');
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toast-message');
        const toastClose = document.querySelector('.toast-close');
        
        saveButtons.forEach(btn => {
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
        
        // Close toast
        if (toastClose) {
            toastClose.addEventListener('click', function() {
                toast.classList.remove('show');
            });
        }
    }
    
    // Configurar paginación
    function setupPagination() {
        paginationContainer.innerHTML = '';
        
        // Calcular número de páginas
        const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
        
        // Si solo hay una página, no mostrar paginación
        if (totalPages <= 1) return;
        
        // Botón anterior
        const prevBtn = document.createElement('button');
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevBtn.disabled = currentPage === 1;
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderBooks();
                setupPagination();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
        paginationContainer.appendChild(prevBtn);
        
        // Números de página
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.textContent = i;
            pageBtn.classList.toggle('active', i === currentPage);
            pageBtn.addEventListener('click', () => {
                currentPage = i;
                renderBooks();
                setupPagination();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            paginationContainer.appendChild(pageBtn);
        }
        
        // Botón siguiente
        const nextBtn = document.createElement('button');
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderBooks();
                setupPagination();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
        paginationContainer.appendChild(nextBtn);
    }
    
    // Filtrar y ordenar libros
    function filterAndSortBooks() {
        // Obtener valores de los filtros
        const searchTerm = searchInput.value.toLowerCase();
        const category = categoryFilter.value;
        const sortBy = sortFilter.value;
        
        // Filtrar por búsqueda y categoría
        filteredBooks = books.filter(book => {
            const matchesSearch = book.title.toLowerCase().includes(searchTerm) || 
                                  book.author.toLowerCase().includes(searchTerm);
            const matchesCategory = category === 'all' || book.category === category;
            return matchesSearch && matchesCategory;
        });
        
        // Ordenar libros
        switch (sortBy) {
            case 'title-asc':
                filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'title-desc':
                filteredBooks.sort((a, b) => b.title.localeCompare(a.title));
                break;
            case 'price-asc':
                filteredBooks.sort((a, b) => parseFloat(a.price || 0) - parseFloat(b.price || 0));
                break;
            case 'price-desc':
                filteredBooks.sort((a, b) => parseFloat(b.price || 0) - parseFloat(a.price || 0));
                break;
        }
        
        // Resetear a la primera página
        currentPage = 1;
        
        // Renderizar libros y paginación
        renderBooks();
        setupPagination();
    }
    
    // Configurar eventos de búsqueda y filtros
    searchBtn.addEventListener('click', filterAndSortBooks);
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            filterAndSortBooks();
        }
    });
    categoryFilter.addEventListener('change', filterAndSortBooks);
    sortFilter.addEventListener('change', filterAndSortBooks);
    
    // Cargar libros al iniciar
    loadBooks();
});