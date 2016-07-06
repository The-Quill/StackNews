const PostsReducer = (state = [], action) => {
    switch (action.type){
        case "ADD_POST":
            var data = Object.values();
            return [
                ...state,
                ...data
            ]
            break;
        case "REMOVE_POST":
            var data = Object.values();
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
