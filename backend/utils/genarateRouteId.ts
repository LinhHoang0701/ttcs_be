import _ from 'lodash';

export const genarateRouteId = (from: string, to: string) => {
    const routeId = _.uniqueId(from+to);
    
    return routeId;
}