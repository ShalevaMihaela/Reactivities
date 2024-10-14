import {Tab, TabPane } from "semantic-ui-react";
import ProfilePhotos from "./ProfilePhotos";
import { observer } from "mobx-react-lite";
import { Profile } from "../../app/layout/models/profile";

interface Props{
    profile:Profile;
}

export default observer( function PageContent({profile}:Props){
    
    const panes=[
        {menuItem:'About' , render:()=><TabPane>About Content</TabPane>},
        {menuItem:'Photos' , render:()=><ProfilePhotos profile={profile}/>},
        {menuItem:'Events' , render:()=><TabPane>Events Content</TabPane>},
        {menuItem:'Followers' , render:()=><TabPane>Followers Content</TabPane>},
        {menuItem:'Following' , render:()=><TabPane>Following Content</TabPane>},
    ]
    return(
        <Tab
        menu={{fluid:true , vertical:true}}
        menuPosition="right"
        panes={panes}
        />
    )
})