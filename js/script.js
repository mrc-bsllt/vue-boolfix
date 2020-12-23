var app = new Vue (
  {
    el: "#app",
    data: {
      prefix: "https://image.tmdb.org/t/p/w220_and_h330_face/",
      films: [],
      filmsBackup: [],
      tvSeries: [],
      tvSeriesBackup: [],
      genres: [],
      totalResultFilms: -1,
      totalResultSeries: -1,
      searchInputVal: "",
      hamburgerStatus: false,
      activeClass: false
    }, //fine data

    methods: {
      searchFilms: function() {
        const self = this;
        const query = this.searchInputVal;
        self.films = [];

        if (query != "") {
          axios
          .get("https://api.themoviedb.org/3/search/movie", {
            params: {
              api_key: "6aec7bf32e62af91512f360891825035",
              query,
              language: "it-IT"
            }
          }).then((response) => {
            self.films = response.data.results;
            self.filmsBackup = response.data.results;
            self.totalResultFilms = response.data.total_results;

            for (var i = 0; i < self.films.length; i++) {
              const element = self.films[i];
              element.cast = [];
              const notFloorNumber = Math.round(element.vote_average)/2;

              element.fullStars = Math.floor(notFloorNumber);

              if ((notFloorNumber - element.fullStars) != 0) {
                element.halfEmptyStar = 1;
              } else {
                element.halfEmptyStar = 0;
              }

              element.emptyStars = 5 - element.halfEmptyStar - element.fullStars;

              axios
                .get(`https://api.themoviedb.org/3/movie/${element.id}/credits`, {
                  params: {
                    api_key: "6aec7bf32e62af91512f360891825035",
                  }
                }).then((response) => {
                  for (var i = 0; i < response.data.cast.length; i++) {
                    if (element.cast.length < 5) {
                      element.cast.push(response.data.cast[i].name);
                    }
                  }
                  this.$forceUpdate();
                });
            }
          });
        }
      }, //fine funzione

      searchTvSeries: function() {

        const self = this;
        const query = this.searchInputVal;
        self.tvSeries = [];

        if (query != "") {
          axios
          .get("https://api.themoviedb.org/3/search/tv", {
              params: {
              api_key: "6aec7bf32e62af91512f360891825035",
              query,
              language: "it-IT"
            }
          }).then( (response) => {
            self.tvSeries = response.data.results;
            self.tvSeriesBackup = response.data.results;
            self.totalResultSeries = response.data.total_results;

            for(var i = 0; i < self.tvSeries.length; i++) {
              const element = self.tvSeries[i];
              element.cast = [];
              const notFloorNumber = Math.round(element.vote_average)/2;

              element.fullStars = Math.floor(notFloorNumber);

              if ((notFloorNumber - element.fullStars) != 0) {
                element.halfEmptyStar = 1;
              } else {
                element.halfEmptyStar = 0;
              }

              element.emptyStars = 5 - element.halfEmptyStar - element.fullStars;

              axios
                .get(`https://api.themoviedb.org/3/tv/${element.id}/credits`, {
                  params: {
                    api_key: "6aec7bf32e62af91512f360891825035",
                  }
                }).then((response) => {
                  for (var i = 0; i < response.data.cast.length; i++) {
                    if (element.cast.length < 5) {
                      element.cast.push(response.data.cast[i].name);
                    }
                  }
                  this.$forceUpdate();
                });
              }
            }
          )
        }

      }, //fine funzione

      activeHamburger: function() {
        if (this.hamburgerStatus == false) {
          this.hamburgerStatus = true;
        } else {
          this.hamburgerStatus = false;
        }
      }, //fine funzione

      toggleActiveClass: function() {
        if (this.activeClass) {
          this.activeClass = false;
        } else {
          this.activeClass = true;
        }
      }, //fine funzione

      filterByGenre: function(index) {
        const idChosenGenre = this.genres[index].id;
        this.films = this.filmsBackup;
        this.tvSeries = this.tvSeriesBackup;

        const filteredFilms = this.films.filter(
          (element) => {
            return element.genre_ids.includes(idChosenGenre)
          }
        );
        this.films = filteredFilms;

        const filteredSeries = this.tvSeries.filter(
          (element) => {
            return element.genre_ids.includes(idChosenGenre)
          }
        );
        this.tvSeries = filteredSeries;

        this.activeClass = false;
      } //fine funzione

    }, //fine methods

    mounted: function() {
      const self = this;
      axios
      .get("https://api.themoviedb.org/3/genre/movie/list", {
          params: {
          api_key: "6aec7bf32e62af91512f360891825035",
        }
      })
      .then(function (response) {
          self.genres = response.data.genres
        }
      )

    } //fine mounted


  } //fine istanza vue
);
