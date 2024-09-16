import React from "react";
import { Grid} from "semantic-ui-react";
import { Activity } from "../../../app/layout/models/activity";
import ActivityList from "./ActivityList";
import ActivityDetails from "../details/ActivityDetails";
import Activityform from "../form/ActivityForm";

interface Props{
    activities: Activity[];
    selectedActivity: Activity | undefined;
    selectActivity:(id: string)=> void;
    cancelSelectActivity:()=> void;
    editMode: boolean;
    openForm: (id: string)=>void;
    closeForm: ()=>void;
    createOrEdit: (activity: Activity)=> void;
    deleteActivity: (id: string)=>void;
}

export default function Activitydashboard({activities, selectedActivity, selectActivity,
  cancelSelectActivity, editMode, openForm, closeForm, createOrEdit,deleteActivity}: Props){
    return (
        <Grid>
            <Grid.Column width='10'>
            <ActivityList activities={activities} 
            selectActivity={selectActivity}
            deleteActivity={deleteActivity}></ActivityList>
            </Grid.Column>
            <Grid.Column width='6'>
              {selectedActivity && !editMode &&
            <ActivityDetails 
            activity={selectedActivity} 
            cancelSelectActivity={cancelSelectActivity}
            openForm={openForm}>
              </ActivityDetails>}
              {editMode &&
            <Activityform
            closeForm={closeForm}
            activity={selectedActivity}
            createOrEdit={createOrEdit}
            ></Activityform>}
            </Grid.Column>
        </Grid>
    )
}