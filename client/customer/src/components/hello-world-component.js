class HelloWorld extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  connectedCallback () {
    this.render()
  }

  render () {
    this.shadow.innerHTML = `
      <style>
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
        }

        .content {
          text-align: center;
          padding: 2rem;
        }

        h1 {
          font-size: 3rem;
        }

      </style>

      <div class="container">
        <div class="content">
          <h1>¡Hola Mundo!</h1>
        </div>
      </div>
    `
  }
}

customElements.define('hello-world-component', HelloWorld)
