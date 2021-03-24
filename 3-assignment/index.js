/* get the id of movie with the name : 
https://api.themoviedb.org/3/search/movie?  api_key=9bc3828de117c1e056c726e3f56dcac6&query=suicide+squad */

/* get the names of actors with movie id : 
https://api.themoviedb.org/3/movie/436969/credits?api_key=9bc3828de117c1e056c726e3f56dcac6&language=en-US */

/*get the all movies of an actor or director with his id : 
https://api.themoviedb.org/3/person/155/movie_credits?api_key=9bc3828de117c1e056c726e3f56dcac6&language=en-US*/

addEventListener('load', function() {
    call_Movie('joker')
});
 addEventListener("keydown", function(pressed_key) {
  pressed_key=pressed_key.keyCode;
  if (pressed_key === 13) {
   let but=document.getElementsByClassName("btn btn-primary");
   but[but.length-1].click();
  }
});

let tab=["joker"];
function call_Movie(search){
    let url = 'https://api.themoviedb.org/3/search/movie?api_key=9bc3828de117c1e056c726e3f56dcac6&query=' + search
    fetch(url).then(function(res) {
        return res.json()
    }).then(function(data){
        console.log(data.results[0])
        insertIntoHTML(data)
    }).catch(function(error){
        console.log('There is a problem: Check it out')
        console.log(error)
    })
}

function insertIntoHTML(data){
    let baseUrl = 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2'
            let elem = data.results[0]

                document.body.innerHTML +='<div class="list"> <h1><a>' + elem.title + ' </a></h1> <p class="text">'+elem.release_date+'</p><img src=' +baseUrl +elem.poster_path+' class="img-fluid rounded d-block img-thumbnail"></div><div class="form"> <div class="form-group"> <input type="text" class="form-control" onfocus="reset(this)" placeholder="Enter the director or an actor of the movie"></div><button class="btn btn-primary" Onclick="response()">Submit</button></div>'
id_film=elem.id;
  console.log(id_film);

}




function response(){

    let res =  document.getElementsByClassName("form-control");
    let name = document.getElementsByTagName('a');
  name = name[name.length-1].innerHTML;

    //callAPI(name);
    call_Movie2(name,res[res.length-1].value);
}
function call_Movie2(search,movie){
    let url = 'https://api.themoviedb.org/3/search/movie?api_key=9bc3828de117c1e056c726e3f56dcac6&query=' + search
    fetch(url).then(function(res) {
        return res.json()
    }).then(function(data){
        //console.log(data.results[0].id)
        call_cast(data,movie)
    }).catch(function(err){
        console.log('There is a problem: Check it out')
        console.log(err)
    })
}

function call_cast(data,actor){
  const id_film=data.results[0].id;
  //console.log(id_film);
  let url='https://api.themoviedb.org/3/movie/'+ id_film +'/credits?api_key=b1cd873b996025c059ed17379953c1b8&language=en-US'
    fetch(url).then(function(res) {
        return res.json()
    }).then(function(data){
        console.log(data.cast[0].id);
        
        compare_cast(data,actor)
    }).catch(function(error){
        console.log('There is a problem: Check it out')
        console.log(error)
    })
}

function compare_cast(data,actor){
  let i=0;
  let exist = 0;
  let casts=data.cast;
  let baseUrl = 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2'
  while(i<casts.length){
    if(actor.toLowerCase()==casts[i].name.toLowerCase()){
      exist=1;
      buttons=document.getElementsByClassName("btn btn-primary")
      buttons[buttons.length-1].disabled=true;
      respons=document.getElementsByClassName("form-control");
    respons[respons.length-1].disabled=true;
      document.body.innerHTML += '<div class="list"> <h1><a>' + actor + ' </a></h1> <img src=' +baseUrl +casts[i].profile_path+' class="img-fluid rounded d-block img-thumbnail"></div><div class="form"> <div class="form-group"> <input type="text" class="form-control" onfocus="reset(this)" placeholder="A Movie where he played"></div><button class="btn btn-primary" Onclick="response2(\''+ casts[i].id +'\')">Submit</button></div>';
      break;
    }
    i++;
  }
  if (exist==0){
    respons=document.getElementsByClassName("form-control");
    respons[respons.length-1].value="Try Again";
    respons[respons.length-1].style.color="red";
  }


}
function reset(element){
  element.value="";
  element.style.color="black";
}

function response2(id_actor){
    //console.log(id_actor);
  
    let res = document.getElementsByClassName("form-control");
    if(tab.includes(res[res.length-1].value)){
       res[res.length-1].value="Try another movie ";
       res[res.length-1].style.color="red";
    }
    else{
        
        call_films_id(id_actor,res[res.length-1].value,tab);
        console.log("djj  "+ id_actor);
      
    }
    
}

function call_films_id(id_actor,rep,tab){
  console.log(id_actor);

  let url='https://api.themoviedb.org/3/person/'+ id_actor +'/movie_credits?api_key=9bc3828de117c1e056c726e3f56dcac6&language=en-US'
    fetch(url).then(function(res) {
        return res.json()
    }).then(function(data){
        console.log(rep);
        compare_movie(data,rep,tab)
    }).catch(function(error){
        console.log('There is a problem: Check it out')
        console.log(error)
    })
}

function compare_movie(data,movie,tab){
  let i=0;
  let exist=0;
  let casts=data.cast;
  let baseUrl = 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2'
  while(i<casts.length){
    if(movie.toLowerCase()==casts[i].original_title.toLowerCase()){
      exist=1;
      tab.push(movie);
      buttons=document.getElementsByClassName("btn btn-primary")
      buttons[buttons.length-1].disabled=true;
 respons=document.getElementsByClassName("form-control");
    respons[respons.length-1].disabled=true;
      document.body.innerHTML += '<div class="list"> <h1><a>' + movie + ' </a></h1> <img src=' +baseUrl +casts[i].poster_path+' class="img-fluid rounded d-block img-thumbnail"></div><div class="form"> <div class="form-group"> <input type="text" class="form-control" onfocus="reset(this)" placeholder="Enter the director or an actor of the movie"></div><button class="btn btn-primary" Onclick="response()">Submit</button></div>';
      break;
    }
    i++;
  }
  if (exist==0){
    respons=document.getElementsByClassName("form-control");
    respons[respons.length-1].value="Try Again";
    respons[respons.length-1].style.color="red";
  }
}