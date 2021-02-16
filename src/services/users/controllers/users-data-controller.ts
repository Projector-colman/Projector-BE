import * as provider from '../providers/users-data-provider'

export const getUser = async (username) => {
    return provider.getUser(username);
}