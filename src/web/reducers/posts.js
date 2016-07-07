const PostsReducer = (state = [], action) => {
    switch (action.type){
        case "ADD_POST":
            return [
                ...state,
                action.data
            ]
            break;
        case "REMOVE_POST":
            return [
                ...state.slice(0, action.index),
                ...state.slice(action.index + 1)
            ]
            break;
        default:
            return [
                ...state
            ]
            break;
    }
}
export default PostsReducer
