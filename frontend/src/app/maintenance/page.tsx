import MiddleLayout from '@/components/layout/MiddleLayout'
import { FaTools, FaClock } from 'react-icons/fa'
import Link from 'next/link'
import isMaintenanceMode from '@/lib/isMaintenanceMode'
import config from '@/config'
import { Button } from '@/components/ui/button'

const Maintenance = () => {
    return (
        isMaintenanceMode() ? (
            <MiddleLayout>
                <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-4">
                    <div className="bg-card text-card-foreground rounded-base border-2 border-border shadow-shadow p-8 max-w-lg w-full">
                        <div className="flex justify-center mb-6">
                            <FaTools className="text-6xl text-main" />
                        </div>
                        
                        <h1 className="text-3xl font-bold mb-4">
                            We are Under Maintenance
                        </h1>
                        
                        <p className="text-muted-foreground mb-6">
                            We are currently performing scheduled maintenance to improve your experience.
                            Our pet management system will be back online shortly.
                        </p>
                        
                        <div className="flex items-center justify-center mb-6 text-muted-foreground">
                            <FaClock className="mr-2" />
                            <span>Expected downtime: {config.maintenanceEndTime || 'A few hours'}</span>
                        </div>
                        
                        <div className="flex flex-col space-y-4">
                            <p className="text-muted-foreground">
                                For urgent inquiries, please contact our support team.
                            </p>
                            
                            <Link 
                                href="mailto:support@petmanagement.com"
                                className="text-primary hover:underline"
                            >
                                support@petmanagement.com
                            </Link>
                        </div>
                    </div>
                </div>
            </MiddleLayout>
        ) : (
            <MiddleLayout>
                <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-4">
                    <div className="bg-card text-card-foreground rounded-base border-2 border-border shadow-shadow p-8 max-w-lg w-full">
                        <h1 className="text-3xl font-bold mb-4">
                            Maintenance Mode is Off
                        </h1>
                        <p className="text-muted-foreground mb-6">
                            Our system is currently operational.
                        </p>
                        <Button variant="default" asChild>
                            <Link href="/">
                                Return to Home
                            </Link>
                        </Button>
                    </div>
                </div>
            </MiddleLayout>
        )
    )
}

export default Maintenance