class SearchBar extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.searchTimeout = null
    this.searchResults = [] // Almacenar resultados
  }

  connectedCallback () {
    this.render()
    this.setupEventListeners()
  }

  setupEventListeners () {
    const searchInput = this.shadow.querySelector('.search-input')

    searchInput.addEventListener('keyup', (e) => {
      this.handleKeyUp(e.target.value)
    })

    // Cerrar dropdown al hacer clic fuera
    document.addEventListener('click', (e) => {
      if (!this.contains(e.target)) {
        this.hideResults()
      }
    })
  }

  handleKeyUp (query) {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout)
    }

    if (query.trim().length >= 4) {
      this.searchTimeout = setTimeout(() => {
        this.performSearch(query.trim())
      }, 500)
    } else {
      // Ocultar resultados si hay menos de 4 caracteres
      this.hideResults()
    }
  }

  async performSearch (query) {
    try {
      const response = await fetch('/api/customer/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
      })

      if (!response.ok) {
        throw new Error(`Error en la búsqueda: ${response.statusText}`)
      }

      const data = await response.json()
      console.log('Resultados de búsqueda:', data.results)

      this.searchResults = data.results
      this.displayResults()

      this.dispatchEvent(new CustomEvent('searchResults', {
        detail: { results: data.results },
        bubbles: true,
        composed: true
      }))
    } catch (error) {
      console.error('Error al realizar la búsqueda:', error)
      this.hideResults()
    }
  }

  displayResults () {
    const resultsContainer = this.shadow.querySelector('.results-dropdown')

    if (!this.searchResults || this.searchResults.length === 0) {
      resultsContainer.innerHTML = '<div class="no-results">No se encontraron resultados</div>'
      resultsContainer.classList.add('visible')
      return
    }

    const resultsHTML = this.searchResults.map(product => `
      <div class="result-item" data-url="${product.url}">
        <span class="result-name">${product.name}</span>
      </div>
    `).join('')

    resultsContainer.innerHTML = resultsHTML
    resultsContainer.classList.add('visible')

    // Añadir event listeners a cada resultado
    const resultItems = resultsContainer.querySelectorAll('.result-item')
    resultItems.forEach(item => {
      item.addEventListener('click', (e) => {
        const url = e.currentTarget.getAttribute('data-url')
        if (url) {
          window.open(url, '_blank')
        }
      })
    })
  }

  hideResults () {
    const resultsContainer = this.shadow.querySelector('.results-dropdown')
    resultsContainer.classList.remove('visible')
  }

  render () {
    this.shadow.innerHTML =
      /* html */`
      <style>
        * {
          box-sizing: border-box;
        }
  
        button {
          background-color: transparent;
          border: none;
          cursor: pointer;
          outline: none;
          padding: 0;
        }
  
        input {
          font-family: "Nunito Sans", serif;
          font-optical-sizing: auto;
        }
  
        .search-container {
          align-items: center;
          background: linear-gradient(to bottom, hsl(200, 77.10%, 65.00%), #B3E8FF);
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-height: 200px;
          padding: 2rem;
          width: 100%;
          gap: 1.5rem;
        }
  
        .search-title {
          color: hsl(0, 0%, 20%);
          font-family: "Nunito Sans", serif;
          font-size: 2rem;
          font-weight: 800;
          margin: 0;
          text-align: center;
  
          @media (min-width: 768px) {
            font-size: 2.5rem;
          }
        }
  
        .search-wrapper-container {
          position: relative;
          width: 100%;
          max-width: 600px;
        }
  
        .search-wrapper {
          align-items: center;
          background-color: hsl(0, 0%, 100%);
          border-radius: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          display: flex;
          gap: 0.75rem;
          overflow: hidden;
          padding: 0.75rem 1.5rem;
          width: 100%;
  
          @media (min-width: 768px) {
            padding: 1rem 2rem;
          }
        }
  
        .search-icon-left {
          color: hsl(0, 0%, 60%);
          flex-shrink: 0;
          height: 20px;
          width: 20px;
        }
  
        .search-input {
          border: none;
          color: hsl(0, 0%, 20%);
          flex: 1;
          font-size: 1rem;
          outline: none;
          padding: 0.5rem;
  
          @media (min-width: 768px) {
            font-size: 1.1rem;
          }
        }
  
        .search-input::placeholder {
          color: hsl(0, 0%, 60%);
        }
  
        /* ESTILOS DEL DROPDOWN DE RESULTADOS */
        .results-dropdown {
          background-color: hsl(0, 0%, 100%);
          border-radius: 1rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          display: none;
          margin-top: 0.5rem;
          position: absolute;
          top: 100%;
          width: 100%;
          z-index: 1000;
        }
  
        .results-dropdown.visible {
          display: block;
        }
  
        .result-item {
          border-bottom: 1px solid hsl(0, 0%, 90%);
          cursor: pointer;
          font-family: "Nunito Sans", serif;
          padding: 1rem 1.5rem;
          transition: background-color 0.2s ease;
        }
  
        .result-item:last-child {
          border-bottom: none;
        }
  
        .result-item:hover {
          background-color: hsl(200, 77%, 95%);
        }
  
        .result-name {
          color: hsl(0, 0%, 20%);
          font-size: 1rem;
          font-weight: 600;
        }
  
        .no-results {
          color: hsl(0, 0%, 50%);
          font-family: "Nunito Sans", serif;
          padding: 1rem 1.5rem;
          text-align: center;
        }
      </style>
  
      <section class="search-container">
        <h1 class="search-title">Buscador</h1>
        <div class="search-wrapper-container">
          <div class="search-wrapper">
            <svg class="search-icon-left" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              class="search-input" 
              placeholder="Buscar..."
              aria-label="Campo de búsqueda"
            >
          </div>
          <div class="results-dropdown"></div>
        </div>
      </section>
      `
  }
}

customElements.define('search-bar-component', SearchBar)
