'use client'
import React, { useState, useEffect } from 'react'

type LineupMember = {
    name: string
    role?: string
    photo?: string
    description?: string
    instagram?: string
    tiktok?: string
}

type LineupProps = {
    members: LineupMember[]
}

function Lineup({ members }: LineupProps) {
    const [selectedMember, setSelectedMember] =
        useState<LineupMember | null>(null)

    useEffect(() => {
        if (!selectedMember) return

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setSelectedMember(null)
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [selectedMember])

    if (!members.length) return null

    return (
        <div className="my-6">
            <h2 className="text-2xl font-semibold">Line-up</h2>

            <div className="my-4 space-y-4">
                {members.map((member, index) => (
                    <button
                        key={`${member.name}-${index}`}
                        type="button"
                        onClick={() => setSelectedMember(member)}
                        className="flex w-full items-center gap-3 text-left"
                    >
                        {member.photo ? (
                            <img
                                src={member.photo}
                                alt={member.name}
                                loading="lazy"
                                className="h-12 w-12 shrink-0 rounded-full object-cover"
                            />
                        ) : (
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gray-200 text-lg font-semibold text-gray-700">
                                {member.name.charAt(0).toUpperCase()}
                            </div>
                        )}

                        <div>
                            <p className="font-medium">{member.name}</p>
                            {member.role && (
                                <p className="text-sm text-gray-500">
                                    {member.role}
                                </p>
                            )}
                        </div>
                    </button>
                ))}
            </div>

            {selectedMember && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
                    onClick={() => setSelectedMember(null)}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="lineup-modal-title"
                        className="relative max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={() => setSelectedMember(null)}
                            aria-label="Close"
                            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-2xl text-gray-700 hover:bg-gray-200"
                        >
                            &times;
                        </button>

                        {selectedMember.photo ? (
                            <img
                                src={selectedMember.photo}
                                alt={selectedMember.name}
                                className="mb-4 h-34 w-34 rounded-full object-cover"
                            />
                        ) : (
                            <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-200 text-3xl font-semibold text-gray-700">
                                {selectedMember.name.charAt(0).toUpperCase()}
                            </div>
                        )}

                        <h3
                            id="lineup-modal-title"
                            className="pr-8 text-2xl font-semibold text-gray-900"
                        >
                            {selectedMember.name}
                        </h3>

                        {selectedMember.role && (
                            <p className="mt-1 text-sm text-gray-500">
                                {selectedMember.role}
                            </p>
                        )}

                        {selectedMember.description && (
                            <p className="mt-4 whitespace-pre-line leading-relaxed text-gray-700">
                                {selectedMember.description}
                            </p>
                        )}

                        {(selectedMember.instagram ||
                            selectedMember.tiktok) && (
                            <div className="mt-6 flex flex-wrap gap-3">
                                {selectedMember.instagram && (
                                    <a
                                        href={selectedMember.instagram}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100"
                                    >
                                        Instagram
                                    </a>
                                )}

                                {selectedMember.tiktok && (
                                    <a
                                        href={selectedMember.tiktok}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100"
                                    >
                                        TikTok
                                    </a>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Lineup
