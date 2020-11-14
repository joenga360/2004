const skills = require('./skills')
class SkillService {
    constructor(){
        this._videos = [],
        this._videos_by_type = []
    }

    get allVideos(){
        return this._videos
    }
    
    get videoByType(){
        return this._videos_by_type 
    }
    //randomize and get all the skills
    randomizeSkills(){
        for(let i=0; i<skills.length; i++){
            const skill_video = skills[Math.floor(Math.random()*skills.length)]

            if(!this._videos.includes(skill_video)){
                this._videos.push(skill_video)
            }               
        }

        if(this._videos.length < skills.length){
            this.randomizeSkills()
        }else{
            this._videos = this._videos
        }        
    }   
    
    //get skills by type
    getSkillsByType(type){
        this._videos_by_type = this._videos.filter(video => {
            return video.type === type
        })
    }
    
}

module.exports = SkillService