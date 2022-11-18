import { DataObjectServiceInfo, DataObjectType } from "../types"

export const composeDataServiceInfoObject = (name: string, serviceId: string): DataObjectServiceInfo => ({
    type: DataObjectType.ServiceInfo,
    info: {
        name: name,
        serviceId: serviceId,
        shortServiceId: getShortServiceId(serviceId),
    },
})

export const getShortServiceId = (serviceId: string): string => serviceId.slice(0, 6)
