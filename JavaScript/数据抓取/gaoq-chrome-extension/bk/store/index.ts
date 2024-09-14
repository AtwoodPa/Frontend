import { defineStore } from 'pinia'
import getters from './getters'
import actions from './actions'

chrome.storage.local.get('user').then(todo => {
    userStore.user = todo.user;
});

let userStore = defineStore('user', {
    state() {
        return {
            user: {},
            loadingMap: {}
        }
    },
    getters,
    actions
})
export default userStore;