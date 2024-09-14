export default {
    signInUser(state) {
        if (state.user && state.user.name) {
            return state.user;
        }
        return false;
    }
}