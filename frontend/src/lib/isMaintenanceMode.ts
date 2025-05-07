import config from '@/config'

const isMaintenanceMode = () => {
        if (config.isMaintenance) {
            return true
        } else {
            return false
        }
    }

export default isMaintenanceMode