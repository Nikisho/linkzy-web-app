import { getColorFromName } from '@/app/_utils/getColorFromName'
import React from 'react'

type Promoter = {
    photo?: string
    name: string
}

type PromotersProps = {
    organizer: Promoter
}

function Promoters({ organizer }: PromotersProps) {
    const promoters = [organizer]

    return (
        <div className="my-3">
            <p className="text-2xl">
                {promoters.length > 1 ? 'Promoters' : 'Promoter'}
            </p>

            <div className="my-3 space-y-4">
                {promoters.map((promoter, index) => (
                    <div
                        key={`${promoter.name}-${index}`}
                        className="flex items-center space-x-2"
                    >
                        {promoter.photo ? (
                            <a
                                href={`/${promoter.name}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative h-[45px] w-[45px] shrink-0 overflow-hidden rounded-full"
                            >
                                <img
                                    src={promoter.photo}
                                    alt={promoter.name}
                                    loading="lazy"
                                    className="h-full w-full object-cover"
                                />
                            </a>
                        ) : (
                            <div
                                className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full"
                                style={{
                                    backgroundColor: getColorFromName(promoter.name),
                                }}
                            >
                                <p className="text-xl font-bold text-white">
                                    {promoter.name.charAt(0).toUpperCase()}
                                </p>
                            </div>
                        )}

                        <p className="ml-3">
                            {promoter.name}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Promoters