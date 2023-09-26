export const getExceptionModule = (deviceType, deviceId, childDevArr) => {
    const exceptionList = {
        HMIIRC: {
            listName: `/etc/igw/23-HMIIRC.list`,
            listContent: `ENABLE=${deviceId}:${childDevArr}:1:0:1:1.1:2.5:0.35:1`
        },
        AEMDRS: {
            listName: `/etc/igw/12-AEMDRS.list`,
            listContent: `ENABLED_LOOP=${deviceId}:${childDevArr}`
        },
        GWRS002IO: {

        },
        GWRS002DIM: {

        },
        EM1100P: {
            listName: `/etc/igw/10-EM1100P.list`,
            listContent: `CARD=1:${deviceId}:${childDevArr}`
        },
        EBI21R: {
            listName: `/etc/igw/10-EBI21R.list`,
            listContent: `CARD=1:${deviceId}:${childDevArr}`
        }
    }
    return exceptionList[deviceType]
}