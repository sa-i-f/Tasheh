`use strict`
const frm=document.querySelector('.frm')
const inpEl=document.querySelector('.inp_el_r')
const inpCad=document.querySelector('.inp_cad_r')
const work=document.querySelector('.workouts')
class workOuts{
    date=new Date()
    id=(Date.now()+'').slice(-10) //taking the last 10 nums of a string
    constructor(coords,distance,duration){
        this.coords=coords
        this.distance=distance
        this.duration=duration
    }
   _SetDescription(){
    const months=['January','February','March','April','May','June','July','August','September','October','November','December']
    this.description=`${this.type=='running'?'R':'C'}${this.type.slice(1)} on ${months[this.date.getMonth()]} 
    ${this.date.getDate()}`
   }
}

class Running extends workOuts{
    type='running'
constructor(coords,distance,duration,cadance){
    super(coords,distance,duration)
    this.cadance=cadance
    this.clacPace()
    this._SetDescription()

}
clacPace(){
    this.pace=this.duration/this.distance
    return this.pace
}
}
class Cycling extends workOuts{
    type='cycling'
    constructor(coords,distance,duration,evaluation){
        super(coords,distance,duration)
        this.evaluation=evaluation
        this.calcSpeed()
        this._SetDescription()

    }
    calcSpeed(){
        this.speed=this.distance/(this.duration/60)
        return this.speed
    }
}
class App{
    #map
    #mapE
    #workouts=[]
    #type
    constructor(){
        this._getLocalStorage()
        this._getposition()
        frm.addEventListener('submit',this._newWorkout.bind(this)) //in eventlistners in classes we have to use the bind method or part of the code wont work
        $('.inp_ty').change(this._toggleElField)
        $('.workouts').click(this._moveToPop.bind(this))
    }
    _getposition(){

        navigator.geolocation.getCurrentPosition(this._loadMap.bind(this),function(){ //bind to fix this error
            alert('couldnt find location')
        }) //2 funcs 1st for success 2nd for failuer
        
     
    }
    _loadMap(position){
            const {latitude}=position.coords
            const {longitude}=position.coords
            const coords=[latitude,longitude]
             this.#map = L.map('map').setView(coords, 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.#map);
        this.#map.on('click',this._showForm.bind(this))
        this.#workouts.forEach(work=>
        this._renderWorkoutmark(work)
        )
    }
    _showForm(e){
        this.#mapE=e
          // $('.inp_dis').focus()
        $('.frm').slideDown(700).removeClass('hidden')
    }
    _toggleElField(){
        inpEl.classList.toggle('hidden_row')
        inpCad.classList.toggle('hidden_row')
    }
    _newWorkout(e){
        const allNums=(...inps)=>inps.every(inp=>Number.isFinite(inp))
        const allPositive=(...inps)=>inps.every(inp=>inp>0)

        e.preventDefault()
        //get data
         this.#type=$('.inp_ty').val()
        const distance=+$('.inp_dis').val()  //the + to convert to number
        const duration=+$('.inp_dur').val()
        const {lat,lng}=this.#mapE.latlng
        let workout
        //for running
        if(this.#type=='running'){
            const cadance=+$('.inp_cad').val()
            //check if valid
            if(!allNums(cadance,distance,duration)||!allPositive(cadance,duration,distance)) return alert('unvalid numbers !')
             workout=new Running([lat,lng],distance,duration,cadance)
        }
        //for cycling
        if(this.#type=='cycling'){
            const elevation=+$('.inp_el').val()
            if(!allNums(elevation,distance,duration)||!allPositive(elevation,duration,distance)) return alert('unvalid numbers !')
             workout=new Cycling([lat,lng],distance,duration,elevation)
        }
        this.#workouts.push(workout)
        this._renderWorkoutmark(workout)
        this._renderWorkout(workout)
        this._setLocalStorage()
    }
    
    _renderWorkoutmark(workout){
        L.marker(workout.coords).addTo(this.#map)
        .bindPopup(L.popup({
            maxwidth:250,
            minwidth:100,
            autoClose:false,
            closeOnClick:false,
            className:`${this.#type}_pop`//custom
        })).setPopupContent(`${this.#type=='running'?'🏃‍♂️':'🚴‍♀️'} ${workout.description}`)
        .openPopup();
        $('.inp_dis').val('')
        $('.inp_cad').val('')
        $('.inp_dur').val('')
        $('.inp_el').val('')
        $('.frm').slideUp(600)

    }
    _renderWorkout(workout){
        let html;
        if(workout.type=='running'){
             html=`
        <div class="worksum ${workout.type}_pop" data-id="${workout.id}">
              <div class="row ">
                   <span class="p">${workout.description}</span>
                    <div class="col-3 c"><span class="icon">🏃‍♂️</span><span class="num">${workout.distance}</span> <span class="spd">KM</span></div>
                    <div class="col-3 c"><span class="icon">⏱</span><span class="num">${workout.duration}</span> <span class="spd">MIN</span></div>
                    <div class="col-3 c"><span class="icon">⚡️</span><span class="num">${workout.pace.toFixed(1)}</span> <span class="spd">KM/MIN</span></div>
                    <div class="col-3 c"><span class="icon">🦶🏼</span><span class="num">${workout.cadance}</span> <span class="spd">SPM</span></div>
              </div>
        </div>
        `
        }
        if(workout.type=='cycling'){
             html=`
        <div class="worksum ${workout.type}_pop" data-id="${workout.id}">
              <div class="row ">
                   <span class="p">${workout.description}</span>
                    <div class="col-3 c"><span class="icon">🚴‍♀️</span><span class="num">${workout.distance}</span> <span class="spd">KM</span></div>
                    <div class="col-3 c"><span class="icon">⏱</span><span class="num">${workout.duration}</span> <span class="spd">MIN</span></div>
                    <div class="col-3 c"><span class="icon">⚡️</span><span class="num">${workout.speed.toFixed(1)}</span> <span class="spd">KM/HR</span></div>
                    <div class="col-3 c"><span class="icon">⛰️</span><span class="num">${workout.evaluation}</span> <span class="spd">M</span></div>
              </div>
        </div>
        `
        }
        work.insertAdjacentHTML('beforeend',html)

    }
    _moveToPop(e){
        const workoutEl=e.target.closest('.worksum')
        if(!workoutEl) return
        const workout=this.#workouts.find(work=>work.id==workoutEl.dataset.id)
        this.#map.setView(workout.coords,15,{animate:true,pan:{duration:1}})
    }

    _setLocalStorage(){
        localStorage.setItem('workouts',JSON.stringify(this.#workouts))
    }
    _getLocalStorage(){
        const data=JSON.parse(localStorage.getItem('workouts')) //json.parse is the opposite of stringify
        console.log(data)
        if(!data) return
        this.#workouts=data
        this.#workouts.forEach(work=>this._renderWorkout(work) )
    }
    reset(){
        localStorage.removeItem('workouts')
        location.reload() //reloads the page
    }
}

const app=new App()
