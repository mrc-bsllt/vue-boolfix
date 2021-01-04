var app = new Vue (
  {
    el: "#app",
    data: {
      prefix: "https://image.tmdb.org/t/p/w220_and_h330_face/",
      films: [],
      filmsBackup: [],
      tvSeries: [],
      tvSeriesBackup: [],
      topRated: [],
      genres: [],
      totalResultFilms: -1,
      totalResultSeries: -1,
      searchInputVal: "",
      activeClass: {
        hamburger: false,
        choiceGenre: false,
      },
      debounce: null,
      pageFilm: 1,
      totalPageFilm: null,
      pageTv: 1,
      totalPageTv: null
    }, //fine data

    methods: {
      searchFilms: function() {
        const self = this;
        const query = this.searchInputVal;
        const page = this.pageFilm;
        self.films = [];

        if (query != "") {
          axios
          .get("https://api.themoviedb.org/3/search/movie", {
            params: {
              api_key: "6aec7bf32e62af91512f360891825035",
              query,
              page,
              language: "it-IT"
            }
          }).then((response) => {
            self.films = response.data.results;
            self.filmsBackup = response.data.results;
            self.totalResultFilms = response.data.total_results;
            self.totalPageFilm = response.data.total_pages;

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
        const page = this.pageTv;
        self.tvSeries = [];

        if (query != "") {
          axios
          .get("https://api.themoviedb.org/3/search/tv", {
              params: {
              api_key: "6aec7bf32e62af91512f360891825035",
              query,
              page,
              language: "it-IT"
            }
          }).then( (response) => {
            self.tvSeries = response.data.results;
            self.tvSeriesBackup = response.data.results;
            self.totalResultSeries = response.data.total_results;
            self.totalPageTv = response.data.total_pages;

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

      toggleActiveClass: function(param) {
        this.activeClass[param] = !this.activeClass[param];
      }, //fine funzione

      filterByGenre: function(index, array, array2) {
        const idChosenGenre = this.genres[index].id;
        this[array] = this[array2];

        const newArrayFilms = this[array].filter(
          (element) => {
            return element.genre_ids.includes(idChosenGenre)
          }
        );
        this[array] = newArrayFilms;

        this.activeClass.choiceGenre = false;
      }, //fine funzione

      searchDebounce: function(callback, callback2) {
        clearTimeout(this.debounce);
        this.debounce = setTimeout(() => {
          callback();
          callback2();
        }, 500)
      }, //fine funzione

      changePageFilm: function(param) {
        if(param == "--") {
          this.pageFilm--;
        } else {
          this.pageFilm++;
        }
        this.searchFilms();
      }, //fine funzione

      changePagePageTv: function(param) {
        if(param == "--") {
          this.pageTv--;
        } else {
          this.pageTv++;
        }
        this.searchTvSeries();
      }, //fine funzione

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
      );

    }, //fine mounted

    created: function() {
      const self = this;

      axios
        .get("https://api.themoviedb.org/3/movie/top_rated", {
          params: {
            api_key: "6aec7bf32e62af91512f360891825035",
            language: "it-IT"
          }
        }).then(function(response) {

          self.topRated = response.data.results;

          for (var i = 0; i < self.topRated.length; i++) {
            const element = self.topRated[i];
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
                self.$forceUpdate();
              });
          }

        })
    }


  } //fine istanza vue
);
