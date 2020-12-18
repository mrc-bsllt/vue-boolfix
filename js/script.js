// 6aec7bf32e62af91512f360891825035 <-- chiave api
var app = new Vue (
  {
    el: "#app",
    data: {
      films: []
    }, //fine data

    methods: {
      searchFilms: function() {

        const self = this;

        axios
          .get("https://api.themoviedb.org/3/search/movie", {
            params: {
              api_key: "6aec7bf32e62af91512f360891825035",
              query: "ritorno al fut",
              language: "it-IT"
            }
          })
          .then(function (response) {
              self.films = response.data.results;
              console.log(self.films);
            }
          )


      }
    } //fine methods

  } //fine istanza vue
);
