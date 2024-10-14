import { createContext, useContext } from "react";
import ActivityStore from "./activityStore";
import CommonStore from "./commonStore";
import UserStore from "./userStore";
import ModalStore from "./modalStore";
import CommentStore from "./commentStore";
import ProfileStore from "./profileStore";

interface Store{
    activityStore: ActivityStore;
    commonStore: CommonStore;
    userStore: UserStore;
    modalStore: ModalStore;
    commentStore:CommentStore;
    profileStore:ProfileStore;
}

export const store: Store ={
    activityStore: new ActivityStore(),
    commonStore: new CommonStore(),
    userStore: new UserStore(),
    modalStore: new ModalStore(),
    commentStore: new CommentStore(),
    profileStore:new ProfileStore(),
}

export const StoreContext= createContext(store);

export function useStore(){
    return useContext(StoreContext);
}