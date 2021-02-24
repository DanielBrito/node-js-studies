const express = require("express");
const bodyParser = require("body-parser");

const { Sequelize } = require("sequelize/types");

const Playlist = require("./models/playlist");
const Artist = require("./models/artist");
const Album = require("./models/album");
const Track = require("./models/track");
const Artist = require("./models/artist");

const app = express();

const {Op} = Sequelize;

app.use(bodyParser.json());

// OneToMany:
Artist.hasMany(Album, {
  foreignKey: "artist_id"
});

Album.belongsTo(Artist, {
  foreignKey: "artist_id"
});

// ManyToMany:
Playlist.belongsToMany(Track, {
  through: "playlist_track",
  foreignKey: "playlist_id",
  timestamps: false
});

Track.belongsToMany(Playlist, {
  through: "playlist_track",
  foreignKey: "track_id",
  timestamps: false
});

add.post("/api/artists", function(request, response){
  Artist.create({
    name: request.body.name
  }).then(() => {
    response.json(artist);
  }, (errs) => {
    response.status(422).json({
      errs: errs.map((err) => {
        return {
          attribute: err.path,
          message: err.message
        };
      })
    });
  })
})

app.get("/api/playlists", function(request, response){
  let filter = {};
  let {q} = request.query;

  if(q){
    filter = {
      where: {
        name: {
          [Op.like]: `${q}%`
        }
      }
    }
  }

  Playlists.findAll(filter).then((playlists) => {
    response.json(playlists);
  })
});

app.get("/api/playlists/:id", function(request, response){
  const {id} = request.params;

  Playlist.findByPk(id, {
    include: [Track]
  }).then((playlist) => {
    if(playlist){
      response.json(playlist);
    }
    else{
      response.status(404).send();
    }
  })
});

app.get("/api/track/:id", function(request, response){
  const {id} = request.params;

  Track.findByPk(id, {
    include: [Playlist]
  }).then((track) => {
    if(track){
      response.json(track);
    }
    else{
      response.status(404).send();
    }
  })
});

app.get("/api/artists/:id", function(request, response){
  const {id} = request.params;

  Artist.findByPk(id, {
    include: [Album]
  }).then((artist) => {
    if(artist){
      response.json(artist);
    }
    else{
      response.status(404).send();
    }
  })
});

app.get("/api/albums/:id", function(request, response){
  const {id} = request.params;

  Album.findByPk(id, {
    include: [Artist]
  }).then((album) => {
    if(album){
      response.json(album);
    }
    else{
      response.status(404).send();
    }
  })
});

app.delete("/api/playlists/:id", function(request, response){
  let {id} = request.params;

  Playlist
    .findByPk(id)
    .then((playlist) => {
      if(playlist){
        return playlist.setTracks([]).then(() => {
          return playlist.destroy();
        })
      }
      else{
        return Promise.reject();
      }
  })
  .then(() => {
    response.status(204).send();
  }, () => {
    response.status(404).send();
  });
});

app.listen(8000);