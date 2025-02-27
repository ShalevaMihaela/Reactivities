import { makeAutoObservable, runInAction } from "mobx";
import { Activity, ActivityFormValues } from "../layout/models/activity";
import agent from "../api/agent";
import { format } from "date-fns";
import { store } from "./store";
import { Profile } from "../layout/models/profile";

export default class ActivityStore{
    activityRegistry = new Map<string, Activity>();
    selectedActivity: Activity | undefined =undefined;
    editMode = false;
    loading= false;
    loadingInitial = false;

    constructor(){
        makeAutoObservable(this)
    }

    get activitiesByDate (){
        return Array.from(this.activityRegistry.values()).sort((a,b)=>
            a.date!.getTime()-b.date!.getTime());
    }

    get groupedActivities() {
        return Object.entries(
            this.activitiesByDate.reduce((activities,activity)=>{
                const date = format(activity.date!, 'dd MMM yyyy');
                activities[date]=activities[date] ? [...activities[date],activity]:[activity];
                return activities;
            }, {} as {[key:string]:Activity[]})
        )
    }

    loadActivities= async ()=>{
        this.setLoadingInitial(true);
        try {
            const activities= await agent.Activities.list();
            runInAction(()=>{
                activities.forEach(activity =>{
                    this.setActivity(activity);
                  })
                  this.loadingInitial=false;
            })
            
        } catch (error) {
            console.log(error);
            runInAction(()=>{
                this.loadingInitial=false;
            })
        }
    }

    loadActivity= async (id: string)=>{
        let activity=this.getActivity(id);
        if (activity) 
            {
                this.selectedActivity=activity;
                return activity;
            }
        else{
            this.setLoadingInitial(true);
            try {
                activity= await agent.Activities.details(id);
                this.setActivity(activity);
                runInAction(()=>{ this.selectedActivity=activity;})
                this.setLoadingInitial(false);
                return activity;
               
            } catch (error) {
                console.log(error);
                this.setLoadingInitial(false);
              
            }
        }
    }

    private setActivity=(activity:Activity)=>{
        const user= store.userStore.user;
        if(user)
        {
            activity.isGoing=activity.atendees!.some(
                a=>a.username=== user.username
            )
            activity.isHost=activity.hostUsername===user.username;
            activity.host= activity.atendees?.find(
                x=>x.username===activity.hostUsername
            );
        }
        activity.date= new Date(activity.date!);
        this.activityRegistry.set(activity.id,activity);
    }

    private getActivity=(id:string)=>{
        return this.activityRegistry.get(id);
    }

    setLoadingInitial=(state: boolean)=>{
        this.loadingInitial=state;
    }

    createActivity= async (activity:ActivityFormValues)=>{
        const user = store.userStore.user;
        const atendee= new Profile(user!);
        try {
            await agent.Activities.create(activity);
            const newActivity= new Activity(activity);
            newActivity.hostUsername=user!.username;
            newActivity.atendees=[atendee];
            this.setActivity(newActivity);
            runInAction(()=>{
                this.selectedActivity=newActivity;
            })
        } catch (error) {
            console.log(error);
        }
    }

    updateActivity= async(activity:ActivityFormValues)=>{
        try {
            await agent.Activities.update(activity);
            runInAction(()=>{
                if(activity.id){
                    let updatedActivity={...this.getActivity(activity.id), ...activity}
                    this.activityRegistry.set(activity.id,updatedActivity as Activity);
                    this.selectedActivity=updatedActivity as Activity;
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    deleteActivity= async (id: string)=>{
        this.loading= true;
        try {
            await agent.Activities.delete(id);
            runInAction(()=>{
                this.activityRegistry.delete(id);
                this.loading=false;
            })
        } catch (error) {
            console.log(error);
            runInAction(()=>{
                this.loading=false;
            })
        }
    }

    updateAttendance = async ()=> {
        const user = store.userStore.user;
        this.loading=true;
        try {
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(()=>{
                if(this.selectedActivity?.isGoing){
                    this.selectedActivity.atendees = 
                    this.selectedActivity.atendees?.filter(a=> a.username!== user?.username);
                    this.selectedActivity.isGoing=false;
                }else{
                    const atendee= new Profile(user!);
                    this.selectedActivity?.atendees?.push(atendee);
                    this.selectedActivity!.isGoing=true;
                }
                this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!)
            })
        } catch (error) {
            console.log(error);
        } finally{
            runInAction(()=>{
                this.loading=false;
            })
        }
    }

    cancelActivityToggle = async ()=>{
        this.loading=true;
        try {
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(()=>{
                this.selectedActivity!.isCancelled= !this.selectedActivity?.isCancelled;
                this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!);
            
        })} catch (error) {
            console.log(error);
        } finally{
            runInAction(()=>{
                this.loading=false;
            })
        }
    }

    clearSelectedActivity=()=>{
        this.selectedActivity=undefined;
    }
}