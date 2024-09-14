export default {
    async signOut() {
        await chrome.storage.local.set({ 'gaoqu-user': {} })
        this.user = {};
    }
}