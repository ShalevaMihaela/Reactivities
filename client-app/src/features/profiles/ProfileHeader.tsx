import { Button, Divider, Grid, GridColumn, Header, Item, Reveal, Segment, Statistic } from "semantic-ui-react";
import { Profile } from "../../app/layout/models/profile";
import { observer } from "mobx-react-lite";

interface Props{
    profile:Profile;
}
export default observer( function ProfileHeader({profile}:Props){
    return (
        <Segment>
            <Grid>
                <GridColumn width={12}>
                    <Item.Group>
                        <Item>
                            <Item.Image avatar size="small" src={profile.image||'/assets/user.png'}/>
                            <Item.Content verticalAlign="middle">
                                <Header as='h1' content={profile.displayName}></Header>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </GridColumn>
                <Grid.Column width={4}>
                    <Statistic.Group widths={2}>
                        <Statistic label="followers" value='5'></Statistic>
                        <Statistic label="following" value='5'></Statistic>
                    </Statistic.Group>
                    <Divider/>
                    <Reveal animated="move">
                        <Reveal.Content visible style={{width:"100%"}}>
                            <Button fluid color="teal" content='Following'/>
                        </Reveal.Content>
                        <Reveal.Content hidden style={{width:"100%"}}>
                            <Button fluid basic color={true? 'red' :'green'} content={true? 'Unfollow' :'Follow'}/>
                        </Reveal.Content>
                    </Reveal>
                </Grid.Column>
            </Grid>
        </Segment>
    )
})