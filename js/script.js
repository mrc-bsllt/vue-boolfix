// 6aec7bf32e62af91512f360891825035 <-- chiave api

// {
//   "adult": false,
//   "backdrop_path": "/fq3wyOs1RHyz2yfzsb4sck7aWRG.jpg",
//   "genre_ids": [
//       12,
//       35,
//       878,
//       10751
//   ],
//   "id": 105,
//   "original_language": "en",
//   "original_title": "Back to the Future",
//   "overview": "Eighties teenager Marty McFly is accidentally sent back in time to 1955, inadvertently disrupting his parents' first meeting and attracting his mother's romantic interest. Marty must repair the damage to history by rekindling his parents' romance and - with the help of his eccentric inventor friend Doc Brown - return to 1985.",
//   "popularity": 48.943,
//   "poster_path": "/xlBivetfrtF84Yx0zISShnNtHYe.jpg",
//   "release_date": "1985-07-03",
//   "title": "Back to the Future",
//   "video": false,
//   "vote_average": 8.3,
//   "vote_count": 14221
// },
var app = new Vue (
  {
    el: "#app",
    data: {
      prefix: "https://image.tmdb.org/t/p/w220_and_h330_face/",
      films: [],
      searchInputVal: ""
    }, //fine data

    methods: {
      searchFilms: function() {

        const self = this;
        const query = this.searchInputVal;
        self.films = [];

        axios
          .get("https://api.themoviedb.org/3/search/movie", {
            params: {
              api_key: "6aec7bf32e62af91512f360891825035",
              query: query,
              language: "it-IT"
            }
          })
          .then(function (response) {
              self.films = response.data.results;
            }
          )
          console.log(self.films);
      }
    } //fine methods

  } //fine istanza vue
);
