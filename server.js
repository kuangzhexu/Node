const express = require('express');
const cors = require('cors');
const app = express();
const fetch = require('node-fetch');
app.use(cors());

// app.use(express.static(process.cwd()+"/my-app/dist/my-app/"));

var months = {
    '01': 'January',
    '02': 'February',
    '03': 'March',
    '04': 'April',
    '05': 'May',
    '06': 'June',
    '07': 'July',
    '08': 'August',
    '09': 'September',
    '10': 'October',
    '11': 'November',
    '12': 'December'
};

function get_movie_po(url,settings,res) {
    fetch(url, settings)
    .then(res => res.json())
    .then((json) => {
        var c = 0;
        var multi_re = '';
        var final = [];
        var total =[];
        var temp = [];
        var img_base = "https://image.tmdb.org/t/p/original"
        for (item of json.results){
            if ((item.poster_path === undefined || item.poster_path === null)){
                img_base = "../img.png";
            }else{
                c += 1;
                img_base = "https://image.tmdb.org/t/p/original" + item.poster_path;
                var name = item.title.split('"').join('\\"').split(/\n/g).join('\\n').split(/\r/g).join('\\r').split(/\t/g).join('\\t');
                multi_re = '{ "id": '+item.id+', "name": '+'"'+name+'"'+', "media_type": "movie"'+ ', "img":' + '"' +img_base + '"' +' }';
                var obj = JSON.parse(multi_re);
                // console.log('m_po');
                temp.push(obj);
                total.push(obj);
            };
            if (total.length === 10){
                break;
            }
            if (c === 6) {
                final.push(temp);
                c = 0;
                temp = [];
            }
        };
        if (temp.length>0){
            final.push(temp);
        }
        final =  [final,total];
        res.send(final)
    });
};

function get_tv_po(url,settings,res) {
    fetch(url, settings)
    .then(res => res.json())
    .then((json) => {
        var c = 0;
        var multi_re = '';
        var final = [];
        var total =[];
        var temp = [];
        var img_base = "https://image.tmdb.org/t/p/original";
        for (item of json.results){
            if ((item.poster_path === undefined || item.poster_path === null)){
                img_base = "../img.png";
            }else{
                c += 1;
                img_base = "https://image.tmdb.org/t/p/original" + item.poster_path;
                var name = item.name.split('"').join('\\"').split(/\n/g).join('\\n').split(/\r/g).join('\\r').split(/\t/g).join('\\t');
                multi_re = '{ "id": '+item.id+', "name": '+'"'+name+'"'+', "media_type": "tv"'+ ', "img":' + '"' +img_base + '"' +' }';
                // console.log(multi_re);
                var obj = JSON.parse(multi_re);
                temp.push(obj);
                total.push(obj);
            };
            if (total.length === 10) {
                break;
            }
            if (c === 6) {
                // console.log(temp);
                final.push(temp);
                c = 0;
                temp = [];
            }
        };
        if (temp.length>0){
            final.push(temp);
        }
        // console.log(json.results.length)
        final =  [final,total];
        res.send(final)
    });
};

function get_v(v,settings,res) {
    var final = [];
    fetch(v, settings)
    .then(res => res.json())
    .then((json) => {
        var re = '';
        for (item of json.results){
            if (item.type === 'Trailer' || item.type === 'Teaser'){
                var name = item.name.split('"').join('\\"').split(/\n/g).join('\\n').split(/\r/g).join('\\r').split(/\t/g).join('\\t');
                re = '{ "site": '+'"'+item.site+'"'+', "name": '+'"'+name+'"'+', "type": '+ '"' + item.type + '"' +', "key":' + '"' + item.key + '"' +' }';
                var obj_v = JSON.parse(re);
                // console.log('g_v1');
                final.push(obj_v);
                break;
            }
        }
        if (final.length === 0){
            re = '{ "key": "tzkWB85ULJY", "type": "default", "site":  "YouTube"}';
            var obj_v = JSON.parse(re);
            // console.log('get_v2');
            final.push(obj_v);
        }
        res.send(final)
    });
};

function get_movie_d(m_d,settings,res) {
    var final = [];
    fetch(m_d, settings)
    .then(res => res.json())
    .then((json) => {
        // console.log(json);
        var gen = '';
        var re = '';
        for (genre of json.genres){
             gen += genre.name + ', ';
        };
        gen = gen.slice(0,-2);
        var sp = '';
        for (lang of json.spoken_languages){
            sp += lang.english_name + ', ';
        };
        sp = sp.slice(0,-2);
        var rel = json.release_date.slice(0,4);
        var rt = json.runtime;
        if (rt/60 >= 1){
            var h = Math.floor(rt/60);
            var m = rt - (h)*60;
            rt = h+"hr "+m+"mins";
        }else{
            rt = rt + "mins";
        }
        if (json.poster_path === undefined || json.poster_path === null){
            var img_base = "./img.png"
        }else{
            var img_base = "https://image.tmdb.org/t/p/original" + json.poster_path;
        }
        // console.log(img_base);
        var over = json.overview.split('"').join('\\"').split(/\n/g).join('\\n').split(/\r/g).join('\\r').split(/\t/g).join('\\t');
        var tag = json.tagline.split('"').join('\\"').split(/\n/g).join('\\n').split(/\r/g).join('\\r').split(/\t/g).join('\\t');
        re = '{ "title": '+'"'+json.title+'"'+
                ', "genres": '+'"'+gen+'"'+
                ', "spoken_language": '+ '"' + sp + '"' +
                ', "release_date":' + '"' + rel + '"' + 
                ', "runtime": '+'"'+rt+'"' + 
                ', "overview":' + '"' + over + '"'  + 
                ', "vote_average": '+'"'+json.vote_average+'"' + 
                ', "tagline": '+'"'+tag+'"' + 
                ', "img": '+'"'+img_base+'"' + 
                ' }';
        // console.log(re);
        var obj_d = JSON.parse(re);
        // console.log('m_d');
        final.push(obj_d);
        res.send(final);
    });
};

function get_c(c,settings,res) {
    var final = [];
    fetch(c, settings)
    .then(res => res.json())
    .then((json) => {
        var re = '';
        var temp = [];
        for (cast of json.cast){
            if (cast.profile_path != null && cast.profile_path != undefined){
                img = "https://image.tmdb.org/t/p/w500/"+cast.profile_path;
                var character = cast.character.split('"').join('\\"').split(/\n/g).join('\\n').split(/\r/g).join('\\r').split(/\t/g).join('\\t');
                re = '{ "id": '+'"'+cast.id+'"'+
                ', "name": '+'"'+cast.name+'"'+
                ', "character": '+ '"' + character + '"' +
                ', "profile_path":' + '"' + img + '"' + 
                ' }';
                var obj = JSON.parse(re);
                // console.log('g_c');
                temp.push(obj);
                if (temp.length == 6){
                    break;
                }
            }
        }
        var dis = temp.length;
        if (dis < 1){
          dis = "false";
        }else{
          dis = "true";
        }
        final = [temp,dis];
        res.send(final);
    });
};

function get_r(r,settings,res) {
    var final = [];
    fetch(r, settings)
    .then(res => res.json())
    .then((json) => {
        var re = '';
        var temp = [];
        var avatar_path;
        var date = '';
        for (review of json.results){
            if (review.author_details.rating===undefined||review.author_details.rating===null){
                var rating = 0;
            }else{
                var rating = (review.author_details.rating/2).toFixed(0);
            }
            if (review.author_details.avatar_path===undefined||review.author_details.avatar_path===null){
                avatar_path = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHnPmUvFLjjmoYWAbLTEmLLIRCPpV_OgxCVA&usqp=CAU";
            }else{
                if (review.author_details.avatar_path.indexOf('://') > 0 || review.author_details.avatar_path.indexOf('//') === 0 ){
                    avatar_path = "https" + review.author_details.avatar_path.slice(review.author_details.avatar_path.indexOf('://'),-1);
                }else{
                    avatar_path = "https://image.tmdb.org/t/p/original" + review.author_details.avatar_path;
                }
            }
            var content = review.content.split('"').join('\\"').split(/\n/g).join('\\n').split(/\r/g).join('\\r').split(/\t/g).join('\\t');
            var y = review.created_at.slice(0,4);
            var m = review.created_at.slice(5,7);
            var d = review.created_at.slice(8,10);
            var h = parseInt(review.created_at.slice(11,13),10);
            if (h-12<=0){
                var t='AM';
            }else{
                h = h-12;
                var t = 'PM';
            }
            var r = review.created_at.slice(13,19);
            date = months[m]+' '+d+', '+y+', '+h+r+' '+t;
            re = '{ "author": '+'"'+review.author+'"'+
            ', "content": '+'"'+content+'"'+
            ', "created_at": '+ '"' + date + '"' +
            ', "url":' + '"' + review.url + '"' + 
            ', "rating": '+'"'+rating+'"' + 
            ', "avatar_path":' + '"' + avatar_path + '"'  + 
            ' }';
            var obj = JSON.parse(re);
            // console.log('g_r');
            temp.push(obj);
            if(temp.length>=3){
                break;
            }
        }
        if (temp.length==0){
            final = [temp,"false"];
        }else{
            final = [temp,"true"];
        }
        res.send(final);
    });
};

function get_tv_d(t_d,settings,res) {
    var final = [];
    fetch(t_d, settings)
    .then(res => res.json())
    .then((json) => {
        // console.log(json);
        var gen = '';
        var re = '';
        for (genre of json.genres){
             gen += genre.name + ', ';
        };
        gen = gen.slice(0,-2);
        var sp = '';
        for (lang of json.spoken_languages){
            sp += lang.english_name + ', ';
        };
        sp = sp.slice(0,-2);
        var rel = json.first_air_date.slice(0,4);
        var rt = json.episode_run_time[0];
        if (rt/60 >= 1){
            var h = Math.floor(rt/60);
            var m = rt - (h)*60;
            rt = h+"hr "+m+"mins";
        }else{
            rt = rt + "mins";
        }
        if (json.poster_path === undefined || json.poster_path === null){
            var img_base = "./img.png"
        }else{
            var img_base = "https://image.tmdb.org/t/p/original" + json.poster_path;
        }
        // console.log(json);
        var over = json.overview.split('"').join('\\"').split(/\n/g).join('\\n').split(/\r/g).join('\\r').split(/\t/g).join('\\t');
        var tag = json.tagline.split('"').join('\\"').split(/\n/g).join('\\n').split(/\r/g).join('\\r').split(/\t/g).join('\\t');
        re = '{ "title": '+'"'+json.name+'"'+
                ', "genres": '+'"'+gen+'"'+
                ', "spoken_language": '+ '"' + sp + '"' +
                ', "release_date":' + '"' + rel + '"' + 
                ', "runtime": '+'"'+rt+'"' + 
                ', "overview":'  + '"' + over + '"'  + 
                ', "vote_average": '+'"'+json.vote_average+'"' + 
                ', "tagline": '+'"'+tag+'"' + 
                ', "img": '+'"'+img_base+'"' + 
                ' }';
        var obj_d = JSON.parse(re);
        // console.log('t_d');
        final.push(obj_d);
        res.send(final);
    });
};

function get_ca_id(c_i,settings,res) {
    var final = [];
    fetch(c_i, settings)
    .then(res => res.json())
    .then((json) => {
          var temp=[];
          var temp2=[];
          if (json.name != null && json.name != undefined){
              var name = json.name;
              temp.push(name);}
          if (json.profile_path != null && json.profile_path != undefined){
            var img = "https://image.tmdb.org/t/p/w500/"+json.profile_path;
            temp.push(img);
          }else{ var img = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHnPmUvFLjjmoYWAbLTEmLLIRCPpV_OgxCVA&usqp=CAU"; temp.push(img);};
          if (json.biography != null && json.biography != undefined){
            var biography = json.biography.split('"').join('\\"').split(/\n/g).join('\\n').split(/\r/g).join('\\r').split(/\t/g).join('\\t');
            temp.push(biography);
        }
          if (json.birthday != null && json.birthday != undefined){
              var birth = json.birthday;
              birth = "Birth: "+birth;
              temp2.push(birth);};
          if (json.place_of_birth != null && json.place_of_birth != undefined){
              var place = json.place_of_birth;
              place = "Birth Place: "+place
              temp2.push(place);};
          if (json.gender != null && json.gender != undefined){
              if (json.gender==1){var gender = "Female"}
              else if (json.gender==2){var gender = "Male"}
              else{var gender="unknown"};
              gender = "Gender: "+gender;
              temp2.push(gender);
            };
          if (json.known_for_department != null && json.known_for_department != undefined){
              var known_for = json.known_for_department;
              known_for = "Known: "+known_for
              temp2.push(known_for);};
          if (json.also_known_as != null && json.also_known_as != undefined){
              var also_kown = json.also_known_as.join().split('"').join('\\"').split(/\n/g).join('\\n').split(/\r/g).join('\\r').split(/\t/g).join('\\t');
              also_kown = "Also Known as: "+also_kown;
              temp2.push(also_kown);
          }
          final.push(temp);
          final.push(temp2);
        //   console.log(final);
          res.send(final);
    });
};

function get_ca_li(c_l,settings,res) {
    var final = [];
    fetch(c_l, settings)
    .then(res => res.json())
    .then((json) => {
          temp = [];
          if (json.imdb_id != null && json.imdb_id != undefined){
              imbd = "https://www.imdb.com/name/"+json.imdb_id;
              temp.push(imbd);
          }else{temp.push(0)};
          if (json.facebook_id != null && json.facebook_id != undefined){
              facebook = "https://www.facebook.com/"+json.facebook_id;
              temp.push(facebook);
          }else{temp.push(0)};
          if (json.instagram_id != null && json.instagram_id != undefined){
            instagram = "https://www.instagram.com/"+json.instagram_id;
            temp.push(instagram);
          }else{temp.push(0)};
          if (json.twitter_id != null && json.twitter_id != undefined){
            twitter = "https://www.twitter.com/"+json.twitter_id;
            temp.push(twitter);
          }else{temp.push(0)};
          final.push(temp);
        //   console.log(final);
          res.send(final);
    });
};

// app.all('*', function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "X-Requested-With");
//     res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
//     res.header("X-Powered-By", ' 3.2.1')
//     res.header("Content-Type", "application/json;charset=utf-8");
//     next();
// });

// app.get('/', (req,res) => {
//     res.sendFile(process.cwd()+"/my-app/dist/my-app/index.html")
// });

app.get('/nowm', function (req, res) {
    console.log(`request`);
    let url = "https://api.themoviedb.org/3/movie/now_playing?api_key=5afe04657bced8e58863be2e31768ea5&language=en-US&page=1"
    let settings = {method: "Get"};
    fetch(url, settings)
    .then(res => res.json())
    .then((json) => {
        var c = 0;
        var multi_re = '';
        var final = [];
        var temp = [];
        var img_base = "https://image.tmdb.org/t/p/original";
        var img_po = "https://image.tmdb.org/t/p/original";
        for (item of json.results){
            if ((item.backdrop_path === undefined || item.backdrop_path === null)){
                img_base = "../img.png";
            }else{
                if (item.backdrop_path === undefined || item.backdrop_path === null){
                    img_base = "./img.png"
                }else{
                    img_base = "https://image.tmdb.org/t/p/original" + item.backdrop_path;
                    var img_po = "https://image.tmdb.org/t/p/original" + item.poster_path;
                }
                c += 1;
                var name = item.title.split('"').join('\\"').split(/\n/g).join('\\n').split(/\r/g).join('\\r').split(/\t/g).join('\\t');
                multi_re = '{ "id": '+item.id+', "name": '+'"'+name+'"'+', "media_type": "movie"'+ ', "img":' + '"' +img_base + '"'+ ', "img_po":' + '"' + img_po + '"' +' }';
                var obj = JSON.parse(multi_re);
                // console.log('/now');
                temp.push(obj);
            };
            if (c === 6) {
                final.push(temp);
                c = 0;
                temp = [];
                break;
            };
        };
        // console.log(final);
        res.send(final);
        // do something with JSON
    });
    

});

app.get('/nowt', function (req, res) {
    console.log(`request`);
    let url = "https://api.themoviedb.org/3/trending/tv/day?api_key=5afe04657bced8e58863be2e31768ea5"
    let settings = {method: "Get"};
    fetch(url, settings)
    .then(res => res.json())
    .then((json) => {
        var c = 0;
        var multi_re = '';
        var final = [];
        var temp = [];
        var img_base = "https://image.tmdb.org/t/p/original";
        var img_po = "https://image.tmdb.org/t/p/original";
        for (item of json.results){
            if ((item.backdrop_path === undefined || item.backdrop_path === null)){
                img_base = "../img.png";
            }else{
                if (item.backdrop_path === undefined || item.backdrop_path === null){
                    img_base = "./img.png"
                }else{
                    img_base = "https://image.tmdb.org/t/p/original" + item.backdrop_path;
                    var img_po = "https://image.tmdb.org/t/p/original" + item.poster_path;
                }
                c += 1;
                var name = item.name.split('"').join('\\"').split(/\n/g).join('\\n').split(/\r/g).join('\\r').split(/\t/g).join('\\t');
                multi_re = '{ "id": '+item.id+', "name": '+'"'+name+'"'+', "media_type": "movie"'+ ', "img":' + '"' +img_base + '"'+ ', "img_po":' + '"' + img_po + '"' +' }';
                var obj = JSON.parse(multi_re);
                // console.log('/now');
                temp.push(obj);
            };
            if (c === 6) {
                final.push(temp);
                c = 0;
                temp = [];
                break;
            };
        };
        // console.log(final);
        res.send(final);
        // do something with JSON
    });
    

});

app.get('/topm', function (req, res) {
    console.log(`request`);
    let url = "https://api.themoviedb.org/3/movie/top_rated?api_key=5afe04657bced8e58863be2e31768ea5&language=en-US&page=1"
    let settings = {method: "Get"};
    fetch(url, settings)
    .then(res => res.json())
    .then((json) => {
        var c = 0;
        var multi_re = '';
        var final = [];
        var temp = [];
        var img_base = "https://image.tmdb.org/t/p/original";
        var img_po = "https://image.tmdb.org/t/p/original";
        for (item of json.results){
            if ((item.backdrop_path === undefined || item.backdrop_path === null)){
                img_base = "../img.png";
            }else{
                if (item.backdrop_path === undefined || item.backdrop_path === null){
                    img_base = "./img.png"
                }else{
                    img_base = "https://image.tmdb.org/t/p/original" + item.backdrop_path;
                    var img_po = "https://image.tmdb.org/t/p/original" + item.poster_path;
                }
                c += 1;
                var name = item.title.split('"').join('\\"').split(/\n/g).join('\\n').split(/\r/g).join('\\r').split(/\t/g).join('\\t');
                multi_re = '{ "id": '+item.id+', "name": '+'"'+name+'"'+', "media_type": "movie"'+ ', "img":' + '"' +img_base + '"'+ ', "img_po":' + '"' + img_po + '"' +' }';
                var obj = JSON.parse(multi_re);
                // console.log('/now');
                temp.push(obj);
            };
            if (c === 10) {
                final.push(temp);
                c = 0;
                temp = [];
                break;
            };
        };
        // console.log(final);
        res.send(final);
        // do something with JSON
    });
    

});

app.get('/topt', function (req, res) {
    console.log(`request`);
    let url = "https://api.themoviedb.org/3/tv/top_rated?api_key=5afe04657bced8e58863be2e31768ea5&language=en-US&page=1"
    let settings = {method: "Get"};
    fetch(url, settings)
    .then(res => res.json())
    .then((json) => {
        var c = 0;
        var multi_re = '';
        var final = [];
        var temp = [];
        var img_base = "https://image.tmdb.org/t/p/original";
        var img_po = "https://image.tmdb.org/t/p/original";
        for (item of json.results){
            if ((item.backdrop_path === undefined || item.backdrop_path === null)){
                img_base = "../img.png";
            }else{
                if (item.backdrop_path === undefined || item.backdrop_path === null){
                    img_base = "./img.png"
                }else{
                    img_base = "https://image.tmdb.org/t/p/original" + item.backdrop_path;
                    var img_po = "https://image.tmdb.org/t/p/original" + item.poster_path;
                }
                c += 1;
                var name = item.name.split('"').join('\\"').split(/\n/g).join('\\n').split(/\r/g).join('\\r').split(/\t/g).join('\\t');
                multi_re = '{ "id": '+item.id+', "name": '+'"'+name+'"'+', "media_type": "movie"'+ ', "img":' + '"' +img_base + '"'+ ', "img_po":' + '"' + img_po + '"' +' }';
                var obj = JSON.parse(multi_re);
                // console.log('/now');
                temp.push(obj);
            };
            if (c === 10) {
                final.push(temp);
                c = 0;
                temp = [];
                break;
            };
        };
        // console.log(final);
        res.send(final);
        // do something with JSON
    });
    

});

app.get('/popm', function (req, res) {
    console.log(`request`);
    let url = "https://api.themoviedb.org/3/movie/popular?api_key=5afe04657bced8e58863be2e31768ea5&language=en-US&page=1"
    let settings = {method: "Get"};
    fetch(url, settings)
    .then(res => res.json())
    .then((json) => {
        var c = 0;
        var multi_re = '';
        var final = [];
        var temp = [];
        var img_base = "https://image.tmdb.org/t/p/original";
        var img_po = "https://image.tmdb.org/t/p/original";
        for (item of json.results){
            c += 1;
            if ((item.backdrop_path === undefined || item.backdrop_path === null)){
                img_base = "../img.png";
            }else{
                if (item.backdrop_path === undefined || item.backdrop_path === null){
                    img_base = "./img.png"
                }else{
                    img_base = "https://image.tmdb.org/t/p/original" + item.backdrop_path;
                    var img_po = "https://image.tmdb.org/t/p/original" + item.poster_path;
                }
                var name = item.title.split('"').join('\\"').split(/\n/g).join('\\n').split(/\r/g).join('\\r').split(/\t/g).join('\\t');
                multi_re = '{ "id": '+item.id+', "name": '+'"'+name+'"'+', "media_type": "movie"'+ ', "img":' + '"' +img_base + '"'+ ', "img_po":' + '"' + img_po + '"' +' }';
                var obj = JSON.parse(multi_re);
                // console.log('/now');
                temp.push(obj);
            };
            if (c === 10) {
                final.push(temp);
                c = 0;
                temp = [];
                break;
            };
        };
        // console.log(final);
        res.send(final);
        // do something with JSON
    });
    

});

app.get('/popt', function (req, res) {
    console.log(`request`);
    let url = "https://api.themoviedb.org/3/tv/popular?api_key=5afe04657bced8e58863be2e31768ea5&language=en-US&page=1"
    let settings = {method: "Get"};
    fetch(url, settings)
    .then(res => res.json())
    .then((json) => {
        var c = 0;
        var multi_re = '';
        var final = [];
        var temp = [];
        var img_base = "https://image.tmdb.org/t/p/original";
        var img_po = "https://image.tmdb.org/t/p/original";
        for (item of json.results){
            if ((item.backdrop_path === undefined || item.backdrop_path === null)){
                img_base = "../img.png";
            }else{
                if (item.backdrop_path === undefined || item.backdrop_path === null){
                    img_base = "./img.png"
                }else{
                    img_base = "https://image.tmdb.org/t/p/original" + item.backdrop_path;
                    var img_po = "https://image.tmdb.org/t/p/original" + item.poster_path;
                }
                c += 1;
                var name = item.name.split('"').join('\\"').split(/\n/g).join('\\n').split(/\r/g).join('\\r').split(/\t/g).join('\\t');
                multi_re = '{ "id": '+item.id+', "name": '+'"'+name+'"'+', "media_type": "movie"'+ ', "img":' + '"' +img_base + '"'+ ', "img_po":' + '"' + img_po + '"' +' }';
                var obj = JSON.parse(multi_re);
                // console.log('/now');
                temp.push(obj);
            };
            if (c === 10) {
                final.push(temp);
                c = 0;
                temp = [];
                break;
            };
        };
        // console.log(final);
        res.send(final);
        // do something with JSON
    });
    

});

app.get('/multi', (req, res) => {
    let params = req.query.search;
    console.log(`request ${params}`);
    let url = "https://api.themoviedb.org/3/search/multi?api_key=5afe04657bced8e58863be2e31768ea5&language=en-US&query=";

    let settings = {method: "Get"};

    fetch(url+params, settings)
        .then(res => res.json())
        .then((json) => {
            var c = 0;
            var multi_re = '';
            var final = [];
            var temp = [];
            var img_base = "https://image.tmdb.org/t/p/w500";
            var img_po = "https://image.tmdb.org/t/p/original";
            // console.log(json)
            for (item of json.results){
                c += 1;
                if ((item.backdrop_path === undefined || item.backdrop_path === null)){
                    img_base = "../img.png";
                }else if (item.name === undefined){
                    if (item.backdrop_path === undefined || item.backdrop_path === null){
                        img_base = "../img.png";
                    }else{
                        img_base = "https://image.tmdb.org/t/p/w500" + item.backdrop_path;
                        img_po = "https://image.tmdb.org/t/p/original" + item.poster_path;
                    }
                    var rate = (item.vote_average/2).toFixed(1);
                    if (item.release_date != undefined){
                        var rel = item.release_date.slice(0,4);
                    }
                    else{
                        var rel = "unknown";
                    }
                    var name = item.title.split('"').join('\\"').split(/\n/g).join('\\n').split(/\r/g).join('\\r').split(/\t/g).join('\\t');
                    multi_re = '{ "id": '+item.id+', "name": '+'"'+name+'"'+', "rate": '+'"'+rate+'"'+', "date": '+'"'+rel+'"'+', "type": "movie"'+ ', "img":' + '"' +img_base + '"'+ ', "img_po":' + '"' +img_po + '"' +' }';
                    var obj = JSON.parse(multi_re);
                    // console.log('multi1');
                    temp.push(obj);
                }else{
                    if (item.backdrop_path === undefined || item.backdrop_path === null){
                        img_base = "./img.png"
                    }else{
                        img_base = "https://image.tmdb.org/t/p/w500" + item.backdrop_path;
                        img_po = "https://image.tmdb.org/t/p/original" + item.poster_path;
                    }
                    var rate = (item.vote_average/2).toFixed(1);
                    if (item.first_air_date != undefined){
                        var rel = item.first_air_date.slice(0,4);
                    }
                    else{
                        var rel = "unknown";
                    }
                    var name = item.name.split('"').join('\\"').split(/\n/g).join('\\n').split(/\r/g).join('\\r').split(/\t/g).join('\\t');
                    multi_re = '{ "id": '+item.id+', "name": '+'"'+name+'"'+ ', "rate": '+'"'+rate+'"'+', "date": '+'"'+rel+'"'+', "type": "tv"'+ ', "img":' + '"' +img_base + '"'+ ', "img_po":' + '"' +img_po + '"' +' }';
                    var obj = JSON.parse(multi_re);
                    // console.log('multi2');
                    temp.push(obj);
                };
                if (c === 20) {
                    break;
                };
            };
            final.push(temp);
            // console.log(final);
            res.send(final);
            // do something with JSON
        });
});

app.get('/pop', function (req, res) {
    let params = req.query.type;
    console.log(`request pop ${params}`);
    let m_p_url = "https://api.themoviedb.org/3/movie/popular?api_key=5afe04657bced8e58863be2e31768ea5&language=en-US&page=1"
    let t_p_url = "https://api.themoviedb.org/3/tv/popular?api_key=5afe04657bced8e58863be2e31768ea5&language=en-US&page=1"
    let settings = {method: "Get"};
    if (params === 'movie'){
       get_movie_po(m_p_url,settings,res);
    }else if (params === 'tv'){
       get_tv_po(t_p_url,settings,res);
    }
});

app.get('/top', function (req, res) {
    let params = req.query.type;
    console.log(`request top ${params}`);
    let m_t_url = "https://api.themoviedb.org/3/movie/top_rated?api_key=5afe04657bced8e58863be2e31768ea5&language=en-US&page=1"
    let t_t_url = "https://api.themoviedb.org/3/tv/top_rated?api_key=5afe04657bced8e58863be2e31768ea5&language=en-US&page=1"
    let settings = {method: "Get"};
    if (params === 'movie'){
       get_movie_po(m_t_url,settings,res);
    }else if (params === 'tv'){
        get_tv_po(t_t_url,settings,res);
    }
});

app.get('/trending', function (req, res) {
    let params = req.query.type;
    console.log(`request trending ${params}`);
    let m_tr_url = "https://api.themoviedb.org/3/trending/movie/day?api_key=5afe04657bced8e58863be2e31768ea5"
    let t_tr_url = "https://api.themoviedb.org/3/trending/tv/day?api_key=5afe04657bced8e58863be2e31768ea5"
    let settings = {method: "Get"};
    if (params === 'movie'){
       get_movie_po(m_tr_url,settings,res);
    }else if (params === 'tv'){
       get_tv_po(t_tr_url,settings,res);
    }
});

app.get('/mv', function (req, res) {
    let params = req.query.id;
    console.log(`request mv ${params}`);
    let m_v = "https://api.themoviedb.org/3/movie/"+params+"/videos?api_key=5afe04657bced8e58863be2e31768ea5&language=en-US&page=1"
    let settings = {method: "Get"};
    get_v(m_v,settings,res);
});

app.get('/md', function (req, res) {
    let params = req.query.id;
    console.log(`request md ${params}`);
    let m_d = "https://api.themoviedb.org/3/movie/"+params+"?api_key=5afe04657bced8e58863be2e31768ea5&language=en-US&page=1"
    let settings = {method: "Get"};
    get_movie_d(m_d,settings,res);
});

app.get('/mc', function (req, res) {
    let params = req.query.id;
    console.log(`request mc ${params}`);
    let m_c = "https://api.themoviedb.org/3/movie/"+params+"/credits?api_key=5afe04657bced8e58863be2e31768ea5&language=en-US&page=1"
    let settings = {method: "Get"};
    get_c(m_c,settings,res);
});

app.get('/mr', function (req, res) {
    let params = req.query.id;
    console.log(`request mr ${params}`);
    let m_r = "https://api.themoviedb.org/3/movie/"+params+"/reviews?api_key=5afe04657bced8e58863be2e31768ea5&language=en-US&page=1"
    let settings = {method: "Get"};
    get_r(m_r,settings,res);
});

app.get('/recomm', function (req, res) {
    let params = req.query.id;
    console.log(`request rm ${params}`);
    let r_m = "https://api.themoviedb.org/3/movie/"+params+"/recommendations?api_key=5afe04657bced8e58863be2e31768ea5&language=en-US&page=1"
    let settings = {method: "Get"};
    get_movie_po(r_m,settings,res);
});

app.get('/simm', function (req, res) {
    let params = req.query.id;
    console.log(`request sm ${params}`);
    let s_m = "https://api.themoviedb.org/3/movie/"+params+"/similar?api_key=5afe04657bced8e58863be2e31768ea5&language=en-US&page=1"
    let settings = {method: "Get"};
    get_movie_po(s_m,settings,res);
});

app.get('/tv', function (req, res) {
    let params = req.query.id;
    console.log(`request tv ${params}`);
    let t_v = "https://api.themoviedb.org/3/tv/"+params+"/videos?api_key=5afe04657bced8e58863be2e31768ea5&language=en-US&page=1"
    let settings = {method: "Get"};
    get_v(t_v,settings,res);
});

app.get('/td', function (req, res) {
    let params = req.query.id;
    console.log(`request td ${params}`);
    let t_d = "https://api.themoviedb.org/3/tv/"+params+"?api_key=5afe04657bced8e58863be2e31768ea5&language=en-US&page=1"
    let settings = {method: "Get"};
    get_tv_d(t_d,settings,res);
});

app.get('/tc', function (req, res) {
    let params = req.query.id;
    console.log(`request tc ${params}`);
    let t_c = "https://api.themoviedb.org/3/tv/"+params+"/credits?api_key=5afe04657bced8e58863be2e31768ea5&language=en-US&page=1"
    let settings = {method: "Get"};
    get_c(t_c,settings,res);
});

app.get('/tr', function (req, res) {
    let params = req.query.id;
    console.log(`request tr ${params}`);
    let t_r = "https://api.themoviedb.org/3/tv/"+params+"/reviews?api_key=5afe04657bced8e58863be2e31768ea5&language=en-US&page=1"
    let settings = {method: "Get"};
    get_r(t_r,settings,res);
});

app.get('/recomt', function (req, res) {
    let params = req.query.id;
    console.log(`request rt ${params}`);
    let r_t = "https://api.themoviedb.org/3/tv/"+params+"/recommendations?api_key=5afe04657bced8e58863be2e31768ea5&language=en-US&page=1"
    let settings = {method: "Get"};
    get_tv_po(r_t,settings,res);
});

app.get('/simt', function (req, res) {
    let params = req.query.id;
    console.log(`request st ${params}`);
    let s_t = "https://api.themoviedb.org/3/tv/"+params+"/similar?api_key=5afe04657bced8e58863be2e31768ea5&language=en-US&page=1"
    let settings = {method: "Get"};
    get_tv_po(s_t,settings,res);
});

app.get('/cain', function (req, res) {
    let params = req.query.id;
    console.log(`request cain ${params}`);
    let c_in = "https://api.themoviedb.org/3/person/"+params+"?api_key=5afe04657bced8e58863be2e31768ea5&language=en-US&page=1"
    let settings = {method: "Get"};
    get_ca_id(c_in,settings,res);
});

app.get('/exid', function (req, res) {
    let params = req.query.id;
    console.log(`request caid ${params}`);
    let c_li = "https://api.themoviedb.org/3/person/"+params+"/external_ids?api_key=5afe04657bced8e58863be2e31768ea5&language=en-US&page=1"
    let settings = {method: "Get"};
    get_ca_li(c_li,settings,res);
});
// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});
