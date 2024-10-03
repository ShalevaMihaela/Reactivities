import { observer } from "mobx-react-lite";
import { List, Image, Popup} from "semantic-ui-react";
import { Profile } from "../../../app/layout/models/profile";
import { Link } from "react-router-dom";
import ProfileCard from "../../profiles/ProfileCard";

interface Props{
    atendees: Profile[];
}

export default observer(function ActivityListItemAttendee({atendees}:Props){
    return (
        <List horizontal>
            {atendees.map(atendee=>(
                <Popup hoverable key={atendee.username} 
                trigger={
                <List.Item key={atendee.username} as={Link} to={`/profiles/${atendee.username}`}>
                <Image size="mini" circular src={atendee.image || '/assets/user.png'}/>
            </List.Item>
                }>
                    <Popup.Content>
                        <ProfileCard profile={atendee}></ProfileCard>
                    </Popup.Content>
                </Popup>
                
            ))}
        </List>
    )
})