import React from 'react'
import { Skeleton } from '@mui/material'

const SkeletonLoading = () => {
    return (
        <>
            <Skeleton height={30} width={100} />
            <div className="flex gap-2">
                <Skeleton width={100} />
                <Skeleton height={40} className="w-full" />
            </div>
            <div className="flex gap-2">
                <Skeleton width={100} />
                <Skeleton height={40} className="w-full" />
            </div>
            <div className="flex gap-2">
                <Skeleton width={100} />
                <Skeleton height={40} className="w-full" />
            </div>
            <Skeleton height={30} width={100} />
            <div className="flex gap-2">
                <Skeleton width={100} />
                <Skeleton height={40} className="w-full" />
            </div>
            <div className="flex gap-2">
                <Skeleton width={100} />
                <Skeleton height={40} className="w-full" />
            </div>
            <div className="flex gap-2">
                <Skeleton width={100} />
                <Skeleton height={40} className="w-full" />
            </div>
        </>
    )
}

export default SkeletonLoading;
