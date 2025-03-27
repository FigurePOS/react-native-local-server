import { DataObjectServiceInfo, DataObjectType, MessagingServiceInformation } from "../types"

export const composeDataServiceInfoObject = (
    info: Omit<MessagingServiceInformation, "shortId">,
): DataObjectServiceInfo => ({
    type: DataObjectType.ServiceInfo,
    info: {
        name: info.name,
        id: info.id,
        shortId: getShortServiceId(info.id),
    },
})

export const getShortServiceId = (serviceId: string): string => serviceId.slice(0, 6)
