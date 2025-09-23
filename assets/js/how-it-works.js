document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const booksCountInput = document.getElementById('books-count');
    const calculateBtn = document.getElementById('calculate-btn');
    const calculatorResults = document.getElementById('calculator-results');
    const co2Value = document.getElementById('co2-value');
    const co2Equivalent = document.getElementById('co2-equivalent');
    const plasticValue = document.getElementById('plastic-value');
    const plasticEquivalent = document.getElementById('plastic-equivalent');
    const waterValue = document.getElementById('water-value');
    const waterEquivalent = document.getElementById('water-equivalent');
    const funFactText = document.getElementById('fun-fact-text');
    const shareWhatsapp = document.getElementById('share-whatsapp');
    const shareTwitter = document.getElementById('share-twitter');
    const shareFacebook = document.getElementById('share-facebook');
    const shareLinkedin = document.getElementById('share-linkedin');
    const copyResult = document.getElementById('copy-result');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    const toastClose = document.querySelector('.toast-close');
    
    // Fun facts array
    const funFacts = [
        "La industria editorial consume aproximadamente 16 millones de toneladas de papel al año en todo el mundo.",
        "Se necesitan entre 2 y 3 litros de agua para producir una sola hoja de papel.",
        "Cada libro nuevo produce aproximadamente 2.5 kg de emisiones de CO2 durante su producción y distribución.",
        "Reciclar una tonelada de papel puede salvar hasta 17 árboles y 26,500 litros de agua.",
        "La producción de papel es la tercera mayor fuente de contaminación industrial del aire, el agua y el suelo.",
        "Se estima que se producen más de 2 mil millones de libros cada año en todo el mundo.",
        "La tinta utilizada en la impresión de libros contiene compuestos orgánicos volátiles que pueden ser perjudiciales para el medio ambiente.",
        "Un libro de 300 páginas requiere aproximadamente el equivalente a 0.06 árboles para su producción.",
        "La energía necesaria para producir un libro nuevo es suficiente para alimentar una bombilla LED durante más de 70 horas.",
        "Cada año, se talan más de 30 millones de hectáreas de bosques en todo el mundo, en parte para la producción de papel."
    ];
    
    // Calculate button click event
    calculateBtn.addEventListener('click', calculateImpact);
    
    // Enter key press event
    booksCountInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            calculateImpact();
        }
    });
    
    // Calculate impact function
    function calculateImpact() {
        const booksCount = parseInt(booksCountInput.value) || 0;
        
        if (booksCount <= 0) {
            showToast('Por favor, introduce un número válido de libros');
            return;
        }
        
        // Calculate environmental impact (approximate values per book)
        const co2PerBook = 2.5; // kg of CO2
        const plasticPerBook = 0.2; // kg of plastic (from packaging and covers)
        const waterPerBook = 10; // liters of water
        
        // Calculate totals
        const totalCO2 = (booksCount * co2PerBook).toFixed(1);
        const totalPlastic = (booksCount * plasticPerBook).toFixed(1);
        const totalWater = (booksCount * waterPerBook).toFixed(0);
        
        // Calculate equivalents
        const carKmEquivalent = Math.round(totalCO2 * 0.4); // 1 kg CO2 ≈ 0.4 km in an average car
        const bottlesEquivalent = Math.round(totalPlastic * 5); // 1 kg plastic ≈ 5 plastic bottles
        const showersEquivalent = Math.round(totalWater / 50); // 1 shower ≈ 50 liters
        
        // Update UI
        co2Value.textContent = totalCO2;
        co2Equivalent.textContent = carKmEquivalent;
        plasticValue.textContent = totalPlastic;
        plasticEquivalent.textContent = bottlesEquivalent;
        waterValue.textContent = totalWater;
        waterEquivalent.textContent = showersEquivalent;
        
        // Show random fun fact
        const randomIndex = Math.floor(Math.random() * funFacts.length);
        funFactText.textContent = funFacts[randomIndex];
        
        // Show results
        calculatorResults.style.display = 'block';
        
        // Scroll to results
        calculatorResults.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    // Share functions
    shareWhatsapp.addEventListener('click', function() {
        const booksCount = booksCountInput.value || 0;
        const co2 = co2Value.textContent;
        const text = `¡He evitado ${co2} kg de CO2 comprando ${booksCount} libros de segunda mano en Releo! 🌱📚 #LecturaSostenible #Releo`;
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    });
    
    shareTwitter.addEventListener('click', function() {
        const booksCount = booksCountInput.value || 0;
        const co2 = co2Value.textContent;
        const text = `¡He evitado ${co2} kg de CO2 comprando ${booksCount} libros de segunda mano en Releo! 🌱📚`;
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&hashtags=LecturaSostenible,Releo`;
        window.open(url, '_blank');
    });
    
    shareFacebook.addEventListener('click', function() {
        const booksCount = booksCountInput.value || 0;
        const co2 = co2Value.textContent;
        const text = `¡He evitado ${co2} kg de CO2 comprando ${booksCount} libros de segunda mano en Releo! 🌱📚`;
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    });
    
    shareLinkedin.addEventListener('click', function() {
        const booksCount = booksCountInput.value || 0;
        const co2 = co2Value.textContent;
        const text = `¡He evitado ${co2} kg de CO2 comprando ${booksCount} libros de segunda mano en Releo! 🌱📚`;
        const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    });
    
    copyResult.addEventListener('click', function() {
        const booksCount = booksCountInput.value || 0;
        const co2 = co2Value.textContent;
        const plastic = plasticValue.textContent;
        const water = waterValue.textContent;
        const text = `¡He evitado ${co2} kg de CO2, ${plastic} kg de plástico y ${water} litros de agua comprando ${booksCount} libros de segunda mano en Releo! 🌱📚\n\nDescubre tu impacto en: ${window.location.href}`;
        
        // Copy to clipboard
        navigator.clipboard.writeText(text).then(function() {
            showToast('Texto copiado al portapapeles');
        }).catch(function() {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showToast('Texto copiado al portapapeles');
        });
    });
    
    // Show toast function
    function showToast(message) {
        toastMessage.textContent = message;
        toast.classList.add('show');
        
        // Hide toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
    
    // Close toast
    if (toastClose) {
        toastClose.addEventListener('click', function() {
            toast.classList.remove('show');
        });
    }
});