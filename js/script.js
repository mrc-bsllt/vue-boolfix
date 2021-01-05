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
            self.filmsBackup = self.films;
            self.totalResultFilms = response.data.total_results;
            self.totalPageFilm = response.data.total_pages;

            for (var i = 0; i < self.films.length; i++) {

              const element = self.films[i];

              self.getRated(element);
              self.getCast(element, 'movie');

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
            self.tvSeriesBackup = self.tvSeries;
            self.totalResultSeries = response.data.total_results;
            self.totalPageTv = response.data.total_pages;

            for(var i = 0; i < self.tvSeries.length; i++) {

              const element = self.tvSeries[i];

              self.getRated(element);
              self.getCast(element, 'tv');

              }
            });
        }

      }, //fine funzione

      getRated: function(ref) {
        const notFloorNumber = Math.round(ref.vote_average)/2;

        ref.fullStars = Math.floor(notFloorNumber);

        if ((notFloorNumber - ref.fullStars) != 0) {
          ref.halfEmptyStar = 1;
        } else {
          ref.halfEmptyStar = 0;
        }

        ref.emptyStars = 5 - ref.halfEmptyStar - ref.fullStars;

      }, //fine funzione

      getCast: function(ref, type) {

        axios
          .get(`https://api.themoviedb.org/3/${type}/${ref.id}/credits`, {
            params: {
              api_key: "6aec7bf32e62af91512f360891825035",
            }
          }).then((response) => {

            ref.cast = [];

            for (var i = 0; i < response.data.cast.length; i++) {
              if (ref.cast.length < 5) {
                ref.cast.push(response.data.cast[i].name);
              }
            }
            this.$forceUpdate();
          });

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

            self.getRated(element);
            self.getCast(element, 'movie');

          }

        });
    }


  } //fine istanza vue
);
