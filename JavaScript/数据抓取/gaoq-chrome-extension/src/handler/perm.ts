function hasRole(user: any, nameList: string[]) {
    if (user && user.roleName) {
        return nameList.includes(user.roleName)
    }
    return false;
}
export function isBroker(user: any) {
    return hasRole(user, ['经纪人', '经纪主管'])
}
export function isBusinessSupervisor(user: any) {
    return hasRole(user, ['商务主管'])
}