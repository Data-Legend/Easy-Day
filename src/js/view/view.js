export default class view{
    clear(){
        if(this._parentEl) this._parentEl.innerText = '';
    }
    render(data){
        if(!data) return;
        this._data = data;
        this.clear();
        const markup = this.htmlGenerator();
        this._parentEl.insertAdjacentHTML('afterbegin',markup);
    }
    done(){
        const audio = new Audio('../../audio/done.mp3');
        audio.play();
    }
}