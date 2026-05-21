module.exports = {
  plugins: [
    require('cssnano')({
      preset: ['default', {
        calc: false        // preserva clamp()/calc() com variáveis CSS
      }]
    })
  ]
}
