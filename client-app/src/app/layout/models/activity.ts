import { Profile } from "./profile";

export interface Activity {
    id: string;
    title: string;
    date: Date | null;
    description: string;
    category: string;
    city: string;
    venue: string;
    hostUsername:string;
    isCancelled:boolean;
    isGoing:boolean;
    isHost:boolean;
    host?:Profile;
    atendees: Profile[];
    
  }

  export class Activity implements Activity{
    constructor(init?:ActivityFormValues){
      Object.assign(this,init);
    }
  }

  export class ActivityFormValues{
    id?: string=undefined;
    title: string='';
    date: Date | null=null;
    description: string='';
    category: string='';
    city: string='';
    venue: string='';

    constructor(activity?:ActivityFormValues){
      if(activity){
        this.id=activity.id;
        this.title=activity.title;
        this.date=activity.date;
        this.description=activity.description;
        this.category=activity.category;
        this.city=activity.city;
        this.venue=activity.venue;
      }
    }

  }